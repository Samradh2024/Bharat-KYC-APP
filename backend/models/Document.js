import mongoose from 'mongoose'

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  documentType: {
    type: String,
    enum: ['aadhaar', 'pan', 'driving_license', 'voter_id', 'passport', 'selfie'],
    required: true
  },
  documentNumber: {
    type: String,
    required: function() {
      return this.documentType !== 'selfie'
    }
  },
  documentImage: {
    publicId: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    secureUrl: {
      type: String,
      required: true
    }
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'expired'],
    default: 'pending'
  },
  verificationScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  verificationDetails: {
    extractedData: {
      name: String,
      dateOfBirth: Date,
      gender: String,
      address: String,
      documentNumber: String
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0
    },
    verifiedAt: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rejectionReason: String
  },
  metadata: {
    fileSize: Number,
    mimeType: String,
    uploadDate: {
      type: Date,
      default: Date.now
    },
    processingTime: Number,
    ocrText: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Indexes for better query performance
documentSchema.index({ userId: 1, documentType: 1 })
documentSchema.index({ verificationStatus: 1 })
documentSchema.index({ createdAt: -1 })

// Virtual for document age
documentSchema.virtual('age').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24))
})

// Method to check if document is expired (older than 1 year)
documentSchema.methods.isExpired = function() {
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
  return this.createdAt < oneYearAgo
}

// Method to get verification summary
documentSchema.methods.getVerificationSummary = function() {
  return {
    documentType: this.documentType,
    status: this.verificationStatus,
    score: this.verificationScore,
    verifiedAt: this.verificationDetails.verifiedAt,
    isExpired: this.isExpired()
  }
}

const Document = mongoose.model('Document', documentSchema)

export default Document
