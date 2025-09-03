import express from 'express'
import { body } from 'express-validator'
import asyncHandler from 'express-async-handler'
import { protect } from '../middleware/auth.js'
import { validateRequest } from '../middleware/errorHandler.js'
import { uploadDocument, handleUploadError } from '../middleware/upload.js'
import Document from '../models/Document.js'
import { uploadToCloudinary, processDocument } from '../utils/cloudinary.js'
import { extractDocumentData } from '../utils/ocr.js'
import { logger } from '../utils/logger.js'

const router = express.Router()

// @desc    Upload document
// @route   POST /api/documents/upload
// @access  Private
router.post('/upload', 
  protect,
  uploadDocument('document'),
  handleUploadError,
  [
    body('documentType')
      .isIn(['aadhaar', 'pan', 'driving_license', 'voter_id', 'passport', 'selfie'])
      .withMessage('Please select a valid document type'),
    body('documentNumber')
      .optional()
      .isString()
      .withMessage('Document number must be a string')
  ],
  validateRequest,
  asyncHandler(async (req, res) => {
    const { documentType, documentNumber } = req.body

    try {
      // Upload to Cloudinary
      const uploadResult = await uploadToCloudinary(req.file.path, 'kyc-documents')

      // Process document for OCR and verification
      const processedData = await processDocument(uploadResult.secure_url, documentType)

      // Extract document data using OCR
      const extractedData = await extractDocumentData(uploadResult.secure_url, documentType)

      // Create document record
      const document = await Document.create({
        userId: req.user._id,
        documentType,
        documentNumber: documentNumber || extractedData.documentNumber,
        documentImage: {
          publicId: uploadResult.public_id,
          url: uploadResult.url,
          secureUrl: uploadResult.secure_url
        },
        verificationDetails: {
          extractedData: {
            name: extractedData.name,
            dateOfBirth: extractedData.dateOfBirth,
            gender: extractedData.gender,
            address: extractedData.address,
            documentNumber: extractedData.documentNumber
          },
          confidence: processedData.confidence || 0
        },
        metadata: {
          fileSize: req.file.size,
          mimeType: req.file.mimetype,
          processingTime: processedData.processingTime || 0,
          ocrText: extractedData.ocrText
        }
      })

      res.status(201).json({
        success: true,
        message: 'Document uploaded successfully',
        data: {
          document: document.getVerificationSummary()
        }
      })

    } catch (error) {
      logger.error('Document upload error:', error)
      res.status(500)
      throw new Error('Failed to upload document')
    }
  })
)

// @desc    Get user documents
// @route   GET /api/documents
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
  const documents = await Document.find({
    userId: req.user._id,
    isActive: true
  }).sort({ createdAt: -1 })

  res.json({
    success: true,
    data: {
      documents: documents.map(doc => doc.getVerificationSummary())
    }
  })
}))

// @desc    Get document by ID
// @route   GET /api/documents/:id
// @access  Private
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const document = await Document.findOne({
    _id: req.params.id,
    userId: req.user._id,
    isActive: true
  })

  if (!document) {
    res.status(404)
    throw new Error('Document not found')
  }

  res.json({
    success: true,
    data: {
      document: document.getVerificationSummary()
    }
  })
}))

// @desc    Update document
// @route   PUT /api/documents/:id
// @access  Private
router.put('/:id', protect, [
  body('documentNumber')
    .optional()
    .isString()
    .withMessage('Document number must be a string')
], validateRequest, asyncHandler(async (req, res) => {
  const { documentNumber } = req.body

  const document = await Document.findOne({
    _id: req.params.id,
    userId: req.user._id,
    isActive: true
  })

  if (!document) {
    res.status(404)
    throw new Error('Document not found')
  }

  // Update document
  if (documentNumber) {
    document.documentNumber = documentNumber
  }

  await document.save()

  res.json({
    success: true,
    message: 'Document updated successfully',
    data: {
      document: document.getVerificationSummary()
    }
  })
}))

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  const document = await Document.findOne({
    _id: req.params.id,
    userId: req.user._id,
    isActive: true
  })

  if (!document) {
    res.status(404)
    throw new Error('Document not found')
  }

  // Soft delete
  document.isActive = false
  await document.save()

  res.json({
    success: true,
    message: 'Document deleted successfully'
  })
}))

// @desc    Verify document
// @route   POST /api/documents/:id/verify
// @access  Private
router.post('/:id/verify', protect, asyncHandler(async (req, res) => {
  const document = await Document.findOne({
    _id: req.params.id,
    userId: req.user._id,
    isActive: true
  })

  if (!document) {
    res.status(404)
    throw new Error('Document not found')
  }

  // Simulate verification process
  const verificationScore = Math.floor(Math.random() * 40) + 60 // 60-100
  const confidence = Math.random() * 0.3 + 0.7 // 0.7-1.0

  document.verificationStatus = verificationScore >= 80 ? 'verified' : 'rejected'
  document.verificationScore = verificationScore
  document.verificationDetails.confidence = confidence
  document.verificationDetails.verifiedAt = new Date()

  if (document.verificationStatus === 'rejected') {
    document.verificationDetails.rejectionReason = 'Document verification failed'
  }

  await document.save()

  res.json({
    success: true,
    message: `Document ${document.verificationStatus}`,
    data: {
      document: document.getVerificationSummary()
    }
  })
}))

// @desc    Get document verification status
// @route   GET /api/documents/:id/status
// @access  Private
router.get('/:id/status', protect, asyncHandler(async (req, res) => {
  const document = await Document.findOne({
    _id: req.params.id,
    userId: req.user._id,
    isActive: true
  })

  if (!document) {
    res.status(404)
    throw new Error('Document not found')
  }

  res.json({
    success: true,
    data: {
      status: document.verificationStatus,
      score: document.verificationScore,
      confidence: document.verificationDetails.confidence,
      verifiedAt: document.verificationDetails.verifiedAt,
      rejectionReason: document.verificationDetails.rejectionReason
    }
  })
}))

export default router
