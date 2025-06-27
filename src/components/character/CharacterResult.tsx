import { motion } from 'framer-motion'
import { FaStar, FaHeart, FaShare } from 'react-icons/fa'
import { AnalysisResult } from '../../types'

interface CharacterResultProps {
  result: AnalysisResult
  onShare: () => void
  onReset: () => void
}

const animalEmojis: Record<string, string> = {
  'wise-owl': '🦉',
  'playful-otter': '🦦',
  'noble-lion': '🦁',
  'curious-fox': '🦊',
  'gentle-deer': '🦌',
  'mighty-dragon': '🐉',
  'loyal-wolf': '🐺',
  'free-eagle': '🦅',
  'creative-peacock': '🦚',
  'steady-turtle': '🐢'
}

export default function CharacterResult({ result, onShare, onReset }: CharacterResultProps) {
  const emoji = animalEmojis[result.character.id] || '🌟'
  const confidencePercent = Math.round(result.confidence * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="mt-8 space-y-6"
    >
      {/* Character Header */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="text-8xl mb-4"
        >
          {emoji}
        </motion.div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          You're a {result.character.name}!
        </h2>
        <p className="text-gray-600 mt-2 text-lg italic">{result.character.species}</p>
      </motion.div>

      {/* Confidence Score */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ delay: 0.5, duration: 1 }}
        className="max-w-md mx-auto"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Match Confidence</span>
          <span className="text-sm font-bold text-purple-600">{confidencePercent}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${confidencePercent}%` }}
            transition={{ delay: 0.7, duration: 1.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
          />
        </div>
      </motion.div>

      {/* Traits */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl"
      >
        <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <FaStar className="text-yellow-500" />
          Your Traits
        </h3>
        <div className="flex flex-wrap gap-3">
          {result.character.traits.map((trait, index) => (
            <motion.span
              key={trait}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + index * 0.1 }}
              className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-full font-medium text-sm border border-purple-200"
            >
              {trait}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Story */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl"
      >
        <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <FaHeart className="text-red-500" />
          Your Story
        </h3>
        <p className="text-gray-700 leading-relaxed text-lg">
          {result.personalizedStory || result.reasoning}
        </p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="flex justify-center gap-4 pt-4"
      >
        <button
          onClick={onShare}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform transition hover:scale-105"
        >
          <FaShare />
          Share Result
        </button>
        <button
          onClick={onReset}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform transition hover:scale-105"
        >
          Try Again
        </button>
      </motion.div>
    </motion.div>
  )
}