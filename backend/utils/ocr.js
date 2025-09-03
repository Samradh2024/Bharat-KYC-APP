import axios from 'axios'
import { logger } from './logger.js'

// Simulated OCR service - in production, you would use a real OCR service
export const extractDocumentData = async (imageUrl, documentType) => {
  try {
    // Simulate OCR processing time
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Simulate extracted data based on document type
    const mockData = {
      aadhaar: {
        name: 'John Doe',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        address: '123 Main Street, City, State - 123456',
        documentNumber: '123456789012',
        ocrText: 'Aadhaar Card\nName: John Doe\nDOB: 01/01/1990\nGender: Male\nAddress: 123 Main Street, City, State - 123456\nAadhaar No: 123456789012'
      },
      pan: {
        name: 'John Doe',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        address: '123 Main Street, City, State - 123456',
        documentNumber: 'ABCDE1234F',
        ocrText: 'Permanent Account Number\nName: John Doe\nFather\'s Name: Father Doe\nDOB: 01/01/1990\nPAN: ABCDE1234F'
      },
      driving_license: {
        name: 'John Doe',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        address: '123 Main Street, City, State - 123456',
        documentNumber: 'DL1234567890123',
        ocrText: 'Driving License\nName: John Doe\nDOB: 01/01/1990\nAddress: 123 Main Street, City, State - 123456\nLicense No: DL1234567890123'
      },
      voter_id: {
        name: 'John Doe',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        address: '123 Main Street, City, State - 123456',
        documentNumber: 'VOTER123456789',
        ocrText: 'Voter ID Card\nName: John Doe\nDOB: 01/01/1990\nAddress: 123 Main Street, City, State - 123456\nVoter ID: VOTER123456789'
      },
      passport: {
        name: 'John Doe',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        address: '123 Main Street, City, State - 123456',
        documentNumber: 'A12345678',
        ocrText: 'Passport\nName: John Doe\nDOB: 01/01/1990\nPassport No: A12345678'
      },
      selfie: {
        name: null,
        dateOfBirth: null,
        gender: null,
        address: null,
        documentNumber: null,
        ocrText: 'Selfie image - no text extraction needed'
      }
    }

    return mockData[documentType] || mockData.aadhaar
  } catch (error) {
    logger.error('OCR extraction error:', error)
    throw new Error('Failed to extract document data')
  }
}

// Real OCR service integration (example with Google Cloud Vision API)
export const extractDocumentDataWithGoogleVision = async (imageUrl, documentType) => {
  try {
    // This would be the actual implementation with Google Cloud Vision API
    const response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_CLOUD_API_KEY}`,
      {
        requests: [
          {
            image: {
              source: {
                imageUri: imageUrl
              }
            },
            features: [
              {
                type: 'TEXT_DETECTION',
                maxResults: 1
              }
            ]
          }
        ]
      }
    )

    const text = response.data.responses[0]?.textAnnotations[0]?.description || ''
    
    // Parse the extracted text based on document type
    return parseExtractedText(text, documentType)
  } catch (error) {
    logger.error('Google Vision API error:', error)
    throw new Error('Failed to extract document data with Google Vision')
  }
}

const parseExtractedText = (text, documentType) => {
  // This would contain logic to parse different document types
  // For now, return mock data
  return extractDocumentData(null, documentType)
}
