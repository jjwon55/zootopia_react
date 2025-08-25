import React, { useContext } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Cost from '../pages/funeral/Cost'
import Procedure from '../pages/funeral/Procedure'
import CreateHospitalPage from '../pages/hospitals/CreateHospitalPage'
import HospListPage from '../pages/hospitals/HospListPage'
import HospitalDetailPage from '../pages/hospitals/HospitalDetailPage'
import HospitalEditPage from '../pages/hospitals/HospitalEditPage'
import OAuth2Callback from '../pages/oauth2/Callback'; // Import the new component
// 쪽지 관련 페이지 컴포넌트 임포트
import ReceivedMessagesPage from '../pages/message/ReceivedMessagesPage';
import SentMessagesPage from '../pages/message/SentMessagesPage';
import MessageDetailPage from '../pages/message/MessageDetailPage';
import SendMessagePage from '../pages/message/SendMessagePage';


const SysRoutes = () => {
  return (
    <Routes>
      <Route path="/service/funeral/cost" element={<Cost />} />
      <Route path="/service/funeral/procedure" element={<Procedure />} />
      <Route path="/service/hospitals/createhospital" element={<CreateHospitalPage />} />
      <Route path="/service/hospitals/hospitallist" element={<HospListPage/>} />
      <Route path="/service/hospitals/hospitaldetail/:hospitalId" element={<HospitalDetailPage />}/>
      <Route path="/service/hospitals/edit/:hospitalId" element={<HospitalEditPage />} />
      <Route path="/oauth2/callback" element={<OAuth2Callback />} /> {/* Add the new route */}
      {/* 쪽지 관련 라우트 추가 */}
      <Route path="/messages/received" element={<ReceivedMessagesPage />} />
      <Route path="/messages/sent" element={<SentMessagesPage />} />
      <Route path="/messages/send" element={<SendMessagePage />} />
      <Route path="/messages/:messageNo" element={<MessageDetailPage />} /> {/* 상세 페이지는 파라미터 받음 */}
    </Routes>
  )
}

export default SysRoutes