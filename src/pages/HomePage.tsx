import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Discover Your Spirit Animal
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Take a photo and let AI reveal which cartoon animal character matches your personality!
        </p>
        
        <button
          onClick={() => navigate('/capture')}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transform transition hover:scale-105"
        >
          Start Analysis
        </button>
        
        <div className="mt-12 grid grid-cols-3 gap-4 opacity-50">
          <div className="text-center">
            <div className="text-4xl mb-2">📸</div>
            <p className="text-sm">Take a Photo</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🔍</div>
            <p className="text-sm">AI Analysis</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🦁</div>
            <p className="text-sm">Meet Your Character</p>
          </div>
        </div>
      </div>
    </div>
  )
}