import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MessageDetailContainer from '../../containers/message/MessageDetailContainer';

function MessageDetailPage() {
  const { messageNo } = useParams();
  const navigate = useNavigate();

  // 목록으로 돌아가는 함수
  const handleReturnToList = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  // 답장 기능 핸들러 (현재는 구현되지 않았으므로 기본 형태로 둡니다)
  const handleReply = (recipient) => {
    // 답장 페이지로 이동하거나 모달을 띄우는 로직
    console.log('Reply to:', recipient);
    // 예: navigate('/messages/send', { state: { recipient } });
  };

  return (
    <div>
      <MessageDetailContainer
        messageNo={messageNo}
        onReturnToList={handleReturnToList}
        onDeleteSuccess={handleReturnToList} // 삭제 성공 시 목록으로 돌아감
        onReply={handleReply}
      />
    </div>
  );
}

export default MessageDetailPage;
