import { useState, useEffect } from 'react'

export const useOfflineStorage = () => {
  const [storageAvailable, setStorageAvailable] = useState(false)
  const [storageQuota, setStorageQuota] = useState(null)

  useEffect(() => {
    // Check if localStorage is available
    const checkLocalStorage = () => {
      try {
        const test = 'test'
        localStorage.setItem(test, test)
        localStorage.removeItem(test)
        setStorageAvailable(true)
      } catch (e) {
        setStorageAvailable(false)
      }
    }

    // Check if IndexedDB is available
    const checkIndexedDB = () => {
      if ('indexedDB' in window) {
        setStorageAvailable(true)
      }
    }

    // Check storage quota (if supported)
    const checkStorageQuota = async () => {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        try {
          const estimate = await navigator.storage.estimate()
          setStorageQuota(estimate)
        } catch (error) {
          console.warn('Could not get storage estimate:', error)
        }
      }
    }

    checkLocalStorage()
    checkIndexedDB()
    checkStorageQuota()
  }, [])

  const saveToStorage = (key, data) => {
    if (!storageAvailable) {
      console.warn('Storage not available')
      return false
    }

    try {
      const serializedData = JSON.stringify(data)
      localStorage.setItem(key, serializedData)
      return true
    } catch (error) {
      console.error('Failed to save to storage:', error)
      return false
    }
  }

  const loadFromStorage = (key, defaultValue = null) => {
    if (!storageAvailable) {
      return defaultValue
    }

    try {
      const serializedData = localStorage.getItem(key)
      if (serializedData === null) {
        return defaultValue
      }
      return JSON.parse(serializedData)
    } catch (error) {
      console.error('Failed to load from storage:', error)
      return defaultValue
    }
  }

  const clearStorage = (key) => {
    if (!storageAvailable) {
      return false
    }

    try {
      if (key) {
        localStorage.removeItem(key)
      } else {
        localStorage.clear()
      }
      return true
    } catch (error) {
      console.error('Failed to clear storage:', error)
      return false
    }
  }

  const getStorageUsage = () => {
    if (!storageAvailable) {
      return { used: 0, total: 0, percentage: 0 }
    }

    try {
      let used = 0
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length + key.length
        }
      }

      // Estimate total storage (varies by browser)
      const total = 5 * 1024 * 1024 // 5MB estimate
      const percentage = (used / total) * 100

      return { used, total, percentage }
    } catch (error) {
      console.error('Failed to calculate storage usage:', error)
      return { used: 0, total: 0, percentage: 0 }
    }
  }

  return {
    storageAvailable,
    storageQuota,
    saveToStorage,
    loadFromStorage,
    clearStorage,
    getStorageUsage,
  }
}
