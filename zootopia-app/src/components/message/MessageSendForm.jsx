import React, { useEffect, useState } from 'react';

function MessageSendForm({ onSubmit, initialRecipientId = '', initialRecipientNickname = '' }) {

  const [receiverId, setReceiverId] = useState(initialRecipientId);
  const [receiverNickname, setReceiverNickname] = useState(initialRecipientNickname);
  const [content, setContent] = useState('');


  // 답장일 경우, 받는 사람 정보가 바뀌지 않도록 useEffect 사용 (선택 사항)
  useEffect(() => {
    setReceiverId(initialRecipientId);
    setReceiverNickname(initialRecipientNickname);
  }, [initialRecipientId, initialRecipientNickname]);


  const handleSubmit = (e) => {
    e.preventDefault();
    // if (receiverId && content) {
    //   onSubmit({ receiverId, content });
    //   setReceiverId('');
    //   setContent('');
    // }
    // 받는 사람은 ID만 넘겨주면 됩니다.
    onSubmit({ receiverId, content });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        {/* 답장일 경우, 받는 사람 닉네임만 보여주고 ID 입력창은 숨길 수 있습니다. */}
        {initialRecipientNickname ? (
          <div>
            <label>받는 사람:</label>
            <input
              type="text"
              value={receiverNickname}
              readOnly // 닉네임은 읽기 전용으로 표시
              style={{ border: 'none', background: '#f0f0f0' }}
            />
            {/* 실제 전송될 ID는 숨겨진 input으로 관리하거나, state로만 관리 */}
          </div>
        ) : (
          <div>
            <label>받는 사람 ID:</label>
            <input
              type="text"
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
              required
            />
          </div>
        )}
      </div>
      <div>
        <label>내용:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
      </div>
      <button type="submit">보내기</button>
    </form>
  );
}

export default MessageSendForm;