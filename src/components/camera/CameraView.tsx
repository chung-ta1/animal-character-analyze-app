import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { FaCamera } from 'react-icons/fa'

interface CameraViewProps {
  isStreaming: boolean
}

const CameraView = forwardRef<HTMLVideoElement, CameraViewProps>(
  ({ isStreaming }, ref) => {
    return (
      <div className="relative w-full">
        <video
          ref={ref}
          autoPlay
          playsInline
          muted
          className="w-full rounded-2xl bg-black object-cover"
          style={{ 
            display: isStreaming ? 'block' : 'none',
            aspectRatio: '4/3'
          }}
        />
        {!isStreaming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl aspect-[4/3] flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-purple-400 mb-4"
            >
              <FaCamera size={60} />
            </motion.div>
            <p className="text-gray-600 font-medium">Camera preview will appear here</p>
            <p className="text-gray-500 text-sm mt-2">Please allow camera access</p>
          </motion.div>
        )}
        <canvas className="hidden" />
      </div>
    )
  }
)

CameraView.displayName = 'CameraView'

export default CameraView