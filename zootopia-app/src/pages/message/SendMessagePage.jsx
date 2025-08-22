import React from 'react';
import SendMessageFormContainer from '../../containers/message/SendMessageFormContainer'; 

//경로 확인
function SendMessagePage() {
  return (
    <div>
      <h1>쪽지 보내기</h1>
      <SendMessageFormContainer />
    </div>
  );
}
export default SendMessagePage;