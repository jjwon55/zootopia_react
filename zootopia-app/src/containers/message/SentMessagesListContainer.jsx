import React, { useState, useEffect } from 'react';
import { getSentMessages, deleteMessage } from '../../apis/message/messageApi';
import MessageCard from '../../components/message/MessageCard';
import { Pagination, Box } from '@mui/material';

function SentMessagesListContainer({ onMessageClick }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);
  const [pageNum, setPageNum] = useState(1);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await getSentMessages(pageNum);
        console.log('보낸 쪽지함 API 응답:', response); // 응답 데이터 확인용 로그
        const { messageList, pageInfo: newPageInfo } = response;
        setMessages(messageList || []);
        setPageInfo(newPageInfo || null);
      } catch (err) {
        setError('보낸 쪽지 목록을 불러오는 데 실패했습니다.');
        console.error(err);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [pageNum]);

  const handleDelete = async (e, messageNo) => {
    e.stopPropagation();
    const isConfirmed = window.confirm("이 쪽지를 정말 삭제하시겠습니까?");
    if (isConfirmed) {
      try {
        await deleteMessage(messageNo);
        alert("쪽지가 삭제되었습니다.");
        setMessages(currentMessages => currentMessages.filter(msg => msg.messageNo !== messageNo));
      } catch (err) {
        alert(err.response?.data || '쪽지 삭제에 실패했습니다.');
      }
    }
  };

  const handlePageChange = (event, value) => {
    setPageNum(value);
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
        <>
          {messages.map((msg) => (
            <div key={msg.messageNo} onClick={() => onMessageClick(msg.messageNo)} style={{ cursor: 'pointer' }}>
              <MessageCard message={msg} />
              <button onClick={(e) => handleDelete(e, msg.messageNo)}>삭제</button>
            </div>
          ))}
          {pageInfo && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Pagination 
                count={pageInfo.pages}
                page={pageNum}
                onChange={handlePageChange}
              />
            </Box>
          )}
        </>
      )}
    </div>
  );
}

export default SentMessagesListContainer;