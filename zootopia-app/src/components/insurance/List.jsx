import React, { useEffect, useState, useContext } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { LoginContext } from '../../context/LoginContextProvider'
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

// 메인 버튼 스타일(hover 톤다운)
const btn =
  'tw:inline-block tw:rounded tw:px-3 tw:py-2 tw:text-white tw:bg-[#F27A7A] hover:tw:bg-[#E76A6A] tw:transition-colors'

// ✅ “한화손해보험”까지로 옵션 제한
const COMPANY_OPTIONS = [
  { value: '', label: '전체' },
  { value: '삼성화재', label: '삼성화재' },
  { value: 'KB손해보험', label: 'KB손해보험' },
  { value: '메리츠화재', label: '메리츠' }, // API value는 '메리츠화재', 사용자 표시 label은 '메리츠'
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

  // ✅ 단순 선택값만 관리
  const [companySelect, setCompanySelect] = useState(
    company && KNOWN_COMPANIES.has(company) ? company : ''
  )

  // URL의 company 쿼리스트링을 검사하고, 유효하지 않으면 URL에서 제거합니다.
  // 또한, URL이 변경될 때마다 select UI를 동기화하여 일관성을 유지합니다.
  useEffect(() => {
    const companyInUrl = searchParams.get('company');
    if (companyInUrl && !KNOWN_COMPANIES.has(companyInUrl)) {
      // URL에 유효하지 않은 company 값이 있으면 제거하고, 브라우저 히스토리에 남기지 않습니다.
      const next = new URLSearchParams(searchParams);
      next.delete('company');
      setSearchParams(next, { replace: true });
    } else {
      // URL 값에 따라 select UI를 동기화합니다.
      setCompanySelect(companyInUrl || '');
    }
  }, [searchParams, setSearchParams]);

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
        const params = new URLSearchParams(searchParams);
        // `page` URL 파라미터가 비어있거나(예: ?page=) 유효하지 않은 값일 경우를
        // 처리하기 위해, 항상 유효한 페이지 번호를 보장합니다.
        const pageValue = Number(params.get('page')) || 1;
        params.set('page', String(pageValue));

        const data = await req(`/insurance/list?${params.toString()}`)
        setItems(data.products || [])
        setTotalPages(data.totalPages || 1)
      } finally { setLoading(false) }
    })()
  }, [searchParams]) // 의존성 배열을 searchParams로 단순화합니다.

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

  // ✅ 회사 셀렉트 변경
  const onChangeCompanySelect = (e) => {
    const v = e.target.value
    setCompanySelect(v)
    setFilter({ company: v })
  }

  // 페이지네이션 핸들러
  const handlePageChange = (newPage) => {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(newPage))
    setSearchParams(next)
  }

  return (
    <div className="tw:max-w-6xl tw:mx-auto tw:px-6 tw:py-10">
      {/* ───────────────── Hero (Zootopia style) ───────────────── */}
      <div
        className="tw:relative tw:rounded-3xl tw:p-6 md:tw:p-8 tw:mt-2 tw:overflow-hidden
                   tw:bg-gradient-to-br tw:from-[#FFF6F6] tw:via-pink-50 tw:to-amber-50
                   tw:border tw:border-pink-100/70 tw:shadow-sm"
      >
        {/* 배경 장식 (톤다운) */}
        <div className="tw:pointer-events-none tw:absolute tw:inset-0 tw:opacity-70
                        tw:bg-[radial-gradient(circle_at_20%_15%,rgba(242,122,122,0.12),transparent_35%),radial-gradient(circle_at_85%_10%,rgba(253,224,171,0.22),transparent_40%)]" />
        <div className="tw:relative tw:flex tw:flex-col md:tw:flex-row tw:items-center tw:gap-8">

          {/* Left: 타이틀 + 서브카피 + 빠른 필터 */}
          <div className="tw:flex-1">
            <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-2">
              <span className="tw:inline-flex tw:items-center tw:gap-1 tw:text-[11px] tw:px-2 tw:py-1 tw:rounded-full tw:bg-white/70 tw:border tw:border-pink-100 tw:text-rose-500">
                🐾 Zootopia 추천
              </span>
              {Boolean(items?.length) && (
                <span className="tw:inline-flex tw:text-[11px] tw:px-2 tw:py-1 tw:rounded-full tw:bg-white/70 tw:border tw:border-amber-200 tw:text-amber-600">
                  현재 표시: <b className="tw:ml-1">{items.length}</b>개
                </span>
              )}
            </div>

            <h2 className="tw:text-2xl md:tw:text-3xl !tw:font-extrabold tw:text-gray-800 tw:mt-3">
              반려동물 보험, <span className="tw:text-[#F27A7A]">딱 맞게</span> 고르자!
            </h2>
            <p className="tw:mt-2 tw:text-sm md:tw:text-base tw:text-gray-600">
              종(강아지/고양이)과 보험사를 선택하면 주토피아가 <b>한눈에</b> 보여드려요.
            </p>

            {/* 빠른 필터(종) */}
            <div className="tw:mt-4 tw:flex tw:flex-wrap tw:items-center tw:gap-2">
              <button
                onClick={() => toggleSpecies('dog')}
                aria-pressed={species === 'dog'}
                className={`tw:h-9 tw:px-3 tw:rounded-full tw:border tw:text-sm tw:bg-white/80 tw:backdrop-blur hover:tw:bg-white tw:transition
                  ${species === 'dog'
                    ? 'tw:border-pink-200 tw:text-rose-600 tw:shadow-[0_0_0_2px_rgba(242,122,122,0.08)]'
                    : 'tw:border-pink-100 tw:text-gray-700'}`}
              >🐶 강아지</button>

              <button
                onClick={() => toggleSpecies('cat')}
                aria-pressed={species === 'cat'}
                className={`tw:h-9 tw:px-3 tw:rounded-full tw:border tw:text-sm tw:bg-white/80 tw:backdrop-blur hover:tw:bg-white tw:transition
                  ${species === 'cat'
                    ? 'tw:border-pink-200 tw:text-rose-600 tw:shadow-[0_0_0_2px_rgba(242,122,122,0.08)]'
                    : 'tw:border-pink-100 tw:text-gray-700'}`}
              >🐱 고양이</button>

              {(species || company) && (
                <button
                  onClick={() => setFilter({ species: '', company: '' })}
                  className="tw:ml-1 tw:h-9 tw:px-3 tw:rounded-full tw:border tw:border-pink-100 tw:text-sm tw:bg-white/80 hover:tw:bg-white tw:text-gray-600"
                >
                  초기화
                </button>
              )}
            </div>

            {/* 현재 활성 필터 뱃지 */}
            <div className="tw:mt-3 tw:flex tw:flex-wrap tw:gap-2">
              {species && (
                <span className="tw:text-[11px] tw:px-2 tw:py-1 tw:rounded-full tw:bg-white/80 tw:border tw:border-pink-100 tw:text-gray-700">
                  종: <b className="tw:ml-1">{species === 'dog' ? '강아지' : '고양이'}</b>
                </span>
              )}
              {company && (
                <span className="tw:text-[11px] tw:px-2 tw:py-1 tw:rounded-full tw:bg-white/80 tw:border tw:border-pink-100 tw:text-gray-700">
                  보험사: <b className="tw:ml-1">{COMPANY_OPTIONS.find(o => o.value === company)?.label || company}</b>
                </span>
              )}
            </div>

            {/* 액션 */}
            <div className="tw:mt-5 tw:flex tw:flex-wrap tw:items-center tw:gap-3">
              <a href="#faq" className="tw:inline-flex tw:items-center tw:gap-1 tw:text-sm tw:text-rose-600 hover:tw:underline">
                자주 묻는 질문 보기
                <svg className="tw:w-4 tw:h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"/></svg>
              </a>
            </div>
          </div>

          {/* Right: 로고 + 회사 셀렉트 카드 */}
          <div className="tw:w-full md:tw:w-[360px]">
            <div className="tw:bg-white/80 tw:backdrop-blur-sm tw:rounded-2xl tw:p-5 tw:border tw:border-pink-100 tw:shadow-sm">
              <div className="tw:flex tw:items-center tw:justify-center tw:mb-4">
                <img src={zootopiaLogo} alt="주토피아" className="tw:w-20 tw:h-20 tw:object-contain" />
              </div>
              <p className="tw:text-center tw:text-sm tw:text-gray-600 tw:mb-4">원하는 보험사를 골라보세요</p>

              <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-1">보험사</label>
              <select
                value={companySelect}
                onChange={onChangeCompanySelect}
                className="tw:w-full tw:border tw:border-pink-100 tw:rounded-xl tw:px-3 tw:py-2 tw:text-sm tw:bg-white focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#F27A7A]/30"
              >
                {COMPANY_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              <div className="tw:mt-4 tw:text-center">
                <span className="tw:inline-flex tw:items-center tw:gap-2 tw:text-xs tw:text-gray-500">
                  <span className="tw:inline-flex tw:h-5 tw:w-5 tw:items-center tw:justify-center tw:rounded tw:bg-emerald-100">✓</span>
                  조건을 바꾸면 자동으로 결과가 갱신돼요
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ──────────────── /Hero ──────────────── */}

      {/* TIP 영역 (파스텔 핑크) */}
      <div className="tw:mt-10 tw:rounded-2xl tw:bg-pink-50/70 tw:border tw:border-pink-100 tw:p-4">
        <div className="tw:flex tw:items-center tw:justify-center tw:gap-2 tw:text-gray-800">
          <span className="tw:text-lg">💡</span>
          <span className="tw:font-semibold">Tip</span>
        </div>
        <div className="tw:mt-3 tw:flex tw:flex-col tw:items-center tw:gap-1 tw:text-sm tw:text-gray-700">
          <div className="tw:flex tw:items-center tw:gap-2">
            <span className="tw:inline-flex tw:h-5 tw:w-5 tw:items-center tw:justify-center tw:rounded tw:bg-teal-500 tw:text-white tw:text-xs">✓</span>
            <span>슬개골 탈구, 피부병은 가입 전에 보장 여부 꼭 확인</span>
          </div>
          <div className="tw:flex tw:items-center tw:gap-2">
            <span className="tw:inline-flex tw:h-5 tw:w-5 tw:items-center tw:justify-center tw:rounded tw:bg-teal-500 tw:text-white tw:text-xs">✓</span>
            <span>보험료는 연령, 품종, 선택 보장 범위에 따라 달라짐</span>
          </div>
        </div>
      </div>

      {/* 카드 리스트 */}
      <div className="tw:mt-8">
        {loading ? (
          <div className="tw:grid tw:grid-cols-1 sm:tw:grid-cols-2 tw:gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="tw:h-[220px] tw:rounded-2xl tw:bg-white tw:shadow-sm tw:border tw:border-pink-100 tw:animate-pulse">
                <div className="tw:h-full tw:p-5">
                  <div className="tw:h-4 tw:w-1/3 tw:bg-pink-100 tw:rounded tw:mb-4" />
                  <div className="tw:h-3 tw:w-1/2 tw:bg-pink-50 tw:rounded tw:mb-6" />
                  <div className="tw:space-y-2">
                    <div className="tw:h-3 tw:w-3/4 tw:bg-pink-50 tw:rounded" />
                    <div className="tw:h-3 tw:w-2/3 tw:bg-pink-50 tw:rounded" />
                    <div className="tw:h-3 tw:w-1/2 tw:bg-pink-50 tw:rounded" />
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
                className="tw:group tw:relative tw:rounded-2xl tw:bg-white tw:border tw:border-pink-100 tw:shadow-sm hover:tw:shadow-xl hover:tw:-translate-y-0.5 tw:transition-all tw:duration-300 tw:overflow-hidden"
              >
                <div className="tw:absolute -tw-top-[1px] tw:left-0 tw:right-0 tw:h-1 tw:bg-gradient-to-r tw:from-[#F27A7A] tw:to-[#FDA4AF]" />
                <div className="tw:p-5 tw:flex tw:flex-col tw:h-full">
                  <div className="tw:flex tw:items-start tw:justify-between tw:gap-3">
                    <h6 className="tw:font-extrabold tw:text-lg tw:text-gray-800">🐾 {p.name}</h6>
                    <span className="tw:text-[11px] tw:px-2 tw:py-0.5 tw:rounded-full tw:border tw:border-pink-100 tw:bg-pink-50 tw:text-rose-500">
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
                      <span className="tw:inline-flex tw:h-5 tw:w-5 tw:items-center tw:justify-center tw:rounded tw:bg-teal-100">💎</span>
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
                      className="tw:inline-flex tw:items-center tw:gap-1 tw:rounded-xl tw:bg-[#F27A7A] tw:text-white tw:px-4 tw:py-2 tw:text-sm tw:font-semibold hover:tw:bg-[#E76A6A] tw:shadow-sm hover:tw:shadow tw:transition-all"
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

      {/* 페이지네이션 */}
      <div className="tw:mt-10 tw:flex tw:justify-center tw:items-center tw:gap-2">
        <button
          className="tw:h-9 tw:min-w-9 tw:px-3 tw:rounded-lg tw:border tw:border-pink-100 hover:tw:bg-pink-50 disabled:tw:opacity-40"
          disabled={page <= 1}
          onClick={() => handlePageChange(page - 1)}
        >이전</button>

        <div className="tw:flex tw:gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              onClick={() => handlePageChange(n)}
              className={`tw:h-9 tw:min-w-9 tw:px-3 tw:rounded-lg tw:border tw:text-sm tw:transition-colors
                ${n === page ? 'tw:bg-[#F27A7A] tw:text-white tw:border-[#F27A7A]' : 'tw:border-pink-100 hover:tw:bg-pink-50'}`}
            >{n}</button>
          ))}
        </div>

        <button
          className="tw:h-9 tw:min-w-9 tw:px-3 tw:rounded-lg tw:border tw:border-pink-100 hover:tw:bg-pink-50 disabled:tw:opacity-40"
          disabled={page >= totalPages}
          onClick={() => handlePageChange(page + 1)}
        >다음</button>
      </div>

      {/* 관리자만 등록 */}
      {isAdmin && (
        <div className="tw:mt-6 tw:text-right">
          <Link to="/insurance/insert" className={btn}>상품등록</Link>
        </div>
      )}

      {/* FAQ 앵커 */}
      <div id="faq" className="tw:scroll-mt-24">
        <FaqSection />
      </div>
    </div>
  )
}
