import axios from 'axios'

const authApi = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

// ▶ accessToken만 사용 (세션 → 로컬 순)
const getBearer = () => {
  const raw =
    sessionStorage.getItem('accessToken') ||
    localStorage.getItem('accessToken') ||
    ''
  return raw ? (raw.startsWith('Bearer ') ? raw : `Bearer ${raw}`) : ''
}

// ▶ 쿠키에서 XSRF 추출
const getXsrf = () => {
  const m = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/)
  return m ? decodeURIComponent(m[1]) : ''
}

authApi.interceptors.request.use((config) => {
  config.headers = config.headers ?? {}

  const bearer = getBearer()
  if (bearer) config.headers['Authorization'] = bearer

  const xsrf = getXsrf()
  if (xsrf) config.headers['X-XSRF-TOKEN'] = xsrf

  return config
})

// (선택) /login 응답에 token 있으면 자동 저장
authApi.interceptors.response.use((res) => {
  if (res.config?.url?.endsWith('/login') && res.data?.token) {
    try {
      sessionStorage.setItem('accessToken', res.data.token)
      localStorage.setItem('accessToken', res.data.token)
    } catch {}
  }
  return res
})

export default authApi