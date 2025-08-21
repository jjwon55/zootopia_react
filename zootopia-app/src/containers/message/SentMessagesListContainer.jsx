import React, { useState, useEffect } from 'react';
import { getSentMessages, deleteMessage } from '../../apis/message/messageApi'; // getReceivedMessages ->
getSentMessages
import MessageCard from '../../components/message/MessageCard';
import { Link } from 'react-router-dom';




function SentMessagesListContainer() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // API 함수 변경
        const data = await getSentMessages();
        setMessages(data || []);
      } catch (err) {
        setError('보낸 쪽지 목록을 불러오는 데 실패했습니다.');
        console.error(err);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);


  // 목록에서 바로 삭제하는 함수 (추가)
  const handleDelete = async (messageNo) => {
    const isConfirmed = window.confirm("이 쪽지를 정말 삭제하시겠습니까?");
    if (isConfirmed) {
      try {
        await deleteMessage(messageNo);
        alert("쪽지가 삭제되었습니다.");
        // 상태를 직접 갱신하여 화면에서 즉시 사라지게 함
        setMessages(currentMessages => currentMessages.filter(msg => msg.messageNo !== messageNo));
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
      <h2>보낸 쪽지 목록</h2>
      {messages.length === 0 ? (
        <p>보낸 쪽지가 없습니다.</p>
      ) : (
        messages.map((msg) => (
          // 상세 페이지로 이동하는 링크는 동일하게 사용
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
export default SentMessagesListContainer;