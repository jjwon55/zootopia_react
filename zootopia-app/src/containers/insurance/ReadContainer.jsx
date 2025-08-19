import React, { useEffect, useState, useContext, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import Read from '../../components/insurance/Read'
import { LoginContext } from '../../context/LoginContextProvider'

// ✅ 통일: apis/insurance만 사용 (jwt는 인터셉터가 처리)
import {
  readProduct,
  getQnaList,
  registerQna,
  editQna,
  deleteQna,
  answerQna,
} from '../../apis/insurance/insurance'

export default function ReadContainer() {
  const { productId } = useParams()
  const id = productId

  const ctx = useContext(LoginContext) || {}
  const { isLogin } = ctx

  // 역할 파싱 → isAdmin
  const roleSources = [
    ctx.roles, ctx.authList, ctx.authorities,
    ctx.userInfo?.roles, ctx.userInfo?.authList, ctx.userInfo?.authorities,
  ].filter(Boolean)
  const flatRoles = roleSources.flatMap(v => Array.isArray(v) ? v : [v])
  const roleToString = (r) =>
    typeof r === 'string' ? r : (r?.auth || r?.role || r?.authority || r?.name || '')
  const isAdmin = flatRoles.some(r => /(^|_)ADMIN$/i.test(roleToString(r).toUpperCase()))

  // 상세 상태
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // QnA 상태
  const [qna, setQna] = useState({ list: [], pagination: { page: 1, totalPage: 1 } })
  const [qnaLoading, setQnaLoading] = useState(false)
  const [qnaError, setQnaError] = useState('')

  // 상세 로드
  const loadProduct = useCallback(async () => {
    setLoading(true); setError('')
    try {
      if (!id) { setError('잘못된 접근입니다.'); return }
      const { data } = await readProduct(id)
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
      if (!id) { setQnaError('잘못된 접근입니다.'); return }
      const { data } = await getQnaList({ productId: id, page })
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
    if (isAdmin) return // 정책: 관리자는 등록 X
    try {
      await registerQna({ productId: id, species: species || null, question })
      await loadQna(1) // 등록 후 첫 페이지로 새로고침
    } catch (e) {
      setQnaError(e.message || 'Q&A 등록 실패')
    }
  }

  const onQnaEdit = async ({ qnaId, species, question }) => {
    if (isAdmin) return // 정책: 관리자는 질문 수정 X
    try {
      await editQna({ qnaId, productId: id, species, question })
      await loadQna(qna.pagination.page)
    } catch (e) {
      setQnaError(e.message || 'Q&A 수정 실패')
    }
  }

  const onQnaDelete = async ({ qnaId }) => {
    try {
      await deleteQna({ qnaId, productId: id })
      await loadQna(qna.pagination.page)
    } catch (e) {
      setQnaError(e.message || 'Q&A 삭제 실패')
    }
  }

  const onQnaAnswer = async ({ qnaId, answer }) => {
    if (!isAdmin) return // 정책: 관리자만 답변
    try {
      await answerQna({ qnaId, productId: id, answer })
      await loadQna(qna.pagination.page)
    } catch (e) {
      setQnaError(e.message || '답변 등록 실패')
    }
  }

  const onQnaPageChange = (page) => loadQna(page)

  return (
    <Read
      product={product}
      loading={loading}
      error={error}
      isLogin={isLogin}
      isAdmin={isAdmin}
      qna={qna}
      qnaLoading={qnaLoading}
      qnaError={qnaError}
      onQnaRegister={onQnaRegister}
      onQnaEdit={onQnaEdit}
      onQnaDelete={onQnaDelete}
      onQnaAnswer={onQnaAnswer}
      onQnaPageChange={onQnaPageChange}
      reload={loadProduct}
    />
  )
}
