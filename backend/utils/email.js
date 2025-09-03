import nodemailer from 'nodemailer'
import { logger } from './logger.js'

// Configure Nodemailer
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export const sendWelcomeEmail = async (email, name) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Welcome to Bharat KYC - Digital Identity Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Welcome to Bharat KYC!</h2>
          <p>Dear ${name},</p>
          <p>Thank you for registering with Bharat KYC. We're excited to help you with your digital identity verification process.</p>
          <p>Your account has been created successfully. You can now:</p>
          <ul>
            <li>Complete your KYC verification</li>
            <li>Upload your documents securely</li>
            <li>Track your verification status</li>
          </ul>
          <p>If you have any questions, please don't hesitate to contact our support team.</p>
          <p>Best regards,<br>Bharat KYC Team</p>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)
    logger.info(`Welcome email sent to ${email}`)
  } catch (error) {
    logger.error('Email sending error:', error)
    throw new Error('Failed to send welcome email')
  }
}

export const sendKYCSuccessEmail = async (email, name) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'KYC Verification Successful - Bharat KYC',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">KYC Verification Successful!</h2>
          <p>Dear ${name},</p>
          <p>Congratulations! Your KYC verification has been completed successfully.</p>
          <p>Your digital identity is now verified and you can:</p>
          <ul>
            <li>Access all services</li>
            <li>Use your verified identity across platforms</li>
            <li>Enjoy seamless digital experiences</li>
          </ul>
          <p>Thank you for choosing Bharat KYC for your identity verification needs.</p>
          <p>Best regards,<br>Bharat KYC Team</p>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)
    logger.info(`KYC success email sent to ${email}`)
  } catch (error) {
    logger.error('Email sending error:', error)
    throw new Error('Failed to send KYC success email')
  }
}

export const sendKYCRejectionEmail = async (email, name, reason) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'KYC Verification Update - Bharat KYC',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">KYC Verification Update</h2>
          <p>Dear ${name},</p>
          <p>We regret to inform you that your KYC verification could not be completed at this time.</p>
          <p><strong>Reason:</strong> ${reason}</p>
          <p>Please review the information provided and try again. If you need assistance, please contact our support team.</p>
          <p>Best regards,<br>Bharat KYC Team</p>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)
    logger.info(`KYC rejection email sent to ${email}`)
  } catch (error) {
    logger.error('Email sending error:', error)
    throw new Error('Failed to send KYC rejection email')
  }
}
