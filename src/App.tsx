import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CapturePage from './pages/CapturePage'
import ResultsPage from './pages/ResultsPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/capture" element={<CapturePage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App