import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaCamera, FaMagic, FaShareAlt } from 'react-icons/fa'

export default function HomePage() {
  const navigate = useNavigate()

  const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }

  const features = [
    { icon: <FaCamera />, text: "Take a Selfie", delay: 0.2 },
    { icon: <FaMagic />, text: "AI Analysis", delay: 0.4 },
    { icon: <FaShareAlt />, text: "Share Results", delay: 0.6 }
  ]

  const animals = ['🦉', '🦦', '🦁', '🦊', '🦌', '🐉', '🐺', '🦅', '🦚', '🐢']

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 overflow-hidden">
      {/* Floating Animals Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {animals.map((emoji, index) => (
          <motion.div
            key={index}
            className="absolute text-6xl opacity-10"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      <div className="relative flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl"
        >
          {/* Main Emoji */}
          <motion.div
            animate={floatingAnimation}
            className="text-8xl mb-6"
          >
            🎭
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-6xl md:text-7xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Discover Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Spirit Animal
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl md:text-2xl text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Take a photo and let our AI reveal which cartoon animal character 
            matches your unique personality and spirit!
          </motion.p>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/capture')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-10 rounded-full text-xl shadow-2xl transform transition hover:shadow-3xl"
          >
            Start Your Journey
          </motion.button>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: feature.delay + 0.8, duration: 0.6 }}
                className="text-center"
              >
                <div className="text-4xl text-purple-600 mb-3 flex justify-center">
                  {feature.icon}
                </div>
                <p className="text-sm font-medium text-gray-700">{feature.text}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Animal Preview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="mt-12 flex justify-center gap-4"
          >
            {animals.slice(0, 5).map((emoji, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.8, scale: 1 }}
                transition={{ delay: 1.6 + index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.2, opacity: 1 }}
                className="text-4xl cursor-pointer"
              >
                {emoji}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}