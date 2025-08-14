import React, { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginContext } from '../../context/LoginContextProvider';
import * as Swal from '../../apis/alert';

const OAuth2Callback = () => {
  const { loginSetting } = useContext(LoginContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userJson = params.get('user');

    if (token && userJson) {
      try {
        const userInfo = JSON.parse(decodeURIComponent(userJson));
        // Assuming loginSetting can handle setting user info and token
        loginSetting(`Bearer ${token}`, userInfo);
        Swal.alert('로그인 성공', '메인 화면으로 이동합니다.', 'success', () => navigate('/'));
      } catch (error) {
        console.error('Error parsing user info or setting login:', error);
        Swal.alert('로그인 실패', '사용자 정보를 처리하는 중 오류가 발생했습니다.', 'error');
        navigate('/login'); // Redirect to login page on error
      }
    } else {
      Swal.alert('로그인 실패', '인증 정보가 누락되었습니다.', 'error');
      navigate('/login'); // Redirect to login page if no token/user
    }
  }, [location, loginSetting, navigate]);

  return (
    <div>
      <p>소셜 로그인 처리 중...</p>
    </div>
  );
};

export default OAuth2Callback;