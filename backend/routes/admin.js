import express from 'express'
import { body } from 'express-validator'
import asyncHandler from 'express-async-handler'
import { protect, authorize } from '../middleware/auth.js'
import { validateRequest } from '../middleware/errorHandler.js'
import User from '../models/User.js'
import Document from '../models/Document.js'
import KYCSession from '../models/KYCSession.js'
import { logger } from '../utils/logger.js'

const router = express.Router()

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const skip = (page - 1) * limit

  const users = await User.find({})
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  const total = await User.countDocuments({})

  res.json({
    success: true,
    data: {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  })
}))

// @desc    Get user details (Admin only)
// @route   GET /api/admin/users/:id
// @access  Private/Admin
router.get('/users/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  // Get user's documents
  const documents = await Document.find({ userId: user._id })

  // Get user's KYC sessions
  const sessions = await KYCSession.find({ userId: user._id })

  res.json({
    success: true,
    data: {
      user,
      documents,
      sessions: sessions.map(session => session.getSummary())
    }
  })
}))

// @desc    Update user KYC status (Admin only)
// @route   PUT /api/admin/users/:id/kyc-status
// @access  Private/Admin
router.put('/users/:id/kyc-status', protect, authorize('admin'), [
  body('kycStatus')
    .isIn(['pending', 'in_progress', 'verified', 'rejected', 'expired'])
    .withMessage('Invalid KYC status'),
  body('reason')
    .optional()
    .isString()
    .withMessage('Reason must be a string')
], validateRequest, asyncHandler(async (req, res) => {
  const { kycStatus, reason } = req.body

  const user = await User.findById(req.params.id)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  user.kycStatus = kycStatus
  await user.save()

  // Send notification email based on status
  try {
    if (kycStatus === 'verified') {
      await sendKYCSuccessEmail(user.email, user.name)
    } else if (kycStatus === 'rejected') {
      await sendKYCRejectionEmail(user.email, user.name, reason || 'Verification failed')
    }
  } catch (error) {
    logger.error('Failed to send notification email:', error)
  }

  res.json({
    success: true,
    message: `User KYC status updated to ${kycStatus}`,
    data: {
      user: user.getPublicProfile()
    }
  })
}))

// @desc    Get all documents (Admin only)
// @route   GET /api/admin/documents
// @access  Private/Admin
router.get('/documents', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const skip = (page - 1) * limit

  const documents = await Document.find({})
    .populate('userId', 'name email phone')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  const total = await Document.countDocuments({})

  res.json({
    success: true,
    data: {
      documents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  })
}))

// @desc    Verify document (Admin only)
// @route   POST /api/admin/documents/:id/verify
// @access  Private/Admin
router.post('/documents/:id/verify', protect, authorize('admin'), [
  body('verificationStatus')
    .isIn(['pending', 'verified', 'rejected', 'expired'])
    .withMessage('Invalid verification status'),
  body('verificationScore')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Verification score must be between 0 and 100'),
  body('rejectionReason')
    .optional()
    .isString()
    .withMessage('Rejection reason must be a string')
], validateRequest, asyncHandler(async (req, res) => {
  const { verificationStatus, verificationScore, rejectionReason } = req.body

  const document = await Document.findById(req.params.id)

  if (!document) {
    res.status(404)
    throw new Error('Document not found')
  }

  document.verificationStatus = verificationStatus
  document.verificationScore = verificationScore || document.verificationScore
  document.verificationDetails.verifiedAt = new Date()
  document.verificationDetails.verifiedBy = req.user._id

  if (verificationStatus === 'rejected') {
    document.verificationDetails.rejectionReason = rejectionReason
  }

  await document.save()

  res.json({
    success: true,
    message: `Document ${verificationStatus}`,
    data: {
      document: document.getVerificationSummary()
    }
  })
}))

// @desc    Get dashboard statistics (Admin only)
// @route   GET /api/admin/dashboard
// @access  Private/Admin
router.get('/dashboard', protect, authorize('admin'), asyncHandler(async (req, res) => {
  // Get total users
  const totalUsers = await User.countDocuments({})

  // Get users by KYC status
  const kycStats = await User.aggregate([
    {
      $group: {
        _id: '$kycStatus',
        count: { $sum: 1 }
      }
    }
  ])

  // Get total documents
  const totalDocuments = await Document.countDocuments({})

  // Get documents by verification status
  const documentStats = await Document.aggregate([
    {
      $group: {
        _id: '$verificationStatus',
        count: { $sum: 1 }
      }
    }
  ])

  // Get recent KYC sessions
  const recentSessions = await KYCSession.find({})
    .populate('userId', 'name email')
    .sort({ createdAt: -1 })
    .limit(5)

  // Get daily registrations for last 7 days
  const dailyRegistrations = await User.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ])

  res.json({
    success: true,
    data: {
      totalUsers,
      kycStats,
      totalDocuments,
      documentStats,
      recentSessions: recentSessions.map(session => session.getSummary()),
      dailyRegistrations
    }
  })
}))

// @desc    Get system logs (Admin only)
// @route   GET /api/admin/logs
// @access  Private/Admin
router.get('/logs', protect, authorize('admin'), asyncHandler(async (req, res) => {
  // In a real application, you would read from log files or a logging service
  // For now, return a mock response
  res.json({
    success: true,
    data: {
      logs: [
        {
          timestamp: new Date().toISOString(),
          level: 'info',
          message: 'System running normally',
          service: 'kyc-bharat-backend'
        }
      ]
    }
  })
}))

export default router
