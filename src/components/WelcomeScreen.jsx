import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Shield, Smartphone, Wifi, Clock, CheckCircle, ArrowRight } from 'lucide-react'
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

  const features = [
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and never shared without permission',
      color: 'text-success-600',
      bgColor: 'bg-success-50',
    },
    {
      icon: Smartphone,
      title: 'Works Offline',
      description: 'Complete KYC even without internet connection',
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      icon: Wifi,
      title: 'Low Bandwidth',
      description: 'Optimized for slow internet connections',
      color: 'text-warning-600',
      bgColor: 'bg-warning-50',
    },
    {
      icon: Clock,
      title: 'Quick & Easy',
      description: 'Complete verification in under 5 minutes',
      color: 'text-error-600',
      bgColor: 'bg-error-50',
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
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [showFeatures, features.length])

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

      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 safe-top safe-bottom">
        <div className="container-mobile py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-primary-600 rounded-full flex items-center justify-center">
              <Shield className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bharat KYC
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Digital Identity Verification
            </p>
            <p className="text-sm text-gray-500 hindi">
              आपकी पहचान, आपका भरोसा
            </p>
          </motion.div>

          {/* Features Carousel */}
          {showFeatures && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="relative">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{
                      opacity: index === currentFeature ? 1 : 0,
                      x: index === currentFeature ? 0 : 50,
                    }}
                    transition={{ duration: 0.5 }}
                    className={`absolute inset-0 ${feature.bgColor} rounded-lg p-6`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`${feature.color} p-3 rounded-lg bg-white shadow-sm`}>
                        <feature.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {/* Feature Indicators */}
                <div className="flex justify-center space-x-2 mt-4">
                  {features.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentFeature(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentFeature ? 'bg-primary-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Status Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <div className="space-y-3">
              {/* Network Status */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-success-500' : 'bg-warning-500'}`} />
                  <span className="text-sm text-gray-700">
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
                {shouldUseLowBandwidthMode() && (
                  <span className="text-xs text-warning-600 bg-warning-50 px-2 py-1 rounded">
                    Low Bandwidth Mode
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

          {/* Get Started Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="space-y-4"
          >
            <button
              onClick={handleGetStarted}
              disabled={loading}
              className="w-full btn-primary py-4 text-lg font-semibold touch-target"
            >
              {loading ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>

            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">
                By continuing, you agree to our
              </p>
              <div className="flex justify-center space-x-4 text-xs">
                <button className="text-primary-600 hover:underline">
                  Privacy Policy
                </button>
                <button className="text-primary-600 hover:underline">
                  Terms of Service
                </button>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-12 text-center"
          >
            <p className="text-xs text-gray-400">
              Powered by Bharat Digital Identity Platform
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Version 1.0.0 • Made for Rural India
            </p>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default WelcomeScreen
