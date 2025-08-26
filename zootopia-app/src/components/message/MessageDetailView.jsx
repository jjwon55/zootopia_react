import React from 'react';

function MessageDetailView({ message }) {
  if (!message) return <div>쪽지를 찾을 수 없습니다.</div>;

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '20px', gap:'10px' }}>
      {/* <p><strong>쪽지 번호:</strong> {message.messageNo}</p> */}
      <p className='tw:border-b-1 tw:border-[#e2e2e2] tw:rounded-md tw:bg-[#e6e6e61c] tw:p-0.5'><strong>&nbsp;보낸 사람:</strong> {message.senderNickname}</p>
      <p className='tw:border-b-1 tw:border-[#e2e2e2] tw:rounded-md tw:bg-[#e6e6e61c] tw:p-0.5'><strong>&nbsp;받는 사람:</strong> {message.receiverNickname}</p>
      <div><strong>&nbsp;내용:</strong><br/>
        <div className='tw:border-2 tw:border-[#e2e2e2] tw:rounded-md tw:p-4 tw:bg-[#e6e6e61c] tw:whitespace-pre-wrap'>
          {message.content}
        </div>
      </div>
      <p>{new Date(message.sendTime).toLocaleString()}</p>
    </div>
  );
}

export default MessageDetailView;