import React from 'react';
import MessageSendForm from '../../components/message/MessageSendForm'; // 경로 확인
import { sendMessage } from '../../apis/message/messageApi'; // 경로 확인
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';



function SendMessageFormContainer() {

  const location = useLocation();
  const navigate = useNavigate();

  // location.state에서 받는 사람 정보를 추출합니다. 답장이 아닐 경우 null이 됩니다.
  const initialRecipient = location.state || {};

  const handleSubmit = async (messageData) => {
    try {
      // messageData는 { receiverId, content } 형태입니다.
      const response = await sendMessage(messageData);
      // alert('쪽지 전송 성공: ' + response); // 백엔드에서 보낸 메시지
      toast.success('쪽지 전송 성공: ' + response); // 백엔드에서 보낸 메시지
      // 성공 후 추가 작업 (예: 입력 폼 초기화, 다른 페이지로 이동)
      navigate('/messages/received');
    } catch (error) {
      // alert('쪽지 전송 실패: ' + (error.response?.data || error.message));
      toast.error('쪽지 전송 실패: ' + (error.response?.data || error.message));
    }
  };


  return (
    <div>
      <h2>새 쪽지 보내기</h2>
      <MessageSendForm
        onSubmit={handleSubmit}
        initialRecipientId={initialRecipient.recipientId}
        initialRecipientNickname={initialRecipient.recipientNickname}
      />
    </div>
  );
}
export default SendMessageFormContainer;