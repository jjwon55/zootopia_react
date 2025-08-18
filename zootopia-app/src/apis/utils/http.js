export const getCsrf = () =>
  decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || '')

export const setAccessToken = (t) => {
  sessionStorage.setItem('accessToken', t)   // 세션 우선
  localStorage.setItem('accessToken', t)     // 선택: 동기화
}

export const clearAccessToken = () => {
  sessionStorage.removeItem('accessToken')
  localStorage.removeItem('accessToken')
  // ❌ 아래 두 키는 더 이상 사용하지 않지만 혹시 남아있다면 제거
  sessionStorage.removeItem('Authorization')
  localStorage.removeItem('Authorization')
}

// ✅ 오직 accessToken만 읽기 (세션 → 로컬)
const getBearer = () => {
  const raw =
    sessionStorage.getItem('accessToken') ||
    localStorage.getItem('accessToken')
  return raw ? (raw.startsWith('Bearer ') ? raw : `Bearer ${raw}`) : ''
}

export async function req(url, { method = 'GET', json, formData } = {}) {
  const headers = {}
  const init = { method, credentials: 'include' }

  const xsrf = getCsrf()
  if (xsrf) headers['X-XSRF-TOKEN'] = xsrf

  if (json) {
    headers['Content-Type'] = 'application/json'
    init.body = JSON.stringify(json)
  }
  if (formData) {
    init.body = formData
  }

  const bearer = getBearer()
  if (bearer) headers['Authorization'] = bearer

  init.headers = headers

  // 디버그: 실제로 붙는 토큰의 payload 확인
  try {
    const tok = (headers['Authorization'] || '').replace(/^Bearer\s+/, '')
    const payload = JSON.parse(atob(tok.split('.')[1] || ''))
    console.debug('[req]', method, url, { email: payload?.email, roles: payload?.rol || payload?.roles })
  } catch {}

  const res = await fetch('/api' + url, init)
  if (!res.ok) {
    let msg = `HTTP ${res.status}`
    try {
      const body = await res.json()
      if (body?.message) msg += ` - ${body.message}`
    } catch {}
    throw new Error(msg)
  }
  const ct = res.headers.get('content-type') || ''
  return ct.includes('application/json') ? res.json() : {}
}