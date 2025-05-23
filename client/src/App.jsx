import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router'

function App() {

  return (
    <>
      <div>
        Hello!
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/signup' element={<SignupForm />} />
          <Route path='/messages/:userId' element={<MessagesPage />} /> {/* /:userId ? */}
          <Route path='/profile/:userId' element={<ProfilePage />} />
        </Routes>
      </div>
    </>
  )
}

export default App
