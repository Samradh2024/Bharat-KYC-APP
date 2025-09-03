import express from 'express'
import { body } from 'express-validator'
import asyncHandler from 'express-async-handler'
import { protect, generateToken } from '../middleware/auth.js'
import { validateRequest } from '../middleware/errorHandler.js'
import User from '../models/User.js'
import { sendOTP, verifyOTP } from '../utils/sms.js'
import { sendWelcomeEmail } from '../utils/email.js'
import { logger } from '../utils/logger.js'

const router = express.Router()

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('phone')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please enter a valid Indian phone number'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('dateOfBirth')
    .isISO8601()
    .withMessage('Please enter a valid date of birth'),
  body('gender')
    .isIn(['male', 'female', 'other'])
    .withMessage('Please select a valid gender'),
  body('address.street')
    .trim()
    .isLength({ min: 5 })
    .withMessage('Street address is required'),
  body('address.city')
    .trim()
    .isLength({ min: 2 })
    .withMessage('City is required'),
  body('address.state')
    .trim()
    .isLength({ min: 2 })
    .withMessage('State is required'),
  body('address.pincode')
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage('Please enter a valid pincode')
], validateRequest, asyncHandler(async (req, res) => {
  const {
    name,
    phone,
    email,
    password,
    dateOfBirth,
    gender,
    address
  } = req.body

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { phone }]
  })

  if (existingUser) {
    res.status(400)
    throw new Error('User already exists with this email or phone number')
  }

  // Create user
  const user = await User.create({
    name,
    phone,
    email,
    password,
    dateOfBirth,
    gender,
    address
  })

  if (user) {
    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.name)
    } catch (error) {
      logger.error('Failed to send welcome email:', error)
    }

    // Send OTP for phone verification
    try {
      await sendOTP(user.phone)
    } catch (error) {
      logger.error('Failed to send OTP:', error)
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.getPublicProfile(),
        token: generateToken(user._id)
      }
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
}))

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', [
  body('phone')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please enter a valid Indian phone number'),
  body('password')
    .exists()
    .withMessage('Password is required')
], validateRequest, asyncHandler(async (req, res) => {
  const { phone, password } = req.body

  // Find user by phone
  const user = await User.findOne({ phone }).select('+password')

  if (!user) {
    res.status(401)
    throw new Error('Invalid phone number or password')
  }

  // Check password
  const isMatch = await user.comparePassword(password)

  if (!isMatch) {
    res.status(401)
    throw new Error('Invalid phone number or password')
  }

  // Update last login
  await user.updateLastLogin()

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: user.getPublicProfile(),
      token: generateToken(user._id)
    }
  })
}))

// @desc    Send OTP
// @route   POST /api/auth/send-otp
// @access  Public
router.post('/send-otp', [
  body('phone')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please enter a valid Indian phone number')
], validateRequest, asyncHandler(async (req, res) => {
  const { phone } = req.body

  // Check if user exists
  const user = await User.findOne({ phone })

  if (!user) {
    res.status(404)
    throw new Error('User not found with this phone number')
  }

  // Send OTP
  await sendOTP(phone)

  res.json({
    success: true,
    message: 'OTP sent successfully'
  })
}))

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
router.post('/verify-otp', [
  body('phone')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please enter a valid Indian phone number'),
  body('otp')
    .isLength({ min: 4, max: 6 })
    .withMessage('Please enter a valid OTP')
], validateRequest, asyncHandler(async (req, res) => {
  const { phone, otp } = req.body

  // Verify OTP
  const isValid = await verifyOTP(phone, otp)

  if (!isValid) {
    res.status(400)
    throw new Error('Invalid OTP')
  }

  // Update user phone verification status
  await User.findOneAndUpdate(
    { phone },
    { isPhoneVerified: true },
    { new: true }
  )

  res.json({
    success: true,
    message: 'Phone number verified successfully'
  })
}))

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user.getPublicProfile()
    }
  })
}))

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Please enter a valid date of birth'),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Please select a valid gender')
], validateRequest, asyncHandler(async (req, res) => {
  const { name, email, dateOfBirth, gender } = req.body

  // Check if email is being updated and if it's already taken
  if (email && email !== req.user.email) {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      res.status(400)
      throw new Error('Email already exists')
    }
  }

  // Update user
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: name || req.user.name,
      email: email || req.user.email,
      dateOfBirth: dateOfBirth || req.user.dateOfBirth,
      gender: gender || req.user.gender
    },
    { new: true }
  )

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: updatedUser.getPublicProfile()
    }
  })
}))

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
router.put('/change-password', protect, [
  body('currentPassword')
    .exists()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters')
], validateRequest, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body

  // Get user with password
  const user = await User.findById(req.user._id).select('+password')

  // Check current password
  const isMatch = await user.comparePassword(currentPassword)

  if (!isMatch) {
    res.status(400)
    throw new Error('Current password is incorrect')
  }

  // Update password
  user.password = newPassword
  await user.save()

  res.json({
    success: true,
    message: 'Password changed successfully'
  })
}))

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', protect, asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  })
}))

export default router
