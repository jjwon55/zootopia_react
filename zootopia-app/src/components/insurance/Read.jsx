import React, { useEffect, useState, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import { LoginContext } from '../../context/LoginContextProvider'

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

export default function InsuranceRead() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const { roles, isLogin } = useContext(LoginContext) || { roles: [], isLogin: false }
  const isAdmin = roles?.includes?.('ADMIN')

  useEffect(()=> {
    (async () => {
      setLoading(true)
      try {
        const data = await req(`/insurance/read/${id}`)
        setProduct(data.product)
      } finally { setLoading(false) }
    })()
  }, [id])

  if (loading) return <div className="p-4">로딩 중…</div>
  if (!product) return <div className="p-4">상품을 찾을 수 없습니다.</div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h3 className="text-2xl font-bold text-center mb-8">{product.name}</h3>

      <div className="flex flex-col md:flex-row gap-10">
        <div className="text-center">
          {product.imagePath && <img src={product.imagePath} alt="" className="w-[350px] max-w-full rounded mb-4 inline-block" />}
          <ul className="text-sm text-left mx-auto max-w-xs space-y-1">
            <li>✅ 보장 비율: {product.coveragePercent}%</li>
            <li>💰 월 보험료: {product.monthlyFeeRange}</li>
            <li>💎 월 최대 보장 한도: {product.maxCoverage} 만 원</li>
          </ul>
        </div>
        <div className="flex-1">
          <Section title="🐶 가입 조건" body={product.joinCondition} />
          <Section title="📌 보장 항목" body={product.coverageItems} />
          <Section title="⚠️ 유의사항" body={product.precautions} />
        </div>
      </div>

      <div className="flex items-center justify-between mt-8">
        <button className={btn}>결제하기</button>
        <div className="space-x-2">
          <Link to="/insurance/list" className={btn}>목록</Link>
          {isAdmin && (
            <Link to={`/insurance/update/${product.productId}`} className={btn}>수정</Link>
          )}
        </div>
      </div>

      <hr className="my-8" />

      <QnaBlock productId={product.productId} isLogin={isLogin} isAdmin={isAdmin} />
    </div>
  )
}

function Section({ title, body }) {
  return (
    <div className="mb-6">
      <h6 className="font-bold text-lg mb-2">{title}</h6>
      <p className="text-sm whitespace-pre-wrap">{body}</p>
    </div>
  )
}

