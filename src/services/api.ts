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
  timeout: 300000, // Increase timeout to 5 minutes for Claude API
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
      console.error('Request timeout - Claude API processing is taking longer than expected')
      error.message = 'The AI analysis is taking longer than expected (Claude API can take 2-3 minutes). The request timed out after 5 minutes. Please try again with a smaller image or simpler photo.'
    }
    console.error('API Response Error:', error.message)
    return Promise.reject(error)
  }
)

// Helper function to compress and resize image
const compressImage = async (dataUrl: string, maxWidth: number = 800, quality: number = 0.8): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let width = img.width
      let height = img.height
      
      // Calculate new dimensions while maintaining aspect ratio
      if (width > maxWidth) {
        height = (maxWidth / width) * height
        width = maxWidth
      }
      
      canvas.width = width
      canvas.height = height
      
      const ctx = canvas.getContext('2d')
      if (ctx) {
        // Use better image smoothing
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, width, height)
      }
      
      // Convert to JPEG with quality setting
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
      console.log(`Image compressed from ${img.width}x${img.height} to ${width}x${height}`)
      console.log(`Size reduction: ${Math.round((1 - compressedDataUrl.length / dataUrl.length) * 100)}%`)
      resolve(compressedDataUrl)
    }
    img.src = dataUrl
  })
}

export const analyzeImage = async (imageData: string): Promise<AnalysisResult> => {
  // Compress image before sending
  console.log('Original image size:', Math.round(imageData.length / 1024), 'KB')
  const compressedImage = await compressImage(imageData, 800, 0.85)
  console.log('Compressed image size:', Math.round(compressedImage.length / 1024), 'KB')
  
  // Convert base64 to blob
  const base64Data = compressedImage.split(',')[1]
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