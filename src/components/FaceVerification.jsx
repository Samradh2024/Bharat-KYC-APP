import React, { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import Webcam from 'react-webcam'
import { 
  ArrowLeft, 
  ArrowRight, 
  Camera, 
  RotateCcw, 
  CheckCircle, 
  X,
  AlertCircle,
  Eye,
  Smile,
  Zap
} from 'lucide-react'
import { useKYC } from '../contexts/KYCContext'
import { useNetwork } from '../contexts/NetworkContext'
import { useOffline } from '../contexts/OfflineContext'
import LoadingSpinner from './LoadingSpinner'

const FaceVerification = () => {
  const navigate = useNavigate()
  const { setFaceData, nextStep, loading, setLoading } = useKYC()
  const { isOnline } = useNetwork()
  const { addPendingAction } = useOffline()
  const webcamRef = useRef(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [verificationStep, setVerificationStep] = useState('capture') // capture, liveness, facematch
  const [livenessScore, setLivenessScore] = useState(0)
  const [faceMatchScore, setFaceMatchScore] = useState(0)

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: 'user',
  }

  const capture = useCallback(() => {
    if (webcamRef.current) {
      setIsCapturing(true)
      const imageSrc = webcamRef.current.getScreenshot()
      setCapturedImage(imageSrc)
      setIsCapturing(false)
      setVerificationStep('liveness')
    }
  }, [webcamRef])

  const retake = () => {
    setCapturedImage(null)
    setVerificationStep('capture')
    setLivenessScore(0)
    setFaceMatchScore(0)
  }

  const handleLivenessCheck = async () => {
    setLoading(true)
    
    // Simulate liveness detection
    setTimeout(() => {
      const score = Math.random() * 0.4 + 0.6 // 60-100% score
      setLivenessScore(score)
      setVerificationStep('facematch')
      setLoading(false)
    }, 2000)
  }

  const handleFaceMatch = async () => {
    setLoading(true)
    
    // Simulate face matching
    setTimeout(() => {
      const score = Math.random() * 0.3 + 0.7 // 70-100% score
      setFaceMatchScore(score)
      
      // Save face data
      setFaceData({
        selfie: capturedImage,
        livenessScore: livenessScore,
        faceMatchScore: score,
      })
      
      setLoading(false)
      nextStep()
      navigate('/review')
    }, 2000)
  }

  const handleBack = () => {
    navigate('/document-kyc')
  }

  const getVerificationStatus = () => {
    if (verificationStep === 'capture') return 'Take a selfie'
    if (verificationStep === 'liveness') return 'Checking liveness...'
    if (verificationStep === 'facematch') return 'Matching face...'
    return 'Verification complete'
  }

  const getScoreColor = (score) => {
    if (score >= 0.8) return 'text-success-600'
    if (score >= 0.6) return 'text-warning-600'
    return 'text-error-600'
  }

  const getScoreText = (score) => {
    if (score >= 0.8) return 'Excellent'
    if (score >= 0.6) return 'Good'
    return 'Poor'
  }

  return (
    <>
      <Helmet>
        <title>Face Verification - Bharat KYC</title>
        <meta name="description" content="Complete face verification for your KYC" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 safe-top safe-bottom">
        <div className="container-mobile py-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handleBack}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Face Verification
              </h1>
              <div className="w-6" />
            </div>

            <p className="text-gray-600 text-center">
              {getVerificationStatus()}
            </p>
          </motion.div>

          {/* Camera Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <div className="card">
              <div className="card-body">
                {verificationStep === 'capture' && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Take a Selfie
                      </h3>
                      <p className="text-sm text-gray-600">
                        Position your face in the center and ensure good lighting
                      </p>
                    </div>

                    <div className="relative">
                      <Webcam
                        ref={webcamRef}
                        audio={false}
                        screenshotFormat="image/jpeg"
                        videoConstraints={videoConstraints}
                        className="w-full rounded-lg"
                      />
                      
                      {/* Camera Overlay */}
                      <div className="camera-overlay">
                        <div className="camera-frame w-64 h-64">
                          {/* Face guide */}
                          <div className="absolute inset-4 border-2 border-white rounded-full opacity-50"></div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={capture}
                      disabled={isCapturing}
                      className="w-full btn-primary py-4 text-lg font-semibold touch-target"
                    >
                      {isCapturing ? (
                        <LoadingSpinner size="small" color="white" />
                      ) : (
                        <>
                          <Camera className="w-5 h-5 mr-2" />
                          Capture Photo
                        </>
                      )}
                    </button>
                  </div>
                )}

                {verificationStep === 'liveness' && capturedImage && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Liveness Detection
                      </h3>
                      <p className="text-sm text-gray-600">
                        Verifying that you are a real person
                      </p>
                    </div>

                    <div className="relative">
                      <img
                        src={capturedImage}
                        alt="Captured selfie"
                        className="w-full rounded-lg"
                      />
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={retake}
                        className="flex-1 btn-outline py-3"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Retake
                      </button>
                      <button
                        onClick={handleLivenessCheck}
                        disabled={loading}
                        className="flex-1 btn-primary py-3"
                      >
                        {loading ? (
                          <LoadingSpinner size="small" color="white" />
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            Check Liveness
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {verificationStep === 'facematch' && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Face Matching
                      </h3>
                      <p className="text-sm text-gray-600">
                        Comparing with your document photos
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Liveness Score */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Liveness Score
                          </span>
                          <span className={`text-sm font-semibold ${getScoreColor(livenessScore)}`}>
                            {getScoreText(livenessScore)}
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ width: `${livenessScore * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {(livenessScore * 100).toFixed(0)}% - Real person detected
                        </p>
                      </div>

                      {/* Face Match Score */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Face Match Score
                          </span>
                          <span className={`text-sm font-semibold ${getScoreColor(faceMatchScore)}`}>
                            {getScoreText(faceMatchScore)}
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ width: `${faceMatchScore * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {(faceMatchScore * 100).toFixed(0)}% - Face matches documents
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={retake}
                        className="flex-1 btn-outline py-3"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Retake
                      </button>
                      <button
                        onClick={handleFaceMatch}
                        disabled={loading}
                        className="flex-1 btn-primary py-3"
                      >
                        {loading ? (
                          <LoadingSpinner size="small" color="white" />
                        ) : (
                          <>
                            <Smile className="w-4 h-4 mr-2" />
                            Complete Verification
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Tips for better verification
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Ensure good lighting on your face</li>
                <li>• Remove glasses and hats</li>
                <li>• Look directly at the camera</li>
                <li>• Keep a neutral expression</li>
                <li>• Stay still while capturing</li>
              </ul>
            </div>
          </motion.div>

          {/* Offline Notice */}
          {!isOnline && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center p-3 bg-warning-50 rounded-lg"
            >
              <p className="text-sm text-warning-700">
                You're offline. Face verification will be processed when you're back online.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </>
  )
}

export default FaceVerification
