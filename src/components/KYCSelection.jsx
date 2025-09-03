import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { 
  Shield, 
  Smartphone, 
  FileText, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle,
  Wifi,
  WifiOff,
  Clock,
  Zap
} from 'lucide-react'
import { useKYC } from '../contexts/KYCContext'
import { useNetwork } from '../contexts/NetworkContext'
import { useOffline } from '../contexts/OfflineContext'
import LoadingSpinner from './LoadingSpinner'

const KYCSelection = () => {
  const navigate = useNavigate()
  const { setKYCMethod, nextStep, loading } = useKYC()
  const { isOnline, shouldUseLowBandwidthMode } = useNetwork()
  const { getPendingActionsCount } = useOffline()
  const [selectedMethod, setSelectedMethod] = useState(null)

  const kycMethods = [
    {
      id: 'digilocker',
      title: 'DigiLocker KYC',
      subtitle: 'Fastest & Most Secure',
      description: 'Use your DigiLocker account to instantly verify your identity with government-verified documents.',
      icon: Shield,
      color: 'primary',
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-200',
      features: [
        'Instant verification',
        'Government-verified documents',
        'No document upload needed',
        'Most secure method'
      ],
      requirements: [
        'DigiLocker account',
        'Aadhaar number',
        'Mobile number'
      ],
      estimatedTime: '2-3 minutes',
      networkRequired: true,
    },
    {
      id: 'document',
      title: 'Document Upload',
      subtitle: 'Works Offline',
      description: 'Upload photos of your identity documents for manual verification. Works even without internet.',
      icon: FileText,
      color: 'success',
      bgColor: 'bg-success-50',
      borderColor: 'border-success-200',
      features: [
        'Works offline',
        'Multiple document options',
        'Manual verification',
        'Flexible requirements'
      ],
      requirements: [
        'Any government ID',
        'Camera access',
        'Document photos'
      ],
      estimatedTime: '5-10 minutes',
      networkRequired: false,
    }
  ]

  const handleMethodSelect = (method) => {
    setSelectedMethod(method)
  }

  const handleContinue = () => {
    if (selectedMethod) {
      setKYCMethod(selectedMethod.id)
      nextStep()
      navigate(selectedMethod.id === 'digilocker' ? '/digilocker-kyc' : '/document-kyc')
    }
  }

  const handleBack = () => {
    navigate('/')
  }

  const pendingActionsCount = getPendingActionsCount()

  return (
    <>
      <Helmet>
        <title>Choose KYC Method - Bharat KYC</title>
        <meta name="description" content="Choose your preferred KYC verification method" />
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
                Choose KYC Method
              </h1>
              <div className="w-6" />
            </div>

            <p className="text-gray-600 text-center">
              Select the method that works best for you
            </p>
          </motion.div>

          {/* Network Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <div className="space-y-3">
              {/* Connection Status */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <div className="flex items-center space-x-3">
                  {isOnline ? (
                    <Wifi className="w-4 h-4 text-success-600" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-warning-600" />
                  )}
                  <span className="text-sm text-gray-700">
                    {isOnline ? 'Connected' : 'Offline Mode'}
                  </span>
                </div>
                {shouldUseLowBandwidthMode() && (
                  <span className="text-xs text-warning-600 bg-warning-50 px-2 py-1 rounded">
                    Slow Connection
                  </span>
                )}
              </div>

              {/* Pending Actions */}
              {pendingActionsCount > 0 && (
                <div className="flex items-center justify-between p-3 bg-warning-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-warning-600" />
                    <span className="text-sm text-warning-700">
                      {pendingActionsCount} pending action{pendingActionsCount > 1 ? 's' : ''}
                    </span>
                  </div>
                  <CheckCircle className="w-4 h-4 text-warning-600" />
                </div>
              )}
            </div>
          </motion.div>

          {/* KYC Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4 mb-8"
          >
            {kycMethods.map((method, index) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              >
                <button
                  onClick={() => handleMethodSelect(method)}
                  disabled={method.networkRequired && !isOnline}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedMethod?.id === method.id
                      ? `${method.borderColor} ${method.bgColor} ring-2 ring-${method.color}-500 ring-opacity-50`
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  } ${method.networkRequired && !isOnline ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg bg-${method.color}-100`}>
                      <method.icon className={`w-6 h-6 text-${method.color}-600`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {method.title}
                        </h3>
                        {selectedMethod?.id === method.id && (
                          <CheckCircle className="w-5 h-5 text-primary-600" />
                        )}
                      </div>
                      
                      <p className="text-sm text-primary-600 font-medium mb-1">
                        {method.subtitle}
                      </p>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {method.description}
                      </p>

                      {/* Features */}
                      <div className="mb-3">
                        <h4 className="text-xs font-medium text-gray-700 mb-1">Key Features:</h4>
                        <div className="flex flex-wrap gap-1">
                          {method.features.map((feature, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Requirements */}
                      <div className="mb-3">
                        <h4 className="text-xs font-medium text-gray-700 mb-1">Requirements:</h4>
                        <div className="flex flex-wrap gap-1">
                          {method.requirements.map((req, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded"
                            >
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Time Estimate */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {method.estimatedTime}
                          </span>
                        </div>
                        
                        {method.networkRequired && !isOnline && (
                          <div className="flex items-center space-x-1">
                            <WifiOff className="w-4 h-4 text-warning-600" />
                            <span className="text-xs text-warning-600">
                              Requires Internet
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </motion.div>

          {/* Continue Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="space-y-4"
          >
            <button
              onClick={handleContinue}
              disabled={!selectedMethod || loading}
              className="w-full btn-primary py-4 text-lg font-semibold touch-target"
            >
              {loading ? (
                <LoadingSpinner size="small" color="white" />
              ) : (
                <>
                  Continue with {selectedMethod?.title}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>

            {!isOnline && (
              <div className="text-center p-3 bg-warning-50 rounded-lg">
                <p className="text-sm text-warning-700">
                  You're offline. Document upload method is recommended.
                </p>
              </div>
            )}
          </motion.div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-8 text-center"
          >
            <p className="text-xs text-gray-500">
              Need help? Contact support at support@bharatkyc.in
            </p>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default KYCSelection
