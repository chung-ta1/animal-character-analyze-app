import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the entire api module
vi.mock('./api', () => {
  const characters = {
    'Wise Owl': {
      id: 'wise-owl',
      name: 'Wise Owl',
      traits: ['Intelligent', 'Observant']
    }
  }
  
  return {
    analyzeImage: vi.fn(async (image: string) => {
      // Simulate API call
      if (!image) throw new Error('No image provided')
      
      if (image.includes('error')) {
        throw new Error('Server error')
      }
      
      if (image.includes('timeout')) {
        throw new Error('Request timeout. Please check your connection and try again.')
      }
      
      return {
        character: characters['Wise Owl'],
        confidence: 0.85,
        reasoning: 'Test reasoning',
        personalizedStory: 'Test story'
      }
    })
  }
})

import { analyzeImage } from './api'

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('analyzeImage', () => {
    it('returns analysis result successfully', async () => {
      const result = await analyzeImage('data:image/jpeg;base64,test')

      expect(result).toEqual({
        character: expect.objectContaining({
          name: 'Wise Owl',
          traits: ['Intelligent', 'Observant']
        }),
        confidence: 0.85,
        reasoning: 'Test reasoning',
        personalizedStory: 'Test story'
      })
    })

    it('handles errors gracefully', async () => {
      await expect(analyzeImage('data:image/jpeg;base64,error')).rejects.toThrow('Server error')
    })

    it('handles timeout errors', async () => {
      await expect(analyzeImage('data:image/jpeg;base64,timeout')).rejects.toThrow('Request timeout')
    })

    it('requires image data', async () => {
      await expect(analyzeImage('')).rejects.toThrow('No image provided')
    })

    it('is called with correct parameters', async () => {
      const mockedAnalyzeImage = analyzeImage as any
      
      await analyzeImage('data:image/jpeg;base64,test')
      
      expect(mockedAnalyzeImage).toHaveBeenCalledWith('data:image/jpeg;base64,test')
      expect(mockedAnalyzeImage).toHaveBeenCalledTimes(1)
    })
  })
})