import React, { useEffect, useState, useContext, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import Read from '../../components/insurance/Read'
import { LoginContext } from '../../context/LoginContextProvider'
import { req } from '../../apis/utils/http'

// ✅ 수정: 세션 우선 → 현재 로그인 사용자를 정확히 반영

export default function ReadContainer() {
  const { productId } = useParams() // productId
  const id = productId // 이후 코드에서 id 그대로 사용해도 됨
  const ctx = useContext(LoginContext) || {}
  const { isLogin } = ctx
  // 다양한 형태(문자열/객체, ROLE_ prefix 포함)에 대응
  const roleSources = [
    ctx.roles,
    ctx.authList,
    ctx.authorities,
    ctx.userInfo?.roles,
    ctx.userInfo?.authList,
    ctx.userInfo?.authorities,
  ].filter(Boolean)
  const flatRoles = roleSources.flatMap(v => Array.isArray(v) ? v : [v])
  const roleToString = (r) => typeof r === 'string'
    ? r
    : (r?.auth || r?.role || r?.authority || r?.name || '')
  const isAdmin = flatRoles.some(r =>
    /(^|_)ADMIN$/i.test(roleToString(r).toUpperCase())
  )

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
      if (!id) { setError('잘못된 접근입니다.'); return; }
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
      if (!id) { setQnaError('잘못된 접근입니다.'); return; }
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
    if (isAdmin) return; // 관리자면 조용히 무시
     await req('/insurance/qna/register-ajax', {
       method: 'POST',
       json: { species: species || null, question, productId: id },
       auth: true
     })
  }
  const onQnaEdit = async ({ qnaId, species, question }) => {
    if (isAdmin) return; // 관리자면 조용히 무시
     await req('/insurance/qna/edit-ajax', {
       method: 'POST',
       json: { qnaId, species, question, productId: id },
       auth: true
     })
    }
  const onQnaDelete = async ({ qnaId }) => {
    await req(`/insurance/qna/delete-ajax/${qnaId}?productId=${id}`, { method: 'POST' })
    await loadQna(qna.pagination.page)
  }

  const onQnaAnswer = async ({ qnaId, answer }) => {
   await req('/insurance/qna/answer', {
     method: 'POST',
     json: { qnaId, answer, productId: id },
     auth: true
   })
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