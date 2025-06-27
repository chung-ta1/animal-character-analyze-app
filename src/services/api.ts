import axios from 'axios'
import { AnalysisResult } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
})

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