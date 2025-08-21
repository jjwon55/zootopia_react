import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // react-router-dom에서 useParams를 임포트
import { getMessageDetails, deleteMessage } from '../../apis/message/messageApi'; // 경로 확인
import MessageDetailView from '../../components/message/MessageDetailView'; // 경로 확인
import { MessageContext } from '../../context/MessageContextProvider';



function MessageDetailContainer() {
  const { messageNo } = useParams(); // URL 파라미터에서 messageNo 값을 가져옴
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { fetchUnreadCount } = useContext(MessageContext);


  useEffect(() => {
    // messageNo가 유효할 때만 API를 호출
    if (!messageNo) return;

    const fetchMessage = async () => {
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
  }, [messageNo], [fetchUnreadCount]); // messageNo가 변경될 때마다 다시 데이터를 불러옴


  // 답장 버튼 클릭 시 실행될 함수
  const handleReply = () => {
    if (!message) return;
    // 쪽지 보내기 페이지로 이동
    // state 객체를 통해 답장할 상대방의 ID와 닉네임을 전달
    navigate('/messages/send', {
      state: {
        recipientId: message.senderId,
        recipientNickname: message.senderNickname,
      },
    });
  };


  // 삭제 버튼 클릭 시 실행될 함수
  const handleDelete = async () => {
    if (!messageNo) return;
    // 사용자에게 정말 삭제할 것인지 확인받음
    const isConfirmed = window.confirm("이 쪽지를 정말 삭제하시겠습니까?\n삭제된 쪽지는 복구할 없습니다.");
    if (isConfirmed) {
      try {
        const response = await deleteMessage(messageNo);
        alert(response); // 백엔드에서 보낸 성공 메시지 출력
        navigate('/messages/received'); // 삭제 후 받은 쪽지함으로 이동
      } catch (err) {
        // 백엔드에서 보낸 권한 없음(403) 또는 기타 오류 메시지 출력
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
      {/* 여기에 답장하기, 삭제하기 등의 버튼을 추가할 수 있습니다. */}
      <button onClick={handleReply}>답장하기</button>
      <button onClick={handleDelete} style={{ marginLeft: '10px', backgroundColor: '#ff4d4d', color: 'white' }}>
        삭제하기
      </button>
    </div>
  );
}
export default MessageDetailContainer;