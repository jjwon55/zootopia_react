import axios from 'axios';
import Cookies from 'js-cookie';
import api from '../api';

const API_BASE_URL = '/messages';


// axios 인터셉터 설정: 모든 요청에 JWT 토큰을 포함
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('jwt'); // 로그인 시 저장된 토큰 이름 확인
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// 쪽지 보내기
export const sendMessage = async (messageData) => {
  try {
    const response = await api.post(`${API_BASE_URL}/send`, messageData);
    return response.data;
  } catch (error) {
    console.error('쪽지 보내기 실패:', error);
    throw error;
  }
};

// 받은 쪽지 목록 조회
export const getReceivedMessages = async () => {
  try {
    const response = await api.get(`${API_BASE_URL}/received`);
    return response.data;
  } catch (error) {
    console.error('받은 쪽지 목록 조회 실패:', error);
    throw error;
  }
};

// 보낸 쪽지 목록 조회
export const getSentMessages = async () => {
  try {
    const response = await api.get(`${API_BASE_URL}/sent`);
    return response.data;
  } catch (error) {
    console.error('보낸 쪽지 목록 조회 실패:', error);
    throw error;
  }
};

// 특정 쪽지 상세 조회
export const getMessageDetails = async (messageNo) => {
  try {
    const response = await api.get(`${API_BASE_URL}/${messageNo}`);
    return response.data;
  } catch (error) {
    console.error('쪽지 상세 조회 실패:', error);
    throw error;
  }
};

// 특정 쪽지 삭제
export const deleteMessage = async (messageNo) => {
  try {
    const response = await api.delete(`${API_BASE_URL}/${messageNo}`);
    return response.data;
  } catch (error) {
    console.error('쪽지 삭제 실패:', error);
    throw error;
  }
};

// 안 읽은 쪽지 개수 조회
export const getUnreadMessageCount = async () => {
  try {
    const response = await api.get(`${API_BASE_URL}/unread-count`);
    return response.data;
  } catch (error) {
    console.error('안 읽은 쪽지 개수 조회 실패:', error);
    // 개수 조회 실패 시 0을 반환하여 앱이 멈추지 않게 함
    return 0;
  }
};