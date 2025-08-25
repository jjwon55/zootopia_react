import axios from 'axios';
import Cookies from 'js-cookie';

// 1. 프로젝트의 유일한 API 인스턴스를 여기서 생성하고 설정합니다.
const api = axios.create({
  baseURL: 'http://localhost:8080', // 서버 주소를 명확히 적어주는 것이 좋습니다.
  withCredentials: true,
});

// 2. 모든 요청에 토큰을 자동으로 주입하는 인터셉터를 설정합니다.
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. 설정이 완료된 인스턴스를 내보냅니다.
export default api;
