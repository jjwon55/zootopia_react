import React, { useState, useEffect, useContext } from 'react';
import { getMessageDetails, deleteMessage } from '../../apis/message/messageApi'; // 경로 확인
import MessageDetailView from '../../components/message/MessageDetailView'; // 경로 확인
import { MessageContext } from '../../context/MessageContextProvider';

function MessageDetailContainer({ messageNo, onReply, onDeleteSuccess, onReturnToList }) {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { fetchUnreadCount } = useContext(MessageContext);

  useEffect(() => {
    if (!messageNo) return;

    const fetchMessage = async () => {
      setLoading(true);
      try {
        const data = await getMessageDetails(messageNo);
        setMessage(data);
        await fetchUnreadCount();
      } catch (err) {
        setError('쪽지 상세 정보를 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessage();
  }, [messageNo, fetchUnreadCount]);

  const handleReply = () => {
    if (!message || !onReply) return;
    const recipient = {
      userId: message.senderId,
      nickname: message.senderNickname,
    };
    onReply(recipient);
  };

  const handleDelete = async () => {
    if (!messageNo) return;
    const isConfirmed = window.confirm("이 쪽지를 정말 삭제하시겠습니까?\n삭제된 쪽지는 복구할 수 없습니다.");
    if (isConfirmed) {
      try {
        const response = await deleteMessage(messageNo);
        alert(response);
        if (onDeleteSuccess) {
          onDeleteSuccess();
        }
      } catch (err) {
        alert(err.response?.data || '쪽지 삭제에 실패했습니다.');
      }
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }
  if (!message) {
    return <div>쪽지 정보가 없습니다.</div>;
  }

  return (
    <div>
      <MessageDetailView message={message} />
      <button onClick={onReturnToList}>목록으로</button>
      <button onClick={handleReply} style={{ marginLeft: '10px' }}>답장하기</button>
      <button onClick={handleDelete} style={{ marginLeft: '10px', backgroundColor: '#ff4d4d', color: 'white' }}>
        삭제하기
      </button>
    </div>
  );
}

export default MessageDetailContainer;
