import React from 'react';
import MessageBaseModal from './MessageBaseModal';
import SendMessageFormContainer from '../../containers/message/SendMessageFormContainer';

/**
 * 쪽지 보내기 기능을 위한 모달 컴포넌트
 * @param {object} props
 * @param {boolean} props.open - 모달 열림 상태
 * @param {function} props.onClose - 모달을 닫는 함수
 * @param {object} props.recipient - 받는 사람 정보 { userId, nickname }
 */
const SendMessageModal = ({ open, onClose, recipient }) => {
  // 수신자 정보가 없으면 모달을 렌더링하지 않음 (오류 방지)
  if (!recipient) {
    return null;
  }

  // 쪽지 전송 성공 시 호출될 함수
  const handleSuccess = () => {
    // 부모로부터 받은 onClose 함수를 실행하여 모달을 닫음
    if (onClose) {
      onClose();
    }
  };

  const recipientInfoForForm = {
    recipientId: recipient.userId,
    recipientNickname: recipient.nickname,
  };

  return (
    <MessageBaseModal
      open={open}
      onClose={onClose}
      title={`${recipient.nickname}님에게 쪽지 보내기`}
    >
      <SendMessageFormContainer
        initialRecipient={recipientInfoForForm}
        onSuccess={handleSuccess}
      />
    </MessageBaseModal>
  );
};

export default SendMessageModal;
