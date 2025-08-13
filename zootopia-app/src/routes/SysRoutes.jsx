import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Cost from '../pages/funeral/Cost'
import Procedure from '../pages/funeral/Procedure'
import CreateHospitalContainer from '../pages/hospitals/CreateHospitalPage'
import HospListPage from '../pages/hospitals/HospListPage'
import HospitalDetailPage from '../pages/hospitals/HospitalDetailPage'
import HospitalEditPage from '../pages/hospitals/HospitalEditPage'


const SysRoutes = () => {
  return (
    <Routes>
      <Route path="/service/funeral/cost" element={<Cost />} />
      <Route path="/service/funeral/procedure" element={<Procedure />} />
      <Route path="/service/hospitals/createhospital" element={<CreateHospitalContainer />} />
      <Route path="/service/hospitals/hospitallist" element={<HospListPage/>} />
      <Route path="/service/hospitals/hospitaldetail/:hospitalId" element={<HospitalDetailPage />}/>
      <Route path="/service/hospitals/edit/:hospitalId" element={<HospitalEditPage />} />
    </Routes>
  )
}

export default SysRoutes