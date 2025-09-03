import express from 'express'
import asyncHandler from 'express-async-handler'
import { logger } from '../utils/logger.js'

const router = express.Router()

// @desc    DigiLocker webhook
// @route   POST /api/webhooks/digilocker
// @access  Public
router.post('/digilocker', asyncHandler(async (req, res) => {
  try {
    const { event, data } = req.body

    logger.info('DigiLocker webhook received:', { event, data })

    // Handle different webhook events
    switch (event) {
      case 'document_verified':
        // Handle document verification success
        logger.info('Document verified via DigiLocker:', data)
        break
      
      case 'document_rejected':
        // Handle document verification failure
        logger.warn('Document rejected via DigiLocker:', data)
        break
      
      case 'user_consent_granted':
        // Handle user consent
        logger.info('User consent granted via DigiLocker:', data)
        break
      
      case 'user_consent_revoked':
        // Handle user consent revocation
        logger.warn('User consent revoked via DigiLocker:', data)
        break
      
      default:
        logger.info('Unknown DigiLocker webhook event:', event)
    }

    res.status(200).json({ success: true })
  } catch (error) {
    logger.error('DigiLocker webhook error:', error)
    res.status(500).json({ success: false, error: 'Webhook processing failed' })
  }
}))

// @desc    Payment webhook
// @route   POST /api/webhooks/payment
// @access  Public
router.post('/payment', asyncHandler(async (req, res) => {
  try {
    const { event, data } = req.body

    logger.info('Payment webhook received:', { event, data })

    // Handle different payment events
    switch (event) {
      case 'payment_success':
        // Handle successful payment
        logger.info('Payment successful:', data)
        break
      
      case 'payment_failed':
        // Handle failed payment
        logger.warn('Payment failed:', data)
        break
      
      case 'refund_processed':
        // Handle refund
        logger.info('Refund processed:', data)
        break
      
      default:
        logger.info('Unknown payment webhook event:', event)
    }

    res.status(200).json({ success: true })
  } catch (error) {
    logger.error('Payment webhook error:', error)
    res.status(500).json({ success: false, error: 'Webhook processing failed' })
  }
}))

// @desc    SMS delivery webhook
// @route   POST /api/webhooks/sms
// @access  Public
router.post('/sms', asyncHandler(async (req, res) => {
  try {
    const { event, data } = req.body

    logger.info('SMS webhook received:', { event, data })

    // Handle SMS delivery status
    switch (event) {
      case 'delivered':
        logger.info('SMS delivered successfully:', data)
        break
      
      case 'failed':
        logger.warn('SMS delivery failed:', data)
        break
      
      case 'undelivered':
        logger.warn('SMS undelivered:', data)
        break
      
      default:
        logger.info('Unknown SMS webhook event:', event)
    }

    res.status(200).json({ success: true })
  } catch (error) {
    logger.error('SMS webhook error:', error)
    res.status(500).json({ success: false, error: 'Webhook processing failed' })
  }
}))

// @desc    Email delivery webhook
// @route   POST /api/webhooks/email
// @access  Public
router.post('/email', asyncHandler(async (req, res) => {
  try {
    const { event, data } = req.body

    logger.info('Email webhook received:', { event, data })

    // Handle email delivery status
    switch (event) {
      case 'delivered':
        logger.info('Email delivered successfully:', data)
        break
      
      case 'bounced':
        logger.warn('Email bounced:', data)
        break
      
      case 'opened':
        logger.info('Email opened:', data)
        break
      
      case 'clicked':
        logger.info('Email link clicked:', data)
        break
      
      default:
        logger.info('Unknown email webhook event:', event)
    }

    res.status(200).json({ success: true })
  } catch (error) {
    logger.error('Email webhook error:', error)
    res.status(500).json({ success: false, error: 'Webhook processing failed' })
  }
}))

// @desc    Third-party verification webhook
// @route   POST /api/webhooks/verification
// @access  Public
router.post('/verification', asyncHandler(async (req, res) => {
  try {
    const { event, data } = req.body

    logger.info('Verification webhook received:', { event, data })

    // Handle verification results from third-party services
    switch (event) {
      case 'face_verification_complete':
        logger.info('Face verification completed:', data)
        break
      
      case 'document_verification_complete':
        logger.info('Document verification completed:', data)
        break
      
      case 'liveness_check_complete':
        logger.info('Liveness check completed:', data)
        break
      
      case 'verification_failed':
        logger.warn('Verification failed:', data)
        break
      
      default:
        logger.info('Unknown verification webhook event:', event)
    }

    res.status(200).json({ success: true })
  } catch (error) {
    logger.error('Verification webhook error:', error)
    res.status(500).json({ success: false, error: 'Webhook processing failed' })
  }
}))

export default router
