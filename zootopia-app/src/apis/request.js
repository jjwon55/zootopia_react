export default async function req(url, { method='GET', json, formData, auth=false } = {}) {
  const headers = {};
  const init = { method, credentials: 'include' };

  // XSRF (있으면)
  const m = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  if (m) headers['X-XSRF-TOKEN'] = decodeURIComponent(m[1]);

  if (json) {
    headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(json);
  }
  if (formData) {
    init.body = formData; // multipart는 브라우저가 헤더 자동 설정
  }

  // 🔐 관리자/보호된 API일 때만 Authorization 부착
  if (auth) {
    let token =
      localStorage.getItem('Authorization') ||
      sessionStorage.getItem('Authorization') ||
      localStorage.getItem('accessToken') ||
      sessionStorage.getItem('accessToken');
    if (!token) throw new Error('NO_TOKEN');
    if (!token.startsWith('Bearer ')) token = `Bearer ${token}`;
    headers['Authorization'] = token;
  }

  init.headers = headers;

  const res = await fetch('/api' + url, init);
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { const b = await res.json(); if (b?.message) msg += ` - ${b.message}`; } catch {}
    throw new Error(msg);
  }
  return res.headers.get('content-type')?.includes('application/json') ? res.json() : {};
}