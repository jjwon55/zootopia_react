import React, { useState, useEffect, useContext } from 'react';
import { LoginContext } from '../../context/LoginContextProvider';
import { useNavigate } from 'react-router-dom';
import styles from './LoginForm.module.css';
import * as Swal from '../../apis/posts/alert';

const LoginForm = () => {
  const { login } = useContext(LoginContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberId, setRememberId] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);   // ⬅️ 추가
  const [loading, setLoading] = useState(false);

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

    try {
      setLoading(true);
      await login(email, password, { rememberMe }); // ⬅️ 옵션 전달

      Swal.alert('로그인 성공', '메인 화면으로 이동합니다.', 'success', () => navigate('/'));
    } catch (err) {
      const status = err?.response?.status;
      const serverMsg = err?.response?.data?.error;

      if (status === 403) {
        Swal.alert('로그인 실패', serverMsg || '정지된 계정입니다.', 'error');
      } else if (status === 401) {
        Swal.alert('로그인 실패', serverMsg || '아이디 또는 비밀번호가 일치하지 않습니다.', 'error');
      } else {
        Swal.alert('로그인 실패', serverMsg || '로그인에 실패했습니다.', 'error');
      }
    } finally {
      setLoading(false);
    }
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
                className="tw:w-full tw:rounded-lg tw:bg-zinc-100 tw:p-[14px] tw:text-[0.95rem] focus:tw:bg-zinc-200 tw:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                disabled={loading}
              />
            </div>

            {/* 비밀번호 */}
            <div className="tw:mb-4 tw:mt-2">
              <div className="tw:mb-2 tw:text-sm tw:text-zinc-700">비밀번호</div>
              <input
                type="password"
                id="password"
                className="tw:w-full tw:rounded-lg tw:bg-zinc-100 tw:p-[14px] tw:text-[0.95rem] focus:tw:bg-zinc-200 tw:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
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
                  disabled={loading}
                />
                아이디 저장
              </label>

              <label className="tw:flex tw:items-center tw:gap-2 tw:text-[0.85rem] tw:text-zinc-600">
                <input
                  type="checkbox"
                  name="auto-login"
                  id="remember-me-check"
                  className="tw:w-4 tw:h-4"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}  // ⬅️ 활성화
                  disabled={loading}
                />
                자동 로그인
              </label>
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              className="tw:w-full tw:bg-[#ff7b7b] tw:hover:bg-[#ff6666] tw:text-white tw:rounded-lg tw:py-[14px] tw:font-semibold tw:text-base tw:transition-all tw:my-5 disabled:tw:opacity-60"
              disabled={loading}
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>

            <div className="tw:text-center tw:mt-3">
              <small className="tw:text-zinc-500 tw:text-[0.85rem] tw:block tw:my-2">또는</small>
            </div>

            <div className={styles.socialLogin}>
              <a href="/api/oauth2/authorization/kakao" className={`${styles.socialBtn} ${styles.kakao}`}>
                <i className="fas fa-comment"></i>
              </a>
              <a href="/api/oauth2/authorization/naver" className={`${styles.socialBtn} ${styles.naver}`}>
                <span style={{ fontWeight: '900', fontSize: '20px', textShadow: '0 0 1px #fff, 0 0 2px #fff' }}></span>
              </a>
              <a href="/api/oauth2/authorization/google" className={`${styles.socialBtn} ${styles.google}`}>
                <i className="fab fa-google-f"></i>
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
