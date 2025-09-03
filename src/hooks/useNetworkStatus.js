import { useState, useEffect } from 'react'
import { useNetwork } from '../contexts/NetworkContext'

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [connectionType, setConnectionType] = useState('unknown')
  const [connectionSpeed, setConnectionSpeed] = useState('unknown')

  useEffect(() => {
    const updateNetworkInfo = () => {
      setIsOnline(navigator.onLine)
      
      if ('connection' in navigator) {
        const connection = navigator.connection
        setConnectionType(connection.effectiveType || 'unknown')
        setConnectionSpeed(connection.downlink || 'unknown')
      }
    }

    updateNetworkInfo()

    window.addEventListener('online', updateNetworkInfo)
    window.addEventListener('offline', updateNetworkInfo)
    
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', updateNetworkInfo)
    }

    return () => {
      window.removeEventListener('online', updateNetworkInfo)
      window.removeEventListener('offline', updateNetworkInfo)
      
      if ('connection' in navigator) {
        navigator.connection.removeEventListener('change', updateNetworkInfo)
      }
    }
  }, [])

  return {
    isOnline,
    connectionType,
    connectionSpeed,
    isSlowConnection: connectionType === '2g' || connectionType === 'slow-2g',
  }
}

export const useOfflineStorage = () => {
  const [storageAvailable, setStorageAvailable] = useState(false)
  const [storageQuota, setStorageQuota] = useState(null)

  useEffect(() => {
    const checkStorage = async () => {
      try {
        // Check localStorage
        const test = 'test'
        localStorage.setItem(test, test)
        localStorage.removeItem(test)
        
        // Check IndexedDB
        if ('indexedDB' in window) {
          const request = indexedDB.open('test', 1)
          request.onerror = () => setStorageAvailable(false)
          request.onsuccess = () => {
            request.result.close()
            indexedDB.deleteDatabase('test')
            setStorageAvailable(true)
          }
        }

        // Check storage quota if available
        if ('storage' in navigator && 'estimate' in navigator.storage) {
          const estimate = await navigator.storage.estimate()
          setStorageQuota(estimate)
        }
      } catch (error) {
        console.error('Storage check failed:', error)
        setStorageAvailable(false)
      }
    }

    checkStorage()
  }, [])

  const saveToStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data))
      return true
    } catch (error) {
      console.error('Failed to save to storage:', error)
      return false
    }
  }

  const loadFromStorage = (key) => {
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Failed to load from storage:', error)
      return null
    }
  }

  const clearStorage = (key) => {
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

  return {
    storageAvailable,
    storageQuota,
    saveToStorage,
    loadFromStorage,
    clearStorage,
  }
}

export const useIdleTimer = (idleTime = 300000) => { // 5 minutes default
  const [isIdle, setIsIdle] = useState(false)
  const [lastActivity, setLastActivity] = useState(Date.now())

  useEffect(() => {
    let idleTimer

    const resetTimer = () => {
      setLastActivity(Date.now())
      setIsIdle(false)
      
      if (idleTimer) {
        clearTimeout(idleTimer)
      }
      
      idleTimer = setTimeout(() => {
        setIsIdle(true)
      }, idleTime)
    }

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']

    events.forEach(event => {
      document.addEventListener(event, resetTimer, true)
    })

    resetTimer()

    return () => {
      if (idleTimer) {
        clearTimeout(idleTimer)
      }
      
      events.forEach(event => {
        document.removeEventListener(event, resetTimer, true)
      })
    }
  }, [idleTime])

  return {
    isIdle,
    lastActivity,
    resetTimer: () => setLastActivity(Date.now()),
  }
}

export const useIntersectionObserver = (ref, options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [entry, setEntry] = useState(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
      setEntry(entry)
    }, options)

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [ref, options])

  return { isIntersecting, entry }
}

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error('Error writing to localStorage:', error)
    }
  }

  return [storedValue, setValue]
}

export const useSessionStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.sessionStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error('Error reading from sessionStorage:', error)
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error('Error writing to sessionStorage:', error)
    }
  }

  return [storedValue, setValue]
}

export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches
    }
    return false
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(query)
    const updateMatches = (e) => setMatches(e.matches)

    mediaQuery.addListener(updateMatches)
    setMatches(mediaQuery.matches)

    return () => mediaQuery.removeListener(updateMatches)
  }, [query])

  return matches
}

export const useDeviceOrientation = () => {
  const [orientation, setOrientation] = useState('portrait')

  useEffect(() => {
    const updateOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape')
    }

    updateOrientation()
    window.addEventListener('resize', updateOrientation)
    window.addEventListener('orientationchange', updateOrientation)

    return () => {
      window.removeEventListener('resize', updateOrientation)
      window.removeEventListener('orientationchange', updateOrientation)
    }
  }, [])

  return orientation
}

export const useBatteryStatus = () => {
  const [batteryStatus, setBatteryStatus] = useState({
    level: 1,
    charging: true,
    chargingTime: 0,
    dischargingTime: 0,
  })

  useEffect(() => {
    if ('getBattery' in navigator) {
      navigator.getBattery().then((battery) => {
        const updateBatteryInfo = () => {
          setBatteryStatus({
            level: battery.level,
            charging: battery.charging,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime,
          })
        }

        updateBatteryInfo()
        battery.addEventListener('levelchange', updateBatteryInfo)
        battery.addEventListener('chargingchange', updateBatteryInfo)
        battery.addEventListener('chargingtimechange', updateBatteryInfo)
        battery.addEventListener('dischargingtimechange', updateBatteryInfo)

        return () => {
          battery.removeEventListener('levelchange', updateBatteryInfo)
          battery.removeEventListener('chargingchange', updateBatteryInfo)
          battery.removeEventListener('chargingtimechange', updateBatteryInfo)
          battery.removeEventListener('dischargingtimechange', updateBatteryInfo)
        }
      })
    }
  }, [])

  return batteryStatus
}
