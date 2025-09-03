import express from 'express'
import { body } from 'express-validator'
import asyncHandler from 'express-async-handler'
import { protect } from '../middleware/auth.js'
import { validateRequest } from '../middleware/errorHandler.js'
import KYCSession from '../models/KYCSession.js'
import User from '../models/User.js'
import { logger } from '../utils/logger.js'

const router = express.Router()

// @desc    Start KYC session
// @route   POST /api/kyc/start
// @access  Private
router.post('/start', protect, [
  body('method')
    .isIn(['digilocker', 'document', 'manual'])
    .withMessage('Please select a valid KYC method')
], validateRequest, asyncHandler(async (req, res) => {
  const { method } = req.body

  // Check if user already has an active session
  const existingSession = await KYCSession.findOne({
    userId: req.user._id,
    status: 'active'
  })

  if (existingSession) {
    res.status(400)
    throw new Error('You already have an active KYC session')
  }

  // Create new KYC session
  const session = await KYCSession.create({
    userId: req.user._id,
    method,
    metadata: {
      userAgent: req.get('User-Agent'),
      ipAddress: req.ip,
      deviceInfo: {
        type: req.get('User-Agent')?.includes('Mobile') ? 'mobile' : 'desktop',
        os: req.get('User-Agent')?.split('(')[1]?.split(')')[0] || 'unknown',
        browser: req.get('User-Agent')?.split(' ').pop() || 'unknown'
      }
    }
  })

  // Update user KYC status
  await User.findByIdAndUpdate(req.user._id, {
    kycStatus: 'in_progress',
    kycMethod: method
  })

  res.status(201).json({
    success: true,
    message: 'KYC session started successfully',
    data: {
      session: session.getSummary()
    }
  })
}))

// @desc    Get current KYC session
// @route   GET /api/kyc/session
// @access  Private
router.get('/session', protect, asyncHandler(async (req, res) => {
  const session = await KYCSession.findOne({
    userId: req.user._id,
    status: 'active'
  })

  if (!session) {
    res.status(404)
    throw new Error('No active KYC session found')
  }

  res.json({
    success: true,
    data: {
      session: session.getSummary()
    }
  })
}))

// @desc    Update KYC session step
// @route   PUT /api/kyc/step
// @access  Private
router.put('/step', protect, [
  body('step')
    .isInt({ min: 0, max: 6 })
    .withMessage('Step must be between 0 and 6'),
  body('data')
    .optional()
    .isObject()
    .withMessage('Data must be an object')
], validateRequest, asyncHandler(async (req, res) => {
  const { step, data } = req.body

  const session = await KYCSession.findOne({
    userId: req.user._id,
    status: 'active'
  })

  if (!session) {
    res.status(404)
    throw new Error('No active KYC session found')
  }

  // Update session step and data
  session.currentStep = step
  session.metadata.lastActivity = new Date()

  if (data) {
    // Update specific data based on step
    switch (step) {
      case 1: // User info
        if (data.userInfo) {
          session.data.userInfo = { ...session.data.userInfo, ...data.userInfo }
        }
        break
      case 2: // Documents
        if (data.documents) {
          session.data.documents = { ...session.data.documents, ...data.documents }
        }
        break
      case 3: // DigiLocker data
        if (data.digilockerData) {
          session.data.digilockerData = { ...session.data.digilockerData, ...data.digilockerData }
        }
        break
      case 4: // Verification results
        if (data.verificationResults) {
          session.data.verificationResults = { ...session.data.verificationResults, ...data.verificationResults }
        }
        break
    }
  }

  await session.updateProgress()

  res.json({
    success: true,
    message: 'KYC session updated successfully',
    data: {
      session: session.getSummary()
    }
  })
}))

// @desc    Complete KYC session
// @route   POST /api/kyc/complete
// @access  Private
router.post('/complete', protect, asyncHandler(async (req, res) => {
  const session = await KYCSession.findOne({
    userId: req.user._id,
    status: 'active'
  })

  if (!session) {
    res.status(404)
    throw new Error('No active KYC session found')
  }

  // Validate completion
  if (!session.data.verificationResults.overallVerified) {
    res.status(400)
    throw new Error('KYC verification not completed')
  }

  // Complete session
  await session.complete()

  // Update user KYC status
  await User.findByIdAndUpdate(req.user._id, {
    kycStatus: 'verified'
  })

  res.json({
    success: true,
    message: 'KYC completed successfully',
    data: {
      session: session.getSummary()
    }
  })
}))

// @desc    Abandon KYC session
// @route   POST /api/kyc/abandon
// @access  Private
router.post('/abandon', protect, asyncHandler(async (req, res) => {
  const session = await KYCSession.findOne({
    userId: req.user._id,
    status: 'active'
  })

  if (!session) {
    res.status(404)
    throw new Error('No active KYC session found')
  }

  // Abandon session
  await session.abandon()

  // Update user KYC status
  await User.findByIdAndUpdate(req.user._id, {
    kycStatus: 'pending'
  })

  res.json({
    success: true,
    message: 'KYC session abandoned',
    data: {
      session: session.getSummary()
    }
  })
}))

// @desc    Get KYC history
// @route   GET /api/kyc/history
// @access  Private
router.get('/history', protect, asyncHandler(async (req, res) => {
  const sessions = await KYCSession.find({
    userId: req.user._id
  })
  .sort({ createdAt: -1 })
  .limit(10)

  res.json({
    success: true,
    data: {
      sessions: sessions.map(session => session.getSummary())
    }
  })
}))

// @desc    Get KYC status
// @route   GET /api/kyc/status
// @access  Private
router.get('/status', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  const activeSession = await KYCSession.findOne({
    userId: req.user._id,
    status: 'active'
  })

  res.json({
    success: true,
    data: {
      kycStatus: user.kycStatus,
      kycMethod: user.kycMethod,
      activeSession: activeSession ? activeSession.getSummary() : null
    }
  })
}))

export default router
