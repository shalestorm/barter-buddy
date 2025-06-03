import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import MessagesPage from './pages/MessagesPage'
import SignupPage from './pages/SignupPage'
import WelcomePage from './pages/WelcomePage'
import FoundersLogPage from './pages/FoundersLogPage'
import ProtectedRoute from './components/ProtectedRoute'
import ThemeToggle from './components/ThemeToggle'

function App() {

  return (
    <>
      <div className="theme-toggle-wrapper">
        <ThemeToggle />
      </div>
      <div>
        <Routes>
          <Route path='/' element={<WelcomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/dashboard' element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path='/founders' element={<FoundersLogPage />} />
          <Route path='/messages/:userId' element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
          <Route path='/profile/:userId' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        </Routes>
      </div>
    </>
  )
}

export default App
