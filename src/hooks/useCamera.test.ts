import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useCamera from './useCamera'

// Mock getUserMedia
const mockGetUserMedia = vi.fn()
const mockStream = {
  getTracks: vi.fn().mockReturnValue([
    { stop: vi.fn() },
    { stop: vi.fn() }
  ])
}

Object.defineProperty(navigator, 'mediaDevices', {
  value: {
    getUserMedia: mockGetUserMedia
  },
  writable: true
})

describe('useCamera', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetUserMedia.mockResolvedValue(mockStream)
  })

  it('initializes with default values', () => {
    const { result } = renderHook(() => useCamera())
    
    expect(result.current.isStreaming).toBe(false)
    expect(result.current.error).toBe(null)
    expect(result.current.videoRef.current).toBe(null)
    expect(result.current.canvasRef.current).toBe(null)
  })

  it('starts camera successfully', async () => {
    const { result } = renderHook(() => useCamera())
    
    // Create a mock video element and assign it to the ref
    const mockVideoElement = document.createElement('video')
    Object.defineProperty(result.current.videoRef, 'current', {
      value: mockVideoElement,
      writable: true
    })
    
    await act(async () => {
      await result.current.startCamera()
    })

    expect(mockGetUserMedia).toHaveBeenCalledWith({
      video: { 
        facingMode: 'user',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    })
    expect(result.current.isStreaming).toBe(true)
    expect(result.current.error).toBe(null)
    expect(mockVideoElement.srcObject).toBe(mockStream)
  })

  it('handles camera permission denied', async () => {
    mockGetUserMedia.mockRejectedValue(new Error('Permission denied'))
    
    const { result } = renderHook(() => useCamera())
    
    await act(async () => {
      await result.current.startCamera()
    })

    expect(result.current.isStreaming).toBe(false)
    expect(result.current.error).toBe('Failed to access camera. Please ensure camera permissions are granted.')
  })

  it('handles camera not found', async () => {
    mockGetUserMedia.mockRejectedValue({ name: 'NotFoundError' })
    
    const { result } = renderHook(() => useCamera())
    
    await act(async () => {
      await result.current.startCamera()
    })

    expect(result.current.isStreaming).toBe(false)
    expect(result.current.error).toBe('Failed to access camera. Please ensure camera permissions are granted.')
  })

  it('stops camera and cleans up stream', async () => {
    const { result } = renderHook(() => useCamera())
    
    // Create a mock video element and assign it to the ref
    const mockVideoElement = document.createElement('video')
    Object.defineProperty(result.current.videoRef, 'current', {
      value: mockVideoElement,
      writable: true
    })
    
    // Start camera first
    await act(async () => {
      await result.current.startCamera()
    })

    // Then stop it
    act(() => {
      result.current.stopCamera()
    })

    expect(result.current.isStreaming).toBe(false)
    mockStream.getTracks().forEach(track => {
      expect(track.stop).toHaveBeenCalled()
    })
  })

  it('captures image from video stream', async () => {
    const { result } = renderHook(() => useCamera())
    
    // Mock video and canvas elements
    const mockVideo = {
      videoWidth: 640,
      videoHeight: 480
    }
    const mockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn().mockReturnValue({
        drawImage: vi.fn()
      }),
      toDataURL: vi.fn().mockReturnValue('data:image/jpeg;base64,test')
    }
    
    Object.defineProperty(result.current.videoRef, 'current', {
      value: mockVideo,
      writable: true
    })
    Object.defineProperty(result.current.canvasRef, 'current', {
      value: mockCanvas,
      writable: true
    })

    await act(async () => {
      await result.current.startCamera()
    })

    let capturedImage
    act(() => {
      capturedImage = result.current.captureImage()
    })

    expect(mockCanvas.width).toBe(640)
    expect(mockCanvas.height).toBe(480)
    expect(mockCanvas.getContext).toHaveBeenCalledWith('2d')
    expect(capturedImage).toBe('data:image/jpeg;base64,test')
  })

  it('returns null when capturing without video stream', () => {
    const { result } = renderHook(() => useCamera())
    
    const capturedImage = result.current.captureImage()
    
    expect(capturedImage).toBe(null)
  })

  it('cleans up on unmount', async () => {
    const { result, unmount } = renderHook(() => useCamera())
    
    // Create a mock video element and assign it to the ref
    const mockVideoElement = document.createElement('video')
    Object.defineProperty(result.current.videoRef, 'current', {
      value: mockVideoElement,
      writable: true
    })
    
    await act(async () => {
      await result.current.startCamera()
    })

    unmount()

    mockStream.getTracks().forEach(track => {
      expect(track.stop).toHaveBeenCalled()
    })
  })
})