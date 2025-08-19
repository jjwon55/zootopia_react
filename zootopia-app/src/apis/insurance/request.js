export default async function req(path, options = {}) {
  const { method = 'GET', json, formData, headers } = options
  const h = { ...(headers || {}) }           // ✅ 넘겨준 헤더를 그대로 사용(합쳐짐)
  const init = { method, credentials: 'include', headers: h }

  if (json) {
    h['Content-Type'] = 'application/json'
    init.body = JSON.stringify(json)
  }
  if (formData) {
    // ⚠️ FormData일 땐 Content-Type 지정 X (브라우저가 boundary 붙여줌)
    init.body = formData
  }

  const res = await fetch('/api' + path, init)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `HTTP ${res.status}`)
  }
  return res.json().catch(() => ({}))
}