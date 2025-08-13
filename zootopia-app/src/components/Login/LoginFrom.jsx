import React, { useState, useEffect, useContext } from 'react';
import { LoginContext } from '../../context/LoginContextProvider';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const { login } = useContext(LoginContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberId, setRememberId] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberId(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rememberId) localStorage.setItem('savedEmail', email);
    else localStorage.removeItem('savedEmail');

    await login(email, password);
  };

  return (
    <div className="tw:min-h-screen tw:bg-[#f5f5f5]">
      <div className="tw:min-h-[calc(100vh-420px)] tw:flex tw:items-center tw:justify-center tw:p-5">
        <div className="tw:bg-white tw:border tw:border-zinc-300 tw:rounded-2xl tw:shadow-[0_4px_12px_rgba(0,0,0,0.1)] tw:p-[40px] tw:w-[500px] tw:max-w-[90vw]">
          <div className="tw:text-center">
            <h2 className="tw:text-[1.8rem] tw:font-bold tw:text-zinc-800 tw:mb-2">로그인</h2>
            <p className="tw:text-zinc-500 tw:text-[0.9rem] tw:mb-8">Zootopia에 오신 것을 환영합니다</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* 아이디 */}
            <div className="tw:mb-4 tw:mt-2">
              <div className="tw:mb-2 tw:text-sm tw:text-zinc-700">아이디</div>
              <input
                type="text"
                id="email"
                className="tw:w-full tw:rounded-lg tw:bg-zinc-100 tw:p-[14px] tw:text-[0.95rem] tw:transition-colors tw:outline-none tw:ring-0 focus:tw:bg-zinc-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
            </div>

            {/* 비밀번호 */}
            <div className="tw:mb-4 tw:mt-2">
              <div className="tw:mb-2 tw:text-sm tw:text-zinc-700">비밀번호</div>
              <input
                type="password"
                id="password"
                className="tw:w-full tw:rounded-lg tw:bg-zinc-100 tw:p-[14px] tw:text-[0.95rem] tw:transition-colors tw:outline-none tw:ring-0 focus:tw:bg-zinc-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* 체크박스 */}
            <div className="tw:flex tw:items-center tw:justify-between tw:my-5">
              <label className="tw:flex tw:items-center tw:gap-2 tw:text-[0.85rem] tw:text-zinc-600">
                <input
                  type="checkbox"
                  id="remember-id-check"
                  className="tw:w-4 tw:h-4"
                  checked={rememberId}
                  onChange={(e) => setRememberId(e.target.checked)}
                />
                아이디 저장
              </label>

              <label className="tw:flex tw:items-center tw:gap-2 tw:text-[0.85rem] tw:text-zinc-600">
                <input
                  type="checkbox"
                  name="auto-login"
                  id="remember-me-check"
                  className="tw:w-4 tw:h-4"
                  disabled
                />
                자동 로그인
              </label>
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              className="tw:w-full tw:bg-[#ff7b7b] tw:hover:bg-[#ff6666] tw:text-white tw:rounded-lg tw:py-[14px] tw:font-semibold tw:text-base tw:transition-all tw:my-5"
            >
              로그인
            </button>

            <div className="tw:text-center tw:mt-3">
              <small className="tw:text-zinc-500 tw:text-[0.85rem] tw:block tw:my-2">또는</small>
            </div>

            {/* 소셜 로그인 */}
            <div className="tw:flex tw:justify-center tw:gap-4 tw:my-6">
              <a
                href="/oauth2/authorization/kakao"
                className="tw:w-[45px] tw:h-[45px] tw:rounded-full tw:flex tw:items-center tw:justify-center tw:text-white tw:text-[1.2rem] tw:transition-transform tw:hover:scale-110 tw:bg-black/40 tw:text-zinc-200"
                aria-label="카카오 로그인"
                title="카카오 로그인"
              >
                <i className="fas fa-comment" />
              </a>

              <a
                href="/oauth2/authorization/naver"
                className="tw:w-[45px] tw:h-[45px] tw:rounded-full tw:flex tw:items-center tw:justify-center tw:text-white tw:text-[1.2rem] tw:transition-transform tw:hover:scale-110 tw:bg-[#03C75A]"
                aria-label="네이버 로그인"
                title="네이버 로그인"
              >
                <span className="tw:font-bold tw:text-[16px]">N</span>
              </a>

              <a
                href="/oauth2/authorization/facebook"
                className="tw:w-[45px] tw:h-[45px] tw:rounded-full tw:flex tw:items-center tw:justify-center tw:text-white tw:text-[1.2rem] tw:transition-transform tw:hover:scale-110 tw:bg-black/40"
                aria-label="페이스북 로그인"
                title="페이스북 로그인"
              >
                <i className="fab fa-facebook-f" />
              </a>
            </div>

            {/* 회원가입 링크 */}
            <div className="tw:text-center tw:mt-5 tw:text-[0.85rem] tw:text-zinc-600">
              아직 계정이 없으신가요?{' '}
              <a href="/join" className="tw:text-[#ff7b7b] tw:font-semibold tw:hover:underline">
                계정 만들기
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
