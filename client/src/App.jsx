import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar.jsx'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './pages/Home.jsx'
import Users from './pages/Users.jsx'
import { ToastContainer } from 'react-toastify'
import Transactions from './pages/Transactions.jsx'
import Relationships from './pages/Relationships.jsx'

function App() {
  return (  
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users/>} />
        <Route path="/transactions" element={<Transactions />} />
        {/* <Route path="/relationships" element={<Relationships />} /> */}
        <Route path="/relationships/user/:userId" element={<Relationships />} />
        <Route path="/relationships/transaction/:transactionId" element={<Relationships />} />
      </Routes>
      <ToastContainer/>
    </Router>
  )
}

export default App
