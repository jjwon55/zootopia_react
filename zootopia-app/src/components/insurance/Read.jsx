import React from 'react'
import { Link } from 'react-router-dom'
import QnaSection from '../../components/insurance/QnaSection'

const BTN =
  'tw:inline-flex tw:items-center tw:gap-1 tw:rounded-xl tw:px-3 tw:py-2 tw:text-white tw:bg-[#F27A7A] hover:tw:opacity-90 tw:shadow-sm tw:transition tw:duration-150 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#F27A7A]/60'
const BTN_OUTLINE =
  'tw:border tw:rounded-xl tw:px-3 tw:py-2 hover:tw:bg-rose-50 tw:transition tw:duration-150'

export default function Read({
  product,
  loading,
  error,
  isLogin,
  isAdmin,
  qna,
  qnaLoading,
  qnaError,
  onQnaRegister,
  onQnaEdit,
  onQnaDelete,
  onQnaAnswer,
  onQnaPageChange,
  reload,
}) {
  if (loading) return <div className="tw:p-6">로딩 중…</div>
  if (error)   return <div className="tw:p-6 tw:text-red-500">{error}</div>
  if (!product) return <div className="tw:p-6">상품을 찾을 수 없습니다.</div>

  return (
    <div className="tw:max-w-6xl tw:mx-auto tw:px-4 tw:py-10">
      {/* Hero */}
      <div className="tw:rounded-3xl tw:bg-gradient-to-r tw:from-[#FFF0F0] tw:to-white tw:border tw:border-rose-100 tw:p-6 tw:mb-8">
        <h3 className="tw:text-2xl tw:font-extrabold tw:text-[#333] tw:text-center">
          {product.name}
        </h3>
      </div>

      {/* 본문 카드 */}
      <div className="tw:grid md:tw:grid-cols-2 tw:gap-10">
        {/* 좌측: 썸네일 + 요약 */}
        <div className="tw:text-center tw:bg-white tw:border tw:border-rose-100 tw:rounded-3xl tw:p-5 tw:shadow-sm">
          {!!product.imagePath && (
            <img
              src={product.imagePath}
              alt={`${product.name} 대표 이미지`}
              className="tw:w-[360px] tw:max-w-full tw:rounded-2xl tw:mb-4 tw:inline-block tw:border tw:border-rose-100"
            />
          )}
          <ul className="tw:text-sm tw:text-left tw:mx-auto tw:max-w-xs tw:space-y-1">
            {product.company && <li>🏢 보험사: <b>{product.company}</b></li>}
            <li>✅ 보장 비율: <b>{product.coveragePercent}%</b></li>
            <li>💰 월 보험료: <b>{product.monthlyFeeRange}</b></li>
            <li>💎 월 최대 보장 한도: <b>{product.maxCoverage} 만 원</b></li>
          </ul>
        </div>

        {/* 우측: 상세 섹션 */}
        <div className="tw:space-y-6">
          <Section title="🐶 가입 조건" body={product.joinCondition} />
          <Section title="📌 보장 항목" body={product.coverageItems} />
          <Section title="⚠️ 유의사항" body={product.precautions} />
        </div>
      </div>

      {/* 액션 */}
      <div className="tw:flex tw:flex-col md:tw:flex-row tw:items-center tw:justify-between tw:gap-3 tw:mt-8">
        <button className={BTN}>상담/가입 문의</button>
        <div className="tw:space-x-2">
          <Link to="/insurance/list" className={BTN_OUTLINE}>목록</Link>
          {isAdmin && (
            <Link to={`/insurance/update/${product.productId}`} className={BTN}>수정</Link>
          )}
        </div>
      </div>

      <hr className="tw:my-8 tw:border-rose-100" />

      {/* Q&A */}
      <QnaSection
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
        buttonClassName={BTN}
      />
    </div>
  )
}

function Section({ title, body }) {
  return (
    <div className="tw:bg-white tw:border tw:border-rose-100 tw:rounded-3xl tw:p-5 tw:shadow-sm">
      <h6 className="tw:font-bold tw:text-lg tw:mb-2 tw:text-[#333]">{title}</h6>
      <p className="tw:text-sm tw:text-[#444] tw:whitespace-pre-wrap">{body}</p>
    </div>
  )
}