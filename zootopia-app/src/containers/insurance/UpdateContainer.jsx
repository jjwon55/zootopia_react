import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Update from '../../components/insurance/update'

// ── 공통 fetch 헬퍼 (SPA-CSRF: XSRF-TOKEN 쿠키 → X-XSRF-TOKEN 헤더)
const getCsrf = () =>
  decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || '')

async function req(url, { method = 'GET', json, formData } = {}) {
  const headers = {}
  const init = { method, credentials: 'include' }
  const token = getCsrf()
  if (token) headers['X-XSRF-TOKEN'] = token
  if (json) { headers['Content-Type'] = 'application/json'; init.body = JSON.stringify(json) }
  if (formData) { init.body = formData } // multipart 헤더는 브라우저가 세팅
  init.headers = headers

  const res = await fetch('/api' + url, init)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status} ${text}`)
  }
  return res.headers.get('content-type')?.includes('application/json')
    ? res.json()
    : {}
}

const emptyForm = () => ({
  productId: '',
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

export default function UpdateContainer() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // 상세 로드
  const load = useCallback(async () => {
    setLoading(true); setError(''); setSuccess('')
    try {
      const data = await req(`/insurance/read/${id}`)
      const p = data?.product
      if (!p) throw new Error('상품을 찾을 수 없습니다.')
      setForm({
        ...emptyForm(),
        ...p,
      })
    } catch (e) {
      setError(e.message || '상세 조회 실패')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { load() }, [load])

  // 이미지 업로드
  const handleUploadImage = async (file) => {
    if (!file) return
    setUploading(true); setError(''); setSuccess('')
    try {
      const fd = new FormData()
      fd.append('imageFile', file)
      const data = await req('/insurance/upload-image', { method: 'POST', formData: fd })
      if (!data?.imagePath) throw new Error('이미지 경로를 받지 못했습니다.')
      setForm(prev => ({ ...prev, imagePath: data.imagePath }))
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
  const handleChange = (next) => {
    setForm(next)
    setError(''); setSuccess('')
  }

  // 수정 제출
  const handleSubmit = async () => {
    if (!form) return
    setError(''); setSuccess('')
    // 간단 검증
    if (!form.imagePath) return setError('이미지를 먼저 등록하세요.')
    if (!form.name?.trim()) return setError('상품명을 입력하세요.')
    if (!form.species) return setError('반려동물을 선택하세요.')

    setSubmitting(true)
    try {
      await req('/insurance/update', { method: 'POST', json: form })
      setSuccess('수정되었습니다.')
      navigate(`/insurance/read/${form.productId || id}`)
    } catch (e) {
      setError(e.message || '수정 실패')
    } finally {
      setSubmitting(false)
    }
  }

  // 삭제
  const handleDelete = async () => {
    setRemoving(true); setError(''); setSuccess('')
    try {
      await req(`/insurance/delete/${id}`, { method: 'POST' })
      setSuccess('삭제되었습니다.')
      navigate('/insurance/list')
    } catch (e) {
      setError(e.message || '삭제 실패')
    } finally {
      setRemoving(false)
    }
  }

  return (
    <Update
      form={form}
      loading={loading}
      uploading={uploading}
      submitting={submitting}
      removing={removing}
      error={error}
      success={success}
      onChange={handleChange}
      onUploadImage={handleUploadImage}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      reload={load}
    />
  )
}