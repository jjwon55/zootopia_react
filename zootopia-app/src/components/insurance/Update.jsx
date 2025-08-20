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
  const MAX_SIZE = 5 * 1024 * 1024 // 5MB

  const companies = [
    '삼성화재',
    'KB손해보험',
    '메리츠화재',
    'DB손해보험',
    '현대해상',
    '한화손해보험',
  ]

  const change = (k) => (e) => onChange({ ...form, [k]: e.target.value })
  const changeNum = (k) => (e) => {
    const v = e.target.value
    onChange({ ...form, [k]: v === '' ? '' : Number(v) })
  }
  const changeUrl = (k) => (e) => onChange({ ...form, [k]: e.target.value.trim() })
  const toggleSponsored = (e) => onChange({ ...form, sponsored: e.target.checked ? 1 : 0 })

  const onPickImage = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > MAX_SIZE) {
      alert('최대 5MB까지 업로드할 수 있어요.')
      if (fileRef.current) fileRef.current.value = ''
      return
    }
    try {
      const res = await onUploadImage(f)
      const path = typeof res === 'string' ? res : res?.imagePath
      if (!path) throw new Error('NO_IMAGE_PATH')
      onChange({ ...form, imagePath: path })
    } catch (err) {
      console.error(err)
      alert('이미지 업로드에 실패했습니다.')
    } finally {
      if (fileRef.current) fileRef.current.value = ''
    }
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
              <label className={`tw:inline-flex tw:cursor-pointer tw:items-center tw:justify-center tw:rounded-lg tw:bg-[#F27A7A] tw:text-white tw:px-3 tw:py-1.5 tw:text-sm hover:tw:opacity-90 ${uploading ? 'tw:opacity-60 tw:pointer-events-none' : ''}`}>
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

            {/* 보험사 */}
            <Field label="보험사" required>
              <select
                name="company"
                value={form.company || ''}
                onChange={change('company')}
                required
                className="tw:w-full tw:rounded-lg tw:border tw:bg-white tw:px-3 tw:py-2 tw:text-sm tw:outline-none focus:tw:border-rose-300 focus:tw:ring-2 focus:tw:ring-rose-200"
              >
                <option value="">선택하세요</option>
                {companies.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
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
                onChange={changeNum('coveragePercent')}
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
                onChange={changeNum('maxCoverage')}
                placeholder="예) 200"
                className="tw:w-full tw:rounded-lg tw:border tw:bg-white tw:px-3 tw:py-2 tw:text-sm tw:outline-none focus:tw:border-rose-300 focus:tw:ring-2 focus:tw:ring-rose-200"
              />
            </Field>
          </div>
        </div>

        {/* 상세 입력 */}
        <div className="tw:rounded-xl tw:border tw:bg-gray-50 tw:p-4 tw:mb-6">
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

        {/* 🔗 링크/제휴 설정 */}
        <div className="tw:rounded-xl tw:border tw:bg-gray-50 tw:p-4">
          <h4 className="tw:mb-3 tw:text-sm tw:font-semibold tw:text-gray-700">링크/제휴 설정</h4>

          <div className="tw:grid md:tw:grid-cols-2 tw:gap-4">
            <Field label="가입/상담 링크 (applyUrl)">
              <input
                type="url"
                name="applyUrl"
                value={form.applyUrl || ''}
                onChange={changeUrl('applyUrl')}
                placeholder="https://example.com/pet/apply"
                className="tw:w-full tw:rounded-lg tw:border tw:bg-white tw:px-3 tw:py-2 tw:text-sm tw:outline-none focus:tw:border-rose-300 focus:tw:ring-2 focus:tw:ring-rose-200"
              />
            </Field>

            <Field label="상품/홈 링크 (homepageUrl)">
              <input
                type="url"
                name="homepageUrl"
                value={form.homepageUrl || ''}
                onChange={changeUrl('homepageUrl')}
                placeholder="https://example.com/pet"
                className="tw:w-full tw:rounded-lg tw:border tw:bg-white tw:px-3 tw:py-2 tw:text-sm tw:outline-none focus:tw:border-rose-300 focus:tw:ring-2 focus:tw:ring-rose-200"
              />
            </Field>

            <Field label="파트너 코드 (partnerCode)">
              <input
                name="partnerCode"
                value={form.partnerCode || ''}
                onChange={change('partnerCode')}
                placeholder="예) ZOOTOPIA123"
                className="tw:w-full tw:rounded-lg tw:border tw:bg-white tw:px-3 tw:py-2 tw:text-sm tw:outline-none focus:tw:border-rose-300 focus:tw:ring-2 focus:tw:ring-rose-200"
              />
            </Field>

            <div className="tw:grid tw:grid-cols-3 tw:gap-4">
              <Field label="utm_source">
                <input
                  name="utmSource"
                  value={form.utmSource || ''}
                  onChange={change('utmSource')}
                  placeholder="zootopia"
                  className="tw:w-full tw:rounded-lg tw:border tw:bg-white tw:px-3 tw:py-2 tw:text-sm tw:outline-none focus:tw:border-rose-300 focus:tw:ring-2 focus:tw:ring-rose-200"
                />
              </Field>
              <Field label="utm_medium">
                <input
                  name="utmMedium"
                  value={form.utmMedium || ''}
                  onChange={change('utmMedium')}
                  placeholder="referral"
                  className="tw:w-full tw:rounded-lg tw:border tw:bg-white tw:px-3 tw:py-2 tw:text-sm tw:outline-none focus:tw:border-rose-300 focus:tw:ring-2 focus:tw:ring-rose-200"
                />
              </Field>
              <Field label="utm_campaign">
                <input
                  name="utmCampaign"
                  value={form.utmCampaign || ''}
                  onChange={change('utmCampaign')}
                  placeholder="pet_insurance"
                  className="tw:w-full tw:rounded-lg tw:border tw:bg-white tw:px-3 tw:py-2 tw:text-sm tw:outline-none focus:tw:border-rose-300 focus:tw:ring-2 focus:tw:ring-rose-200"
                />
              </Field>
            </div>

            <Field label="광고/제휴 표기">
              <label className="tw:inline-flex tw:items-center tw:gap-2 tw:text-sm">
                <input type="checkbox" checked={!!form.sponsored} onChange={toggleSponsored} />
                <span>스폰서(광고/제휴) 표시</span>
              </label>
            </Field>

            <Field label="면책 문구 (disclaimer)">
              <textarea
                name="disclaimer"
                value={form.disclaimer || ''}
                onChange={change('disclaimer')}
                rows={3}
                placeholder="※ 본 페이지는 상품 소개 목적이며, 가입·상담은 보험사 사이트에서 진행됩니다. ..."
                className="tw:w-full tw:rounded-lg tw:border tw:bg-white tw:px-3 tw:py-2 tw:text-sm tw:outline-none focus:tw:border-rose-300 focus:tw:ring-2 focus:tw:ring-rose-200"
              />
            </Field>
          </div>

          <p className="tw:mt-2 tw:text-xs tw:text-gray-500">
            * applyUrl이 있으면 applyUrl을, 없으면 homepageUrl을 사용해 최종 이동 링크(outboundApplyUrl)를 자동 생성합니다.
            파라미터는 ref/utm_*가 자동으로 붙습니다.
          </p>
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
              disabled={submitting || uploading}
              className="tw:inline-flex tw:items-center tw:justify-center tw:rounded-lg tw:bg-[#F27A7A] tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:text-white hover:tw:opacity-90 disabled:tw:opacity-60"
            >
              {submitting ? '수정 중…' : (uploading ? '이미지 업로드 중…' : '수정')}
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