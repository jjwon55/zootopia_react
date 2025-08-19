import React, { useEffect, useState, useContext } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { LoginContext } from '../../context/LoginContextProvider'
import insuranceLogo from "../../assets/img/insurancelogo.png"
import zootopiaLogo from "../../assets/img/zootopialogo.png"
import FaqSection from './FaqSection'

// ── fetch 헬퍼 (쿠키 CSRF → 헤더 전달)
const getCsrf = () => decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || '')
async function req(url, { method = 'GET', json, formData } = {}) {
  const headers = {}
  const init = { method, credentials: 'include' }
  const token = getCsrf()
  if (token) headers['X-XSRF-TOKEN'] = token
  if (json) { headers['Content-Type'] = 'application/json'; init.body = JSON.stringify(json) }
  if (formData) { init.body = formData }
  init.headers = headers
  const r = await fetch('/api' + url, init)
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  return r.json().catch(() => ({}))
}

const btn = 'tw:inline-block tw:rounded tw:px-3 tw:py-2 tw:text-white tw:bg-[#F27A7A] hover:tw:opacity-90'

// ✅ “한화손해보험”까지로 옵션 제한
const COMPANY_OPTIONS = [
  { value: '', label: '전체' },
  { value: '삼성화재', label: '삼성화재' },
  { value: 'KB손해보험', label: 'KB손해보험' },
  { value: '메리츠', label: '메리츠' },
  { value: '현대해상', label: '현대해상' },
  { value: 'DB손해보험', label: 'DB손해보험' },
  { value: '한화손해보험', label: '한화손해보험' },
]
const KNOWN_COMPANIES = new Set(COMPANY_OPTIONS.map(o => o.value).filter(Boolean))

