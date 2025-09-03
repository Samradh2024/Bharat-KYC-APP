// Service Worker Registration Utility
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      })
      
      console.log('Service Worker registered successfully:', registration)
      
      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker available
            if (confirm('A new version is available. Reload to update?')) {
              window.location.reload()
            }
          }
        })
      })
      
      return registration
    } catch (error) {
      console.error('Service Worker registration failed:', error)
      throw error
    }
  } else {
    console.log('Service Worker not supported')
    return null
  }
}

// Unregister service worker (for development)
export const unregisterServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations()
    for (const registration of registrations) {
      await registration.unregister()
    }
    console.log('Service Workers unregistered')
  }
}
