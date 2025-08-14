import React from 'react'
import { Link } from 'react-router-dom'

const BTN = 'tw:inline-block tw:rounded tw:px-3 tw:py-2 tw:text-white tw:bg-[#F27A7A] hover:tw:opacity-90'

export default function Read({
  // 상세
  product,
  loading,
  error,
  isLogin,
  isAdmin,
  // QnA
  qna,            // { list, pagination: { page, totalPage } }
  qnaLoading,
  qnaError,
  onQnaRegister,
  onQnaEdit,
  onQnaDelete,
  onQnaAnswer,
  onQnaPageChange,
  // 필요 시 상세 재로딩
  reload,
}) {
  if (loading) return <div className="tw:p-4">로딩 중…</div>
  if (error)   return <div className="tw:p-4 tw:text-red-500">{error}</div>
  if (!product) return <div className="tw:p-4">상품을 찾을 수 없습니다.</div>

  return (
    <div className="tw:max-w-5xl tw:mx-auto tw:px-4 tw:py-10">
      <h3 className="tw:text-2xl tw:font-bold tw:text-center tw:mb-8">{product.name}</h3>

      <div className="tw:flex tw:flex-col md:tw:flex-row tw:gap-10">
        <div className="tw:text-center">
          {!!product.imagePath && (
            <img
              src={product.imagePath}
              alt=""
              className="tw:w-[350px] tw:max-w-full tw:rounded tw:mb-4 tw:inline-block"
            />
          )}
          <ul className="tw:text-sm tw:text-left tw:mx-auto tw:max-w-xs tw:space-y-1">
            <li>✅ 보장 비율: {product.coveragePercent}%</li>
            <li>💰 월 보험료: {product.monthlyFeeRange}</li>
            <li>💎 월 최대 보장 한도: {product.maxCoverage} 만 원</li>
          </ul>
        </div>

        <div className="tw:flex-1">
          <Section title="🐶 가입 조건" body={product.joinCondition} />
          <Section title="📌 보장 항목" body={product.coverageItems} />
          <Section title="⚠️ 유의사항" body={product.precautions} />
        </div>
      </div>

      <div className="tw:flex tw:items-center tw:justify-between tw:mt-8">
        <button className={BTN}>결제하기</button>
        <div className="tw:space-x-2">
          <Link to="/insurance/list" className={BTN}>목록</Link>
          {isAdmin && (
            <Link to={`/insurance/update/${product.productId}`} className={BTN}>수정</Link>
          )}
        </div>
      </div>

      <hr className="tw:my-8" />

      {/* Q&A 영역 */}
      <QnaBlock
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
      />
    </div>
  )
}

function Section({ title, body }) {
  return (
    <div className="tw:mb-6">
      <h6 className="tw:font-bold tw:text-lg tw:mb-2">{title}</h6>
      <p className="tw:text-sm tw:whitespace-pre-wrap">{body}</p>
    </div>
  )
}

function QnaBlock({
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
}) {
  const [species, setSpecies] = React.useState('')
  const [question, setQuestion] = React.useState('')

  const register = async () => {
    if (!question.trim()) return alert('질문 내용을 입력하세요.')
    await onQnaRegister({ species: species || null, question })
    setSpecies('')
    setQuestion('')
  }

  return (
    <div>
      <div className="tw:flex tw:items-center tw:gap-2 tw:mb-3">
        <span className="tw:text-2xl">🐾</span>
        <h5 className="tw:font-bold tw:text-lg">펫보험 Q&A</h5>
      </div>

      {!isLogin ? (
        <div className="tw:text-center tw:mb-4">
          <a href="/login" className={BTN}>🔐 로그인 후 이용하기</a>
        </div>
      ) : !isAdmin ? (
        <div className="tw:flex tw:gap-2 tw:mb-4">
          <select
            value={species}
            onChange={e=>setSpecies(e.target.value)}
            className="tw:border tw:rounded tw:px-2 tw:py-2 tw:max-w-[150px] tw:bg-white"
          >
            <option value="">선택 없음</option>
            <option value="강아지">강아지</option>
            <option value="고양이">고양이</option>
          </select>
          <input
            value={question}
            onChange={e=>setQuestion(e.target.value)}
            placeholder="질문"
            className="tw:flex-1 tw:border tw:rounded tw:px-3 tw:py-2"
          />
          <button onClick={register} className={BTN}>질문 등록</button>
        </div>
       ) : (
         <div className="tw:mb-4 tw:text-sm tw:text-gray-600">
           관리자 계정은 질문 등록이 불가합니다.
         </div>
       )}

      {qnaLoading && <div className="tw:text-sm tw:text-gray-500">Q&A 불러오는 중…</div>}
      {qnaError && <div className="tw:text-sm tw:text-red-500">{qnaError}</div>}

      <div className="tw:space-y-3">
        {(!qna?.list || qna.list.length === 0) ? (
          <div className="tw:text-center tw:text-gray-500">등록된 질문이 없습니다.</div>
        ) : qna.list.map(item => (
          <QnaItem
            key={item.qnaId}
            item={item}
            isAdmin={isAdmin}
            onSave={(next)=>onQnaEdit({ qnaId: item.qnaId, ...next })}
            onDelete={()=>onQnaDelete({ qnaId: item.qnaId })}
            onAnswer={(answer)=>onQnaAnswer({ qnaId: item.qnaId, answer })}
          />
        ))}
      </div>

      <div className="tw:mt-4 tw:flex tw:justify-center tw:gap-1">
        <button
          className="tw:px-3 tw:py-1 tw:border tw:rounded hover:tw:bg-rose-50"
          disabled={(qna?.pagination?.page || 1) <= 1}
          onClick={()=> onQnaPageChange((qna?.pagination?.page || 1) - 1)}
        >이전</button>

        {Array.from({ length: qna?.pagination?.totalPage || 1 }, (_,i)=>i+1).map(n=>(
          <button
            key={n}
            className={`tw:px-3 tw:py-1 tw:border tw:rounded hover:tw:bg-rose-50 ${n===(qna?.pagination?.page||1)?'tw:bg-[#F27A7A] tw:text-white tw:border-[#F27A7A]':''}`}
            onClick={()=> onQnaPageChange(n)}
          >{n}</button>
        ))}

        <button
          className="tw:px-3 tw:py-1 tw:border tw:rounded hover:tw:bg-rose-50"
          disabled={(qna?.pagination?.page || 1) >= (qna?.pagination?.totalPage || 1)}
          onClick={()=> onQnaPageChange((qna?.pagination?.page || 1) + 1)}
        >다음</button>
      </div>
    </div>
  )
}