function QnaBlock({ productId, isLogin, isAdmin }) {
  const [list, setList] = useState([])
  const [pagination, setPagination] = useState({ page:1, totalPage:1 })
  const [species, setSpecies] = useState('')
  const [question, setQuestion] = useState('')

  const load = async (page=1) => {
    const data = await req(`/insurance/qna/list?productId=${productId}&page=${page}`)
    setList(data.qnaList || [])
    setPagination(data.pagination || { page, totalPage:1 })
  }

  useEffect(()=>{ load(1) }, [productId])

  const register = async () => {
    if (!question.trim()) return alert('질문 내용을 입력하세요.')
    await req('/insurance/qna/register-ajax', { method:'POST', json: { species: species || null, question, productId } })
    setSpecies(''); setQuestion('')
    load(1)
  }
  const update = async (qnaId, next) => {
    await req('/insurance/qna/edit-ajax', { method:'POST', json: { qnaId, productId, ...next } })
    load(pagination.page)
  }
  const remove = async (qnaId) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    await req(`/insurance/qna/delete-ajax/${qnaId}?productId=${productId}`, { method:'POST' })
    load(pagination.page)
  }
  const answer = async (qnaId, ans) => {
    await req('/insurance/qna/answer', { method:'POST', json: { qnaId, productId, answer: ans } })
    load(pagination.page)
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">🐾</span>
        <h5 className="font-bold text-lg">펫보험 Q&A</h5>
      </div>

      {!isLogin ? (
        <div className="text-center mb-4">
          <a href="/login" className={btn}>🔐 로그인 후 이용하기</a>
        </div>
      ) : !isAdmin ? (
        <div className="flex gap-2 mb-4">
          <select value={species} onChange={e=>setSpecies(e.target.value)} className="border rounded px-2 py-2 max-w-[150px] bg-white">
            <option value="">선택 없음</option>
            <option value="강아지">강아지</option>
            <option value="고양이">고양이</option>
          </select>
          <input value={question} onChange={e=>setQuestion(e.target.value)} placeholder="질문" className="flex-1 border rounded px-3 py-2" />
          <button onClick={register} className={btn}>질문 등록</button>
        </div>
      ) : null}

      <div className="space-y-3">
        {list.length === 0 ? (
          <div className="text-center text-gray-500">등록된 질문이 없습니다.</div>
        ) : list.map(item => (
          <QnaItem key={item.qnaId} item={item} isAdmin={isAdmin}
            onSave={(next)=>update(item.qnaId, next)}
            onDelete={()=>remove(item.qnaId)}
            onAnswer={(ans)=>answer(item.qnaId, ans)}
          />
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-1">
        <button className="px-3 py-1 border rounded hover:bg-rose-50 disabled:opacity-40"
          disabled={pagination.page<=1}
          onClick={()=> load(pagination.page-1)}>이전</button>
        {Array.from({ length: pagination.totalPage||1 }, (_,i)=>i+1).map(n=>(
          <button key={n}
            className={`px-3 py-1 border rounded hover:bg-rose-50 ${n===pagination.page?'bg-[#F27A7A] text-white border-[#F27A7A]':''}`}
            onClick={()=> load(n)}>{n}</button>
        ))}
        <button className="px-3 py-1 border rounded hover:bg-rose-50 disabled:opacity-40"
          disabled={pagination.page>=(pagination.totalPage||1)}
          onClick={()=> load(pagination.page+1)}>다음</button>
      </div>
    </div>
  )
}

function QnaItem({ item, isAdmin, onSave, onDelete, onAnswer }) {
  const [editing, setEditing] = useState(false)
  const [species, setSpecies] = useState(item.species || '')
  const [question, setQuestion] = useState(item.question || '')
  const [answer, setAns] = useState(item.answer || '')
  const canEdit = item.writer && (!item.answer || item.answer === '')

  return (
    <div className="border rounded p-3 bg-white">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm">
            <span className="inline-block px-2 py-0.5 text-xs bg-yellow-200 rounded mr-1">
              {item.species || '기타'}
            </span>
            <b>{item.question}</b>
          </div>
          <div className="text-xs text-gray-500">
            답변: {item.answer ? '1':'0'} | 작성자: {item.nickname} | {item.createdAt}
          </div>
        </div>
        {(item.writer || item.admin) && (
          <button onClick={onDelete} className="text-xs border px-2 py-1 rounded hover:bg-rose-50">삭제</button>
        )}
      </div>

      {canEdit && (
        <div className="mt-2">
          {!editing ? (
            <button onClick={()=>setEditing(true)} className="border rounded px-3 py-1 hover:bg-rose-50">수정</button>
          ) : (
            <div className="mt-2 space-y-2">
              <select value={species} onChange={e=>setSpecies(e.target.value)} className="border rounded px-2 py-1 bg-white">
                <option value="">선택 없음</option>
                <option value="강아지">강아지</option>
                <option value="고양이">고양이</option>
              </select>
              <input value={question} onChange={e=>setQuestion(e.target.value)} className="w-full border rounded px-2 py-1" />
              <div className="flex gap-2">
                <button onClick={()=>{ onSave({ species, question }); setEditing(false) }} className={btn}>저장</button>
                <button onClick={()=>setEditing(false)} className="border rounded px-3 py-1 hover:bg-rose-50">취소</button>
              </div>
            </div>
          )}
        </div>
      )}

      {isAdmin && (
        <div className="mt-3">
          <textarea className="w-full border rounded px-2 py-1" value={answer} onChange={e=>setAns(e.target.value)} placeholder="관리자 답변" />
          <button onClick={()=>onAnswer(answer)} className={`${btn} mt-2`}>답변 등록</button>
        </div>
      )}

      {!isAdmin && item.answer && (
        <details className="mt-2">
          <summary className="cursor-pointer select-none text-sm">답변 보기</summary>
          <div className="mt-2 text-sm">{item.answer}</div>
        </details>
      )}
    </div>
  )
}