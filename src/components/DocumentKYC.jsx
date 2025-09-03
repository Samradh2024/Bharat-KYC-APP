import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useDropzone } from 'react-dropzone'
import { 
  ArrowLeft, 
  ArrowRight, 
  Camera, 
  Upload, 
  CheckCircle, 
  X,
  FileText,
  Shield,
  AlertCircle,
  RotateCcw,
  Download
} from 'lucide-react'
import { useKYC } from '../contexts/KYCContext'
import { useNetwork } from '../contexts/NetworkContext'
import { useOffline } from '../contexts/OfflineContext'
import LoadingSpinner from './LoadingSpinner'

const DocumentKYC = () => {
  const navigate = useNavigate()
  const { setDocuments, nextStep, loading, setLoading } = useKYC()
  const { isOnline } = useNetwork()
  const { addPendingAction } = useOffline()
  const [uploadedDocs, setUploadedDocs] = useState({})
  const [currentStep, setCurrentStep] = useState(0)
  const [showCamera, setShowCamera] = useState(false)

  const documentTypes = [
    {
      id: 'aadhaar',
      name: 'Aadhaar Card',
      description: 'Front and back of your Aadhaar card',
      required: true,
      icon: Shield,
      color: 'primary',
      maxSize: 5, // MB
      acceptedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
    },
    {
      id: 'pan',
      name: 'PAN Card',
      description: 'Your PAN card',
      required: true,
      icon: FileText,
      color: 'success',
      maxSize: 5,
      acceptedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
    },
    {
      id: 'drivingLicense',
      name: 'Driving License',
      description: 'Your driving license (optional)',
      required: false,
      icon: FileText,
      color: 'warning',
      maxSize: 5,
      acceptedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
    },
    {
      id: 'voterId',
      name: 'Voter ID',
      description: 'Your voter ID card (optional)',
      required: false,
      icon: FileText,
      color: 'error',
      maxSize: 5,
      acceptedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
    },
  ]

  const onDrop = useCallback((acceptedFiles, rejectedFiles, info) => {
    const docType = info.accept['image/*'] ? 'image' : 'document'
    const docId = info.accept['image/*'] ? 'aadhaar' : 'pan' // Simplified for demo

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      
      // Validate file size
      const maxSize = documentTypes.find(d => d.id === docId)?.maxSize || 5
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File size must be less than ${maxSize}MB`)
        return
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      
      setUploadedDocs(prev => ({
        ...prev,
        [docId]: {
          file,
          preview: previewUrl,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
        }
      }))

      // Save to offline storage if offline
      if (!isOnline) {
        addPendingAction({
          type: 'document_upload',
          data: {
            docId,
            fileName: file.name,
            fileSize: file.size,
            timestamp: Date.now(),
          }
        })
      }
    }

    if (rejectedFiles.length > 0) {
      console.error('Rejected files:', rejectedFiles)
      alert('Some files were rejected. Please check file type and size.')
    }
  }, [documentTypes, isOnline, addPendingAction])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf'],
    },
    multiple: false,
    maxSize: 5 * 1024 * 1024, // 5MB
  })

  const handleDocumentUpload = (docId) => {
    setCurrentStep(docId)
    setShowCamera(false)
  }

  const handleCameraCapture = () => {
    setShowCamera(true)
  }

  const handleRemoveDocument = (docId) => {
    setUploadedDocs(prev => {
      const newDocs = { ...prev }
      delete newDocs[docId]
      return newDocs
    })
  }

  const handleContinue = () => {
    const requiredDocs = documentTypes.filter(doc => doc.required)
    const uploadedRequiredDocs = requiredDocs.filter(doc => uploadedDocs[doc.id])
    
    if (uploadedRequiredDocs.length < requiredDocs.length) {
      alert('Please upload all required documents')
      return
    }

    setLoading(true)
    
    // Simulate processing
    setTimeout(() => {
      setDocuments(uploadedDocs)
      setLoading(false)
      nextStep()
      navigate('/face-verification')
    }, 2000)
  }

  const handleBack = () => {
    navigate('/kyc-selection')
  }

  const getProgress = () => {
    const requiredDocs = documentTypes.filter(doc => doc.required)
    const uploadedRequiredDocs = requiredDocs.filter(doc => uploadedDocs[doc.id])
    return Math.round((uploadedRequiredDocs.length / requiredDocs.length) * 100)
  }

  return (
    <>
      <Helmet>
        <title>Upload Documents - Bharat KYC</title>
        <meta name="description" content="Upload your identity documents for verification" />
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
                Upload Documents
              </h1>
              <div className="w-6" />
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{getProgress()}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${getProgress()}%` }}
                />
              </div>
            </div>

            <p className="text-gray-600 text-center">
              Upload clear photos of your identity documents
            </p>
          </motion.div>

          {/* Document Types */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4 mb-8"
          >
            {documentTypes.map((docType, index) => (
              <motion.div
                key={docType.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              >
                <div className={`card ${uploadedDocs[docType.id] ? 'border-success-300 bg-success-50' : ''}`}>
                  <div className="card-body">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-${docType.color}-100`}>
                          <docType.icon className={`w-5 h-5 text-${docType.color}-600`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {docType.name}
                            {docType.required && (
                              <span className="text-error-600 ml-1">*</span>
                            )}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {docType.description}
                          </p>
                        </div>
                      </div>
                      
                      {uploadedDocs[docType.id] && (
                        <CheckCircle className="w-6 h-6 text-success-600" />
                      )}
                    </div>

                    {uploadedDocs[docType.id] ? (
                      <div className="space-y-3">
                        {/* Document Preview */}
                        <div className="relative">
                          <img
                            src={uploadedDocs[docType.id].preview}
                            alt={docType.name}
                            className="w-full h-32 object-cover rounded-lg border"
                          />
                          <button
                            onClick={() => handleRemoveDocument(docType.id)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* Document Info */}
                        <div className="text-sm text-gray-600">
                          <p>File: {uploadedDocs[docType.id].name}</p>
                          <p>Size: {(uploadedDocs[docType.id].size / 1024 / 1024).toFixed(2)} MB</p>
                          <p>Uploaded: {new Date(uploadedDocs[docType.id].uploadedAt).toLocaleString()}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Upload Options */}
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleDocumentUpload(docType.id)}
                            className="flex-1 btn-outline py-3"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Choose File
                          </button>
                          <button
                            onClick={handleCameraCapture}
                            className="flex-1 btn-outline py-3"
                          >
                            <Camera className="w-4 h-4 mr-2" />
                            Camera
                          </button>
                        </div>
                        
                        {/* Drop Zone */}
                        <div
                          {...getRootProps()}
                          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                            isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
                          }`}
                        >
                          <input {...getInputProps()} />
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">
                            {isDragActive
                              ? 'Drop the file here'
                              : 'Drag & drop a file here, or click to select'
                            }
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Max size: {docType.maxSize}MB • Formats: JPG, PNG, PDF
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-8"
          >
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Tips for better verification
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Ensure good lighting when taking photos</li>
                <li>• Keep documents flat and avoid shadows</li>
                <li>• Make sure all text is clearly visible</li>
                <li>• Avoid blurry or tilted images</li>
              </ul>
            </div>
          </motion.div>

          {/* Continue Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="space-y-4"
          >
            <button
              onClick={handleContinue}
              disabled={getProgress() < 100 || loading}
              className="w-full btn-primary py-4 text-lg font-semibold touch-target"
            >
              {loading ? (
                <LoadingSpinner size="small" color="white" />
              ) : (
                <>
                  Continue to Face Verification
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>

            {!isOnline && (
              <div className="text-center p-3 bg-warning-50 rounded-lg">
                <p className="text-sm text-warning-700">
                  You're offline. Documents will be processed when you're back online.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default DocumentKYC
