import React, { useEffect, useState, useContext, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import Read from '../../components/insurance/read'
import { LoginContext } from '../../context/LoginContextProvider'

// ── 공통 fetch 헬퍼 (SPA-CSRF: XSRF-TOKEN 쿠키 → X-XSRF-TOKEN 헤더)
const getCsrf = () =>
  decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || '')

async function req(url, { method = 'GET', json, formData } = {}) {
  const headers = {}
  const init = { method, credentials: 'include' }
  const token = getCsrf()
  if (token) headers['X-XSRF-TOKEN'] = token
  if (json) { headers['Content-Type'] = 'application/json'; init.body = JSON.stringify(json) }
  if (formData) { init.body = formData }
  init.headers = headers

  const res = await fetch('/api' + url, init)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status} ${text}`)
  }
  return res.headers.get('content-type')?.includes('application/json')
    ? res.json()
    : {}
}

export default function ReadContainer() {
  const { id } = useParams() // productId
  const { roles, isLogin } = useContext(LoginContext) || { roles: [], isLogin: false }
  const isAdmin = roles?.includes?.('ADMIN')

  // 상품 상세
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // QnA
  const [qna, setQna] = useState({
    list: [],
    pagination: { page: 1, totalPage: 1 }
  })
  const [qnaLoading, setQnaLoading] = useState(false)
  const [qnaError, setQnaError] = useState('')

  // 상세 로드
  const loadProduct = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const data = await req(`/insurance/read/${id}`)
      setProduct(data.product || null)
    } catch (e) {
      setError(e.message || '상세 조회 실패')
    } finally {
      setLoading(false)
    }
  }, [id])

  // QnA 로드
  const loadQna = useCallback(async (page = 1) => {
    setQnaLoading(true); setQnaError('')
    try {
      const data = await req(`/insurance/qna/list?productId=${id}&page=${page}`)
      setQna({
        list: data.qnaList || [],
        pagination: data.pagination || { page, totalPage: 1 }
      })
    } catch (e) {
      setQnaError(e.message || 'Q&A 조회 실패')
    } finally {
      setQnaLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadProduct()
    loadQna(1)
  }, [loadProduct, loadQna])

  // QnA 액션들
  const onQnaRegister = async ({ species, question }) => {
    await req('/insurance/qna/register-ajax', {
      method: 'POST',
      json: { species: species || null, question, productId: id }
    })
    await loadQna(1)
  }

  const onQnaEdit = async ({ qnaId, species, question }) => {
    await req('/insurance/qna/edit-ajax', {
      method: 'POST',
      json: { qnaId, species, question, productId: id }
    })
    await loadQna(qna.pagination.page)
  }

  const onQnaDelete = async ({ qnaId }) => {
    await req(`/insurance/qna/delete-ajax/${qnaId}?productId=${id}`, { method: 'POST' })
    await loadQna(qna.pagination.page)
  }

  const onQnaAnswer = async ({ qnaId, answer }) => {
    await req('/insurance/qna/answer', {
      method: 'POST',
      json: { qnaId, answer, productId: id }
    })
    await loadQna(qna.pagination.page)
  }

  const onQnaPageChange = (page) => loadQna(page)

  return (
    <Read
      // 상세
      product={product}
      loading={loading}
      error={error}
      isLogin={isLogin}
      isAdmin={isAdmin}
      // QnA
      qna={qna}
      qnaLoading={qnaLoading}
      qnaError={qnaError}
      onQnaRegister={onQnaRegister}
      onQnaEdit={onQnaEdit}
      onQnaDelete={onQnaDelete}
      onQnaAnswer={onQnaAnswer}
      onQnaPageChange={onQnaPageChange}
      // 필요 시 상세 재로딩
      reload={loadProduct}
    />
  )
}