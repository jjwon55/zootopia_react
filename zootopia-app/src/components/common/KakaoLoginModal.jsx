import React, { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

/**
 * 카카오 계정 로그인이 필요한 경우 표시하는 모달
 * 실제 카카오 OAuth 를 완전히 붙이지 않고 UX/흐름을 구성
 * props:
 *  - open: boolean
 *  - onClose: () => void
 *  - onLoggedIn: (kakaoUser) => void
 */
export default function KakaoLoginModal({ open, onClose, onLoggedIn }) {
  const [tab, setTab] = useState('qr'); // qr | idpw
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [fakeKakaoSession, setFakeKakaoSession] = useState(null);

  useEffect(() => {
    if (!open) return;
    // 초기화
    setTab('qr');
    setId('');
    setPw('');
    setError('');
  }, [open]);

  if (!open) return null;

  const simulateQrScan = () => {
    // 실제 OAuth: 전체 창 이동 (로그인 후 front 에서 callback 결과 처리 -> JWT 세팅) 
    // 모달 내에서 새 탭으로 열고 싶으면 window.open 사용
    window.location.href = '/auth/kakao/authorize';
  };

  const handleIdPwLogin = (e) => {
    e.preventDefault();
    setError('');
    if (!id || !pw) {
      setError('카카오 ID / 비밀번호를 입력하세요.');
      return;
    }
    // 데모: 어떤 값이든 성공
    const kakaoUser = { kakaoId: id, nickname: id + '님' };
    setFakeKakaoSession(kakaoUser);
    onLoggedIn?.(kakaoUser);
  };

  return (
    <div className="tw:fixed tw:inset-0 tw:z-[2000] tw:flex tw:items-center tw:justify-center tw:bg-black/40">
      <div className="tw:bg-white tw:rounded-xl tw:shadow-xl tw:w-full tw:max-w-md tw:p-6 tw:relative">
        <button onClick={onClose} className="tw:absolute tw:top-3 tw:right-3 tw:text-gray-400 hover:tw:text-gray-600">✕</button>
        <h2 className="tw:text-xl tw:font-bold tw:mb-4 tw:text-[#3c1e1e] tw:flex tw:items-center tw:gap-2">
          <span>💛</span> 카카오 계정 로그인
        </h2>
        {!fakeKakaoSession && (
          <div className="tw:mb-4 tw:flex tw:gap-2 tw:text-sm">
            <button onClick={() => setTab('qr')} className={`tw:flex-1 tw:py-2 tw:rounded tw:font-semibold ${tab==='qr' ? 'tw:bg-yellow-300 tw:text-gray-900' : 'tw:bg-gray-100 tw:text-gray-600'}`}>QR 로그인</button>
            <button onClick={() => setTab('idpw')} className={`tw:flex-1 tw:py-2 tw:rounded tw:font-semibold ${tab==='idpw' ? 'tw:bg-yellow-300 tw:text-gray-900' : 'tw:bg-gray-100 tw:text-gray-600'}`}>ID/PW 로그인</button>
          </div>
        )}

        {!fakeKakaoSession && tab === 'qr' && (
          <div className="tw:flex tw:flex-col tw:items-center tw:gap-4 tw:text-center">
            <QRCodeCanvas value={window.location.origin + '/kakao-auth-demo'} size={180} includeMargin={true} bgColor="#ffffff" fgColor="#3c1e1e" />
            <div className="tw:text-sm tw:text-gray-600 tw:leading-relaxed">
              휴대폰 카카오톡에서 <strong>QR코드</strong>로 카카오 로그인<br/>또는 아래 버튼으로 계정 로그인 페이지로 이동하세요.
            </div>
            <button onClick={simulateQrScan} className="tw:px-5 tw:py-2 tw:bg-yellow-400 hover:tw:bg-yellow-500 tw:rounded tw:font-semibold tw:text-gray-900 tw:shadow-sm">
              카카오 계정으로 로그인
            </button>
          </div>
        )}

        {!fakeKakaoSession && tab === 'idpw' && (
          <div className="tw:space-y-4 tw:text-sm tw:text-gray-600 tw:text-center">
            <p>이 탭은 더 이상 사용하지 않습니다. 위의 '카카오 계정으로 로그인' 버튼을 사용하세요.</p>
            <button onClick={simulateQrScan} className="tw:px-5 tw:py-2 tw:bg-yellow-400 hover:tw:bg-yellow-500 tw:rounded tw:font-semibold tw:text-gray-900 tw:shadow-sm">카카오 로그인 페이지 이동</button>
          </div>
        )}

        {fakeKakaoSession && (
          <div className="tw:text-center tw:space-y-4">
            <div className="tw:text-green-600 tw:font-semibold">카카오 로그인 완료</div>
            <div className="tw:text-sm tw:text-gray-600">결제를 계속 진행해주세요.</div>
            <button onClick={onClose} className="tw:px-4 tw:py-2 tw:bg-[#FF9999] hover:tw:bg-[#FF8C8C] tw:text-white tw:rounded tw:font-semibold">닫기</button>
          </div>
        )}
      </div>
    </div>
  );
}
