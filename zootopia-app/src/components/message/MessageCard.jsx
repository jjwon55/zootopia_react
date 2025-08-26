import { CheckLine } from 'lucide-react';
import React from 'react';

function MessageCard({ message }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
      {/* senderNickname이 있을 때만 "보낸 사람"을 표시 */}
      {message.senderNickname && <p><strong>보낸 사람:</strong> {message.senderNickname}</p>}
      {/* receiverNickname이 있을 때만 "받는 사람"을 표시 */}
      {message.receiverNickname && <p><strong>받는 사람:</strong> {message.receiverNickname}</p>}
      <p><strong>내용:</strong> {message.content?.substring(0, 50)}...</p> {/* 내용이 길 경우를 대비 */}
      <p><strong>시간:</strong> {new Date(message.sendTime).toLocaleString()}</p>
      {/* isRead는 받은 편지함에만 의미가 있으므로, 존재할 때만 표시 */}
      {message.isRead !== undefined && (
        <div style={{ fontWeight: message.isRead ? 'normal' : 'bold' }}>
          {message.isRead ? <CheckLine className='tw:text-[#00db49]' /> : <div className='tw:text-[#ff3333] tw:italic tw:font-bold tw:text-[13px]'>안 읽은 메시지</div>}
        </div>
      )}
    </div>
  );
}

export default MessageCard;
