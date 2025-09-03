import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
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
  Zap,
  Star,
  Sparkles
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
  const [hoveredMethod, setHoveredMethod] = useState(null)

  const kycMethods = [
    {
      id: 'digilocker',
      title: 'DigiLocker KYC',
      subtitle: 'Fastest & Most Secure',
      description: 'Use your DigiLocker account to instantly verify your identity with government-verified documents.',
      icon: Shield,
      color: 'primary',
      bgColor: 'bg-primary-500/20',
      borderColor: 'border-primary-400/30',
      gradient: 'from-primary-500/20 to-primary-600/20',
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
      badge: 'Recommended',
      badgeColor: 'success',
    },
    {
      id: 'document',
      title: 'Document Upload',
      subtitle: 'Works Offline',
      description: 'Upload photos of your identity documents for manual verification. Works even without internet.',
      icon: FileText,
      color: 'success',
      bgColor: 'bg-success-500/20',
      borderColor: 'border-success-400/30',
      gradient: 'from-success-500/20 to-success-600/20',
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
      badge: 'Offline Ready',
      badgeColor: 'warning',
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

      <div className="min-h-screen bg-gradient-primary safe-top safe-bottom relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-5 w-20 h-20 bg-white/5 rounded-full animate-float"></div>
          <div className="absolute top-20 right-10 w-16 h-16 bg-white/5 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 left-10 w-12 h-12 bg-white/5 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="container-mobile py-6 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <motion.button
                onClick={handleBack}
                className="p-3 text-white/80 hover:text-white transition-colors rounded-xl hover:bg-white/10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-6 h-6" />
              </motion.button>
              <h1 className="text-2xl font-bold text-white text-glow">
                Choose KYC Method
              </h1>
              <div className="w-12" />
            </div>

            <p className="text-white/80 text-center text-lg">
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
            <div className="space-y-4">
              {/* Connection Status */}
              <motion.div 
                className="glass-card p-4"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {isOnline ? (
                      <Wifi className="w-5 h-5 text-success-400" />
                    ) : (
                      <WifiOff className="w-5 h-5 text-warning-400" />
                    )}
                    <span className="text-white font-medium">
                      {isOnline ? 'Connected' : 'Offline Mode'}
                    </span>
                  </div>
                  {shouldUseLowBandwidthMode() && (
                    <span className="status-badge-warning">
                      Slow Connection
                    </span>
                  )}
                </div>
              </motion.div>

              {/* Pending Actions */}
              {pendingActionsCount > 0 && (
                <motion.div 
                  className="glass-card p-4 border border-warning-400/30"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-warning-400" />
                      <span className="text-white font-medium">
                        {pendingActionsCount} pending action{pendingActionsCount > 1 ? 's' : ''}
                      </span>
                    </div>
                    <CheckCircle className="w-5 h-5 text-warning-400" />
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* KYC Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6 mb-8"
          >
            {kycMethods.map((method, index) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                onHoverStart={() => setHoveredMethod(method.id)}
                onHoverEnd={() => setHoveredMethod(null)}
              >
                <motion.button
                  onClick={() => handleMethodSelect(method)}
                  disabled={method.networkRequired && !isOnline}
                  className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden ${
                    selectedMethod?.id === method.id
                      ? `${method.borderColor} ${method.bgColor} ring-4 ring-${method.color}-400/30 shadow-2xl`
                      : 'border-white/20 bg-white/10 backdrop-blur-lg hover:border-white/40 hover:bg-white/15'
                  } ${method.networkRequired && !isOnline ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl'}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Background gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${method.gradient} opacity-0 transition-opacity duration-300 ${
                    selectedMethod?.id === method.id ? 'opacity-100' : ''
                  }`} />
                  
                  <div className="relative z-10">
                    <div className="flex items-start space-x-4">
                      <motion.div 
                        className={`p-4 rounded-2xl backdrop-blur-lg border ${method.borderColor} shadow-lg ${
                          selectedMethod?.id === method.id ? 'bg-white/20' : 'bg-white/10'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <method.icon className={`w-8 h-8 text-${method.color}-400`} />
                      </motion.div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-white text-xl mb-1">
                              {method.title}
                            </h3>
                            <p className="text-sm text-white/80 font-medium">
                              {method.subtitle}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {method.badge && (
                              <span className={`status-badge-${method.badgeColor} text-xs`}>
                                {method.badge}
                              </span>
                            )}
                            {selectedMethod?.id === method.id && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                              >
                                <CheckCircle className="w-6 h-6 text-primary-400" />
                              </motion.div>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-white/70 mb-4 leading-relaxed">
                          {method.description}
                        </p>

                        {/* Features */}
                        <div className="mb-4">
                          <h4 className="text-xs font-semibold text-white/90 mb-2 uppercase tracking-wide">Key Features:</h4>
                          <div className="flex flex-wrap gap-2">
                            {method.features.map((feature, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-white/10 text-white/80 px-3 py-1 rounded-full backdrop-blur-lg border border-white/20"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Requirements */}
                        <div className="mb-4">
                          <h4 className="text-xs font-semibold text-white/90 mb-2 uppercase tracking-wide">Requirements:</h4>
                          <div className="flex flex-wrap gap-2">
                            {method.requirements.map((req, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-primary-500/20 text-primary-300 px-3 py-1 rounded-full border border-primary-400/30"
                              >
                                {req}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Time Estimate */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-white/50" />
                            <span className="text-xs text-white/60">
                              {method.estimatedTime}
                            </span>
                          </div>
                          
                          {method.networkRequired && !isOnline && (
                            <div className="flex items-center space-x-1">
                              <WifiOff className="w-4 h-4 text-warning-400" />
                              <span className="text-xs text-warning-400">
                                Requires Internet
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sparkles effect on hover */}
                  <AnimatePresence>
                    {hoveredMethod === method.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="absolute top-2 right-2"
                      >
                        <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
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
            <motion.button
              onClick={handleContinue}
              disabled={!selectedMethod || loading}
              className="w-full btn-primary py-5 text-xl font-bold touch-target relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  <span className="relative z-10 flex items-center justify-center">
                    Continue with {selectedMethod?.title}
                    <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </>
              )}
            </motion.button>

            {!isOnline && (
              <motion.div 
                className="text-center p-4 glass-card border border-warning-400/30"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <WifiOff className="w-5 h-5 text-warning-400" />
                  <p className="text-sm text-warning-300 font-medium">
                    You're offline
                  </p>
                </div>
                <p className="text-xs text-white/70">
                  Document upload method is recommended for offline use.
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-8 text-center"
          >
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <p className="text-sm text-white/60">
                Need help? Contact support at support@bharatkyc.in
              </p>
              <Star className="w-4 h-4 text-yellow-400" />
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default KYCSelection
