import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Cost from '../pages/funeral/Cost'
import Procedure from '../pages/funeral/Procedure'
import CreateHospitalContainer from '../pages/hospitals/CreateHospitalPage'
import HospListPage from '../pages/hospitals/HospListPage'


const SysRoutes = () => {
  return (
    <Routes>
      <Route path="/cost" element={<Cost />} />
      <Route path="/procedure" element={<Procedure />} />
      <Route path="/createhospital" element={<CreateHospitalContainer />} />
      <Route path="/hospitallist" element={<HospListPage/>} />
    </Routes>
  )
}

export default SysRoutes