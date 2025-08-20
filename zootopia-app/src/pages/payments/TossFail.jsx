import React from 'react';

export default function TossFail() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const message = params.get('message');
  return (
    <div style={{padding:40}}>
      <h2>결제 실패 / 취소</h2>
      <p>에러코드: {code}</p>
      <p>사유: {message}</p>
      <a href="/checkout">다시 결제 시도</a>
    </div>
  );
}
