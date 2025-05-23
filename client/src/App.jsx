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

function App() {

  return (
    <>
      <div>
        Hello!
        <Routes>
          <Route path='/' element={<WelcomePage />} />
          <Route path='/login' element={<LoginPage />} />
          {/* <Route path='/signup' element={<SignupForm />} /> */}
          <Route path='/dashboard' element={<BrowsePage />} />
          <Route path='/chat/:userId' element={<ChatPage />} />
          <Route path='/founders' element={<FoundersLogPage />} />
          <Route path='/messages/:userId' element={<MessagesPage />} />
          <Route path='/profile/:userId' element={<ProfilePage />} />
        </Routes>
      </div>
    </>
  )
}

export default App
