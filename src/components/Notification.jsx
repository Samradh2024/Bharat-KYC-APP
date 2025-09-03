import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  X, 
  Bell,
  Shield,
  Wifi,
  Clock
} from 'lucide-react'

const Notification = ({ 
  type = 'info',
  title = '',
  message = '',
  duration = 5000,
  onClose,
  show = true,
  position = 'top-right',
  variant = 'default'
}) => {
  const [isVisible, setIsVisible] = useState(show)

  useEffect(() => {
    setIsVisible(show)
  }, [show])

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  const iconComponents = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertCircle,
    info: Info,
    network: Wifi,
    security: Shield,
    time: Clock,
  }

  const IconComponent = iconComponents[type] || Info

  const variants = {
    default: {
      success: {
        bg: 'bg-success-500/20',
        border: 'border-success-400/30',
        icon: 'text-success-400',
        text: 'text-white',
      },
      error: {
        bg: 'bg-error-500/20',
        border: 'border-error-400/30',
        icon: 'text-error-400',
        text: 'text-white',
      },
      warning: {
        bg: 'bg-warning-500/20',
        border: 'border-warning-400/30',
        icon: 'text-warning-400',
        text: 'text-white',
      },
      info: {
        bg: 'bg-primary-500/20',
        border: 'border-primary-400/30',
        icon: 'text-primary-400',
        text: 'text-white',
      },
    },
    glass: {
      success: {
        bg: 'bg-success-500/10',
        border: 'border-success-400/20',
        icon: 'text-success-300',
        text: 'text-white/90',
      },
      error: {
        bg: 'bg-error-500/10',
        border: 'border-error-400/20',
        icon: 'text-error-300',
        text: 'text-white/90',
      },
      warning: {
        bg: 'bg-warning-500/10',
        border: 'border-warning-400/20',
        icon: 'text-warning-300',
        text: 'text-white/90',
      },
      info: {
        bg: 'bg-primary-500/10',
        border: 'border-primary-400/20',
        icon: 'text-primary-300',
        text: 'text-white/90',
      },
    },
  }

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  }

  const currentVariant = variants[variant][type] || variants[variant].info

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed ${positionClasses[position]} z-50 max-w-sm w-full`}
          initial={{ 
            opacity: 0, 
            scale: 0.8,
            x: position.includes('right') ? 100 : position.includes('left') ? -100 : 0,
            y: position.includes('top') ? -50 : position.includes('bottom') ? 50 : 0
          }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            x: 0,
            y: 0
          }}
          exit={{ 
            opacity: 0, 
            scale: 0.8,
            x: position.includes('right') ? 100 : position.includes('left') ? -100 : 0,
            y: position.includes('top') ? -50 : position.includes('bottom') ? 50 : 0
          }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        >
          <div className={`glass-card p-4 ${currentVariant.bg} ${currentVariant.border} backdrop-blur-lg`}>
            <div className="flex items-start space-x-3">
              {/* Icon */}
              <motion.div
                className={`p-2 rounded-full ${currentVariant.bg} ${currentVariant.border}`}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
              >
                <IconComponent className={`w-5 h-5 ${currentVariant.icon}`} />
              </motion.div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {title && (
                  <motion.h4 
                    className={`font-semibold text-sm ${currentVariant.text} mb-1`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {title}
                  </motion.h4>
                )}
                {message && (
                  <motion.p 
                    className={`text-sm ${currentVariant.text} leading-relaxed`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {message}
                  </motion.p>
                )}
              </div>

              {/* Close Button */}
              <motion.button
                onClick={handleClose}
                className={`p-1 rounded-full hover:bg-white/10 transition-colors ${currentVariant.text}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Progress Bar */}
            {duration > 0 && (
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-white/20 rounded-b-2xl overflow-hidden"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: duration / 1000, ease: "linear" }}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Notification Container for multiple notifications
const NotificationContainer = ({ notifications = [], position = 'top-right' }) => {
  return (
    <div className={`fixed ${position.includes('right') ? 'right-4' : position.includes('left') ? 'left-4' : 'left-1/2 transform -translate-x-1/2'} z-50 space-y-4`}>
      {notifications.map((notification, index) => (
        <Notification
          key={notification.id || index}
          {...notification}
          position={position}
        />
      ))}
    </div>
  )
}

export { NotificationContainer }
export default Notification
