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
    <form onSubmit={handleSubmit} className='tw:flex tw:flex-col tw:justify-center tw:items-center tw:gap-3.5'>
      <div className=''>
        {/* 답장일 경우, 받는 사람 닉네임만 보여주고 ID 입력창은 숨길 수 있습니다. */}
        {initialRecipientNickname ? (
          <div className='tw:flex tw:justify-start tw:gap-4'>
            <label>받는 사람:</label>
            <input
              type="text"
              value={receiverNickname}
              readOnly // 닉네임은 읽기 전용으로 표시
              className='tw:text-center tw:border-1 tw:border-[#d8d8d8] tw:rounded-md tw:w-[200px]'
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
      <div className='tw:flex tw:gap-4'>
        {/* <label>내용:</label> */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className='tw:p-2 tw:border-1 tw:border-[#cfcfcf] tw:rounded-md tw:w-[450px]'
          rows={5}
          placeholder='보낼 메시지를 입력하세요.'
        ></textarea>
      </div>
      <button className='tw:bg-[#ff8181] tw:rounded-2xl tw:text-white tw:w-[400px] tw:justify-center' type="submit">보내기</button>
    </form>
  );
}

export default MessageSendForm;