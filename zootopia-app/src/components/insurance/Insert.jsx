import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

/* ---------- helpers ---------- */
const getCsrf = () =>
  decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || '')

const getToken = () =>
  localStorage.getItem('Authorization') ||
  localStorage.getItem('accessToken') ||
  sessionStorage.getItem('Authorization') ||
  sessionStorage.getItem('accessToken')

async function req(
  url,
  { method = 'GET', json, formData, auth = false } = {}
) {
  const headers = {};
  const init = { method, credentials: 'include' };

  // CSRF(XSRF) 토큰 (있으면 넣기)
  const xsrf = getCsrf();
  if (xsrf) headers['X-XSRF-TOKEN'] = xsrf;
  // 업로드 요청 보내기 직전
  
const token = localStorage.getItem('accessToken');  // 혹은 상태/쿠키 등
console.log('accessToken:', token);
// 정규식으로 점 2개 확인
console.log('isJWT:', typeof token === 'string' && (token.match(/\./g) || []).length === 2);

  // 본문
  if (json) {
    headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(json);
  }
  if (formData) {
    init.body = formData; // 브라우저가 적절한 multipart boundary를 자동 세팅
  }

  // 🔐 관리자 전용 요청이라면 JWT 삽입
  if (auth) {
    let token = null;

    // 1) localStorage / sessionStorage
    const keys = ['Authorization', 'accessToken', 'jwt', 'token', 'AUTHORIZATION'];
    for (const k of keys) {
      const v = localStorage.getItem(k) || sessionStorage.getItem(k);
      if (v) { token = v; break; }
    }

    // 2) 쿠키 fallback (ex. Cookies.set('jwt', jwt))
    if (!token) {
      const m = document.cookie.match(/(?:Authorization|accessToken|jwt|token)=([^;]+)/);
      if (m?.[1]) token = decodeURIComponent(m[1]);
    }

    if (!token) throw new Error('NO_TOKEN');

    headers['Authorization'] = token.startsWith('Bearer ')
      ? token
      : `Bearer ${token}`;
  }

  init.headers = headers;

  // 개발 로그: Authorization 앞 몇 글자만 노출
  if (import.meta.env.DEV) {
    const prev = headers.Authorization ? headers.Authorization.slice(0, 16) + '…' : '(none)';
    console.log('[REQ]', method, url, { Authorization: prev });
  }

  const r = await fetch('/api' + url, init);
  if (!r.ok) {
    let msg = `HTTP ${r.status}`;
    try { const b = await r.json(); if (b?.message) msg += ` - ${b.message}`; } catch {}
    throw new Error(msg);
  }
  try { return await r.json(); } catch { return {}; }
}

