// App initialization utilities
export const initializeApp = async () => {
  try {
    // Check for service worker support
    if ('serviceWorker' in navigator) {
      console.log('Service Worker supported')
    }

    // Check for IndexedDB support
    if ('indexedDB' in window) {
      console.log('IndexedDB supported')
    }

    // Check for WebRTC support (for camera)
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      console.log('WebRTC supported')
    }

    // Initialize offline storage
    await initializeOfflineStorage()

    console.log('App initialized successfully')
  } catch (error) {
    console.error('App initialization failed:', error)
    throw error
  }
}

// Service Worker registration
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('Service Worker registered:', registration)
      return registration
    } catch (error) {
      console.error('Service Worker registration failed:', error)
    }
  }
}

// Offline storage initialization
const initializeOfflineStorage = async () => {
  try {
    // Check localStorage support
    const test = 'test'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    
    // Initialize IndexedDB if supported
    if ('indexedDB' in window) {
      // Create database for offline data
      const request = indexedDB.open('BharatKYC', 1)
      
      request.onerror = () => {
        console.error('IndexedDB error:', request.error)
      }
      
      request.onsuccess = () => {
        console.log('IndexedDB initialized')
      }
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result
        
        // Create object stores
        if (!db.objectStoreNames.contains('documents')) {
          db.createObjectStore('documents', { keyPath: 'id' })
        }
        
        if (!db.objectStoreNames.contains('pendingActions')) {
          db.createObjectStore('pendingActions', { keyPath: 'id', autoIncrement: true })
        }
      }
    }
  } catch (error) {
    console.error('Offline storage initialization failed:', error)
  }
}

// Network utilities
export const checkNetworkStatus = () => {
  return {
    online: navigator.onLine,
    connection: navigator.connection ? {
      effectiveType: navigator.connection.effectiveType,
      downlink: navigator.connection.downlink,
      rtt: navigator.connection.rtt,
    } : null,
  }
}

// File utilities
export const compressImage = async (file, maxWidth = 800, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      const { width, height } = img
      const ratio = Math.min(maxWidth / width, maxWidth / height)
      
      canvas.width = width * ratio
      canvas.height = height * ratio
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      
      canvas.toBlob((blob) => {
        resolve(new File([blob], file.name, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        }))
      }, 'image/jpeg', quality)
    }
    
    img.src = URL.createObjectURL(file)
  })
}

// Validation utilities
export const validateAadhaar = (aadhaar) => {
  const regex = /^[0-9]{12}$/
  return regex.test(aadhaar)
}

export const validatePAN = (pan) => {
  const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
  return regex.test(pan)
}

export const validatePhone = (phone) => {
  const regex = /^[6-9][0-9]{9}$/
  return regex.test(phone)
}

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// Security utilities
export const generateSecureId = () => {
  return 'kyc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

export const encryptData = (data) => {
  // In a real app, use proper encryption
  return btoa(JSON.stringify(data))
}

export const decryptData = (encryptedData) => {
  // In a real app, use proper decryption
  try {
    return JSON.parse(atob(encryptedData))
  } catch {
    return null
  }
}

// Performance utilities
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const throttle = (func, limit) => {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Analytics utilities
export const trackEvent = (eventName, properties = {}) => {
  // In a real app, send to analytics service
  console.log('Analytics Event:', eventName, properties)
}

export const trackError = (error, context = {}) => {
  // In a real app, send to error tracking service
  console.error('Error Tracked:', error, context)
}

// Accessibility utilities
export const announceToScreenReader = (message) => {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', 'polite')
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message
  
  document.body.appendChild(announcement)
  
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

// Device utilities
export const getDeviceInfo = () => {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    deviceMemory: navigator.deviceMemory,
    hardwareConcurrency: navigator.hardwareConcurrency,
    maxTouchPoints: navigator.maxTouchPoints,
  }
}

export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export const isLowEndDevice = () => {
  const deviceMemory = navigator.deviceMemory || 4
  const hardwareConcurrency = navigator.hardwareConcurrency || 4
  return deviceMemory < 2 || hardwareConcurrency < 2
}
