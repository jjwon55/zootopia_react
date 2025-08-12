import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
// UI 전용 컴포넌트
import Insert from '../../components/insurance/Insert'

// ── 공통 fetch 헬퍼 (SPA-CSRF: XSRF-TOKEN 쿠키 → X-XSRF-TOKEN 헤더)
const getCsrf = () =>
  decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || '')

async function req(url, { method = 'GET', json, formData } = {}) {
  const headers = {}
  const init = { method, credentials: 'include' }
  const token = getCsrf()
  if (token) headers['X-XSRF-TOKEN'] = token
  if (json) {
    headers['Content-Type'] = 'application/json'
    init.body = JSON.stringify(json)
  }
  if (formData) init.body = formData // multipart는 브라우저가 헤더 자동 지정
  init.headers = headers

  const res = await fetch('/api' + url, init)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status} ${text}`)
  }
  // 업로드 응답 등은 빈 바디일 수도 있으니 안전하게 처리
  return res.headers.get('content-type')?.includes('application/json')
    ? res.json()
    : {}
}

/**
 * InsertContainer
 * - 상태/검증/네비게이션/서버통신 담당
 * - UI는 components/insurance/insert.jsx 로 전달
 */
export default function InsertContainer() {
  const navigate = useNavigate()

  // 폼 상태 (서버 DTO와 키 맞추기)
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

  // 이미지 업로드 (multipart)
  const handleUploadImage = async (file) => {
    if (!file) return
    setError('')
    setSuccess('')
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('imageFile', file)
      const data = await req('/insurance/upload-image', { method: 'POST', formData: fd })
      if (!data?.imagePath) throw new Error('이미지 경로를 받지 못했습니다.')
      setForm((prev) => ({ ...prev, imagePath: data.imagePath }))
      setSuccess('이미지 업로드 완료')
      return data.imagePath
    } catch (e) {
      setError(e.message || '이미지 업로드 실패')
      throw e
    } finally {
      setUploading(false)
    }
  }

  // 입력 변경
  const handleChange = (next) => setForm(next)

  // 등록 제출
  const handleSubmit = async () => {
    setError('')
    setSuccess('')
    // 간단 검증
    if (!form.imagePath) return setError('이미지를 먼저 등록하세요.')
    if (!form.name.trim()) return setError('상품명을 입력하세요.')
    if (!form.species) return setError('반려동물을 선택하세요.')

    setSubmitting(true)
    try {
      await req('/insurance/register', { method: 'POST', json: form })
      setSuccess('등록되었습니다.')
      navigate('/insurance/list')
    } catch (e) {
      setError(e.message || '등록 실패')
    } finally {
      setSubmitting(false)
    }
  }

  // Insert(UI) 컴포넌트에 모든 로직을 props로 전달
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