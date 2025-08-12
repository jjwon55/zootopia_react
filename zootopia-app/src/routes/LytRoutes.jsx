import React from 'react'
import Home from '../pages/Home'
import List from '../pages/parttime/List'
import Insert from '../pages/parttime/Insert'
import Read from '../pages/parttime/Read'
import Update from '../pages/parttime/Update'
// ---- insurance는 컨테이너 연결 (이름 충돌 방지: Insurance 접두어)
import InsuranceList from '../pages/insurance/List'
import InsuranceInsert from '../pages/insurance/Insert'
import InsuranceRead from '../pages/insurance/Read'
import InsuranceUpdate from '../pages/insurance/Update'
import { Route, Routes } from 'react-router-dom'

const LytRoutes = () => {
  return (
    <>
      <Routes>
        {/* 기본 페이지 */}
        <Route path="/" element={<Home />} />
        {/* 아르바이트 경로 */}
        <Route path="/parttime/list" element={<List />} />
        <Route path="/parttime/insert" element={<Insert />} />
        <Route path="/parttime/read/:jobId" element={<Read />} />
        <Route path="/parttime/update/:jobId" element={<Update />} />
        <Route path="/insurance/list" element={<InsuranceList />} />
        <Route path="/insurance/create" element={<InsuranceInsert />} />
        <Route path="/insurance/read/:jobId" element={<InsuranceRead />} />
        <Route path="/insurance/update/:jobId" element={<InsuranceUpdate />} />
      </Routes>
    </>
  )
}

export default LytRoutes