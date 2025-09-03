import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNetwork } from './NetworkContext'
import toast from 'react-hot-toast'

const OfflineContext = createContext()

export function OfflineProvider({ children }) {
  const { isOnline } = useNetwork()
  const [pendingActions, setPendingActions] = useState([])
  const [syncing, setSyncing] = useState(false)

  // Load pending actions from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pending-actions')
      if (saved) {
        setPendingActions(JSON.parse(saved))
      }
    } catch (error) {
      console.error('Error loading pending actions:', error)
    }
  }, [])

  // Save pending actions to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('pending-actions', JSON.stringify(pendingActions))
    } catch (error) {
      console.error('Error saving pending actions:', error)
    }
  }, [pendingActions])

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && pendingActions.length > 0) {
      syncPendingActions()
    }
  }, [isOnline, pendingActions.length])

  const addPendingAction = (action) => {
    const newAction = {
      id: Date.now() + Math.random(),
      ...action,
      timestamp: Date.now(),
      retryCount: 0,
    }
    
    setPendingActions(prev => [...prev, newAction])
    
    if (!isOnline) {
      toast.success('Action saved for when you\'re back online')
    }
  }

  const removePendingAction = (actionId) => {
    setPendingActions(prev => prev.filter(action => action.id !== actionId))
  }

  const updatePendingAction = (actionId, updates) => {
    setPendingActions(prev => 
      prev.map(action => 
        action.id === actionId ? { ...action, ...updates } : action
      )
    )
  }

  const syncPendingActions = async () => {
    if (syncing || pendingActions.length === 0) return

    setSyncing(true)
    
    try {
      const actionsToSync = [...pendingActions]
      let successCount = 0
      let failureCount = 0

      for (const action of actionsToSync) {
        try {
          // Simulate API call
          await new Promise((resolve, reject) => {
            setTimeout(() => {
              // Simulate 90% success rate
              if (Math.random() > 0.1) {
                resolve()
              } else {
                reject(new Error('Simulated API failure'))
              }
            }, 1000)
          })

          removePendingAction(action.id)
          successCount++
        } catch (error) {
          console.error('Failed to sync action:', action, error)
          
          // Increment retry count
          updatePendingAction(action.id, { 
            retryCount: action.retryCount + 1 
          })
          
          failureCount++
          
          // Remove action if it has been retried too many times
          if (action.retryCount >= 3) {
            removePendingAction(action.id)
            toast.error(`Failed to sync action after 3 retries`)
          }
        }
      }

      if (successCount > 0) {
        toast.success(`Synced ${successCount} actions successfully`)
      }
      
      if (failureCount > 0) {
        toast.error(`${failureCount} actions failed to sync`)
      }
    } catch (error) {
      console.error('Error during sync:', error)
      toast.error('Failed to sync pending actions')
    } finally {
      setSyncing(false)
    }
  }

  const clearAllPendingActions = () => {
    setPendingActions([])
    localStorage.removeItem('pending-actions')
    toast.success('All pending actions cleared')
  }

  const getPendingActionsCount = () => pendingActions.length

  const getPendingActionsByType = (type) => {
    return pendingActions.filter(action => action.type === type)
  }

  const value = {
    pendingActions,
    syncing,
    addPendingAction,
    removePendingAction,
    updatePendingAction,
    syncPendingActions,
    clearAllPendingActions,
    getPendingActionsCount,
    getPendingActionsByType,
  }

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  )
}

export function useOffline() {
  const context = useContext(OfflineContext)
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider')
  }
  return context
}
