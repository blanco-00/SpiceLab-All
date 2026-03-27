import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import RoomPage from '@/pages/RoomPage'
import GamePage from '@/pages/GamePage'
import JoinPage from '@/pages/JoinPage'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/join/:roomCode" element={<JoinPage />} />
          <Route path="/room/:roomCode" element={<RoomPage />} />
          <Route path="/game/:roomCode" element={<GamePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
