import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Signup from './pages/Signup'
import Chat from './pages/Chat'

const App = () => {
  return (
    <div>
     <BrowserRouter>
     <Routes>
     {/* <Route path="/" element={<Login />} /> */}
      <Route path="/" element={<Signup />} />
      <Route path="/chat" element={<Chat/>} />
     </Routes>
     </BrowserRouter>
    </div>
  )
}

export default App