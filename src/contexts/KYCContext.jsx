import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

// Action types
const KYC_ACTIONS = {
  SET_STEP: 'SET_STEP',
  SET_USER_DATA: 'SET_USER_DATA',
  SET_DOCUMENTS: 'SET_DOCUMENTS',
  SET_FACE_DATA: 'SET_FACE_DATA',
  SET_VERIFICATION_STATUS: 'SET_VERIFICATION_STATUS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  RESET: 'RESET',
  UPDATE_PROGRESS: 'UPDATE_PROGRESS',
  SET_OFFLINE_DATA: 'SET_OFFLINE_DATA',
  SET_DIGILOCKER_DATA: 'SET_DIGILOCKER_DATA',
}

// Initial state
const initialState = {
  currentStep: 0,
  totalSteps: 6,
  userData: {
    name: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
    },
  },
  documents: {
    aadhaar: null,
    pan: null,
    drivingLicense: null,
    voterId: null,
  },
  faceData: {
    selfie: null,
    livenessScore: 0,
    faceMatchScore: 0,
  },
  verificationStatus: {
    documentsVerified: false,
    faceVerified: false,
    overallVerified: false,
  },
  loading: false,
  error: null,
  progress: 0,
  offlineData: [],
  digilockerData: null,
  kycMethod: null, // 'digilocker' or 'document'
}

// Reducer function
function kycReducer(state, action) {
  switch (action.type) {
    case KYC_ACTIONS.SET_STEP:
      return {
        ...state,
        currentStep: action.payload,
        progress: Math.round((action.payload / state.totalSteps) * 100),
      }
    
    case KYC_ACTIONS.SET_USER_DATA:
      return {
        ...state,
        userData: { ...state.userData, ...action.payload },
      }
    
    case KYC_ACTIONS.SET_DOCUMENTS:
      return {
        ...state,
        documents: { ...state.documents, ...action.payload },
      }
    
    case KYC_ACTIONS.SET_FACE_DATA:
      return {
        ...state,
        faceData: { ...state.faceData, ...action.payload },
      }
    
    case KYC_ACTIONS.SET_VERIFICATION_STATUS:
      return {
        ...state,
        verificationStatus: { ...state.verificationStatus, ...action.payload },
      }
    
    case KYC_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      }
    
    case KYC_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    
    case KYC_ACTIONS.RESET:
      return initialState
    
    case KYC_ACTIONS.UPDATE_PROGRESS:
      return {
        ...state,
        progress: action.payload,
      }
    
    case KYC_ACTIONS.SET_OFFLINE_DATA:
      return {
        ...state,
        offlineData: action.payload,
      }
    
    case KYC_ACTIONS.SET_DIGILOCKER_DATA:
      return {
        ...state,
        digilockerData: action.payload,
      }
    
    default:
      return state
  }
}

// Create context
const KYCContext = createContext()

