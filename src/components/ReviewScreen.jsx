import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle,
  Shield,
  User,
  FileText,
  Camera,
  Edit,
  Eye
} from 'lucide-react'
import { useKYC } from '../contexts/KYCContext'
import { useNetwork } from '../contexts/NetworkContext'
import LoadingSpinner from './LoadingSpinner'

const ReviewScreen = () => {
  const navigate = useNavigate()
  const { 
    userData, 
    documents, 
    faceData, 
    digilockerData, 
    kycMethod,
    nextStep, 
    loading, 
    setLoading,
    setVerificationStatus 
  } = useKYC()
  const { isOnline } = useNetwork()

  const handleSubmit = async () => {
    setLoading(true)
    
    // Simulate final verification process
    setTimeout(() => {
      setVerificationStatus({
        documentsVerified: true,
        faceVerified: true,
        overallVerified: true,
      })
      setLoading(false)
      nextStep()
      navigate('/success')
    }, 3000)
  }

  const handleBack = () => {
    navigate('/face-verification')
  }

  const handleEditSection = (section) => {
    switch (section) {
      case 'documents':
        navigate('/document-kyc')
        break
      case 'face':
        navigate('/face-verification')
        break
      case 'digilocker':
        navigate('/digilocker-kyc')
        break
      default:
        break
    }
  }

  const getVerificationData = () => {
    if (kycMethod === 'digilocker' && digilockerData) {
      return {
        name: digilockerData.name,
        aadhaar: digilockerData.aadhaar,
        phone: digilockerData.phone,
        email: digilockerData.email,
        address: digilockerData.address,
        documents: digilockerData.documents,
      }
    } else {
      return {
        name: userData.name,
        aadhaar: userData.aadhaar,
        phone: userData.phone,
        email: userData.email,
        address: userData.address,
        documents: documents,
      }
    }
  }

  const verificationData = getVerificationData()

  return (
    <>
      <Helmet>
        <title>Review & Submit - Bharat KYC</title>
        <meta name="description" content="Review your KYC information before submission" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 safe-top safe-bottom">
        <div className="container-mobile py-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handleBack}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Review & Submit
              </h1>
              <div className="w-6" />
            </div>

            <p className="text-gray-600 text-center">
              Review your information before final submission
            </p>
          </motion.div>

          {/* Review Sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6 mb-8"
          >
            {/* Personal Information */}
            <div className="card">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-primary-600" />
                    <h3 className="font-semibold text-gray-900">
                      Personal Information
                    </h3>
                  </div>
                  <CheckCircle className="w-5 h-5 text-success-600" />
                </div>
              </div>
              <div className="card-body">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{verificationData.name || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{verificationData.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{verificationData.email || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Address:</span>
                    <span className="font-medium text-right">
                      {verificationData.address ? 
                        `${verificationData.address.street}, ${verificationData.address.city}` : 
                        'Not provided'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Verification */}
            <div className="card">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-primary-600" />
                    <h3 className="font-semibold text-gray-900">
                      Document Verification
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-success-600" />
                    <button
                      onClick={() => handleEditSection('documents')}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-body">
                {kycMethod === 'digilocker' ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Aadhaar:</span>
                      <span className="font-medium">
                        {verificationData.documents?.aadhaar?.number ? 
                          `XXXX-XXXX-${verificationData.documents.aadhaar.number.slice(-4)}` : 
                          'Not verified'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">PAN:</span>
                      <span className="font-medium">
                        {verificationData.documents?.pan?.number ? 
                          `${verificationData.documents.pan.number.slice(0, 5)}XXXX${verificationData.documents.pan.number.slice(-1)}` : 
                          'Not verified'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="text-success-600 font-medium">Government Verified</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Aadhaar Card:</span>
                      <span className="font-medium">
                        {documents.aadhaar ? 'Uploaded' : 'Not uploaded'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">PAN Card:</span>
                      <span className="font-medium">
                        {documents.pan ? 'Uploaded' : 'Not uploaded'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="text-warning-600 font-medium">Pending Verification</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Face Verification */}
            <div className="card">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Camera className="w-5 h-5 text-primary-600" />
                    <h3 className="font-semibold text-gray-900">
                      Face Verification
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-success-600" />
                    <button
                      onClick={() => handleEditSection('face')}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Selfie:</span>
                    <span className="font-medium">
                      {faceData.selfie ? 'Captured' : 'Not captured'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Liveness Score:</span>
                    <span className="font-medium">
                      {faceData.livenessScore > 0 ? 
                        `${(faceData.livenessScore * 100).toFixed(0)}%` : 
                        'Not checked'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Face Match Score:</span>
                    <span className="font-medium">
                      {faceData.faceMatchScore > 0 ? 
                        `${(faceData.faceMatchScore * 100).toFixed(0)}%` : 
                        'Not checked'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="card border-primary-200 bg-primary-50">
              <div className="card-body">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-primary-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-primary-900 mb-2">
                      Security & Privacy
                    </h4>
                    <ul className="text-sm text-primary-800 space-y-1">
                      <li>• Your data is encrypted and secure</li>
                      <li>• We follow government security guidelines</li>
                      <li>• Your information is never shared without consent</li>
                      <li>• All verification is done on secure servers</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            <button
              onClick={handleSubmit}
              disabled={loading || !isOnline}
              className="w-full btn-primary py-4 text-lg font-semibold touch-target"
            >
              {loading ? (
                <LoadingSpinner size="small" color="white" />
              ) : (
                <>
                  Submit KYC Verification
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>

            {!isOnline && (
              <div className="text-center p-3 bg-warning-50 rounded-lg">
                <p className="text-sm text-warning-700">
                  You need internet connection to submit your KYC
                </p>
              </div>
            )}

            <div className="text-center">
              <p className="text-xs text-gray-500">
                By submitting, you agree to our terms and privacy policy
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default ReviewScreen
