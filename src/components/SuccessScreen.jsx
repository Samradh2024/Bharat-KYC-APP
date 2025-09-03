import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { 
  CheckCircle, 
  X, 
  ArrowRight, 
  Download, 
  Share2,
  Home,
  RefreshCw,
  Star,
  Sparkles,
  Trophy,
  Award,
  Calendar,
  Mail,
  Phone
} from 'lucide-react'
import { useKYC } from '../contexts/KYCContext'

const SuccessScreen = () => {
  const navigate = useNavigate()
  const { resetKYC } = useKYC()
  const [showConfetti, setShowConfetti] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)

  useEffect(() => {
    // Trigger confetti effect
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }, [])

  const handleDownloadCertificate = async () => {
    setDownloadProgress(0)
    
    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 100)

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

      <div className="min-h-screen bg-gradient-success safe-top safe-bottom relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-white/10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-40 left-20 w-20 h-20 bg-white/10 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
          <div className="absolute bottom-20 right-10 w-28 h-28 bg-white/10 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Confetti effect */}
        <AnimatePresence>
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: -20,
                    opacity: 1,
                  }}
                  animate={{
                    y: window.innerHeight + 20,
                    opacity: 0,
                    rotate: 360,
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.1,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        <div className="container-mobile py-8 relative z-10">
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2
            }}
            className="text-center mb-8"
          >
            <div className="relative">
              <motion.div 
                className="w-32 h-32 mx-auto mb-6 success-circle"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CheckCircle className="w-16 h-16 text-success-400" />
              </motion.div>
              
              {/* Sparkles around success icon */}
              <AnimatePresence>
                {showConfetti && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute top-0 left-1/4"
                    >
                      <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute top-0 right-1/4"
                    >
                      <Star className="w-6 h-6 text-yellow-300 animate-pulse" />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            
            <motion.h1 
              className="text-4xl font-bold text-white mb-3 text-glow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Verification Complete!
            </motion.h1>
            <motion.p 
              className="text-xl text-white/90 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Your KYC has been successfully verified
            </motion.p>
            <motion.p 
              className="text-lg text-white/70 hindi"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              आपकी पहचान सफलतापूर्वक सत्यापित हो गई है
            </motion.p>
          </motion.div>

          {/* Success Details */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6 mb-8"
          >
            {/* Verification Summary */}
            <motion.div 
              className="glass-card p-6"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <h3 className="font-bold text-white text-xl">
                  Verification Summary
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl backdrop-blur-lg">
                  <span className="text-white/80">Documents Verified</span>
                  <CheckCircle className="w-5 h-5 text-success-400" />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl backdrop-blur-lg">
                  <span className="text-white/80">Face Verification</span>
                  <CheckCircle className="w-5 h-5 text-success-400" />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl backdrop-blur-lg">
                  <span className="text-white/80">Liveness Check</span>
                  <CheckCircle className="w-5 h-5 text-success-400" />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-success-500/20 rounded-xl border border-success-400/30">
                  <span className="text-white font-semibold">Overall Status</span>
                  <span className="text-success-300 font-bold">Verified</span>
                </div>
              </div>
            </motion.div>

            {/* Next Steps */}
            <motion.div 
              className="glass-card p-6"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Award className="w-6 h-6 text-primary-400" />
                <h3 className="font-bold text-white text-xl">
                  What's Next?
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-white/10 rounded-xl backdrop-blur-lg">
                  <div className="w-2 h-2 bg-primary-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-white/80">
                    You can now use this verification for various services
                  </p>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-white/10 rounded-xl backdrop-blur-lg">
                  <Calendar className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-white/80">
                    Your verification is valid for 12 months
                  </p>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-white/10 rounded-xl backdrop-blur-lg">
                  <Mail className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-white/80">
                    You'll receive updates on your registered email/mobile
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-4"
          >
            <motion.button
              onClick={handleDownloadCertificate}
              className="w-full btn-outline py-5 text-lg font-semibold touch-target relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center justify-center">
                <Download className="w-6 h-6 mr-3 group-hover:animate-bounce" />
                Download Certificate
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.button>

            <motion.button
              onClick={handleShare}
              className="w-full btn-outline py-5 text-lg font-semibold touch-target relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center justify-center">
                <Share2 className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                Share Success
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.button>

            <motion.button
              onClick={handleStartNew}
              className="w-full btn-primary py-5 text-xl font-bold touch-target relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center justify-center">
                <Home className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                Back to Home
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.button>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 text-center"
          >
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Star className="w-4 h-4 text-yellow-400" />
              <p className="text-sm text-white/60">
                Thank you for using Bharat KYC
              </p>
              <Star className="w-4 h-4 text-yellow-400" />
            </div>
            <p className="text-xs text-white/50">
              For support, contact us at support@bharatkyc.in
            </p>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default SuccessScreen
