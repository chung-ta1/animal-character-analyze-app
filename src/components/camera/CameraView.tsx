import { forwardRef } from 'react'

interface CameraViewProps {
  isStreaming: boolean
}

const CameraView = forwardRef<HTMLVideoElement, CameraViewProps>(
  ({ isStreaming }, ref) => {
    return (
      <div className="relative w-full max-w-2xl mx-auto">
        <video
          ref={ref}
          autoPlay
          playsInline
          muted
          className="w-full rounded-lg shadow-lg bg-black"
          style={{ display: isStreaming ? 'block' : 'none' }}
        />
        {!isStreaming && (
          <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
            <p className="text-gray-500">Camera preview will appear here</p>
          </div>
        )}
        <canvas className="hidden" />
      </div>
    )
  }
)

CameraView.displayName = 'CameraView'

export default CameraView