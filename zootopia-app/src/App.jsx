import React from 'react'
import './App.css';
import { BrowserRouter, Routes } from 'react-router-dom';

import LoginContextProvider from './context/LoginContextProvider';
import JjwRoutes from './routes/JjwRoutes';
import LytRoutes from './routes/LytRoutes';
import HsmRoutes from './routes/HsmRoutes';
import SysRoutes from './routes/SysRoutes';
import Header from './components/header/Header';

const App = () => {
  return (
    <BrowserRouter>
      <LoginContextProvider>
        <Header />
          <SysRoutes />
          {/* <JjwRoutes /> */}
          {/* <HsmRoutes /> */}
          {/* <LytRoutes /> */}
      </LoginContextProvider>
    </BrowserRouter>
  );
};


export default App