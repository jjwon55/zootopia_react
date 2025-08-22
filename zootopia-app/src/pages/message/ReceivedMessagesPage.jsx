import React from 'react';
import ReceivedMessagesListContainer from '../../containers/message/ReceivedMessagesListContainer'; // 경로 확인



function ReceivedMessagesPage() {
  return (
    <div>
      <h1>받은 쪽지함</h1>
      <ReceivedMessagesListContainer />
    </div>
  );
}
export default ReceivedMessagesPage;