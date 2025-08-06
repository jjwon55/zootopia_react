import React from 'react'
import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Cost from './pages/funeral/cost';
import Procedure from './pages/funeral/Procedure';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Cost />} />
        <Route path="/procedure" element={<Procedure />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App