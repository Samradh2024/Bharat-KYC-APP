import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Shield, Smartphone, Wifi, Clock, CheckCircle, ArrowRight, Sparkles, Star, Zap } from 'lucide-react'
import { useKYC } from '../contexts/KYCContext'
import { useNetwork } from '../contexts/NetworkContext'
import { useOffline } from '../contexts/OfflineContext'
import LoadingSpinner from './LoadingSpinner'

const WelcomeScreen = () => {
  const navigate = useNavigate()
  const { nextStep, loading } = useKYC()
  const { isOnline, shouldUseLowBandwidthMode } = useNetwork()
  const { getPendingActionsCount } = useOffline()
  const [showFeatures, setShowFeatures] = useState(false)
  const [currentFeature, setCurrentFeature] = useState(0)
  const [showSparkles, setShowSparkles] = useState(false)

  const features = [
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and never shared without permission',
      color: 'text-success-400',
      bgColor: 'bg-success-500/20',
      borderColor: 'border-success-400/30',
      gradient: 'from-success-500/20 to-success-600/20',
    },
    {
      icon: Smartphone,
      title: 'Works Offline',
      description: 'Complete KYC even without internet connection',
      color: 'text-primary-400',
      bgColor: 'bg-primary-500/20',
      borderColor: 'border-primary-400/30',
      gradient: 'from-primary-500/20 to-primary-600/20',
    },
    {
      icon: Wifi,
      title: 'Low Bandwidth',
      description: 'Optimized for slow internet connections',
      color: 'text-warning-400',
      bgColor: 'bg-warning-500/20',
      borderColor: 'border-warning-400/30',
      gradient: 'from-warning-500/20 to-warning-600/20',
    },
    {
      icon: Clock,
      title: 'Quick & Easy',
      description: 'Complete verification in under 5 minutes',
      color: 'text-error-400',
      bgColor: 'bg-error-500/20',
      borderColor: 'border-error-400/30',
      gradient: 'from-error-500/20 to-error-600/20',
    },
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFeatures(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (showFeatures) {
      const interval = setInterval(() => {
        setCurrentFeature((prev) => (prev + 1) % features.length)
      }, 4000)

      return () => clearInterval(interval)
    }
  }, [showFeatures, features.length])

  useEffect(() => {
    const sparkleInterval = setInterval(() => {
      setShowSparkles(true)
      setTimeout(() => setShowSparkles(false), 1000)
    }, 3000)

    return () => clearInterval(sparkleInterval)
  }, [])

  const handleGetStarted = () => {
    nextStep()
    navigate('/kyc-selection')
  }

  const pendingActionsCount = getPendingActionsCount()

  return (
    <>
      <Helmet>
        <title>Welcome - Bharat KYC</title>
        <meta name="description" content="Secure and simple KYC verification for rural India" />
      </Helmet>

      <div className="min-h-screen bg-gradient-primary safe-top safe-bottom relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-white/5 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-40 left-20 w-20 h-20 bg-white/5 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
          <div className="absolute bottom-20 right-10 w-28 h-28 bg-white/5 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container-mobile py-8 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-8"
          >
            <div className="relative">
              <motion.div 
                className="w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center backdrop-blur-lg border border-white/20 shadow-2xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Shield className="w-14 h-14 text-white" />
              </motion.div>
              
              {/* Sparkles effect */}
              <AnimatePresence>
                {showSparkles && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <motion.h1 
              className="text-4xl font-bold text-white mb-3 text-glow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Bharat KYC
            </motion.h1>
            <motion.p 
              className="text-xl text-white/90 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Digital Identity Verification
            </motion.p>
            <motion.p 
              className="text-lg text-white/70 hindi"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              आपकी पहचान, आपका भरोसा
            </motion.p>
          </motion.div>

          {/* Features Carousel */}
          <AnimatePresence>
            {showFeatures && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mb-8"
              >
                <div className="relative h-32">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 50, scale: 0.9 }}
                      animate={{
                        opacity: index === currentFeature ? 1 : 0,
                        x: index === currentFeature ? 0 : 50,
                        scale: index === currentFeature ? 1 : 0.9,
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className={`absolute inset-0 glass-card p-6 border ${feature.borderColor}`}
                    >
                      <div className="flex items-center space-x-4 h-full">
                        <div className={`${feature.bgColor} p-4 rounded-2xl backdrop-blur-lg border ${feature.borderColor} shadow-lg`}>
                          <feature.icon className={`w-8 h-8 ${feature.color}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-white mb-2 text-lg">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-white/80 leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Feature Indicators */}
                  <div className="flex justify-center space-x-3 mt-4">
                    {features.map((_, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setCurrentFeature(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentFeature 
                            ? 'bg-white shadow-lg scale-125' 
                            : 'bg-white/30 hover:bg-white/50'
                        }`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <div className="space-y-4">
              {/* Network Status */}
              <motion.div 
                className="glass-card p-4"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${isOnline ? 'bg-success-400 animate-pulse' : 'bg-warning-400'}`} />
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

          {/* Get Started Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="space-y-6"
          >
            <motion.button
              onClick={handleGetStarted}
              disabled={loading}
              className="w-full btn-primary py-5 text-xl font-bold touch-target relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  <span className="relative z-10 flex items-center justify-center">
                    Get Started
                    <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </>
              )}
            </motion.button>

            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <p className="text-sm text-white/60 mb-3">
                By continuing, you agree to our
              </p>
              <div className="flex justify-center space-x-6 text-sm">
                <button className="text-white/80 hover:text-white transition-colors duration-200 underline decoration-white/30 hover:decoration-white">
                  Privacy Policy
                </button>
                <button className="text-white/80 hover:text-white transition-colors duration-200 underline decoration-white/30 hover:decoration-white">
                  Terms of Service
                </button>
              </div>
            </motion.div>
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
              <p className="text-sm text-white/50">
                Powered by Bharat Digital Identity Platform
              </p>
              <Star className="w-4 h-4 text-yellow-400" />
            </div>
            <p className="text-xs text-white/40">
              Version 1.0.0 • Made for Rural India
            </p>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default WelcomeScreen
