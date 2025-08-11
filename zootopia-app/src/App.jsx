import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Procedure from './pages/funeral/Procedure';
import Insert from './pages/parttime/Insert'
import List from './pages/parttime/List'
import Read from './pages/parttime/Read'
import Update from './pages/parttime/Update'
import LoginContextProvider from './context/LoginContextProvider';


const App = () => {
  return (
    <BrowserRouter>
    <LoginContextProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/procedure" element={<Procedure />} />
        <Route path="/parttime/insert" element={<Insert />} />
        <Route path="/parttime/list" element={<List />} />
        <Route path="/parttime/read/:id" element={<Read />} />
        <Route path="/parttime/update/:id" element={<Update />} />
    </Routes>
    </LoginContextProvider>
    </BrowserRouter>
  )
}

export default App