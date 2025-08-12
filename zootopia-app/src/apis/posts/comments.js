import axios from 'axios';
import Cookies from 'js-cookie';

// ✅ 공통 axios 인스턴스
const api = axios.create({
  baseURL: '/api', // vite proxy에서 /api → http://localhost:8080 로 매핑
  withCredentials: true, // 세션/쿠키 인증 시 필수
});

// ✅ 요청마다 JWT 자동 추가
api.interceptors.request.use((config) => {
  const token = Cookies.get('jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ 댓글 API
const commentBase = '/comments';

export const addComment = (postId, content) =>
  api.post(commentBase, { postId, content });

export const deleteComment = (commentId) =>
  api.delete(`${commentBase}/${commentId}`);

export const updateComment = (commentId, postId, content) =>
  api.put(`${commentBase}/${commentId}`, { commentId, postId, content });

export const replyToComment = (postId, parentId, content) =>
  api.post(`${commentBase}/reply`, { postId, parentId, content });

