import React from 'react'
import './App.css';
import { BrowserRouter, Routes } from 'react-router-dom';

import LoginContextProvider from './context/LoginContextProvider';
import JjwRoutes from './routes/JjwRoutes';
import LytRoutes from './routes/LytRoutes';
import HsmRoutes from './routes/HsmRoutes';
import SysRoutes from './routes/SysRoutes';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import MessageContextProvider from './context/MessageContextProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <BrowserRouter>
      <LoginContextProvider>
        <MessageContextProvider>
        <Header />
          <SysRoutes />
          <JjwRoutes />
          <HsmRoutes />
          <LytRoutes />
        <Footer />
        <ToastContainer
          position="top-center" // 알림 위치를 화면 상단 중앙으로 설정
          autoClose={1000} // 3초 후에 자동으로 닫힘
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        </MessageContextProvider>
      </LoginContextProvider>
    </BrowserRouter>
  );
};


export default App