# Bharat KYC Backend

A comprehensive backend API for the Bharat KYC Digital Identity Verification System, built with Node.js, Express, and MongoDB.

## Features

- **User Authentication & Authorization**: JWT-based authentication with role-based access control
- **KYC Session Management**: Complete KYC workflow with session tracking
- **Document Upload & Verification**: Secure document upload with OCR and verification
- **Face Verification**: AI-powered face matching and liveness detection
- **DigiLocker Integration**: Government document verification via DigiLocker API
- **Admin Dashboard**: Comprehensive admin panel for user and document management
- **Email & SMS Notifications**: Automated notifications for KYC status updates
- **Webhook Support**: Integration with external services and payment gateways
- **Security**: Rate limiting, input validation, and security headers
- **Logging**: Structured logging with Winston
- **File Storage**: Cloud storage integration with Cloudinary

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcryptjs
- **File Upload**: Multer with Sharp image processing
- **Cloud Storage**: Cloudinary
- **Email**: Nodemailer
- **SMS**: Twilio
- **Logging**: Winston
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate limiting

## Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection configuration
├── middleware/
│   ├── auth.js              # Authentication middleware
│   ├── errorHandler.js      # Error handling middleware
│   └── upload.js            # File upload middleware
├── models/
│   ├── User.js              # User model
│   ├── Document.js          # Document model
│   └── KYCSession.js        # KYC session model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── kyc.js               # KYC management routes
│   ├── documents.js         # Document management routes
│   ├── verification.js      # Verification endpoints
│   ├── admin.js             # Admin panel routes
│   └── webhooks.js          # Webhook handlers
├── utils/
│   ├── logger.js            # Logging configuration
│   ├── cloudinary.js        # Cloud storage utilities
│   ├── ocr.js               # OCR processing utilities
│   ├── sms.js               # SMS utilities
│   └── email.js             # Email utilities
├── uploads/                  # Temporary file storage
├── logs/                    # Application logs
├── server.js                # Main application file
├── package.json             # Dependencies and scripts
└── env.example              # Environment variables template
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Set up MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Update `MONGODB_URI` in your `.env` file

5. **Create required directories**
   ```bash
   mkdir uploads logs
   ```

## Environment Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/kyc-bharat

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=30d

# Cloud Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# SMS Configuration (Twilio)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload Limits
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,application/pdf

# Security
BCRYPT_ROUNDS=12
SESSION_SECRET=your-session-secret
```

## Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Testing
```bash
npm test
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### KYC Management
- `POST /api/kyc/start` - Start KYC session
- `GET /api/kyc/session` - Get current session
- `PUT /api/kyc/step` - Update session step
- `POST /api/kyc/complete` - Complete KYC
- `POST /api/kyc/abandon` - Abandon KYC
- `GET /api/kyc/history` - Get KYC history
- `GET /api/kyc/status` - Get KYC status

### Document Management
- `POST /api/documents/upload` - Upload document
- `GET /api/documents` - Get user documents
- `GET /api/documents/:id` - Get document by ID
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document
- `POST /api/documents/:id/verify` - Verify document

### Verification
- `POST /api/verification/face` - Face verification
- `POST /api/verification/document` - Document verification
- `POST /api/verification/digilocker` - DigiLocker verification
- `POST /api/verification/overall` - Overall KYC verification

### Admin Panel
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get user details
- `PUT /api/admin/users/:id/kyc-status` - Update user KYC status
- `GET /api/admin/documents` - Get all documents
- `POST /api/admin/documents/:id/verify` - Verify document
- `GET /api/admin/dashboard` - Get dashboard statistics

### Webhooks
- `POST /api/webhooks/digilocker` - DigiLocker webhooks
- `POST /api/webhooks/payment` - Payment webhooks
- `POST /api/webhooks/sms` - SMS delivery webhooks
- `POST /api/webhooks/email` - Email delivery webhooks
- `POST /api/webhooks/verification` - Verification webhooks

## Database Models

### User Model
- Basic user information (name, email, phone, etc.)
- KYC status and method
- Authentication details
- Address information

### Document Model
- Document metadata and images
- Verification status and scores
- OCR extracted data
- Processing metadata

### KYC Session Model
- Session tracking and progress
- User data and documents
- Verification results
- Session metadata

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Input Validation**: Express-validator for request validation
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS**: Cross-origin resource sharing configuration
- **Helmet**: Security headers
- **File Upload Security**: File type and size validation

## Error Handling

- Centralized error handling middleware
- Structured error responses
- Detailed logging for debugging
- Graceful error recovery

## Logging

- Structured logging with Winston
- Separate log files for errors and combined logs
- Console logging in development
- Log rotation and management

## File Upload

- Multer for file handling
- Sharp for image optimization
- Cloudinary for cloud storage
- File type and size validation
- Secure file naming

## Testing

The application includes:
- Unit tests for utilities
- Integration tests for API endpoints
- Mock services for external dependencies

## Deployment

### Prerequisites
- Node.js 18+
- MongoDB
- Cloudinary account
- Twilio account (for SMS)
- SMTP server (for emails)

### Production Considerations
- Use environment variables for all sensitive data
- Set up proper logging and monitoring
- Configure SSL/TLS certificates
- Set up database backups
- Configure proper CORS settings
- Set up rate limiting
- Use PM2 or similar for process management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
