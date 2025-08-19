// src/apis/adminClient.js
import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "/api",          // ✅ 항상 /api부터 시작하도록
  withCredentials: true,    // ✅ JWT 쿠키 전송
});

// ✅ Authorization 헤더 자동 추가
api.interceptors.request.use((config) => {
  const token = Cookies.get("jwt");
  if (token && typeof token === "string") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
