import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnalysisResult } from '../types'

export default function ResultsPage() {
  const navigate = useNavigate()
  const [result, setResult] = useState<AnalysisResult | null>(null)

  useEffect(() => {
    const storedResult = sessionStorage.getItem('analysisResult')
    if (storedResult) {
      setResult(JSON.parse(storedResult))
    } else {
      // No result, redirect to home
      navigate('/')
    }
  }, [navigate])

  const handleShare = () => {
    if (!result) return
    
    const shareText = `I'm a ${result.character.name}! ${result.character.traits.join(', ')}. Discover your spirit animal at [YourAppURL]`
    
    if (navigator.share) {
      navigator.share({
        title: 'My Spirit Animal',
        text: shareText,
      })
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(shareText)
      alert('Share text copied to clipboard!')
    }
  }

  const handleTryAgain = () => {
    sessionStorage.removeItem('analysisResult')
    navigate('/capture')
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            You're a {result.character.name}!
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex justify-center items-center">
              <div className="w-64 h-64 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center">
                <span className="text-8xl">🦁</span>
                {/* In production, this would be <img src={result.character.imageUrl} /> */}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Your Traits</h2>
                <div className="flex flex-wrap gap-2">
                  {result.character.traits.map((trait, index) => (
                    <span
                      key={index}
                      className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-2">Your Story</h2>
                <p className="text-gray-600 leading-relaxed">{result.personalizedStory || result.character.baseStory || result.character.description}</p>
              </div>

              {result.confidence && (
                <div className="text-sm text-gray-500">
                  Match confidence: {Math.round(result.confidence * 100)}%
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={handleShare}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg"
            >
              Share Result
            </button>
            <button
              onClick={handleTryAgain}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-full shadow-lg"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}