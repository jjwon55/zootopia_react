import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Update({
  form,
  onChange,
  onUploadImage,
  onSubmit,
  onDelete,           // 선택: 삭제 핸들러
  uploading = false,
  submitting = false,
  deleting = false,
  error,
  success,
}) {
  const navigate = useNavigate()
  const fileRef = useRef(null)

  const change = (k) => (e) => onChange({ ...form, [k]: e.target.value })

  const onPickImage = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    await onUploadImage(f)
  }

  const removeImage = () => {
    if (fileRef.current) fileRef.current.value = ''
    onChange({ ...form, imagePath: '' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <div className="tw:mx-auto tw:max-w-5xl tw:px-4 tw:py-10">
      <div className="tw:mb-6 tw:flex tw:items-center tw:justify-between">
        <h3 className="tw:text-2xl tw:font-extrabold tw:tracking-tight">보험상품 수정</h3>
      </div>

      {error && (
        <div className="tw:mb-4 tw:rounded tw:border tw:border-red-200 tw:bg-red-50 tw:px-3 tw:py-2 tw:text-sm tw:text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="tw:mb-4 tw:rounded tw:border tw:border-green-200 tw:bg-green-50 tw:px-3 tw:py-2 tw:text-sm tw:text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="tw:rounded-2xl tw:border tw:bg-white tw:p-6 tw:shadow-sm">
        <div className="tw:mb-8 tw:grid tw:gap-6 upd-grid tw:grid-cols-[320px_1fr]">
          {/* 이미지 업로더 */}
          <div className="tw:rounded-xl tw:border tw:bg-gray-50 tw:p-4">
            <p className="tw:mb-2 tw:text-sm tw:font-semibold tw:text-gray-700">대표 이미지</p>

            <div className="tw:relative tw:flex tw:aspect-square tw:w-full tw:items-center tw:justify-center tw:overflow-hidden tw:rounded-lg tw:border tw:border-dashed tw:bg-white">
              {form.imagePath ? (
                <img src={form.imagePath} alt="미리보기" className="tw:h-full tw:w-full tw:object-contain" />
              ) : (
                <div className="tw:text-center tw:text-gray-400">
                  <div className="tw:text-4xl">📷</div>
                  <div className="tw:mt-1 tw:text-sm">이미지를 업로드하세요</div>
                </div>
              )}
            </div>

            <div className="tw:mt-3 tw:flex tw:flex-wrap tw:items-center tw:gap-2">
              <label className="tw:inline-flex tw:cursor-pointer tw:items-center tw:justify-center tw:rounded-lg tw:bg-[#F27A7A] tw:text-white tw:px-3 tw:py-1.5 tw:text-sm hover:tw:opacity-90">
                파일 선택
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="tw:hidden"
                  onChange={onPickImage}
                />
              </label>
              {form.imagePath && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="tw:inline-flex tw:items-center tw:justify-center tw:rounded-lg tw:bg-[#F27A7A] tw:text-white tw:px-3 tw:py-1.5 tw:text-sm tw:font-medium hover:tw:bg-[#e36b6b] focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#F27A7A]"
                >
                  삭제
                </button>
              )}
              {uploading && <span className="tw:text-xs tw:text-gray-500">업로드 중…</span>}
            </div>

            <p className="tw:mt-2 tw:text-xs tw:text-gray-500">권장: 1:1 정사각형, PNG/JPG • 최대 5MB</p>
          </div>

          {/* 핵심 입력 */}
          <div className="tw:grid tw:grid-cols-1 tw:gap-4">
            <Field label="상품명" required>
              <input
                name="name"
                value={form.name || ''}
                onChange={change('name')}
                placeholder="예) 펫케어 안심플랜"
                className="tw:w-full tw:rounded-lg tw:border tw:bg-white tw:px-3 tw:py-2 tw:text-sm tw:outline-none focus:tw:border-rose-300 focus:tw:ring-2 focus:tw:ring-rose-200"
                required
              />
            </Field>

            <Field label="슬로건">
              <input
                name="slogan"
                value={form.slogan || ''}
                onChange={change('slogan')}
                placeholder="예) 병원비 걱정 끝!"
                className="tw:w-full tw:rounded-lg tw:border tw:bg-white tw:px-3 tw:py-2 tw:text-sm tw:outline-none focus:tw:border-rose-300 focus:tw:ring-2 focus:tw:ring-rose-200"
              />
            </Field>

            <Field label="반려동물" required>
              <select
                name="species"
                value={form.species || ''}
                onChange={change('species')}
                required
                className="tw:w-full tw:rounded-lg tw:border tw:bg-white tw:px-3 tw:py-2 tw:text-sm tw:outline-none focus:tw:border-rose-300 focus:tw:ring-2 focus:tw:ring-rose-200"
              >
                <option value="">선택하세요</option>
                <option value="dog">강아지</option>
                <option value="cat">고양이</option>
                <option value="all">둘다</option>
              </select>
            </Field>

            <Field label="보장 비율(%)">
              <input
                type="number" min="0" max="100"
                name="coveragePercent"
                value={form.coveragePercent ?? ''}
                onChange={change('coveragePercent')}
                placeholder="예) 70"
                className="tw:w-full tw:rounded-lg tw:border tw:bg-white tw:px-3 tw:py-2 tw:text-sm tw:outline-none focus:tw:border-rose-300 focus:tw:ring-2 focus:tw:ring-rose-200"
              />
            </Field>

            <Field label="월 보험료(범위)">
              <input
                name="monthlyFeeRange"
                value={form.monthlyFeeRange || ''}
                onChange={change('monthlyFeeRange')}
                placeholder="예) 18,000 ~ 35,000"
                className="tw:w-full tw:rounded-lg tw:border tw:bg-white tw:px-3 tw:py-2 tw:text-sm tw:outline-none focus:tw:border-rose-300 focus:tw:ring-2 focus:tw:ring-rose-200"
              />
            </Field>

            <Field label="월 최대 보장 한도(만원)">
              <input
                type="number" min="0"
                name="maxCoverage"
                value={form.maxCoverage ?? ''}
                onChange={change('maxCoverage')}
                placeholder="예) 200"
                className="tw:w-full tw:rounded-lg tw:border tw:bg-white tw:px-3 tw:py-2 tw:text-sm tw:outline-none focus:tw:border-rose-300 focus:tw:ring-2 focus:tw:ring-rose-200"
              />
            </Field>
          </div>
        </div>

        {/* 상세 입력 */}
        <div className="tw:rounded-xl tw:border tw:bg-gray-50 tw:p-4">
          <h4 className="tw:mb-3 tw:text-sm tw:font-semibold tw:text-gray-700">상세 정보</h4>
          <div className="tw:grid tw:grid-cols-1 tw:gap-4">
            <Field label="가입조건">
              <input
                name="joinCondition"
                value={form.joinCondition || ''}
                onChange={change('joinCondition')}
                placeholder="예) 생후 60일 이상, 8세 이하"
                className="tw:w-full tw:rounded-lg tw:border tw:bg-white tw:px-3 tw:py-2 tw:text-sm tw:outline-none focus:tw:border-rose-300 focus:tw:ring-2 focus:tw:ring-rose-200"
              />
            </Field>

            <Field label="보장항목">
              <textarea
                name="coverageItems"
                value={form.coverageItems || ''}
                onChange={change('coverageItems')}
                rows={3}
                placeholder="예) 질병/상해, 입원/수술, MRI/CT 등"
                className="tw:w-full tw:rounded-lg tw:border tw:bg-white tw:px-3 tw:py-2 tw:text-sm tw:outline-none focus:tw:border-rose-300 focus:tw:ring-2 focus:tw:ring-rose-200"
              />
            </Field>

            <Field label="유의사항">
              <textarea
                name="precautions"
                value={form.precautions || ''}
                onChange={change('precautions')}
                rows={4}
                placeholder="예) 기존 질환 제외, 면책기간 30일 등"
                className="tw:w-full tw:rounded-lg tw:border tw:bg-white tw:px-3 tw:py-2 tw:text-sm tw:outline-none focus:tw:border-rose-300 focus:tw:ring-2 focus:tw:ring-rose-200"
              />
            </Field>
          </div>
        </div>

        {/* 액션 */}
        <div className="tw:mt-8 tw:flex tw:flex-wrap tw:items-center tw:justify-between">
          <div className="tw:flex tw:gap-2">
            {onDelete && (
              <button
                type="button"
                disabled={deleting}
                onClick={onDelete}
                className="tw:inline-flex tw:items-center tw:justify-center tw:rounded-lg tw:border tw:border-red-300 tw:px-4 tw:py-2 tw:text-sm tw:text-red-600 hover:tw:bg-red-50 disabled:tw:opacity-60"
              >
                {deleting ? '삭제 중…' : '삭제'}
              </button>
            )}
          </div>

          <div className="tw:flex tw:gap-2">
            <button
              type="button"
              onClick={() => navigate('/insurance/list')}
              className="tw:inline-flex tw:items-center tw:justify-center tw:rounded-lg tw:border tw:px-4 tw:py-2 tw:text-sm hover:tw:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="tw:inline-flex tw:items-center tw:justify-center tw:rounded-lg tw:bg-[#F27A7A] tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:text-white hover:tw:opacity-90 disabled:tw:opacity-60"
            >
              {submitting ? '수정 중…' : '수정'}
            </button>
          </div>
        </div>
      </form>

      {/* 모바일 1열 */}
      <style>{`
        @media (max-width: 767px) {
          .upd-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <label className="tw:block">
      <span className="tw:mb-1 tw:inline-flex tw:items-center tw:gap-1 tw:text-sm tw:font-medium tw:text-gray-700">
        {label} {required && <span className="tw:text-rose-500">*</span>}
      </span>
      {children}
    </label>
  )
}