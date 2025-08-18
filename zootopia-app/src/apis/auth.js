import { data } from 'react-router-dom';
import api from './api';
import axios from 'axios';
import { makeAuthHeaders, xsrfHeader } from './utils/authHeaders'

// 회원가입
export const join = (data) => api.post(`/users`,data)

export const login = (email, password) => {
  const params = new URLSearchParams()
  params.append('email', email)
  params.append('password', password)
  return api.post('/login', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    withCredentials: true,
  })
}


export const info = () =>
  api.get('/users/info', { headers: { ...makeAuthHeaders(), ...xsrfHeader() } })

export const update = (data) =>
  api.put('/users', data, { headers: { ...makeAuthHeaders(), ...xsrfHeader() } })

export const remove = (username) =>
  api.delete(`/users/${username}`, { headers: { ...makeAuthHeaders(), ...xsrfHeader() } })


