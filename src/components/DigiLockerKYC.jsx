import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { 
  ArrowLeft, 
  ArrowRight, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Lock,
  User,
  Smartphone,
  Mail
} from 'lucide-react'
import { useKYC } from '../contexts/KYCContext'
import { useNetwork } from '../contexts/NetworkContext'
import LoadingSpinner from './LoadingSpinner'

const DigiLockerKYC = () => {
  const navigate = useNavigate()
  const { setDigiLockerData, nextStep, loading, setLoading } = useKYC()
  const { isOnline } = useNetwork()
  const [step, setStep] = useState('info') // info, auth, success
  const [userData, setUserData] = useState({
    aadhaar: '',
    phone: '',
    email: '',
  })

  const handleInputChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAuthenticate = async () => {
    if (!userData.aadhaar || !userData.phone) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    
    // Simulate DigiLocker authentication
    setTimeout(() => {
      const mockDigiLockerData = {
        name: 'Rahul Kumar',
        aadhaar: userData.aadhaar,
        phone: userData.phone,
        email: userData.email,
        dateOfBirth: '1990-05-15',
        gender: 'Male',
        address: {
          street: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
        },
        documents: {
          aadhaar: {
            number: userData.aadhaar,
            verified: true,
            issuedDate: '2015-03-20',
          },
          pan: {
            number: 'ABCDE1234F',
            verified: true,
            issuedDate: '2018-07-10',
          }
        },
        verificationStatus: {
          documentsVerified: true,
          faceVerified: false,
          overallVerified: false,
        },
        timestamp: new Date().toISOString(),
      }

      setDigiLockerData(mockDigiLockerData)
      setStep('success')
      setLoading(false)
    }, 3000)
  }

  const handleContinue = () => {
    nextStep()
    navigate('/face-verification')
  }

  const handleBack = () => {
    navigate('/kyc-selection')
  }

  const openDigiLocker = () => {
    window.open('https://digilocker.gov.in', '_blank')
  }

  return (
    <>
      <Helmet>
        <title>DigiLocker KYC - Bharat KYC</title>
        <meta name="description" content="Verify your identity using DigiLocker" />
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
                DigiLocker KYC
              </h1>
              <div className="w-6" />
            </div>

            <p className="text-gray-600 text-center">
              Fast and secure verification using government-verified documents
            </p>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {step === 'info' && (
              <div className="space-y-6">
                {/* Info Card */}
                <div className="card">
                  <div className="card-body">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                        <Shield className="w-8 h-8 text-primary-600" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        What is DigiLocker?
                      </h2>
                      <p className="text-gray-600">
                        DigiLocker is a government-issued digital document storage service that provides verified documents for instant KYC verification.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-success-600 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-gray-900">Instant Verification</h3>
                          <p className="text-sm text-gray-600">No document upload needed</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-success-600 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-gray-900">Government Verified</h3>
                          <p className="text-sm text-gray-600">Documents are pre-verified by government</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-success-600 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-gray-900">Secure & Private</h3>
                          <p className="text-sm text-gray-600">Your data is encrypted and protected</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={openDigiLocker}
                      className="w-full btn-outline mt-6"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Learn More About DigiLocker
                    </button>
                  </div>
                </div>

                {/* Authentication Form */}
                <div className="card">
                  <div className="card-body">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Enter Your Details
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="form-label">
                          Aadhaar Number <span className="text-error-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={userData.aadhaar}
                          onChange={(e) => handleInputChange('aadhaar', e.target.value)}
                          placeholder="Enter 12-digit Aadhaar number"
                          className="form-input"
                          maxLength={12}
                        />
                        <p className="form-help">
                          We'll use this to fetch your verified documents from DigiLocker
                        </p>
                      </div>

                      <div>
                        <label className="form-label">
                          Mobile Number <span className="text-error-600">*</span>
                        </label>
                        <input
                          type="tel"
                          value={userData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="Enter registered mobile number"
                          className="form-input"
                          maxLength={10}
                        />
                        <p className="form-help">
                          Must be the same number registered with Aadhaar
                        </p>
                      </div>

                      <div>
                        <label className="form-label">
                          Email Address (Optional)
                        </label>
                        <input
                          type="email"
                          value={userData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="Enter your email address"
                          className="form-input"
                        />
                        <p className="form-help">
                          For receiving verification updates
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleAuthenticate}
                      disabled={loading || !isOnline}
                      className="w-full btn-primary mt-6 py-4 text-lg font-semibold touch-target"
                    >
                      {loading ? (
                        <LoadingSpinner size="small" color="white" />
                      ) : (
                        <>
                          <Lock className="w-5 h-5 mr-2" />
                          Authenticate with DigiLocker
                        </>
                      )}
                    </button>

                    {!isOnline && (
                      <div className="mt-4 text-center p-3 bg-warning-50 rounded-lg">
                        <p className="text-sm text-warning-700">
                          DigiLocker requires internet connection
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="space-y-6">
                {/* Success Card */}
                <div className="card border-success-300 bg-success-50">
                  <div className="card-body text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-success-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-success-600" />
                    </div>
                    
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Authentication Successful!
                    </h2>
                    
                    <p className="text-gray-600 mb-6">
                      Your documents have been verified through DigiLocker
                    </p>

                    {/* User Info */}
                    <div className="bg-white rounded-lg p-4 mb-6">
                      <h3 className="font-semibold text-gray-900 mb-3">Verified Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium">Rahul Kumar</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Aadhaar:</span>
                          <span className="font-medium">XXXX-XXXX-1234</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">PAN:</span>
                          <span className="font-medium">ABCDE1234F</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Address:</span>
                          <span className="font-medium">Mumbai, Maharashtra</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleContinue}
                      className="w-full btn-primary py-4 text-lg font-semibold touch-target"
                    >
                      Continue to Face Verification
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8"
          >
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Security & Privacy
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Your data is encrypted and never stored on our servers</li>
                <li>• We only access documents you explicitly authorize</li>
                <li>• All communication is secured with SSL encryption</li>
                <li>• Your privacy is protected as per government guidelines</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default DigiLockerKYC
