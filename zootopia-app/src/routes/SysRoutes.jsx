import React from 'react'
import Cost from './../pages/funeral/Cost';
import Procedure from './../pages/funeral/Procedure';
import { Route, Routes } from 'react-router-dom';
import CreateHospitalPage from '../pages/hospitals/CreateHospitalPage';

const SysRoutes = () => {
  return (
    <Routes>
      <Route path="/cost" element={<Cost />} />
      <Route path="/procedure" element={<Procedure />} />
      <Route path="service/createhospital" element={<CreateHospitalPage />} />
    </Routes>
  )
}

export default SysRoutes