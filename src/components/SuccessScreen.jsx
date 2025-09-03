import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { 
  CheckCircle, 
  X, 
  ArrowRight, 
  Download, 
  Share2,
  Home,
  RefreshCw
} from 'lucide-react'
import { useKYC } from '../contexts/KYCContext'

const SuccessScreen = () => {
  const navigate = useNavigate()
  const { resetKYC } = useKYC()

  const handleDownloadCertificate = () => {
    // Simulate certificate download
    const certificateData = {
      name: 'Rahul Kumar',
      kycId: 'KYC_' + Date.now(),
      verifiedOn: new Date().toISOString(),
      status: 'Verified',
    }
    
    const blob = new Blob([JSON.stringify(certificateData, null, 2)], {
      type: 'application/json',
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'kyc-certificate.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Bharat KYC Verification Complete',
          text: 'I have successfully completed my KYC verification using Bharat KYC.',
          url: window.location.origin,
        })
      } catch (error) {
        console.log('Share cancelled or failed')
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.origin)
      alert('Link copied to clipboard!')
    }
  }

  const handleStartNew = () => {
    resetKYC()
    navigate('/')
  }

  return (
    <>
      <Helmet>
        <title>KYC Verification Complete - Bharat KYC</title>
        <meta name="description" content="Your KYC verification has been completed successfully" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-success-50 to-success-100 safe-top safe-bottom">
        <div className="container-mobile py-8">
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2
            }}
            className="text-center mb-8"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-success-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-success-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Verification Complete!
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Your KYC has been successfully verified
            </p>
            <p className="text-sm text-gray-500 hindi">
              आपकी पहचान सफलतापूर्वक सत्यापित हो गई है
            </p>
          </motion.div>

          {/* Success Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6 mb-8"
          >
            {/* Verification Summary */}
            <div className="card">
              <div className="card-body">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Verification Summary
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Documents Verified</span>
                    <CheckCircle className="w-5 h-5 text-success-600" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Face Verification</span>
                    <CheckCircle className="w-5 h-5 text-success-600" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Liveness Check</span>
                    <CheckCircle className="w-5 h-5 text-success-600" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Overall Status</span>
                    <span className="text-success-600 font-semibold">Verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="card">
              <div className="card-body">
                <h3 className="font-semibold text-gray-900 mb-4">
                  What's Next?
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-700">
                        You can now use this verification for various services
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-700">
                        Your verification is valid for 12 months
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-700">
                        You'll receive updates on your registered email/mobile
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-4"
          >
            <button
              onClick={handleDownloadCertificate}
              className="w-full btn-outline py-4 text-lg font-semibold touch-target"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Certificate
            </button>

            <button
              onClick={handleShare}
              className="w-full btn-outline py-4 text-lg font-semibold touch-target"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share Success
            </button>

            <button
              onClick={handleStartNew}
              className="w-full btn-primary py-4 text-lg font-semibold touch-target"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </button>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 text-center"
          >
            <p className="text-xs text-gray-500">
              Thank you for using Bharat KYC
            </p>
            <p className="text-xs text-gray-500 mt-1">
              For support, contact us at support@bharatkyc.in
            </p>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default SuccessScreen
