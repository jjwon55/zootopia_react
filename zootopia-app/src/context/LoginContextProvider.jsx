import React, { createContext, useEffect, useState, useContext } from 'react';
import api from '../apis/api';
import * as auth from '../apis/auth';
import * as Swal from '../apis/posts/alert';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

// ... import 동일
export const LoginContext = createContext();
export const useLoginContext = () => useContext(LoginContext);

const LoginContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [roles, setRoles] = useState({ isUser: false, isAdmin: false });
  const navigate = useNavigate();

  const applyUser = (data) => {
    setIsLogin(true);
    setUserInfo(data);
    const r = { isUser: false, isAdmin: false };
    if (Array.isArray(data.authList)) {
      for (const obj of data.authList) {
        if (obj.auth === 'ROLE_USER') r.isUser = true;
        if (obj.auth === 'ROLE_ADMIN') r.isAdmin = true;
      }
    }
    setRoles(r);
  };

  const clearUser = () => {
    setIsLogin(false);
    setUserInfo(null);
    setRoles({ isUser: false, isAdmin: false });
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem('isLogin');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('roles');
  };

  // ⬇️ 로그인 함수: rememberMe 옵션 지원
  const login = async (email, password, { rememberMe = false } = {}) => {
    const response = await auth.login(email, password);
    const jwt = response?.data?.token;
    if (!jwt) throw new Error('JWT 없음');

    await loginSetting(`Bearer ${jwt}`, { rememberMe });
    return response;
  };

  // ⬇️ 토큰 세팅 + 유저조회. rememberMe에 따라 쿠키 보존 기간 결정
  const loginSetting = async (authorization, { rememberMe = false } = {}) => {
    try {
      const jwt = authorization.replace('Bearer ', '');
      api.defaults.headers.common.Authorization = `Bearer ${jwt}`;

      // rememberMe=true → 영속(예: 14일), false → 세션 쿠키
      const cookieOpts = { path: '/', sameSite: 'lax' };
      if (rememberMe) {
        // 프로덕션(https)에서는 secure: true 권장
        Cookies.set('jwt', jwt, { ...cookieOpts, expires: 14 /* days */ });
      } else {
        Cookies.set('jwt', jwt, cookieOpts); // 세션 쿠키
      }

      const { data } = await auth.info();
      applyUser(data);

      // (선택) rememberMe일 때만 로컬 저장
      if (rememberMe) {
        localStorage.setItem('isLogin', 'true');
        localStorage.setItem('userInfo', JSON.stringify(data));
        localStorage.setItem('roles', JSON.stringify(roles));
      } else {
        localStorage.removeItem('isLogin');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('roles');
      }
    } catch (err) {
      console.error('자동 로그인 실패 또는 JWT 인증 실패:', err);
      logout(true);
    }
  };

  const autoLogin = async () => {
    const jwt = Cookies.get('jwt');
    if (!jwt) { clearUser(); return; }
    try {
      api.defaults.headers.common.Authorization = `Bearer ${jwt}`;
      const { data } = await auth.info();
      applyUser(data);
    } catch {
      await logout(true);
    }
  };

  const logoutSetting = () => {
    clearUser();
    Cookies.remove('jwt', { path: '/' }); // set 시 사용한 path와 동일해야 확실히 삭제
  };

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

  useEffect(() => {
    (async () => {
      try {
        await autoLogin(); // 쿠키 있으면 자동로그인
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <LoginContext.Provider value={{ isLogin, login, userInfo, roles, isLoading, logout, loginSetting }}>
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContextProvider;
