import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, AlertCircle } from 'lucide-react'

const ProgressIndicator = ({ 
  steps = [], 
  currentStep = 0, 
  variant = 'default',
  showLabels = true,
  showIcons = true,
  size = 'medium'
}) => {
  const sizeClasses = {
    small: 'h-1',
    medium: 'h-2',
    large: 'h-3',
  }

  const stepSizes = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-10 h-10',
  }

  const iconSizes = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-5 h-5',
  }

  const variants = {
    default: {
      completed: 'bg-success-500',
      current: 'bg-primary-500',
      pending: 'bg-gray-300',
      text: 'text-gray-600',
      icon: 'text-white',
    },
    glass: {
      completed: 'bg-success-400',
      current: 'bg-primary-400',
      pending: 'bg-white/20',
      text: 'text-white/80',
      icon: 'text-white',
    },
    colorful: {
      completed: 'bg-gradient-to-r from-success-500 to-success-600',
      current: 'bg-gradient-to-r from-primary-500 to-primary-600',
      pending: 'bg-gradient-to-r from-gray-400 to-gray-500',
      text: 'text-gray-700',
      icon: 'text-white',
    },
  }

  const currentVariant = variants[variant]

  const getStepStatus = (index) => {
    if (index < currentStep) return 'completed'
    if (index === currentStep) return 'current'
    return 'pending'
  }

  const getStepIcon = (index, status) => {
    if (status === 'completed') {
      return <CheckCircle className={`${iconSizes[size]} ${currentVariant.icon}`} />
    }
    if (status === 'current') {
      return <Clock className={`${iconSizes[size]} ${currentVariant.icon}`} />
    }
    return <div className={`${iconSizes[size]} rounded-full ${currentVariant.pending}`} />
  }

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="relative mb-6">
        <div className={`progress-bar ${sizeClasses[size]}`}>
          <motion.div
            className={`progress-fill-animated ${sizeClasses[size]}`}
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="flex justify-between items-start">
        {steps.map((step, index) => {
          const status = getStepStatus(index)
          const isCompleted = status === 'completed'
          const isCurrent = status === 'current'

          return (
            <motion.div
              key={index}
              className="flex flex-col items-center space-y-2 flex-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Step Icon */}
              <motion.div
                className={`${stepSizes[size]} rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted 
                    ? currentVariant.completed 
                    : isCurrent 
                    ? currentVariant.current 
                    : currentVariant.pending
                } ${isCurrent ? 'ring-4 ring-primary-500/30 shadow-lg' : ''}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {showIcons && getStepIcon(index, status)}
                {!showIcons && (
                  <span className={`text-sm font-bold ${currentVariant.icon}`}>
                    {index + 1}
                  </span>
                )}
              </motion.div>

              {/* Step Label */}
              {showLabels && (
                <div className="text-center max-w-20">
                  <p className={`text-xs font-medium ${currentVariant.text} ${
                    isCurrent ? 'font-semibold' : ''
                  }`}>
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                      {step.description}
                    </p>
                  )}
                </div>
              )}

              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="absolute top-4 left-1/2 w-full h-0.5 bg-gray-200 -z-10">
                  <motion.div
                    className={`h-full ${currentVariant.completed}`}
                    initial={{ width: 0 }}
                    animate={{ 
                      width: index < currentStep ? '100%' : '0%' 
                    }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  />
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Current Step Info */}
      {steps[currentStep] && (
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className={`text-lg font-semibold ${currentVariant.text}`}>
            {steps[currentStep].label}
          </h3>
          {steps[currentStep].description && (
            <p className={`text-sm ${currentVariant.text} mt-1`}>
              {steps[currentStep].description}
            </p>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default ProgressIndicator
