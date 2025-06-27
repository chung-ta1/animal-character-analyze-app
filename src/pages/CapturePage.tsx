import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCamera, FaRedo, FaSpinner, FaHome } from 'react-icons/fa'
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
    }
  }

  const handleRetake = () => {
    setCapturedImage(null)
    setAnalysisError(null)
    setAnalysisResult(null)
    startCamera()
  }

  const handleAnalyze = async () => {
    if (!capturedImage) return

    setIsAnalyzing(true)
    setAnalysisError(null)

    try {
      const result = await analyzeImage(capturedImage)
      setAnalysisResult(result)
    } catch (err) {
      setAnalysisError('Failed to analyze image. Please try again.')
      console.error('Analysis error:', err)
    } finally {
      setIsAnalyzing(false)
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

            {/* Overlay Controls */}
            {!capturedImage && isStreaming && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent p-6"
              >
                <button
                  onClick={handleCapture}
                  className="mx-auto block bg-white text-purple-600 w-20 h-20 rounded-full shadow-2xl hover:shadow-3xl transform transition hover:scale-110 flex items-center justify-center"
                >
                  <FaCamera className="text-3xl" />
                </button>
              </motion.div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-center gap-4">
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

              {capturedImage && !analysisResult && (
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
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <>
                        <FaSpinner className="inline mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      'Analyze My Spirit Animal'
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => navigate('/')}
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition hover:scale-105"
            >
              <FaHome className="inline mr-2" />
              Home
            </button>
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
              <div className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-full px-8 py-4 shadow-xl">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-16 h-16 border-4 border-purple-600 rounded-full animate-spin border-t-transparent"></div>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-800">AI is analyzing your spirit...</p>
                  <p className="text-sm text-gray-600">This may take a few moments</p>
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