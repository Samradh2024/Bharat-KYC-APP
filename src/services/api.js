import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  sendOTP: (phone) => api.post('/auth/send-otp', { phone }),
  verifyOTP: (phone, otp) => api.post('/auth/verify-otp', { phone, otp }),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
  logout: () => api.post('/auth/logout'),
}

// KYC API
export const kycAPI = {
  startSession: (method) => api.post('/kyc/start', { method }),
  getSession: () => api.get('/kyc/session'),
  updateStep: (step, data) => api.put('/kyc/step', { step, data }),
  completeKYC: () => api.post('/kyc/complete'),
  abandonKYC: () => api.post('/kyc/abandon'),
  getHistory: () => api.get('/kyc/history'),
  getStatus: () => api.get('/kyc/status'),
}

// Document API
export const documentAPI = {
  uploadDocument: (formData) => api.post('/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getDocuments: () => api.get('/documents'),
  getDocument: (id) => api.get(`/documents/${id}`),
  updateDocument: (id, data) => api.put(`/documents/${id}`, data),
  deleteDocument: (id) => api.delete(`/documents/${id}`),
  verifyDocument: (id) => api.post(`/documents/${id}/verify`),
  getDocumentStatus: (id) => api.get(`/documents/${id}/status`),
}

// Verification API
export const verificationAPI = {
  verifyFace: (data) => api.post('/verification/face', data),
  verifyDocument: (data) => api.post('/verification/document', data),
  verifyDigiLocker: (data) => api.post('/verification/digilocker', data),
  verifyOverall: (data) => api.post('/verification/overall', data),
}

// Admin API (if user has admin role)
export const adminAPI = {
  getUsers: (page = 1, limit = 10) => api.get(`/admin/users?page=${page}&limit=${limit}`),
  getUser: (id) => api.get(`/admin/users/${id}`),
  updateUserKYCStatus: (id, status, reason) => api.put(`/admin/users/${id}/kyc-status`, { kycStatus: status, reason }),
  getDocuments: (page = 1, limit = 10) => api.get(`/admin/documents?page=${page}&limit=${limit}`),
  verifyDocument: (id, status, score, reason) => api.post(`/admin/documents/${id}/verify`, { verificationStatus: status, verificationScore: score, rejectionReason: reason }),
  getDashboard: () => api.get('/admin/dashboard'),
  getLogs: () => api.get('/admin/logs'),
}

// Utility functions
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
  }
}

export const getAuthToken = () => {
  return localStorage.getItem('token')
}

export const isAuthenticated = () => {
  const token = getAuthToken()
  return !!token
}

export default api
