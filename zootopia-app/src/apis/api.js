import axios from 'axios';
import Cookies from 'js-cookie'

// axios 객체 생성
// const api = axios.create({
//   baseURL: 'http://localhost:8080',
//   withCredentials: true,

// })

// 기본 URL 설정
// api.defaults.baseURL = '/api'

const api = axios.create({
  // ✅ 프록시 사용: 상대경로만 쓰세요. (절대 URL 금지)
  baseURL: '/api',
  // JWT로 헤더 인증이면 보통 쿠키를 안 쓰므로 굳이 withCredentials 필요 없음
  // 필요할 때만 true
  withCredentials: false,
})

api.interceptors.request.use((config) => {
  const jwt = Cookies.get('jwt') || localStorage.getItem('accessToken')
  if (jwt) {
    config.headers.Authorization = `Bearer ${jwt}`
  }
  return config
})

export default api
