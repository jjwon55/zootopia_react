// apis/authApi.js
import axios from 'axios'

const authApi = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

authApi.interceptors.request.use((config) => {
  let raw =
    sessionStorage.getItem('accessToken') ||
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('Authorization') ||
    localStorage.getItem('Authorization')

  if (raw) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = raw.startsWith('Bearer ') ? raw : `Bearer ${raw}`
  }

  const m = document.cookie.match(/XSRF-TOKEN=([^;]+)/)
  if (m) {
    config.headers = config.headers ?? {}
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(m[1])
  }

  return config
})

export default authApi