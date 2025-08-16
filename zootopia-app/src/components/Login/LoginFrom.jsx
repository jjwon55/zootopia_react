import React, { useState, useEffect, useContext } from 'react';
import { LoginContext } from '../../context/LoginContextProvider';
import { useNavigate } from 'react-router-dom';
import '../../components/Login/LoginForm.css';

const LoginForm = () => {
  const { login } = useContext(LoginContext); // ✅ context 직접 접근
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
    if (rememberId) {
      localStorage.setItem('savedEmail', email);
    } else {
      localStorage.removeItem('savedEmail');
    }

    await login(email, password);
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-container">
          <div className="text-center">
            <h2 className="login-title">로그인</h2>
            <p className="login-subtitle">Zootopia에 오신 것을 환영합니다</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="input-label">아이디</div>
              <input
                type="text"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
            </div>
            <div className="input-group">
              <div className="input-label">비밀번호</div>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-check-container">
              <div className="form-check-item">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="remember-id-check"
                  checked={rememberId}
                  onChange={(e) => setRememberId(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="remember-id-check">
                  아이디 저장
                </label>
              </div>
              <div className="form-check-item">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="auto-login"
                  id="remember-me-check"
                  disabled
                />
                <label className="form-check-label" htmlFor="remember-me-check">
                  자동 로그인
                </label>
              </div>
            </div>

            <button className="btn btn-primary btn-login" type="submit">
              로그인
            </button>

            <div className="text-center mt-3">
              <small>또는</small>
            </div>

            <div className="social-login">
              <a href="/api/oauth2/authorization/kakao" className="social-btn kakao">
                <i className="fas fa-comment"></i>
              </a>
              <a href="/api/oauth2/authorization/naver" className="social-btn naver">
                <span style={{ fontWeight: 'bold', fontSize: '20px' }}>N</span>
              </a>
              <a href="/api/oauth2/authorization/google" className="social-btn google">
                <i className="fab fa-google-f"></i>
              </a>
            </div>

            <div className="register-link">
              아직 계정이 없으신가요? <a href="/join">계정 만들기</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
