import React from 'react'
import { motion } from 'framer-motion'
import { WifiOff, Wifi, AlertCircle, CheckCircle } from 'lucide-react'
import { useNetwork } from '../contexts/NetworkContext'
import { useOffline } from '../contexts/OfflineContext'

const OfflineIndicator = () => {
  const { isOnline, connectionType, shouldUseLowBandwidthMode } = useNetwork()
  const { getPendingActionsCount } = useOffline()

  const pendingActionsCount = getPendingActionsCount()

  if (isOnline) return null

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      exit={{ y: -100 }}
      className="offline-indicator"
    >
      <div className="flex items-center justify-center space-x-2">
        <WifiOff className="w-4 h-4" />
        <span className="text-sm font-medium">You're offline</span>
        {pendingActionsCount > 0 && (
          <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
            {pendingActionsCount} pending
          </span>
        )}
      </div>
    </motion.div>
  )
}

const NetworkStatus = () => {
  const { isOnline, connectionType, shouldUseLowBandwidthMode } = useNetwork()

  if (isOnline && !shouldUseLowBandwidthMode()) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-16 left-4 right-4 z-40"
    >
      <div className="bg-white rounded-lg shadow-lg border p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-warning-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Slow Connection</p>
                  <p className="text-xs text-gray-600">
                    {connectionType} • Low bandwidth mode enabled
                  </p>
                </div>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-error-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Offline Mode</p>
                  <p className="text-xs text-gray-600">
                    Some features may not work
                  </p>
                </div>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <CheckCircle className="w-4 h-4 text-success-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-error-600" />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default OfflineIndicator
export { NetworkStatus }
