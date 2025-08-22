import React, { useState, useEffect, useContext } from 'react';
import { getReceivedMessages, deleteMessage } from '../../apis/message/messageApi'; // 경로 확인
import MessageCard from '../../components/message/MessageCard'; // 경로 확인
import { Link } from 'react-router-dom';
import { MessageContext } from '../../context/MessageContextProvider';




function ReceivedMessagesListContainer() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { fetchUnreadCount } = useContext(MessageContext);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getReceivedMessages();
        setMessages(data || []);
      } catch (err) {
        setError('받은 쪽지 목록을 불러오는 데 실패했습니다.');
        console.error(err);
        setMessages([]); // 에러가 발생했을 때도 빈 배열로 설정
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []); // 컴포넌트가 처음 마운트될 때 한 번만 실행


  // 목록에서 바로 삭제하는 함수 (추가)
  const handleDelete = async (messageNo) => {
    const isConfirmed = window.confirm("이 쪽지를 정말 삭제하시겠습니까?");
    if (isConfirmed) {
      try {
        await deleteMessage(messageNo);
        alert("쪽지가 삭제되었습니다.");
        // 상태를 직접 갱신하여 화면에서 즉시 사라지게 함
        setMessages(currentMessages => currentMessages.filter(msg => msg.messageNo !== messageNo));
        // 뱃지 카운트도 갱신
        await fetchUnreadCount();
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


  return (
    <div>
      <h2>받은 쪽지 목록</h2>
      {messages.length === 0 ? (
        <p>받은 쪽지가 없습니다.</p>
      ) : (
        messages.map((msg) => (
          <div>
            <Link to={`/messages/${msg.messageNo}`} key={msg.messageNo} style={{ textDecoration:'none', color: 'inherit' }}>
              <MessageCard message={msg} />
            </Link>
            <button onClick={() => handleDelete(msg.messageNo)}>삭제</button>
          </div>
        ))
      )}
    </div>
  );
}
export default ReceivedMessagesListContainer;