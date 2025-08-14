import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Insert from '../../components/insurance/Insert'
import {
  uploadImage as apiUploadImage,
  registerProduct as apiRegisterProduct
} from '../../apis/insurance/insurance'
 

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

  const handleChange = (next) => setForm(next)

  // 이미지 업로드 (ADMIN 전용)
  const handleUploadImage = async (file) => {
    if (!file) return
    setError('')
    setSuccess('')
    setUploading(true)
    try {
      const data = await apiUploadImage(file)
      if (!data?.imagePath) throw new Error('이미지 경로를 받지 못했습니다.')
      setForm((prev) => ({ ...prev, imagePath: data.imagePath }))
      setSuccess('이미지 업로드 완료')
      return data.imagePath
    } catch (e) {
      if (e.message === 'NO_TOKEN') {
        setError('로그인이 필요합니다. 관리자 계정으로 다시 시도하세요.')
      } else if (e.message?.startsWith?.('HTTP 403')) {
        setError('접근 권한이 없습니다. 관리자 계정인지 확인하세요.')
      } else {
        setError(e.message || '이미지 업로드 실패')
      }
    } finally {
      setUploading(false)
    }
  }

  // 등록 (ADMIN 전용)
  const handleSubmit = async () => {
    setError('')
    setSuccess('')

    if (!form.imagePath) return setError('이미지를 먼저 등록하세요.')
    if (!form.name.trim()) return setError('상품명을 입력하세요.')
    if (!form.species) return setError('반려동물을 선택하세요.')

    setSubmitting(true)
    try {
      await apiRegisterProduct(form)
      setSuccess('등록되었습니다.')
      navigate('/insurance/list')
    } catch (e) {
      if (e.message === 'NO_TOKEN') {
        setError('관리자 로그인이 필요합니다. 로그인 후 다시 시도하세요.')
      } else if (e.message?.startsWith?.('HTTP 403')) {
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