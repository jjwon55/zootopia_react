import React from 'react'
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Cost from './pages/funeral/Cost';
import Home from './pages/Home'
import Procedure from './pages/funeral/Procedure';
import List from './pages/posts/List'
import Read from './pages/posts/Read';
import Create from './pages/posts/Create';
import Update from './pages/posts/Update';
import LoginForm from './components/Login/LoginFrom';
import LoginContextProvider from './context/LoginContextProvider';
import HospListPage from './pages/hospitals/HospListPage';
import CreateHospitalComponent from './components/hospitals/CreateHospitalComponent';


const App = () => {
  return (
    <BrowserRouter>
    <LoginContextProvider>
      <Routes>
        {/* 전주원 */}
        <Route path="/posts" element={<List />} />
        <Route path="/posts/read/:postId" element={<Read />} />
        <Route path="/posts/create" element={<Create />} />
        <Route path="/posts/edit/:postId" element={<Update />} />
        <Route path="/login" element={<LoginForm />} />
        {/* 전주원 */}


        {/* 신유식 */}

        {/* 신유식 */}


        {/* 이윤태 */}
        <Route path="/" element={<Home />} />
        <Route path="/cost" element={<Cost />} />
        <Route path="/procedure" element={<Procedure />} />


        {/* 이윤태 */}


        {/* 홍성민 */}

        {/* 홍성민 */}

      

        <Route path="/service/hospitals" element={<HospListPage />} />
        <Route path="/service/createhospital" element={<CreateHospitalComponent />} />

      </Routes>
      </LoginContextProvider>
    </BrowserRouter>
  )
}

export default App