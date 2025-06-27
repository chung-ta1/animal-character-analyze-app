import axios from 'axios'
import { AnalysisResult } from '../types'

// For production, VITE_API_URL should be the full backend URL
// For development, we use the proxy path
const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api/v1`
  : '/api/v1'

console.log('API Base URL:', API_BASE_URL)

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // Increase timeout to 60 seconds
})

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url)
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url)
    return response
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - the server might be starting up or processing is taking too long')
      error.message = 'The analysis is taking longer than expected. The server might be starting up (free tier). Please try again in a moment.'
    }
    console.error('API Response Error:', error.message)
    return Promise.reject(error)
  }
)

export const analyzeImage = async (imageData: string): Promise<AnalysisResult> => {
  // Convert base64 to blob
  const base64Data = imageData.split(',')[1]
  const byteCharacters = atob(base64Data)
  const byteNumbers = new Array(byteCharacters.length)
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  
  const byteArray = new Uint8Array(byteNumbers)
  const blob = new Blob([byteArray], { type: 'image/jpeg' })

  // Create form data
  const formData = new FormData()
  formData.append('image', blob, 'capture.jpg')

  const response = await api.post<AnalysisResult>('/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

export const getCharacters = async () => {
  const response = await api.get('/characters')
  return response.data
}