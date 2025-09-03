import React from 'react'
import { motion } from 'framer-motion'

const LoadingSpinner = ({ size = 'medium', color = 'primary', text = '', variant = 'spinner' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
    xlarge: 'w-12 h-12',
  }

  const colorClasses = {
    primary: 'text-primary-400',
    success: 'text-success-400',
    warning: 'text-warning-400',
    error: 'text-error-400',
    white: 'text-white',
    gray: 'text-gray-400',
  }

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`w-2 h-2 ${colorClasses[color]} rounded-full`}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        )

      case 'pulse':
        return (
          <motion.div
            className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              background: `radial-gradient(circle, currentColor 30%, transparent 70%)`,
            }}
          />
        )

      case 'ring':
        return (
          <div className="relative">
            <motion.div
              className={`${sizeClasses[size]} rounded-full border-2 border-current/20`}
            />
            <motion.div
              className={`${sizeClasses[size]} rounded-full border-2 border-t-transparent border-current absolute inset-0`}
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>
        )

      case 'wave':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className={`w-1 ${colorClasses[color]} rounded-full`}
                style={{ height: sizeClasses[size] }}
                animate={{
                  scaleY: [1, 2, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        )

      default: // spinner
        return (
          <motion.div
            className={`${sizeClasses[size]} rounded-full border-2 border-current/20 border-t-current`}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        )
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {renderSpinner()}
      </motion.div>
      {text && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-white/70 mt-3 text-center font-medium"
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}

export default LoadingSpinner
