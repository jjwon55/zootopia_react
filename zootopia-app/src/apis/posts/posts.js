import axios from 'axios';
import Cookies from 'js-cookie';  

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // ✅ 쿠키 전송 필수
});


// ✅ 요청마다 Authorization 헤더 자동 추가
api.interceptors.request.use((config) => {
  const token = Cookies.get('jwt'); // ✅ localStorage 대신 쿠키에서 읽기

  if (token && typeof token === 'string') {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
const base = '/posts';

export const list = (params) => api.get(base, { params });
export const read = (id) => api.get(`${base}/${id}`);
export const create = (data) => api.post(base, data);
export const update = (id, data) => api.put(`${base}/${id}`, data);
export const remove = (id) => api.delete(`${base}/${id}`);
export const toggleLike = (postId) =>
  api.post(`/posts/${postId}/like`, null, { withCredentials: true });
