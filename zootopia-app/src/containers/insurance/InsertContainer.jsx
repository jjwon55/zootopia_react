import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Insert from '../../components/insurance/Insert'

// ── CSRF 헬퍼
const getCsrf = () =>
  decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || '')

// ── 공통 요청 헬퍼 (Authorization 자동 부착 옵션 지원)
async function req(url, { method = 'GET', json, formData, auth = false } = {}) {
  const headers = {}
  const init = { method, credentials: 'include' }

  const xsrf = getCsrf()
  if (xsrf) headers['X-XSRF-TOKEN'] = xsrf

  if (json) {
    headers['Content-Type'] = 'application/json'
    init.body = JSON.stringify(json)
  }
  if (formData) {
    init.body = formData // multipart는 브라우저가 자동 처리
  }

  // 🔐 보호된 API면 Authorization 추가
   if (auth) {
     // 1) accessToken(순수 JWT) 우선
     let raw =
       localStorage.getItem('accessToken') ||
       sessionStorage.getItem('accessToken') ||
       // 2) Authorization 저장돼 있으면 Bearer 제거 후 사용
       (localStorage.getItem('Authorization') || sessionStorage.getItem('Authorization'))?.replace(/^Bearer\s+/,'') ||
       null;
  
     if (!raw) throw new Error('NO_TOKEN');
     if ((raw.match(/\./g) || []).length !== 2) {
       // 잘못 저장된 값이면 사용 금지
       throw new Error('INVALID_TOKEN_FORMAT');
     }
     headers['Authorization'] = `Bearer ${raw}`;
   }

  init.headers = headers

  // 개발 중 로그(앞부분만)
  if (import.meta.env?.DEV) {
    console.log('[REQ]', method, url, {
      Authorization: headers.Authorization ? headers.Authorization.slice(0, 16) + '…' : '(none)',
    })
  }

  const res = await fetch('/api' + url, init)
  if (!res.ok) {
    let msg = `HTTP ${res.status}`
    try {
      const b = await res.json()
      if (b?.message) msg += ` - ${b.message}`
    } catch {}
    throw new Error(msg)
  }
  return res.headers.get('content-type')?.includes('application/json') ? res.json() : {}
}

export default function InsertContainer() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    imagePath: '',
    name: '',
    slogan: '',
    coveragePercent: '',
    monthlyFeeRange: '',
    maxCoverage: '',
    species: '',
    joinCondition: '',
    coverageItems: '',
    precautions: '',
  })

  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // 이미지 업로드 (ADMIN 전용 → auth:true)
  const handleUploadImage = async (file) => {
    if (!file) return
    setError('')
    setSuccess('')
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('imageFile', file) // 서버 @RequestParam("imageFile") 와 일치
      const data = await req('/insurance/upload-image', {
        method: 'POST',
        formData: fd,
        auth: true,                // ✅ FIX: Authorization 자동 부착
      })
      if (!data?.imagePath) throw new Error('이미지 경로를 받지 못했습니다.')
      setForm((prev) => ({ ...prev, imagePath: data.imagePath }))
      setSuccess('이미지 업로드 완료')
      return data.imagePath
    } catch (e) {
      if (e.message === 'NO_TOKEN') alert('로그인 필요');
      else if (e.message === 'INVALID_TOKEN_FORMAT') {
        alert('토큰이 잘못 저장되어 재로그인이 필요합니다.');
        localStorage.removeItem('Authorization');
        localStorage.removeItem('accessToken');
      } else if (e.message.startsWith('HTTP 403')) alert('권한 없음');
      else alert('요청 실패');
    }
  }

  const handleChange = (next) => setForm(next)

  // 등록 (ADMIN 전용 → auth:true)
  const handleSubmit = async () => {
    setError('')
    setSuccess('')

    if (!form.imagePath) return setError('이미지를 먼저 등록하세요.')
    if (!form.name.trim()) return setError('상품명을 입력하세요.')
    if (!form.species) return setError('반려동물을 선택하세요.')

    setSubmitting(true)
    try {
      await req('/insurance/register', {
        method: 'POST',
        json: form,
        auth: true,               // ✅ FIX: Authorization 자동 부착
      })
      setSuccess('등록되었습니다.')
      navigate('/insurance/list')
    } catch (e) {
      if (e.message === 'NO_TOKEN') {
        setError('관리자 로그인이 필요합니다. 로그인 후 다시 시도하세요.')
      } else if (e.message.startsWith('HTTP 403')) {
        setError('접근 권한이 없습니다. 관리자 계정인지 확인하세요.')
      } else {
        setError(e.message || '등록 실패')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Insert
      form={form}
      onChange={handleChange}
      onUploadImage={handleUploadImage}
      onSubmit={handleSubmit}
      uploading={uploading}
      submitting={submitting}
      error={error}
      success={success}
    />
  )
}