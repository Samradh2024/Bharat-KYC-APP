import React, { Suspense, useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useQueryClient } from 'react-query'
import { motion, AnimatePresence } from 'framer-motion'

// Lazy load components for better performance
const WelcomeScreen = React.lazy(() => import('./components/WelcomeScreen'))
const KYCSelection = React.lazy(() => import('./components/KYCSelection'))
const DigiLockerKYC = React.lazy(() => import('./components/DigiLockerKYC'))
const DocumentKYC = React.lazy(() => import('./components/DocumentKYC'))
const FaceVerification = React.lazy(() => import('./components/FaceVerification'))
const ReviewScreen = React.lazy(() => import('./components/ReviewScreen'))
const SuccessScreen = React.lazy(() => import('./components/SuccessScreen'))
const ErrorScreen = React.lazy(() => import('./components/ErrorScreen'))
const OfflineIndicator = React.lazy(() => import('./components/OfflineIndicator'))
const LoadingSpinner = React.lazy(() => import('./components/LoadingSpinner'))
const NetworkStatus = React.lazy(() => import('./components/NetworkStatus'))

// Context providers
import { KYCProvider } from './contexts/KYCContext'
import { NetworkProvider } from './contexts/NetworkContext'
import { OfflineProvider } from './contexts/OfflineContext'

// Hooks
import { useNetworkStatus } from './hooks/useNetworkStatus'
import { useOfflineStorage } from './hooks/useOfflineStorage'

// Utils
import { initializeApp } from './utils/appInitializer'
import { registerServiceWorker } from './utils/serviceWorker'

function App() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const queryClient = useQueryClient()

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeApp()
        await registerServiceWorker()
        setIsInitialized(true)
      } catch (error) {
        console.error('App initialization failed:', error)
        setIsInitialized(true) // Continue anyway
      }
    }

    initialize()
  }, [])

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <NetworkProvider>
      <OfflineProvider>
        <KYCProvider>
          <Helmet>
            <title>Bharat KYC - Digital Identity Verification</title>
            <meta name="description" content="Secure and simple KYC verification for rural India" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            <meta name="theme-color" content="#3b82f6" />
            <link rel="manifest" href="/manifest.json" />
            <link rel="apple-touch-icon" href="/icon-192x192.png" />
          </Helmet>

          <div className="min-h-screen bg-gray-50">
            {/* Offline Indicator */}
            {!isOnline && <OfflineIndicator />}
            
            {/* Network Status */}
            <NetworkStatus />

            {/* Main App Content */}
            <AnimatePresence mode="wait">
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <WelcomeScreen />
                    </Suspense>
                  } 
                />
                <Route 
                  path="/kyc-selection" 
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <KYCSelection />
                    </Suspense>
                  } 
                />
                <Route 
                  path="/digilocker-kyc" 
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <DigiLockerKYC />
                    </Suspense>
                  } 
                />
                <Route 
                  path="/document-kyc" 
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <DocumentKYC />
                    </Suspense>
                  } 
                />
                <Route 
                  path="/face-verification" 
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <FaceVerification />
                    </Suspense>
                  } 
                />
                <Route 
                  path="/review" 
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <ReviewScreen />
                    </Suspense>
                  } 
                />
                <Route 
                  path="/success" 
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <SuccessScreen />
                    </Suspense>
                  } 
                />
                <Route 
                  path="/error" 
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <ErrorScreen />
                    </Suspense>
                  } 
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          </div>
        </KYCProvider>
      </OfflineProvider>
    </NetworkProvider>
  )
}

export default App
