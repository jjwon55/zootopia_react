import React from 'react'
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Cost from './pages/funeral/Cost';
import Home from './pages/Home'
import Procedure from './pages/funeral/Procedure';
import HospListPage from './pages/hospitals/HospListPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/" element={<Cost />} />
        <Route path="/procedure" element={<Procedure />} />
        <Route path="/service/hospitals" element={<HospListPage />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App