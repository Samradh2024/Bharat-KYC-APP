# Bharat KYC - Digital Identity Verification System

A comprehensive digital identity verification platform designed for rural India, featuring both frontend and backend components with modern web technologies.

## 🚀 Features

### Frontend (React + Vite)
- **Modern UI/UX**: Beautiful, responsive design optimized for mobile devices
- **Progressive Web App**: Works offline with service worker support
- **Multi-step KYC Flow**: Intuitive step-by-step verification process
- **Document Upload**: Drag-and-drop file upload with preview
- **Face Verification**: Real-time camera integration for selfie capture
- **DigiLocker Integration**: Government document verification
- **Offline Support**: Works without internet connection
- **Real-time Validation**: Form validation with helpful error messages
- **Loading States**: Smooth loading animations and progress indicators

### Backend (Node.js + Express + MongoDB)
- **RESTful API**: Comprehensive API endpoints for all KYC operations
- **JWT Authentication**: Secure token-based authentication
- **File Upload**: Secure document upload with Cloudinary integration
- **OCR Processing**: Document text extraction and verification
- **Face Verification**: AI-powered face matching and liveness detection
- **Email & SMS**: Automated notifications via Twilio and Nodemailer
- **Admin Dashboard**: Complete admin panel for user management
- **Webhook Support**: Integration with external services
- **Security**: Rate limiting, input validation, and security headers
- **Logging**: Structured logging with Winston

## 🛠 Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **React Query** - Data fetching
- **Framer Motion** - Animations
- **React Hook Form** - Form handling
- **Axios** - HTTP client

### Backend
- **Node.js 18+** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File upload
- **Cloudinary** - Cloud storage
- **Twilio** - SMS service
- **Nodemailer** - Email service
- **Winston** - Logging

## 📁 Project Structure

```
kyc-bharat/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom hooks
│   ├── services/           # API services
│   └── utils/              # Utility functions
├── backend/                # Backend source code
│   ├── config/             # Configuration files
│   ├── middleware/         # Express middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   └── server.js           # Main server file
├── public/                 # Static assets
├── package.json            # Frontend dependencies
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd kyc-bharat
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Environment Setup

#### Frontend (.env)
```bash
cp env.example .env
```
Edit `.env` with your configuration:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

#### Backend (.env)
```bash
cd backend
cp env.example .env
```
Edit `backend/.env` with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kyc-bharat
JWT_SECRET=your-super-secret-jwt-key
# Add other required environment variables
```

### 4. Start Development Servers

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend
```bash
npm run dev
```

### 5. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/health

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP

### KYC Endpoints
- `POST /api/kyc/start` - Start KYC session
- `GET /api/kyc/session` - Get current session
- `PUT /api/kyc/step` - Update session step
- `POST /api/kyc/complete` - Complete KYC

### Document Endpoints
- `POST /api/documents/upload` - Upload document
- `GET /api/documents` - Get user documents
- `POST /api/documents/:id/verify` - Verify document

### Admin Endpoints
- `GET /api/admin/users` - Get all users
- `GET /api/admin/dashboard` - Get dashboard stats
- `PUT /api/admin/users/:id/kyc-status` - Update user status

## 🔧 Configuration

### Frontend Configuration
- API URL configuration in `.env`
- PWA settings in `public/manifest.json`
- Service worker in `public/sw.js`

### Backend Configuration
- Database connection in `backend/config/database.js`
- Environment variables in `backend/.env`
- Logging configuration in `backend/utils/logger.js`

## 🧪 Testing

### Frontend Tests
```bash
npm test
```

### Backend Tests
```bash
cd backend
npm test
```

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build
```
Deploy the `dist` folder to your hosting service.

### Backend Deployment
```bash
cd backend
npm start
```
Use PM2 or similar for production process management.

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Security headers with Helmet
- File upload validation
- SQL injection prevention

## 📱 Mobile Optimization

- Responsive design for all screen sizes
- Touch-friendly interface
- Offline functionality
- Progressive Web App features
- Optimized for slow networks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in the `backend/README.md` file

## 🗺 Roadmap

- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Integration with more government services
- [ ] Mobile app development
- [ ] Blockchain integration for document verification
- [ ] AI-powered fraud detection
- [ ] Real-time collaboration features

---

**Built with ❤️ for Digital India**