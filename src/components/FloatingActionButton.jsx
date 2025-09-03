import React from 'react'
import { motion } from 'framer-motion'
import { Plus, Home, ArrowLeft, Settings, HelpCircle } from 'lucide-react'

const FloatingActionButton = ({ 
  icon = Plus, 
  onClick, 
  variant = 'primary',
  size = 'medium',
  position = 'bottom-right',
  tooltip = '',
  disabled = false 
}) => {
  const iconComponents = {
    plus: Plus,
    home: Home,
    back: ArrowLeft,
    settings: Settings,
    help: HelpCircle,
  }

  const IconComponent = typeof icon === 'string' ? iconComponents[icon] || Plus : icon

  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-14 h-14',
    large: 'w-16 h-16',
  }

  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800',
    success: 'bg-gradient-to-r from-success-600 to-success-700 hover:from-success-700 hover:to-success-800',
    warning: 'bg-gradient-to-r from-warning-600 to-warning-700 hover:from-warning-700 hover:to-warning-800',
    error: 'bg-gradient-to-r from-error-600 to-error-700 hover:from-error-700 hover:to-error-800',
    glass: 'bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 hover:border-white/30',
  }

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
    'center': 'bottom-1/2 right-6 transform translate-y-1/2',
  }

  const iconSizes = {
    small: 'w-5 h-5',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`fab ${sizeClasses[size]} ${variantClasses[variant]} ${positionClasses[position]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      whileHover={{ scale: disabled ? 1 : 1.1 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.5
      }}
    >
      <IconComponent className={`${iconSizes[size]} text-white`} />
      
      {/* Tooltip */}
      {tooltip && (
        <motion.div
          className="tooltip"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {tooltip}
        </motion.div>
      )}
    </motion.button>
  )
}

export default FloatingActionButton
