export function getCookie(name) {
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return m ? m[1] : ''
}

export function makeAuthHeaders() {
  const token = localStorage.getItem('accessToken') || ''
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function xsrfHeader() {
  const raw = getCookie('XSRF-TOKEN')
  if (!raw) return {}
  // 서버가 URL-encoding된 값을 쓰면 decodeURIComponent 필요
  const token = decodeURIComponent(raw)
  return { 'X-XSRF-TOKEN': token }
}