import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCamera, FaRedo, FaHome } from 'react-icons/fa'
import useCamera from '../hooks/useCamera'
import CameraView from '../components/camera/CameraView'
import CharacterResult from '../components/character/CharacterResult'
import { analyzeImage } from '../services/api'
import { AnalysisResult } from '../types'

export default function CapturePage() {
  const navigate = useNavigate()
  const { videoRef, canvasRef, isStreaming, error, startCamera, stopCamera, captureImage } = useCamera()
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  
  // Debug: Log API URL
  console.log('API URL:', import.meta.env.VITE_API_URL || 'Not set')

  const handleStartCamera = async () => {
    setCapturedImage(null)
    setAnalysisError(null)
    setAnalysisResult(null)
    await startCamera()
  }

  const handleCapture = () => {
    const imageData = captureImage()
    if (imageData) {
      setCapturedImage(imageData)
      stopCamera()
      // Automatically start analysis after capture
      handleAnalyze(imageData)
    }
  }

  const handleRetake = () => {
    setCapturedImage(null)
    setAnalysisError(null)
    setAnalysisResult(null)
    startCamera()
  }

  const handleAnalyze = async (imageData?: string) => {
    const image = imageData || capturedImage
    if (!image) return

    setIsAnalyzing(true)
    setAnalysisError(null)
    setAnalysisProgress(0)

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) return prev
        return prev + Math.random() * 20
      })
    }, 500)

    try {
      const result = await analyzeImage(image)
      setAnalysisProgress(100)
      setAnalysisResult(result)
    } catch (err) {
      setAnalysisError('Failed to analyze image. Please try again.')
      console.error('Analysis error:', err)
    } finally {
      clearInterval(progressInterval)
      setIsAnalyzing(false)
      setAnalysisProgress(0)
    }
  }

  const handleShare = () => {
    if (!analysisResult) return
    
    const shareText = `I'm a ${analysisResult.character.name}! ${analysisResult.character.traits.join(', ')}. Discover your spirit animal!`
    
    if (navigator.share) {
      navigator.share({
        title: 'My Spirit Animal',
        text: shareText,
      })
    } else {
      navigator.clipboard.writeText(shareText)
      alert('Share text copied to clipboard!')
    }
  }

  const handleReset = () => {
    setCapturedImage(null)
    setAnalysisResult(null)
    setAnalysisError(null)
    handleStartCamera()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Discover Your Spirit Animal
          </h1>
          <p className="text-gray-600 text-lg">
            Take a photo and let AI reveal your inner character
          </p>
        </motion.div>

        {/* Camera/Image Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl p-6 mb-8"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-4"
            >
              {error}
            </motion.div>
          )}

          {analysisError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-4"
            >
              {analysisError}
            </motion.div>
          )}

          <div className="relative rounded-2xl overflow-hidden bg-gray-100">
            <AnimatePresence mode="wait">
              {!capturedImage ? (
                <motion.div
                  key="camera"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <CameraView ref={videoRef} isStreaming={isStreaming} />
                  <canvas ref={canvasRef} className="hidden" />
                </motion.div>
              ) : (
                <motion.img
                  key="captured"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  src={capturedImage}
                  alt="Captured"
                  className="w-full rounded-2xl"
                />
              )}
            </AnimatePresence>

            {/* Camera Streaming Indicator */}
            {!capturedImage && isStreaming && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
              >
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                Live
              </motion.div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition hover:scale-105"
            >
              <FaHome className="inline mr-2" />
              Home
            </button>

            <AnimatePresence mode="wait">
              {!isStreaming && !capturedImage && (
                <motion.button
                  key="start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  onClick={handleStartCamera}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform transition hover:scale-105"
                >
                  <FaCamera className="inline mr-2" />
                  Enable Camera
                </motion.button>
              )}

              {isStreaming && !capturedImage && (
                <motion.button
                  key="capture"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  onClick={handleCapture}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform transition hover:scale-105"
                >
                  <FaCamera className="inline mr-2" />
                  Capture Photo
                </motion.button>
              )}

              {capturedImage && !analysisResult && !isAnalyzing && (
                <motion.div
                  key="analyze"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex gap-4"
                >
                  <button
                    onClick={handleRetake}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition hover:scale-105"
                  >
                    <FaRedo className="inline mr-2" />
                    Retake
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Analyzing Animation */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="inline-flex flex-col items-center gap-4 bg-white/80 backdrop-blur-sm rounded-3xl px-12 py-8 shadow-xl">
                <div className="relative">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      fill="none"
                      stroke="#e9d5ff"
                      strokeWidth="8"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      fill="none"
                      stroke="#9333ea"
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 60}`}
                      strokeDashoffset={`${2 * Math.PI * 60 * (1 - analysisProgress / 100)}`}
                      className="transition-all duration-500 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-purple-600">{Math.round(analysisProgress)}%</p>
                      <p className="text-xs text-gray-600">Processing</p>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-800">AI is analyzing your spirit...</p>
                  <p className="text-sm text-gray-600">Discovering your inner animal character</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <AnimatePresence>
          {analysisResult && (
            <CharacterResult
              result={analysisResult}
              onShare={handleShare}
              onReset={handleReset}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}