// Provider component
export function KYCProvider({ children }) {
  const [state, dispatch] = useReducer(kycReducer, initialState)
  const navigate = useNavigate()

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('kyc-data')
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        dispatch({ type: KYC_ACTIONS.SET_USER_DATA, payload: parsedData.userData || {} })
        dispatch({ type: KYC_ACTIONS.SET_STEP, payload: parsedData.currentStep || 0 })
      }
    } catch (error) {
      console.error('Error loading KYC data:', error)
    }
  }, [])

  // Save data to localStorage when state changes
  useEffect(() => {
    try {
      const dataToSave = {
        userData: state.userData,
        currentStep: state.currentStep,
        documents: state.documents,
        faceData: state.faceData,
      }
      localStorage.setItem('kyc-data', JSON.stringify(dataToSave))
    } catch (error) {
      console.error('Error saving KYC data:', error)
    }
  }, [state.userData, state.currentStep, state.documents, state.faceData])

  // Navigation functions
  const nextStep = () => {
    if (state.currentStep < state.totalSteps - 1) {
      dispatch({ type: KYC_ACTIONS.SET_STEP, payload: state.currentStep + 1 })
      navigateToStep(state.currentStep + 1)
    }
  }

  const prevStep = () => {
    if (state.currentStep > 0) {
      dispatch({ type: KYC_ACTIONS.SET_STEP, payload: state.currentStep - 1 })
      navigateToStep(state.currentStep - 1)
    }
  }

  const goToStep = (step) => {
    dispatch({ type: KYC_ACTIONS.SET_STEP, payload: step })
    navigateToStep(step)
  }

  const navigateToStep = (step) => {
    const routes = [
      '/',
      '/kyc-selection',
      '/document-kyc', // or '/digilocker-kyc'
      '/face-verification',
      '/review',
      '/success',
    ]
    navigate(routes[step] || '/')
  }

  // Action functions
  const setUserData = (data) => {
    dispatch({ type: KYC_ACTIONS.SET_USER_DATA, payload: data })
  }

  const setDocuments = (documents) => {
    dispatch({ type: KYC_ACTIONS.SET_DOCUMENTS, payload: documents })
  }

  const setFaceData = (faceData) => {
    dispatch({ type: KYC_ACTIONS.SET_FACE_DATA, payload: faceData })
  }

  const setVerificationStatus = (status) => {
    dispatch({ type: KYC_ACTIONS.SET_VERIFICATION_STATUS, payload: status })
  }

  const setLoading = (loading) => {
    dispatch({ type: KYC_ACTIONS.SET_LOADING, payload: loading })
  }

  const setError = (error) => {
    dispatch({ type: KYC_ACTIONS.SET_ERROR, payload: error })
    if (error) {
      toast.error(error)
    }
  }

  const resetKYC = () => {
    dispatch({ type: KYC_ACTIONS.RESET })
    localStorage.removeItem('kyc-data')
    navigate('/')
  }

  const setKYCMethod = (method) => {
    dispatch({ type: KYC_ACTIONS.SET_USER_DATA, payload: { kycMethod: method } })
  }

  const setDigiLockerData = (data) => {
    dispatch({ type: KYC_ACTIONS.SET_DIGILOCKER_DATA, payload: data })
  }

  const saveOfflineData = (data) => {
    const offlineData = [...state.offlineData, { ...data, timestamp: Date.now() }]
    dispatch({ type: KYC_ACTIONS.SET_OFFLINE_DATA, payload: offlineData })
    
    // Save to localStorage
    try {
      localStorage.setItem('kyc-offline-data', JSON.stringify(offlineData))
    } catch (error) {
      console.error('Error saving offline data:', error)
    }
  }

  const syncOfflineData = async () => {
    if (state.offlineData.length > 0) {
      setLoading(true)
      try {
        // Simulate API call to sync offline data
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Clear offline data after successful sync
        dispatch({ type: KYC_ACTIONS.SET_OFFLINE_DATA, payload: [] })
        localStorage.removeItem('kyc-offline-data')
        
        toast.success('Offline data synced successfully!')
      } catch (error) {
        setError('Failed to sync offline data')
      } finally {
        setLoading(false)
      }
    }
  }

  // Validation functions
  const validateCurrentStep = () => {
    switch (state.currentStep) {
      case 0: // Welcome
        return true
      case 1: // KYC Selection
        return state.kycMethod
      case 2: // Document/DigiLocker
        if (state.kycMethod === 'digilocker') {
          return state.digilockerData
        } else {
          return Object.values(state.documents).some(doc => doc !== null)
        }
      case 3: // Face Verification
        return state.faceData.selfie && state.faceData.livenessScore > 0.7
      case 4: // Review
        return state.verificationStatus.documentsVerified && state.verificationStatus.faceVerified
      default:
        return true
    }
  }

  const canProceed = () => {
    return validateCurrentStep()
  }

  const value = {
    ...state,
    nextStep,
    prevStep,
    goToStep,
    setUserData,
    setDocuments,
    setFaceData,
    setVerificationStatus,
    setLoading,
    setError,
    resetKYC,
    setKYCMethod,
    setDigiLockerData,
    saveOfflineData,
    syncOfflineData,
    canProceed,
    validateCurrentStep,
  }

  return (
    <KYCContext.Provider value={value}>
      {children}
    </KYCContext.Provider>
  )
}

// Custom hook to use KYC context
export function useKYC() {
  const context = useContext(KYCContext)
  if (!context) {
    throw new Error('useKYC must be used within a KYCProvider')
  }
  return context
}
