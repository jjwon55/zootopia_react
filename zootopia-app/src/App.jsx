import React from 'react'
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Cost from './pages/funeral/cost';
import Home from './pages/Home'
import Procedure from './pages/funeral/Procedure';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/" element={<Cost />} />
        <Route path="/procedure" element={<Procedure />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App