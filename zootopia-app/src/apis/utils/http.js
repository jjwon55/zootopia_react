import { xsrfHeader } from './authHeaders'

const getBearer = () => {
  const raw =
    sessionStorage.getItem('accessToken') ||
    localStorage.getItem('accessToken')
  return raw ? (raw.startsWith('Bearer ') ? raw : `Bearer ${raw}`) : ''
}

export default async function req(path, { method = 'GET', json, formData, headers } = {}) {
  const h = { ...(headers || {}), ...xsrfHeader() }
  const bearer = getBearer()
  if (bearer) h['Authorization'] = bearer

  const init = { method, credentials: 'include', headers: h }
  if (json) {
    h['Content-Type'] = 'application/json'
    init.body = JSON.stringify(json)
  } else if (formData) {
    init.body = formData // Content-Type 자동
  }

  const res = await fetch('/api' + path, init)
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(body || `HTTP ${res.status}`)
  }
  return res.headers.get('content-type')?.includes('application/json')
    ? res.json()
    : {}
}