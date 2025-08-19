import React from 'react';
import { createContext, useEffect, useState, useContext } from 'react';
import api from '../apis/api';
import * as auth from '../apis/auth';
import * as Swal from '../apis/posts/alert';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

// 📦 컨텍스트 생성
export const LoginContext = createContext();
export const useLoginContext = () => useContext(LoginContext);

const LoginContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(() => localStorage.getItem('isLogin') === 'true');
  const [userInfo, setUserInfo] = useState(() => JSON.parse(localStorage.getItem('userInfo') || 'null'));
  const [roles, setRoles] = useState(() =>
    JSON.parse(localStorage.getItem('roles') || '{"isUser": false, "isAdmin": false}')
  );

  const navigate = useNavigate();

  // 🔐 로그인 함수 (에러 덮어쓰기/알림/내부 네비게이션 제거, 원본 에러 그대로 throw)
  const login = async (email, password) => {
    const response = await auth.login(email, password); // 실패 시 Axios 에러가 그대로 throw
    const jwt = response?.data?.token;
    if (!jwt) throw new Error('JWT 없음');

    Cookies.set('jwt', jwt);
    await loginSetting(`Bearer ${jwt}`);
    // 성공 알림/라우팅은 호출하는 컴포넌트에서 처리 (관심사 분리)
    return response;
  };

  // JWT로 사용자 정보 조회 후 로그인 세팅
  const loginSetting = async (authorization) => {
    try {
      const jwt = authorization.replace('Bearer ', '');
      Cookies.set('jwt', jwt);
      // ✅ API 헤더에도 설정(로그아웃 시 제거와 대칭)
      api.defaults.headers.common.Authorization = `Bearer ${jwt}`;

      const response = await auth.info();
      const data = response.data;

      setIsLogin(true);
      setUserInfo(data);
      localStorage.setItem('isLogin', 'true');
      localStorage.setItem('userInfo', JSON.stringify(data));

      // 권한 설정
      const updateRoles = { isUser: false, isAdmin: false };
      if (Array.isArray(data.authList)) {
        data.authList.forEach((obj) => {
          if (obj.auth === 'ROLE_USER') updateRoles.isUser = true;
          if (obj.auth === 'ROLE_ADMIN') updateRoles.isAdmin = true;
        });
      }
      setRoles(updateRoles);
      localStorage.setItem('roles', JSON.stringify(updateRoles));
    } catch (err) {
      console.error('자동 로그인 실패 또는 JWT 인증 실패:', err);
      logout(true); // 강제 로그아웃
    }
  };

  // 🍪 JWT 쿠키 기반 자동 로그인
  const autoLogin = async () => {
    const jwt = Cookies.get('jwt');
    if (!jwt) return;

    const authorization = `Bearer ${jwt}`;
    await loginSetting(authorization);
  };

  // 로그아웃
  const logout = (force = false) => {
    if (force) {
      logoutSetting();
      navigate('/');
      return;
    }

    Swal.confirm('로그아웃 하시겠습니까?', '로그아웃을 진행합니다.', 'warning', (result) => {
      if (result.isConfirmed) {
        Swal.alert('로그아웃 완료', '정상적으로 로그아웃 되었습니다.', 'success');
        logoutSetting();
        navigate('/');
      }
    });
  };

  const logoutSetting = () => {
    delete api.defaults.headers.common.Authorization;
    setIsLogin(false);
    setUserInfo(null);
    setRoles({ isUser: false, isAdmin: false });
    localStorage.removeItem('isLogin');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('roles');
    Cookies.remove('jwt');
  };

  useEffect(() => {
    if (!localStorage.getItem('isLogin')) {
      autoLogin();
    }
    setIsLoading(false);
  }, []);

  return (
    <LoginContext.Provider
      value={{ isLogin, login, userInfo, roles, isLoading, logout, loginSetting }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContextProvider;
