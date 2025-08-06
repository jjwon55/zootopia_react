import axios from 'axios';

// axios 객체 생성
const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,

})


// 기본 URL 설정
api.defaults.baseURL = '/api'

export default api;