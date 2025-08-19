import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Update from '../../components/insurance/Update'

// ✅ axios 인스턴스를 쓰는 함수들만 사용
import {
  readProduct as apiReadProduct,
  uploadImage as apiUploadImage,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct,
} from '../../apis/insurance/insurance'  

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
  const navigate = useNavigate()
  const params = useParams()
  const id = params.id ?? params.productId

  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const load = useCallback(async () => {
    setLoading(true); setError(''); setSuccess('')
    try {
      const { data } = await apiReadProduct(id)
      const p = data?.product
      if (!p) throw new Error('상품을 찾을 수 없습니다.')
      setForm({ ...emptyForm(), ...p })
    } catch (e) {
      setError(e.message || '상세 조회 실패')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { load() }, [load])

  const handleUploadImage = async (file) => {
    if (!file) return
    setUploading(true); setError(''); setSuccess('')
    try {
      const data = await apiUploadImage(file) // { imagePath }
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

  const handleChange = (next) => { setForm(next); setError(''); setSuccess('') }

  const handleSubmit = async () => {
    if (!form) return
    setError(''); setSuccess('')
    if (!form.imagePath) return setError('이미지를 먼저 등록하세요.')
    if (!form.name?.trim()) return setError('상품명을 입력하세요.')
    if (!form.species) return setError('반려동물을 선택하세요.')

    setSubmitting(true)
    try {
      await apiUpdateProduct(form) // ✅ axios 인스턴스 사용
      setSuccess('수정되었습니다.')
      navigate(`/insurance/read/${form.productId || id}`)
    } catch (e) {
      setError(e?.response?.data || e.message || '수정 실패')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    setDeleting(true); setError(''); setSuccess('')
    try {
      await apiDeleteProduct(id)
      setSuccess('삭제되었습니다.')
      navigate('/insurance/list')
    } catch (e) {
      setError(e?.response?.data || e.message || '삭제 실패')
    } finally {
      setDeleting(false)
    }
  }

  if (loading || !form) return <div className="tw:p-4">로딩 중…</div>

  return (
    <Update
      form={form}
      uploading={uploading}
      submitting={submitting}
      deleting={deleting}
      error={error}
      success={success}
      onChange={handleChange}
      onUploadImage={handleUploadImage}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
    />
  )
}