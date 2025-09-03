import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw, Phone, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useKYC } from '../contexts/KYCContext'

const ErrorScreen = () => {
  const navigate = useNavigate()
  const { error, resetKYC } = useKYC()

  const handleRetry = () => {
    resetKYC()
    navigate('/')
  }

  const handleContactSupport = () => {
    // In a real app, this would open phone dialer or email
    window.open('tel:+91-1800-123-4567', '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Verification Failed</h1>
          <div className="w-9"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Error Icon */}
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.3 }}
            className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6"
          >
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </motion.div>

          {/* Error Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Verification Failed
          </h2>

          {/* Error Message */}
          <p className="text-gray-600 mb-8 max-w-md">
            {error?.message || "We couldn't complete your KYC verification. This could be due to network issues, document quality, or other technical problems."}
          </p>

          {/* What went wrong section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              What went wrong?
            </h3>
            <ul className="text-left text-gray-600 space-y-2">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Document images were unclear or incomplete</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Face verification didn't match with documents</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Network connection was unstable</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Server processing timeout</span>
              </li>
            </ul>
          </div>

          {/* How to resolve section */}
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 mb-8 max-w-md">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              How to resolve?
            </h3>
            <ul className="text-left text-blue-800 space-y-2">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Ensure good lighting when taking photos</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Keep documents flat and fully visible</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Use a stable internet connection</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Try again in a few minutes</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRetry}
              className="btn-primary flex items-center justify-center"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContactSupport}
              className="btn-secondary flex items-center justify-center"
            >
              <Phone className="w-5 h-5 mr-2" />
              Contact Support
            </motion.button>
          </div>

          {/* Support Info */}
          <div className="mt-8 text-sm text-gray-500">
            <p>Need help? Call us at <span className="font-semibold">1800-123-4567</span></p>
            <p>Available 24/7 for assistance</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ErrorScreen
