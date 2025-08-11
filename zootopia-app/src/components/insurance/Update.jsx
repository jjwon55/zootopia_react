import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const getCsrf = () => decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || '')
async function req(url, { method='GET', json, formData } = {}) {
  const headers = {}
  const init = { method, credentials: 'include' }
  const token = getCsrf()
  if (token) headers['X-XSRF-TOKEN'] = token
  if (json) { headers['Content-Type'] = 'application/json'; init.body = JSON.stringify(json) }
  if (formData) { init.body = formData }
  init.headers = headers
  const r = await fetch('/api' + url, init)
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  return r.json().catch(()=> ({}))
}

const btn = 'inline-block rounded px-4 py-2 text-white bg-[#F27A7A] hover:opacity-90'

export default function InsuranceUpdate() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [preview, setPreview] = useState('')

  useEffect(()=> {
    (async () => {
      const data = await req(`/insurance/read/${id}`)
      setForm(data.product)
      setPreview(data.product?.imagePath || '')
    })()
  }, [id])

  if (!form) return <div className="p-4">로딩 중…</div>
  const change = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const uploadImage = async (file) => {
    const fd = new FormData()
    fd.append('imageFile', file)
    const data = await req('/insurance/upload-image', { method:'POST', formData: fd })
    if (data.imagePath) {
      setForm(prev => ({ ...prev, imagePath: data.imagePath }))
      setPreview(data.imagePath)
      alert('✅ 이미지 업로드 완료')
    } else alert('❌ 업로드 실패')
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.imagePath) return alert('이미지를 먼저 등록하세요.')
    await req('/insurance/update', { method:'POST', json: form })
    alert('수정되었습니다.')
    navigate(`/insurance/read/${id}`)
  }

  const onDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    await req(`/insurance/delete/${id}`, { method:'POST' })
    alert('삭제되었습니다.')
    navigate('/insurance/list')
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h3 className="text-2xl font-bold text-center mb-6">보험상품 수정</h3>

      {/* 이미지 업로더 */}
      <form
        className="flex items-center gap-2 mb-4"
        onSubmit={(e)=>{ e.preventDefault(); const f=e.currentTarget.file.files[0]; if(f) uploadImage(f); else alert('📸 이미지를 선택하세요.') }}
      >
        <input type="file" name="file" accept="image/*" className="w-full border rounded px-3 py-2" />
        <button className={btn}>등록</button>
      </form>
      {preview && <div className="text-center mb-4"><img src={preview} alt="미리보기" className="max-h-52 rounded inline-block" /></div>}

      {/* 폼 */}
      <form onSubmit={onSubmit} className="space-y-4">
        <input type="hidden" value={form.productId} readOnly />
        <Field label="상품명" required>
          <input className="w-full border rounded px-3 py-2" value={form.name||''} onChange={change('name')} required />
        </Field>
        <Field label="슬로건">
          <input className="w-full border rounded px-3 py-2" value={form.slogan||''} onChange={change('slogan')} />
        </Field>
        <Field label="보장비율">
          <input className="w-full border rounded px-3 py-2" value={form.coveragePercent||''} onChange={change('coveragePercent')} />
        </Field>
        <Field label="월 보험료">
          <input className="w-full border rounded px-3 py-2" value={form.monthlyFeeRange||''} onChange={change('monthlyFeeRange')} />
        </Field>
        <Field label="최대 보장 한도">
          <input className="w-full border rounded px-3 py-2" value={form.maxCoverage||''} onChange={change('maxCoverage')} />
        </Field>
        <Field label="반려동물" required>
          <select className="w-full border rounded px-3 py-2 bg-white" value={form.species||''} onChange={change('species')} required>
            <option value="">선택하세요.</option>
            <option value="dog">강아지</option>
            <option value="cat">고양이</option>
            <option value="all">둘다</option>
          </select>
        </Field>
        <Field label="가입조건">
          <input className="w-full border rounded px-3 py-2" value={form.joinCondition||''} onChange={change('joinCondition')} />
        </Field>
        <Field label="보장항목">
          <input className="w-full border rounded px-3 py-2" value={form.coverageItems||''} onChange={change('coverageItems')} />
        </Field>
        <Field label="유의사항">
          <textarea className="w-full border rounded px-3 py-2" rows={3} value={form.precautions||''} onChange={change('precautions')} />
        </Field>

        <div className="flex justify-center gap-3 pt-2">
          <button type="button" onClick={()=>navigate(-1)} className="border rounded px-4 py-2 hover:bg-rose-50">취소</button>
          <button className={btn}>수정</button>
        </div>
      </form>

      <div className="text-right mt-4">
        <button onClick={onDelete} className={btn}>삭제</button>
      </div>
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block font-semibold mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  )
}