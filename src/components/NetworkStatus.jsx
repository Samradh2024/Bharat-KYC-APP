import React from 'react'
import { motion } from 'framer-motion'
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react'
import { useNetwork } from '../contexts/NetworkContext'

const NetworkStatus = () => {
  const { isOnline, connectionType, connectionSpeed, isSlowConnection } = useNetwork()

  // Don't show anything if online and connection is good
  if (isOnline && !isSlowConnection) {
    return null
  }

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="bg-white shadow-lg border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {!isOnline ? (
              <WifiOff className="w-5 h-5 text-red-600" />
            ) : isSlowConnection ? (
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            ) : (
              <Wifi className="w-5 h-5 text-green-600" />
            )}
            
            <div>
              <p className="text-sm font-medium text-gray-900">
                {!isOnline ? 'Offline Mode' : 'Slow Connection'}
              </p>
              <p className="text-xs text-gray-500">
                {!isOnline 
                  ? 'Some features may be limited'
                  : `${connectionType} • ${connectionSpeed}`
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {!isOnline && (
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            )}
            {isSlowConnection && (
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default NetworkStatus
