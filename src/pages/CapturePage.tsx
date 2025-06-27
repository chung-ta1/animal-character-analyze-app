import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useCamera from '../hooks/useCamera'
import CameraView from '../components/camera/CameraView'
import { analyzeImage } from '../services/api'

export default function CapturePage() {
  const navigate = useNavigate()
  const { videoRef, canvasRef, isStreaming, error, startCamera, stopCamera, captureImage } = useCamera()
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)

  const handleStartCamera = async () => {
    setCapturedImage(null)
    setAnalysisError(null)
    await startCamera()
  }

  const handleCapture = () => {
    const imageData = captureImage()
    if (imageData) {
      setCapturedImage(imageData)
      stopCamera()
    }
  }

  const handleRetake = () => {
    setCapturedImage(null)
    setAnalysisError(null)
    startCamera()
  }

  const handleAnalyze = async () => {
    if (!capturedImage) return

    setIsAnalyzing(true)
    setAnalysisError(null)

    try {
      const result = await analyzeImage(capturedImage)
      // Store result in sessionStorage for the results page
      sessionStorage.setItem('analysisResult', JSON.stringify(result))
      navigate('/results')
    } catch (err) {
      setAnalysisError('Failed to analyze image. Please try again.')
      console.error('Analysis error:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Take Your Photo
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {analysisError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {analysisError}
          </div>
        )}

        <div className="relative">
          {!capturedImage ? (
            <>
              <CameraView ref={videoRef} isStreaming={isStreaming} />
              <canvas ref={canvasRef} className="hidden" />
            </>
          ) : (
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="w-full rounded-lg shadow-lg"
            />
          )}
        </div>

        <div className="mt-8 flex justify-center gap-4">
          {!isStreaming && !capturedImage && (
            <button
              onClick={handleStartCamera}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg"
            >
              Enable Camera
            </button>
          )}

          {isStreaming && !capturedImage && (
            <button
              onClick={handleCapture}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg"
            >
              Capture Photo
            </button>
          )}

          {capturedImage && (
            <>
              <button
                onClick={handleRetake}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-full shadow-lg"
              >
                Retake
              </button>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
              </button>
            </>
          )}

          <button
            onClick={() => navigate('/')}
            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-full shadow-lg"
          >
            Cancel
          </button>
        </div>

        {isAnalyzing && (
          <div className="mt-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">AI is analyzing your photo...</p>
          </div>
        )}
      </div>
    </div>
  )
}