import { motion } from 'framer-motion'
import { FaStar, FaHeart, FaShare } from 'react-icons/fa'
import { AnalysisResult } from '../../types'

interface CharacterResultProps {
  result: AnalysisResult
  onShare: () => void
  onReset: () => void
}

// Dynamic emoji mapping based on animal names
const getAnimalEmoji = (name: string): string => {
  const lowerName = name.toLowerCase()
  
  // Check for specific animals in the name
  // Wild cats
  if (lowerName.includes('lion')) return '🦁'
  if (lowerName.includes('tiger')) return '🐅'
  if (lowerName.includes('leopard')) return '🐆'
  if (lowerName.includes('cheetah')) return '🐆'
  if (lowerName.includes('panther')) return '🐈‍⬛'
  if (lowerName.includes('lynx')) return '🐈'
  if (lowerName.includes('cat')) return '🐱'
  
  // Bears
  if (lowerName.includes('bear')) return '🐻'
  if (lowerName.includes('polar bear')) return '🐻‍❄️'
  if (lowerName.includes('panda')) return '🐼'
  
  // Canines
  if (lowerName.includes('wolf')) return '🐺'
  if (lowerName.includes('fox')) return '🦊'
  if (lowerName.includes('dog')) return '🐕'
  if (lowerName.includes('husky')) return '🐺'
  if (lowerName.includes('coyote')) return '🐺'
  
  // Birds
  if (lowerName.includes('owl')) return '🦉'
  if (lowerName.includes('eagle')) return '🦅'
  if (lowerName.includes('hawk')) return '🦅'
  if (lowerName.includes('falcon')) return '🦅'
  if (lowerName.includes('peacock')) return '🦚'
  if (lowerName.includes('swan')) return '🦢'
  if (lowerName.includes('flamingo')) return '🦩'
  if (lowerName.includes('parrot')) return '🦜'
  if (lowerName.includes('dove')) return '🕊️'
  if (lowerName.includes('rooster')) return '🐓'
  if (lowerName.includes('chicken')) return '🐔'
  if (lowerName.includes('duck')) return '🦆'
  if (lowerName.includes('penguin')) return '🐧'
  if (lowerName.includes('bird')) return '🐦'
  
  // Marine life
  if (lowerName.includes('dolphin')) return '🐬'
  if (lowerName.includes('whale')) return '🐋'
  if (lowerName.includes('shark')) return '🦈'
  if (lowerName.includes('octopus')) return '🐙'
  if (lowerName.includes('squid')) return '🦑'
  if (lowerName.includes('jellyfish')) return '🪼'
  if (lowerName.includes('seal')) return '🦭'
  if (lowerName.includes('otter')) return '🦦'
  if (lowerName.includes('fish')) return '🐠'
  if (lowerName.includes('goldfish')) return '🐠'
  if (lowerName.includes('tropical fish')) return '🐠'
  if (lowerName.includes('lobster')) return '🦞'
  if (lowerName.includes('crab')) return '🦀'
  if (lowerName.includes('shrimp')) return '🦐'
  
  // Reptiles & Amphibians
  if (lowerName.includes('turtle')) return '🐢'
  if (lowerName.includes('tortoise')) return '🐢'
  if (lowerName.includes('snake')) return '🐍'
  if (lowerName.includes('lizard')) return '🦎'
  if (lowerName.includes('gecko')) return '🦎'
  if (lowerName.includes('chameleon')) return '🦎'
  if (lowerName.includes('crocodile')) return '🐊'
  if (lowerName.includes('alligator')) return '🐊'
  if (lowerName.includes('frog')) return '🐸'
  if (lowerName.includes('dragon')) return '🐉'
  
  // Hoofed animals
  if (lowerName.includes('horse')) return '🐴'
  if (lowerName.includes('unicorn')) return '🦄'
  if (lowerName.includes('zebra')) return '🦓'
  if (lowerName.includes('deer')) return '🦌'
  if (lowerName.includes('moose')) return '🦌'
  if (lowerName.includes('elk')) return '🦌'
  if (lowerName.includes('giraffe')) return '🦒'
  if (lowerName.includes('llama')) return '🦙'
  if (lowerName.includes('alpaca')) return '🦙'
  if (lowerName.includes('camel')) return '🐪'
  if (lowerName.includes('cow')) return '🐄'
  if (lowerName.includes('ox')) return '🐂'
  if (lowerName.includes('buffalo')) return '🦬'
  if (lowerName.includes('bison')) return '🦬'
  if (lowerName.includes('pig')) return '🐷'
  if (lowerName.includes('boar')) return '🐗'
  if (lowerName.includes('sheep')) return '🐑'
  if (lowerName.includes('goat')) return '🐐'
  if (lowerName.includes('ram')) return '🐏'
  
  // Primates
  if (lowerName.includes('monkey')) return '🐵'
  if (lowerName.includes('gorilla')) return '🦍'
  if (lowerName.includes('orangutan')) return '🦧'
  if (lowerName.includes('chimpanzee')) return '🐵'
  
  // Small mammals
  if (lowerName.includes('rabbit')) return '🐰'
  if (lowerName.includes('bunny')) return '🐰'
  if (lowerName.includes('hare')) return '🐰'
  if (lowerName.includes('mouse')) return '🐭'
  if (lowerName.includes('rat')) return '🐀'
  if (lowerName.includes('hamster')) return '🐹'
  if (lowerName.includes('squirrel')) return '🐿️'
  if (lowerName.includes('chipmunk')) return '🐿️'
  if (lowerName.includes('beaver')) return '🦫'
  if (lowerName.includes('hedgehog')) return '🦔'
  if (lowerName.includes('bat')) return '🦇'
  
  // Large mammals
  if (lowerName.includes('elephant')) return '🐘'
  if (lowerName.includes('mammoth')) return '🦣'
  if (lowerName.includes('rhino')) return '🦏'
  if (lowerName.includes('hippo')) return '🦛'
  
  // Australian animals
  if (lowerName.includes('koala')) return '🐨'
  if (lowerName.includes('kangaroo')) return '🦘'
  
  // Insects & Small creatures
  if (lowerName.includes('butterfly')) return '🦋'
  if (lowerName.includes('bee')) return '🐝'
  if (lowerName.includes('ladybug')) return '🐞'
  if (lowerName.includes('beetle')) return '🪲'
  if (lowerName.includes('ant')) return '🐜'
  if (lowerName.includes('spider')) return '🕷️'
  if (lowerName.includes('scorpion')) return '🦂'
  if (lowerName.includes('snail')) return '🐌'
  if (lowerName.includes('worm')) return '🪱'
  
  // Mythical/Fantasy
  if (lowerName.includes('phoenix')) return '🔥'
  if (lowerName.includes('griffin')) return '🦅'
  if (lowerName.includes('pegasus')) return '🦄'
  
  // Other unique animals
  if (lowerName.includes('sloth')) return '🦥'
  if (lowerName.includes('badger')) return '🦡'
  if (lowerName.includes('raccoon')) return '🦝'
  if (lowerName.includes('skunk')) return '🦨'
  if (lowerName.includes('opossum')) return '🐾'
  if (lowerName.includes('peacock')) return '🦚'
  if (lowerName.includes('turkey')) return '🦃'
  if (lowerName.includes('dodo')) return '🦤'
  
  // Default emoji
  return '🌟'
}

export default function CharacterResult({ result, onShare, onReset }: CharacterResultProps) {
  const emoji = getAnimalEmoji(result.character.name)
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
        {/* Animal Emoji Display */}
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

      {/* Analysis & Story */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl space-y-4"
      >
        <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <FaHeart className="text-red-500" />
          Your Analysis
        </h3>
        
        {/* Reasoning */}
        {result.reasoning && (
          <div className="pb-4 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Why this animal?</h4>
            <p className="text-gray-700 leading-relaxed">
              {result.reasoning}
            </p>
          </div>
        )}
        
        {/* Personalized Story */}
        {result.personalizedStory && (
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Your Story</h4>
            <p className="text-gray-700 leading-relaxed text-lg">
              {result.personalizedStory}
            </p>
          </div>
        )}
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