/* ---------- component ---------- */
export default function InsuranceInsert() {
  const navigate = useNavigate()
  const fileRef = useRef(null)

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
  const [preview, setPreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const change = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }))

  const uploadImage = async (file) => {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('imageFile', file)

      // 🔐 업로드는 ADMIN 전용 → auth:true
      const data = await req('/insurance/upload-image', {
        method: 'POST',
        formData: fd,
        auth: true,
      })

      if (data.imagePath) {
        setForm((prev) => ({ ...prev, imagePath: data.imagePath }))
        setPreview(data.imagePath)
      } else {
        alert('❌ 이미지 업로드 실패')
      }
    } catch (e) {
      console.error(e)
      if (e.message === 'NO_TOKEN') {
        alert('관리자 로그인이 필요합니다. 로그인 후 다시 시도하세요.')
      } else if (e.message.startsWith('HTTP 403')) {
        alert('접근 권한이 없습니다. 관리자 계정인지 확인하세요.')
      } else {
        alert('❌ 이미지 업로드 중 오류가 발생했습니다.')
      }
    } finally {
      setUploading(false)
    }
  }

  const onPickImage = (e) => {
    const f = e.target.files?.[0]
    if (f) uploadImage(f)
  }

  const removeImage = () => {
    if (fileRef.current) fileRef.current.value = ''
    setPreview('')
    setForm((s) => ({ ...s, imagePath: '' }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.imagePath) return alert('이미지를 먼저 등록하세요.')
    if (!form.name || !form.species) return alert('필수 항목을 확인해주세요.')

    setSubmitting(true)
    try {
      // 🔐 등록도 ADMIN 전용 → auth:true
      await req('/insurance/register', {
        method: 'POST',
        json: form,
        auth: true,
      })
      alert('등록되었습니다.')
      navigate('/insurance/list')
    } catch (err) {
      console.error(err)
      if (err.message === 'NO_TOKEN') {
        alert('관리자 로그인이 필요합니다. 로그인 후 다시 시도하세요.')
      } else if (err.message.startsWith('HTTP 403')) {
        alert('접근 권한이 없습니다. 관리자 계정인지 확인하세요.')
      } else {
        alert('❌ 등록 실패')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-2xl font-extrabold tracking-tight">보험상품 등록</h3>
      </div>

      <form onSubmit={onSubmit} className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-[260px_1fr]">
          {/* 이미지 업로더 */}
          <div className="rounded-xl border bg-gray-50 p-4">
            <p className="mb-2 text-sm font-semibold text-gray-700">대표 이미지</p>

            <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg border border-dashed bg-white">
              {preview ? (
                <img src={preview} alt="미리보기" className="h-full w-full object-contain" />
              ) : (
                <div className="text-center text-gray-400">
                  <div className="text-4xl">📷</div>
                  <div className="mt-1 text-sm">이미지를 업로드하세요</div>
                </div>
              )}
            </div>

            <div className="mt-3 flex gap-2">
              <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">
                파일 선택
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onPickImage}
                />
              </label>
              {preview && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="inline-flex items-center justify-center rounded-lg border px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                >
                  삭제
                </button>
              )}
              {uploading && <span className="text-xs text-gray-500">업로드 중…</span>}
            </div>

            <p className="mt-2 text-xs text-gray-500">권장: 1:1 정사각형, PNG/JPG • 최대 5MB</p>
          </div>

          {/* 핵심 입력 */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="상품명" required>
              <input
                name="name"
                value={form.name}
                onChange={change('name')}
                placeholder="예) 펫케어 안심플랜"
                className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-200"
                required
              />
            </Field>

            <Field label="슬로건">
              <input
                name="slogan"
                value={form.slogan}
                onChange={change('slogan')}
                placeholder="예) 병원비 걱정 끝!"
                className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-200"
              />
            </Field>

            <Field label="반려동물" required>
              <select
                name="species"
                value={form.species}
                onChange={change('species')}
                required
                className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-200"
              >
                <option value="">선택하세요</option>
                <option value="dog">강아지</option>
                <option value="cat">고양이</option>
                <option value="all">둘다</option>
              </select>
            </Field>

            <Field label="보장 비율(%)">
              <input
                type="number"
                min="0"
                max="100"
                name="coveragePercent"
                value={form.coveragePercent}
                onChange={change('coveragePercent')}
                placeholder="예) 70"
                className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-200"
              />
            </Field>

            <Field label="월 보험료(범위)">
              <input
                name="monthlyFeeRange"
                value={form.monthlyFeeRange}
                onChange={change('monthlyFeeRange')}
                placeholder="예) 18,000 ~ 35,000"
                className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-200"
              />
            </Field>

            <Field label="월 최대 보장 한도(만원)">
              <input
                type="number"
                min="0"
                name="maxCoverage"
                value={form.maxCoverage}
                onChange={change('maxCoverage')}
                placeholder="예) 200"
                className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-200"
              />
            </Field>
          </div>
        </div>

        {/* 상세 입력 */}
        <div className="rounded-xl border bg-gray-50 p-4">
          <h4 className="mb-3 text-sm font-semibold text-gray-700">상세 정보</h4>
          <div className="grid grid-cols-1 gap-4">
            <Field label="가입조건">
              <input
                name="joinCondition"
                value={form.joinCondition}
                onChange={change('joinCondition')}
                placeholder="예) 생후 60일 이상, 8세 이하"
                className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-200"
              />
            </Field>

            <Field label="보장항목">
              <textarea
                name="coverageItems"
                value={form.coverageItems}
                onChange={change('coverageItems')}
                rows={3}
                placeholder="예) 질병/상해, 입원/수술, MRI/CT 등"
                className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-200"
              />
            </Field>

            <Field label="유의사항">
              <textarea
                name="precautions"
                value={form.precautions}
                onChange={change('precautions')}
                rows={4}
                placeholder="예) 기존 질환 제외, 면책기간 30일 등"
                className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-200"
              />
            </Field>
          </div>
        </div>

        {/* 액션 */}
        <div className="mt-8 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate('/insurance/list')}
            className="inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-lg bg-[#F27A7A] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? '등록 중…' : '등록'}
          </button>
        </div>
      </form>
    </div>
  )
}

/* ---------- sub component ---------- */
function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="mb-1 inline-flex items-center gap-1 text-sm font-medium text-gray-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      {children}
    </label>
  )
}