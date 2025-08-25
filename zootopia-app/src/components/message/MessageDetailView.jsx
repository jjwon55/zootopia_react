import React from 'react';

function MessageDetailView({ message }) {
  if (!message) return <div>쪽지를 찾을 수 없습니다.</div>;

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '20px' }}>
      <h2>쪽지 상세</h2>
      <p><strong>쪽지 번호:</strong> {message.messageNo}</p>
      <p><strong>보낸 사람:</strong> {message.senderNickname}</p>
      <p><strong>받는 사람:</strong> {message.receiverNickname}</p>
      <p><strong>내용:</strong> {message.content}</p>
      <p><strong>보낸 시간:</strong> {new Date(message.sendTime).toLocaleString()}</p>
    </div>
  );
}

export default MessageDetailView;