import React from 'react';
import MessageSendForm from '../../components/message/MessageSendForm'; // 경로 확인
import { sendMessage } from '../../apis/message/messageApi'; // 경로 확인
import { toast } from 'react-toastify';

function SendMessageFormContainer({ initialRecipient, onSuccess }) {
  const handleSubmit = async (messageData) => {
    try {
      // messageData는 { receiverId, content } 형태입니다.
      const response = await sendMessage(messageData);
      toast.success('쪽지 전송 성공: ' + response); // 백엔드에서 보낸 메시지
      
      // 성공 시 부모 컴포넌트에서 전달받은 콜백 함수 실행
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error('쪽지 전송 실패: ' + (error.response?.data || error.message));
    }
  };

  return (
    <div>
      <h2>새 쪽지 보내기</h2>
      <MessageSendForm
        onSubmit={handleSubmit}
        initialRecipientId={initialRecipient?.recipientId}
        initialRecipientNickname={initialRecipient?.recipientNickname}
      />
    </div>
  );
}

export default SendMessageFormContainer;