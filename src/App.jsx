import React from 'react'
import Navbar from './components/Navbar';
import { Route, Routes } from 'react-router';
import Home from './pages/Home';

const App = () => {
  return (
    <div>
      <Navbar />
      <div>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/' element={}/>
        </Routes>
      </div>
    </div>
  )
}

export default App
