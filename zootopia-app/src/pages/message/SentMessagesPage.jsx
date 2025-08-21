import React from 'react';
import SentMessagesListContainer from '../../containers/message/SentMessagesListContainer'; // 경로 확인



function SentMessagesPage() {
  return (
    <div>
      <h1>보낸 쪽지함</h1>
      <SentMessagesListContainer />
    </div>
  );
}
export default SentMessagesPage;