import React, { useEffect, useState, useContext } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { LoginContext } from '../../context/LoginContextProvider'
import insuranceLogo from "../../assets/img/insurancelogo.png"
import zootopiaLogo from "../../assets/img/zootopialogo.png"
import FaqSection from './FaqSection'

// ── fetch 헬퍼 (쿠키 CSRF → 헤더 전달)
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

const btn = 'inline-block rounded px-3 py-2 text-white bg-[#F27A7A] hover:opacity-90'

export default function InsuranceList() {
  const [items, setItems] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const { roles } = useContext(LoginContext) || { roles: [] }

  const page = Number(searchParams.get('page')) || 1
  const species = searchParams.get('species') || ''
  const company = searchParams.get('company') || ''

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const data = await req(`/insurance/list?species=${species}&company=${company}&page=${page}`)
        setItems(data.products || [])
        setTotalPages(data.totalPages || 1)
      } finally { setLoading(false) }
    })()
  }, [page, species, company])

  const setFilter = (kv) => {
    const next = new URLSearchParams(searchParams)
    Object.entries(kv).forEach(([k,v]) => v ? next.set(k,v) : next.delete(k))
    next.set('page', 1)
    setSearchParams(next)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl !font-bold text-center mb-8">펫 보험</h2>

      {/* 상단: 로고 + 필터 카드 */}
      <div className="mt-5 flex flex-col md:flex-row items-center justify-center gap-12">
        {/* 왼쪽 로고 이미지 */}
        <div className="shrink-0 text-center">
          <img
            src={insuranceLogo}  // ← 프로젝트 경로에 맞게 수정
            alt="보험 로고"
            className="w-[360px] max-w-full rounded-lg shadow"
          />
        </div>

        {/* 오른쪽 필터 */}
        <div className="w-full max-w-[360px] bg-rose-50 rounded-xl p-5 shadow">
          <p className="text-center font-semibold mb-4">🐶 원하는 보험 찾기 🐱</p>

          <div className="flex justify-center gap-2 mb-6">
            <button
              className={`border rounded px-3 py-1 ${species==='dog'?'bg-white border-rose-300':''}`}
              onClick={()=> setFilter({ species:'dog' })}
            >강아지</button>
            <button
              className={`border rounded px-3 py-1 ${species==='cat'?'bg-white border-rose-300':''}`}
              onClick={()=> setFilter({ species:'cat' })}
            >고양이</button>
          </div>

          <select
            className="w-full border rounded px-2 py-2 text-sm bg-white"
            value={company}
            onChange={(e)=> setFilter({ company: e.target.value })}
          >
            <option value="">전체</option>
            <option value="삼성화재">삼성화재</option>
            <option value="KB">KB</option>
            <option value="메리츠">메리츠</option>
          </select>

          <div className="text-center mt-6">
            <img src={zootopiaLogo} alt="주토피아" className="w-16 mx-auto" />
            <p className="text-xs mt-1 font-semibold text-gray-500">🏡 펫과 함께, 더 나은 내일을</p>
          </div>
        </div>
      </div>

      {/* TIP 영역 */}
      <div className="mt-8">
        <div className="flex items-center justify-center gap-2 text-gray-800">
          <span className="text-lg">💡</span>
          <span className="font-semibold">Tip</span>
        </div>
        <div className="mt-2 flex flex-col items-center gap-1 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-green-500 text-white text-xs">✓</span>
            <span>슬개골 탈구, 피부병은 가입 전에 보장 여부 꼭 확인</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-green-500 text-white text-xs">✓</span>
            <span>보험료는 연령, 품종, 선택 보장 범위에 따라 달라짐</span>
          </div>
        </div>
      </div>

      {/* 카드 리스트 */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {loading && <div className="text-center text-gray-500">로딩 중…</div>}
        {!loading && items.map(p => (
          <div key={p.productId} className="rounded-2xl border p-4 shadow-sm bg-white min-h-[240px] flex flex-col">
            <h6 className="font-bold mb-2">🐾 {p.name}</h6>
            <p className="text-sm text-gray-500 mb-4">{p.slogan}</p>
            <ul className="text-sm space-y-1 mb-4">
              <li>💰 <b>월 보험료:</b> {p.monthlyFeeRange}원</li>
              <li>💎 <b>월 최대 보장 한도:</b> {p.maxCoverage}만원</li>
              <li>✅ <b>보장 비율:</b> {p.coveragePercent}%</li>
            </ul>
            <div className="mt-auto text-right">
              <Link to={`/insurance/read/${p.productId}`} className={btn}>자세히 보기</Link>
            </div>
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="mt-10 flex justify-center gap-1">
        <button
          className="px-3 py-1 border rounded hover:bg-rose-50 disabled:opacity-40"
          disabled={page<=1}
          onClick={()=> setSearchParams({ species, company, page: page-1 })}
        >이전</button>
        {Array.from({ length: totalPages }, (_,i)=>i+1).map(n => (
          <button key={n}
            className={`px-3 py-1 border rounded hover:bg-rose-50 ${n===page?'bg-[#F27A7A] text-white border-[#F27A7A]':''}`}
            onClick={()=> setSearchParams({ species, company, page:n })}
          >{n}</button>
        ))}
        <button
          className="px-3 py-1 border rounded hover:bg-rose-50 disabled:opacity-40"
          disabled={page>=totalPages}
          onClick={()=> setSearchParams({ species, company, page: page+1 })}
        >다음</button>
      </div>

      {/* 관리자만 등록 */}
      {roles?.includes?.('ADMIN') && (
        <div className="mt-6 text-right">
          <Link to="/insurance/create" className={btn}>상품등록</Link>
        </div>
      )}

    <FaqSection />
    </div>
    
  )

}