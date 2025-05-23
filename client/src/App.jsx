import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router'
import BrowsePage from './pages/BrowsePage'
import ChatPage from './pages/ChatPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import MessagesPage from './pages/MessagesPage'
// import SignupForm from './pages/SignupForm'
import WelcomePage from './pages/WelcomePage'
import FoundersLogPage from './pages/FoundersLogPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  return (
    <>
      <div>
        Hello!
        <Routes>
          <Route path='/' element={<WelcomePage />} />
          <Route path='/login' element={<LoginPage />} />
          {/* <Route path='/signup' element={<SignupForm />} /> */}
          <Route path='/dashboard' element={<ProtectedRoute><BrowsePage /></ProtectedRoute>} />
          <Route path='/chat/:userId' element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path='/founders' element={<FoundersLogPage />} />
          <Route path='/messages/:userId' element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
          <Route path='/profile/:userId' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        </Routes>
      </div>
    </>
  )
}

export default App
