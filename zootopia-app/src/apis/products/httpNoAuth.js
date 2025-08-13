import axios from 'axios';

// 장바구니 등 개발 환경에서 인증을 건너뛰어야 하는 요청용 전용 클라이언트
// - baseURL과 프록시는 동일하게 사용하되 Authorization 자동 부착 없음
const apiNoAuth = axios.create({
  baseURL: '/api',
  withCredentials: false,
});

export default apiNoAuth;