export default function InsuranceList() {
  const [items, setItems] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  const page = Number(searchParams.get('page')) || 1
  const species = searchParams.get('species') || ''
  const company = searchParams.get('company') || ''

  // ✅ 기타 입력 제거 → 단순 선택값만 관리
  const [companySelect, setCompanySelect] = useState(
    company && KNOWN_COMPANIES.has(company) ? company : ''
  )

  // 쿼리스트링 변경 시 select 동기화
  useEffect(() => {
    if (!company || !KNOWN_COMPANIES.has(company)) {
      setCompanySelect('')
    } else {
      setCompanySelect(company)
    }
  }, [company])

  const ctx = useContext(LoginContext) || {}
  const roleSources = [
    ctx.roles, ctx.authList, ctx.authorities,
    ctx.userInfo?.roles, ctx.userInfo?.authList, ctx.userInfo?.authorities,
  ].filter(Boolean)
  const flatRoles = roleSources.flatMap(v => Array.isArray(v) ? v : [v])
  const roleToString = (r) => typeof r === 'string' ? r : (r?.auth || r?.role || r?.authority || r?.name || '')
  const isAdmin = flatRoles.some(r => /(^|_)ADMIN$/i.test(roleToString(r).toUpperCase()))

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const qs = new URLSearchParams({ page: String(page) })
        if (species) qs.set('species', species)
        if (company) qs.set('company', company)
        const data = await req(`/insurance/list?${qs.toString()}`)
        setItems(data.products || [])
        setTotalPages(data.totalPages || 1)
      } finally { setLoading(false) }
    })()
  }, [page, species, company])

  const setFilter = (kv) => {
    const next = new URLSearchParams(searchParams)
    Object.entries(kv).forEach(([k, v]) => v ? next.set(k, v) : next.delete(k))
    next.set('page', '1')
    setSearchParams(next)
  }

  // 종 토글(한 번 더 누르면 해제)
  const toggleSpecies = (val) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      const cur = next.get('species') || ''
      if (cur === val) next.delete('species')
      else next.set('species', val)
      next.set('page', '1')
      return next
    })
  }

  // ✅ 회사 셀렉트 변경 (기타 없음)
  const onChangeCompanySelect = (e) => {
    const v = e.target.value
    setCompanySelect(v)
    setFilter({ company: v })
  }

  return (
    <div className="tw:max-w-6xl tw:mx-auto tw:px-6 tw:py-10">
      <div className="tw:bg-amber-50/40 tw:border tw:border-amber-100 tw:rounded-3xl tw:p-8 tw:shadow-sm">
        <h2 className="tw:text-2xl !tw:font-bold tw:text-center tw:mb-8">펫 보험</h2>

        <div className="tw:mt-5 tw:flex tw:flex-row tw:flex-nowrap tw:justify-center tw:items-start tw:gap-12">
          <div className="tw:w-[360px] tw:h-[360px] tw:bg-amber-100 tw:rounded-xl tw:shadow tw:flex tw:items-center tw:justify-center tw:overflow-hidden">
            <img src={insuranceLogo} alt="보험 로고" className="tw:w-full tw:h-full tw:object-contain" />
          </div>

          {/* 오른쪽 필터 */}
          <div className="tw:w-[360px] tw:min-h-[360px] tw:bg-rose-50 tw:rounded-xl tw:p-5 tw:shadow tw:flex tw:flex-col">
            <p className="tw:text-center tw:font-semibold tw:mb-8 tw:mt-5">🐶 원하는 보험 찾기 🐱</p>

            {/* 종 필터 (토글) */}
            <div className="tw:flex tw:justify-center tw:gap-2 tw:mb-6">
              <button
                className={`tw:border tw:rounded tw:px-3 tw:py-1 ${species === 'dog' ? 'tw:bg-white tw:border-rose-300' : ''}`}
                onClick={() => toggleSpecies('dog')}
                aria-pressed={species === 'dog'}
              >강아지</button>
              <button
                className={`tw:border tw:rounded tw:px-3 tw:py-1 ${species === 'cat' ? 'tw:bg-white tw:border-rose-300' : ''}`}
                onClick={() => toggleSpecies('cat')}
                aria-pressed={species === 'cat'}
              >고양이</button>
            </div>

            {/* 회사 필터 (기타 입력 제거) */}
            <label className="tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-1">보험사</label>
            <select
              className="tw:w-full tw:border tw:rounded tw:px-2 tw:py-2 tw:text-sm tw:bg-white"
              value={companySelect}
              onChange={onChangeCompanySelect}
            >
              {COMPANY_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <div className="tw:text-center tw:mt-6">
              <img src={zootopiaLogo} alt="주토피아" className="tw:w-16 tw:mx-auto" />
              <p className="tw:text-xs tw:mt-1 tw:font-semibold tw:text-gray-500">🏡 펫과 함께, 더 나은 내일을</p>
            </div>
          </div>
        </div>

        {/* TIP 영역 */}
        <div className="tw:mt-10 tw:rounded-2xl tw:bg-rose-50/60 tw:border tw:border-rose-100 tw:p-4">
          <div className="tw:flex tw:items-center tw:justify-center tw:gap-2 tw:text-gray-800">
            <span className="tw:text-lg">💡</span>
            <span className="tw:font-semibold">Tip</span>
          </div>
          <div className="tw:mt-3 tw:flex tw:flex-col tw:items-center tw:gap-1 tw:text-sm tw:text-gray-700">
            <div className="tw:flex tw:items-center tw:gap-2">
              <span className="tw:inline-flex tw:h-5 tw:w-5 tw:items-center tw:justify-center tw:rounded tw:bg-emerald-500 tw:text-white tw:text-xs">✓</span>
              <span>슬개골 탈구, 피부병은 가입 전에 보장 여부 꼭 확인</span>
            </div>
            <div className="tw:flex tw:items-center tw:gap-2">
              <span className="tw:inline-flex tw:h-5 tw:w-5 tw:items-center tw:justify-center tw:rounded tw:bg-emerald-500 tw:text-white tw:text-xs">✓</span>
              <span>보험료는 연령, 품종, 선택 보장 범위에 따라 달라짐</span>
            </div>
          </div>
        </div>

        {/* 카드 리스트 */}
        <div className="tw:mt-8">
          {loading ? (
            <div className="tw:grid tw:grid-cols-1 sm:tw:grid-cols-2 tw:gap-5">
              {[...Array(4)].map((_,i)=>(
                <div key={i} className="tw:h-[220px] tw:rounded-2xl tw:bg-white tw:shadow-sm tw:border tw:border-rose-100 tw:animate-pulse">
                  <div className="tw:h-full tw:p-5">
                    <div className="tw:h-4 tw:w-1/3 tw:bg-rose-100 tw:rounded tw:mb-4" />
                    <div className="tw:h-3 tw:w-1/2 tw:bg-rose-50 tw:rounded tw:mb-6" />
                    <div className="tw:space-y-2">
                      <div className="tw:h-3 tw:w-3/4 tw:bg-rose-50 tw:rounded" />
                      <div className="tw:h-3 tw:w-2/3 tw:bg-rose-50 tw:rounded" />
                      <div className="tw:h-3 tw:w-1/2 tw:bg-rose-50 tw:rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="tw:grid tw:grid-cols-1 sm:tw:grid-cols-2 tw:gap-5">
              {items.map(p => (
                <div
                  key={p.productId}
                  className="tw:group tw:relative tw:rounded-2xl tw:bg-white tw:border tw:border-rose-100 tw:shadow-sm hover:tw:shadow-xl hover:tw:-translate-y-0.5 tw:transition-all tw:duration-300 tw:overflow-hidden"
                >
                  <div className="tw:absolute -tw-top-[1px] tw:left-0 tw:right-0 tw:h-1 tw:bg-gradient-to-r tw:from-[#F27A7A] tw:to-rose-300" />
                  <div className="tw:p-5 tw:flex tw:flex-col tw:h-full">
                    <div className="tw:flex tw:items-start tw:justify-between tw:gap-3">
                      <h6 className="tw:font-extrabold tw:text-lg tw:text-gray-800">🐾 {p.name}</h6>
                      <span className="tw:text-[11px] tw:px-2 tw:py-0.5 tw:rounded-full tw:border tw:border-rose-200 tw:bg-rose-50 tw:text-rose-500">
                        {p.company || '보험사'}
                      </span>
                    </div>
                    <p className="tw:text-sm tw:text-gray-500 tw:mt-1">{p.slogan}</p>
                    <div className="tw:mt-4 tw:space-y-2 tw:text-sm">
                      <div className="tw:flex tw:items-center tw:gap-2">
                        <span className="tw:inline-flex tw:h-5 tw:w-5 tw:items-center tw:justify-center tw:rounded tw:bg-amber-100">💰</span>
                        <div><b>월 보험료:</b> <span className="tw:text-gray-700">{p.monthlyFeeRange}원</span></div>
                      </div>
                      <div className="tw:flex tw:items-center tw:gap-2">
                        <span className="tw:inline-flex tw:h-5 tw:w-5 tw:items-center tw:justify-center tw:rounded tw:bg-emerald-100">💎</span>
                        <div><b>월 최대 보장:</b> <span className="tw:text-gray-700">{p.maxCoverage}만원</span></div>
                      </div>
                      <div className="tw:flex tw:items-center tw:gap-2">
                        <span className="tw:inline-flex tw:h-5 tw:w-5 tw:items-center tw:justify-center tw:rounded tw:bg-sky-100">✅</span>
                        <div><b>보장 비율:</b> <span className="tw:text-gray-700">{p.coveragePercent}%</span></div>
                      </div>
                    </div>
                    <div className="tw:mt-5 tw:flex tw:justify-end">
                      <Link
                        to={`/insurance/read/${p.productId}`}
                        className="tw:inline-flex tw:items-center tw:gap-1 tw:rounded-xl tw:bg-[#F27A7A] tw:text-white tw:px-4 tw:py-2 tw:text-sm tw:font-semibold hover:tw:bg-rose-500 tw:shadow-sm hover:tw:shadow tw:transition-all"
                      >
                        자세히 보기
                        <svg xmlns="http://www.w3.org/2000/svg" className="tw:w-4 tw:h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L12 6.414V16a1 1 0 11-2 0V6.414L5.707 9.707A1 1 0 114.293 8.293l5-5z" clipRule="evenodd"/></svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && items.length === 0 && (
            <div className="tw:mt-6 tw:text-center tw:text-gray-500 tw:text-sm">
              조건에 맞는 상품이 없습니다. 필터를 변경해보세요.
            </div>
          )}
        </div>
      </div>

      {/* 페이지네이션 */}
      <div className="tw:mt-10 tw:flex tw:justify-center tw:items-center tw:gap-2">
        <button
          className="tw:h-9 tw:min-w-9 tw:px-3 tw:rounded-lg tw:border tw:border-rose-200 hover:tw:bg-rose-50 disabled:tw:opacity-40"
          disabled={page <= 1}
          onClick={() => setSearchParams({ species, company, page: page - 1 })}
        >이전</button>

        <div className="tw:flex tw:gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              onClick={() => setSearchParams({ species, company, page: n })}
              className={`tw:h-9 tw:min-w-9 tw:px-3 tw:rounded-lg tw:border tw:text-sm tw:transition-colors
                ${n === page ? 'tw:bg-[#F27A7A] tw:text-white tw:border-[#F27A7A]' : 'tw:border-rose-200 hover:tw:bg-rose-50'}`}
            >{n}</button>
          ))}
        </div>

        <button
          className="tw:h-9 tw:min-w-9 tw:px-3 tw:rounded-lg tw:border tw:border-rose-200 hover:tw:bg-rose-50 disabled:tw:opacity-40"
          disabled={page >= totalPages}
          onClick={() => setSearchParams({ species, company, page: page + 1 })}
        >다음</button>
      </div>

      {/* 관리자만 등록 */}
      {isAdmin && (
        <div className="tw:mt-6 tw:text-right">
          <Link to="/insurance/insert" className={btn}>상품등록</Link>
        </div>
      )}

      <FaqSection />
    </div>
  )
}