function QnaItem({ item, isAdmin, onSave, onDelete, onAnswer }) {
  const [editing, setEditing] = React.useState(false)
  const [species, setSpecies] = React.useState(item.species || '')
  const [question, setQuestion] = React.useState(item.question || '')
  const [answer, setAns] = React.useState(item.answer || '')
  const canEdit = item.writer && (!item.answer || item.answer === '')

  return (
    <div className="tw:border tw:rounded tw:p-3 tw:bg-white">
      <div className="tw:flex tw:justify-between tw:items-start">
        <div>
          <div className="tw:text-sm">
            <span className="tw:inline-block tw:px-2 tw:py-0.5 tw:text-xs tw:bg-yellow-200 tw:rounded tw:mr-1">
              {item.species || '기타'}
            </span>
            <b>{item.question}</b>
          </div>
          <div className="tw:text-xs tw:text-gray-500">
            답변: {item.answer ? '1':'0'} | 작성자: {item.nickname} | {item.createdAt}
          </div>
        </div>
        {(item.writer || item.admin) && (
          <button onClick={onDelete} className="tw:text-xs tw:border tw:px-2 tw:py-1 tw:rounded hover:tw:bg-rose-50">삭제</button>
        )}
      </div>

      {canEdit && (
        <div className="tw:mt-2">
          {!editing ? (
            <button onClick={()=>setEditing(true)} className="tw:border tw:rounded tw:px-3 tw:py-1 hover:tw:bg-rose-50">수정</button>
          ) : (
            <div className="tw:mt-2 tw:space-y-2">
              <select
                value={species}
                onChange={e=>setSpecies(e.target.value)}
                className="tw:border tw:rounded tw:px-2 tw:py-1 tw:bg-white"
              >
                <option value="">선택 없음</option>
                <option value="강아지">강아지</option>
                <option value="고양이">고양이</option>
              </select>
              <input
                value={question}
                onChange={e=>setQuestion(e.target.value)}
                className="tw:w-full tw:border tw:rounded tw:px-2 tw:py-1"
              />
              <div className="tw:flex tw:gap-2">
                <button
                  onClick={()=>{ onSave({ species, question }); setEditing(false) }}
                  className={BTN}
                >저장</button>
                <button
                  onClick={()=>setEditing(false)}
                  className="tw:border tw:rounded tw:px-3 tw:py-1 hover:tw:bg-rose-50"
                >취소</button>
              </div>
            </div>
          )}
        </div>
      )}

      {isAdmin && (
        <div className="tw:mt-3">
          <textarea
            className="tw:w-full tw:border tw:rounded tw:px-2 tw:py-1"
            value={answer}
            onChange={e=>setAns(e.target.value)}
            placeholder="관리자 답변"
          />
          <button onClick={()=>onAnswer(answer)} className={`${BTN} tw:mt-2`}>답변 등록</button>
        </div>
      )}

      {!isAdmin && item.answer && (
        <details className="tw:mt-2">
          <summary className="tw:cursor-pointer tw:select-none tw:text-sm">답변 보기</summary>
          <div className="tw:mt-2 tw:text-sm">{item.answer}</div>
        </details>
      )}
    </div>
  )
}