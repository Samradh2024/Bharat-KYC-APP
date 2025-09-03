import mongoose from 'mongoose'

const kycSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  currentStep: {
    type: Number,
    default: 0,
    min: 0,
    max: 6
  },
  totalSteps: {
    type: Number,
    default: 6
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'abandoned', 'expired'],
    default: 'active'
  },
  method: {
    type: String,
    enum: ['digilocker', 'document', 'manual'],
    required: true
  },
  data: {
    userInfo: {
      name: String,
      phone: String,
      email: String,
      dateOfBirth: Date,
      gender: String,
      address: {
        street: String,
        city: String,
        state: String,
        pincode: String
      }
    },
    documents: {
      aadhaar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document'
      },
      pan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document'
      },
      drivingLicense: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document'
      },
      voterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document'
      },
      selfie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document'
      }
    },
    digilockerData: {
      accessToken: String,
      refreshToken: String,
      documents: [{
        type: String,
        uri: String,
        name: String,
        issuedDate: Date,
        validTill: Date
      }]
    },
    verificationResults: {
      documentsVerified: {
        type: Boolean,
        default: false
      },
      faceVerified: {
        type: Boolean,
        default: false
      },
      overallVerified: {
        type: Boolean,
        default: false
      },
      scores: {
        documentScore: {
          type: Number,
          min: 0,
          max: 100,
          default: 0
        },
        faceScore: {
          type: Number,
          min: 0,
          max: 100,
          default: 0
        },
        livenessScore: {
          type: Number,
          min: 0,
          max: 100,
          default: 0
        }
      }
    }
  },
  metadata: {
    userAgent: String,
    ipAddress: String,
    deviceInfo: {
      type: String,
      os: String,
      browser: String
    },
    location: {
      country: String,
      state: String,
      city: String
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    lastActivity: {
      type: Date,
      default: Date.now
    },
    completedAt: Date,
    timeSpent: Number // in seconds
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Indexes for better query performance
kycSessionSchema.index({ userId: 1, status: 1 })
kycSessionSchema.index({ sessionId: 1 })
kycSessionSchema.index({ createdAt: -1 })
kycSessionSchema.index({ 'metadata.lastActivity': -1 })

// Pre-save middleware to generate session ID
kycSessionSchema.pre('save', function(next) {
  if (!this.sessionId) {
    this.sessionId = `kyc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  next()
})

// Method to update progress
kycSessionSchema.methods.updateProgress = function() {
  this.progress = Math.round((this.currentStep / this.totalSteps) * 100)
  this.metadata.lastActivity = new Date()
  return this.save()
}

// Method to move to next step
kycSessionSchema.methods.nextStep = function() {
  if (this.currentStep < this.totalSteps - 1) {
    this.currentStep += 1
    return this.updateProgress()
  }
  return Promise.resolve(this)
}

// Method to complete session
kycSessionSchema.methods.complete = function() {
  this.status = 'completed'
  this.currentStep = this.totalSteps - 1
  this.progress = 100
  this.metadata.completedAt = new Date()
  this.metadata.timeSpent = Math.floor((this.metadata.completedAt - this.metadata.startedAt) / 1000)
  return this.save()
}

// Method to abandon session
kycSessionSchema.methods.abandon = function() {
  this.status = 'abandoned'
  this.metadata.timeSpent = Math.floor((new Date() - this.metadata.startedAt) / 1000)
  return this.save()
}

// Method to get session summary
kycSessionSchema.methods.getSummary = function() {
  return {
    sessionId: this.sessionId,
    currentStep: this.currentStep,
    progress: this.progress,
    status: this.status,
    method: this.method,
    startedAt: this.metadata.startedAt,
    lastActivity: this.metadata.lastActivity,
    timeSpent: this.metadata.timeSpent
  }
}

const KYCSession = mongoose.model('KYCSession', kycSessionSchema)

export default KYCSession
