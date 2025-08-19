import { data } from 'react-router-dom';
import api from './api';
import axios from 'axios';

// 회원가입
export const join = (data) => api.post(`/users`,data)

export const login = (email, password) => {
  const params = new URLSearchParams();
  params.append('email', email);
  params.append('password', password);

  return axios.post('/api/login', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    withCredentials: true
  });
};



// 회원 정보
export const info = () => api.get(`/users/info`)

//회원 정보 수정
export const update = (data) => api.put(`/users`, data)

// 회원 탈퇴

export const remove = (username) => api.delete(`/users/${username}`)


