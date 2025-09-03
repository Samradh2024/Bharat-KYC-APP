import cloudinary from 'cloudinary'
import sharp from 'sharp'
import { logger } from './logger.js'

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const uploadToCloudinary = async (filePath, folder = 'kyc-documents') => {
  try {
    // Optimize image before upload
    const optimizedBuffer = await sharp(filePath)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer()

    const result = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
          transformation: [
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(optimizedBuffer)
    })

    return result
  } catch (error) {
    logger.error('Cloudinary upload error:', error)
    throw new Error('Failed to upload to cloud storage')
  }
}

export const processDocument = async (imageUrl, documentType) => {
  try {
    // Simulate document processing
    const processingTime = Math.random() * 2000 + 1000 // 1-3 seconds
    const confidence = Math.random() * 0.3 + 0.7 // 0.7-1.0

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, processingTime))

    return {
      confidence,
      processingTime,
      documentType,
      processed: true
    }
  } catch (error) {
    logger.error('Document processing error:', error)
    throw new Error('Failed to process document')
  }
}

export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.v2.uploader.destroy(publicId)
    return result
  } catch (error) {
    logger.error('Cloudinary delete error:', error)
    throw new Error('Failed to delete from cloud storage')
  }
}

export const generateThumbnail = async (imageUrl, width = 300, height = 300) => {
  try {
    const result = await cloudinary.v2.url(imageUrl, {
      transformation: [
        { width, height, crop: 'fill' },
        { quality: 'auto:low' }
      ]
    })
    return result
  } catch (error) {
    logger.error('Thumbnail generation error:', error)
    throw new Error('Failed to generate thumbnail')
  }
}
