import React, { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const NetworkContext = createContext()

export function NetworkProvider({ children }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [connectionType, setConnectionType] = useState('unknown')
  const [connectionSpeed, setConnectionSpeed] = useState('unknown')
  const [isSlowConnection, setIsSlowConnection] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      toast.success('Connection restored!')
    }

    const handleOffline = () => {
      setIsOnline(false)
      toast.error('You are offline. Some features may not work.')
    }

    const updateConnectionInfo = () => {
      if ('connection' in navigator) {
        const connection = navigator.connection
        setConnectionType(connection.effectiveType || 'unknown')
        setConnectionSpeed(connection.downlink || 'unknown')
        setIsSlowConnection(connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')
      }
    }

    // Initial connection info
    updateConnectionInfo()

    // Event listeners
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', updateConnectionInfo)
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      
      if ('connection' in navigator) {
        navigator.connection.removeEventListener('change', updateConnectionInfo)
      }
    }
  }, [])

  const getConnectionQuality = () => {
    if (!isOnline) return 'offline'
    if (isSlowConnection) return 'slow'
    if (connectionType === '4g' || connectionType === '5g') return 'fast'
    if (connectionType === '3g') return 'medium'
    return 'slow'
  }

  const shouldUseLowBandwidthMode = () => {
    return !isOnline || isSlowConnection || connectionType === '2g' || connectionType === 'slow-2g'
  }

  const value = {
    isOnline,
    connectionType,
    connectionSpeed,
    isSlowConnection,
    getConnectionQuality,
    shouldUseLowBandwidthMode,
  }

  return (
    <NetworkContext.Provider value={value}>
      {children}
    </NetworkContext.Provider>
  )
}

export function useNetwork() {
  const context = useContext(NetworkContext)
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider')
  }
  return context
}
