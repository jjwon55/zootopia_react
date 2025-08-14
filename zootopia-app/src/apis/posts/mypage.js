// src/apis/mypage.js
import axios from 'axios';
import Cookies from 'js-cookie';

// ✅ axios 인스턴스
const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // 쿠키 인증 시 필수
});

// ✅ 요청마다 JWT 토큰 자동 첨부
api.interceptors.request.use((config) => {
  const token = Cookies.get('jwt');
  if (token && typeof token === 'string') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const base = '/mypage';

// ✅ 내 마이페이지 정보 조회
export const getMyPage = () => api.get(base);

// ✅ 프로필 이미지 변경 (FormData)
export const updateProfileImage = (formData) =>
  api.post(`${base}/edit/profile-image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// ✅ 닉네임 및 소개 변경
export const updateProfileInfo = (nickname, intro) =>
  api.put(`${base}/edit/profile-info`, null, {
    params: { nickname, intro },
  });

// ✅ 반려동물 정보 수정/등록
export const updatePet = (petData) =>
  api.post(`${base}/edit/pet`, petData);

// ✅ 비밀번호 변경
export const updatePassword = (currentPassword, newPassword, newPasswordCheck) =>
  api.put(`${base}/edit/password`, null, {
    params: { currentPassword, newPassword, newPasswordCheck },
  });

// ✅ 다른 사용자 마이페이지 조회
export const getUserPage = (userId) => api.get(`${base}/${userId}`);

// ✅ 회원 탈퇴
export const deleteAccount = () => api.delete(base);
