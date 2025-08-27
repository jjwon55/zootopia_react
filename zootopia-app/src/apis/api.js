// src/apis/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',         // ✅ 절대 http://localhost:8080 이런 거 쓰지 말고 프록시 경로만
  withCredentials: true,   // ✅ JWT/쿠키 인증용
});

export default api;
