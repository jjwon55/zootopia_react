import React from 'react'
import { Link } from 'react-router-dom'

const BTN_PRIMARY =
  'tw:inline-flex tw:items-center tw:gap-1 tw:rounded-xl tw:px-3 tw:py-2 tw:text-white tw:bg-[#F27A7A] hover:tw:opacity-90 tw:shadow-sm tw:transition tw:duration-150 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#F27A7A]/60'
const BTN_GHOST =
  'tw:border tw:rounded-xl tw:px-3 tw:py-2 hover:tw:bg-rose-50 tw:transition tw:duration-150 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-rose-200'

export default function QnaSection({
  isLogin,
  isAdmin,
  qna,             // { list, pagination: { page, totalPage } }
  qnaLoading,
  qnaError,
  onQnaRegister,
  onQnaEdit,
  onQnaDelete,
  onQnaAnswer,
  onQnaPageChange,
  buttonClassName = BTN_PRIMARY,
}) {
  const [species, setSpecies] = React.useState('')
  const [question, setQuestion] = React.useState('')

  const register = async () => {
    if (!question.trim()) return alert('질문 내용을 입력하세요.')
    await onQnaRegister?.({ species: species || null, question })
    setSpecies('')
    setQuestion('')
  }

  return (
    <section className="tw:mt-10">
      {/* 헤더 */}
      <div className="tw:flex tw:items-center tw:gap-3 tw:mb-4">
        <div className="tw:h-9 tw:w-9 tw:flex tw:items-center tw:justify-center tw:bg-[#FFF0F0] tw:text-[#F27A7A] tw:rounded-xl">🐾</div>
        <h5 className="tw:font-extrabold tw:text-xl tw:text-[#333]">펫보험 Q&amp;A</h5>
      </div>

      {/* 작성 영역 */}
      {!isLogin ? (
        <div className="tw:text-center tw:mb-5 tw:bg-[#FFF5F5] tw:border tw:border-rose-100 tw:rounded-2xl tw:p-4">
          <p className="tw:mb-2 tw:text-[#444]">질문을 남기려면 로그인이 필요해요.</p>
          <Link to="/login" className={buttonClassName} aria-label="로그인 하러 가기">🔐 로그인 후 이용하기</Link>
        </div>
      ) : !isAdmin ? (
        <div className="tw:flex tw:flex-col md:tw:flex-row tw:gap-2 tw:mb-5">
          <select
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            className="tw:border tw:rounded-xl tw:px-3 tw:py-2 tw:max-w-[180px] tw:bg-white focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-rose-200"
            aria-label="동물 종류 선택"
          >
            <option value="">선택 없음</option>
            <option value="강아지">강아지</option>
            <option value="고양이">고양이</option>
          </select>

          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="어떤 점이 궁금하신가요?"
            className="tw:flex-1 tw:border tw:rounded-xl tw:px-3 tw:py-2 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-rose-200"
            aria-label="질문 입력"
          />
          <button onClick={register} className={buttonClassName} aria-label="질문 등록">➕ 질문 등록</button>
        </div>
      ) : (
        <div className="tw:mb-4 tw:text-sm tw:text-gray-600 tw:bg-rose-50 tw:border tw:border-rose-100 tw:rounded-2xl tw:p-3">
          관리자 계정은 질문 등록이 불가합니다.
        </div>
      )}

      {/* 상태 */}
      {qnaLoading && (
        <div className="tw:space-y-2 tw:mb-4">
          <div className="tw:h-20 tw:bg-rose-50 tw:rounded-2xl tw:animate-pulse" />
          <div className="tw:h-20 tw:bg-rose-50 tw:rounded-2xl tw:animate-pulse" />
        </div>
      )}
      {qnaError && <div className="tw:text-sm tw:text-red-500 tw:mb-3">{qnaError}</div>}

      {/* 리스트 */}
      <div className="tw:space-y-3">
        {(!qna?.list || qna.list.length === 0) ? (
          <div className="tw:text-center tw:text-gray-500 tw:bg-white tw:border tw:border-rose-100 tw:rounded-2xl tw:p-8">
            등록된 질문이 없습니다. 첫 번째 질문의 주인공이 되어 보세요!
          </div>
        ) : qna.list.map((item) => (
          <QnaItem
            key={item.qnaId}
            item={item}
            isAdmin={isAdmin}
            onSave={(next) => onQnaEdit?.({ qnaId: item.qnaId, ...next })}
            onDelete={() => onQnaDelete?.({ qnaId: item.qnaId })}
            onAnswer={(answer) => onQnaAnswer?.({ qnaId: item.qnaId, answer })}
            buttonClassName={buttonClassName}
          />
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="tw:mt-5 tw:flex tw:justify-center tw:gap-1">
        <button
          className={`${BTN_GHOST} tw:h-9 tw:px-3`}
          disabled={(qna?.pagination?.page || 1) <= 1}
          onClick={() => onQnaPageChange?.((qna?.pagination?.page || 1) - 1)}
          aria-label="이전 페이지"
        >이전</button>

        {Array.from({ length: qna?.pagination?.totalPage || 1 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            className={`tw:h-9 tw:px-3 tw:border tw:rounded-xl tw:transition tw:duration-150 hover:tw:bg-rose-50 ${
              n === (qna?.pagination?.page || 1)
                ? 'tw:bg-[#F27A7A] tw:text-white tw:border-[#F27A7A]'
                : 'tw:bg-white'
            }`}
            onClick={() => onQnaPageChange?.(n)}
            aria-label={`${n} 페이지로 이동`}
          >{n}</button>
        ))}

        <button
          className={`${BTN_GHOST} tw:h-9 tw:px-3`}
          disabled={(qna?.pagination?.page || 1) >= (qna?.pagination?.totalPage || 1)}
          onClick={() => onQnaPageChange?.((qna?.pagination?.page || 1) + 1)}
          aria-label="다음 페이지"
        >다음</button>
      </div>
    </section>
  )
}

function QnaItem({ item, isAdmin, onSave, onDelete, onAnswer, buttonClassName = BTN_PRIMARY }) {
  const [editing, setEditing] = React.useState(false)
  const [species, setSpecies] = React.useState(item.species || '')
  const [question, setQuestion] = React.useState(item.question || '')
  const [answer, setAns] = React.useState(item.answer || '')
  const canEdit = item.writer && (!item.answer || item.answer === '')

  const badge =
    'tw:inline-block tw:px-2 tw:py-0.5 tw:text-xs tw:rounded-full tw:border tw:border-rose-200 tw:bg-[#FFF0F0] tw:text-[#F27A7A]'

  return (
    <div className={`tw:border tw:rounded-2xl tw:p-4 tw:bg-white tw:shadow-sm ${item.answer ? 'tw:border-emerald-100' : 'tw:border-rose-100'}`}>
      <div className="tw:flex tw:justify-between tw:items-start tw:gap-3">
        <div className="tw:min-w-0">
          <div className="tw:text-sm tw:flex tw:flex-wrap tw:items-center tw:gap-2">
            <span className={badge}>{item.species || '기타'}</span>
            <b className="tw:truncate">{item.question}</b>
          </div>
          <div className="tw:text-xs tw:text-gray-500 tw:mt-1">
            답변: {item.answer ? '1' : '0'} · 작성자: {item.nickname} · {item.createdAt}
          </div>
        </div>
        {(item.writer || item.admin) && (
          <button
            onClick={onDelete}
            className="tw:text-xs tw:border tw:px-2 tw:py-1 tw:rounded-lg hover:tw:bg-rose-50 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-rose-200"
            aria-label="질문 삭제"
          >삭제</button>
        )}
      </div>

      {canEdit && (
        <div className="tw:mt-3">
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="tw:border tw:rounded-lg tw:px-3 tw:py-1 hover:tw:bg-rose-50 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-rose-200"
            >수정</button>
          ) : (
            <div className="tw:mt-2 tw:space-y-2">
              <select
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                className="tw:border tw:rounded-lg tw:px-2 tw:py-1 tw:bg-white focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-rose-200"
              >
                <option value="">선택 없음</option>
                <option value="강아지">강아지</option>
                <option value="고양이">고양이</option>
              </select>
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="tw:w-full tw:border tw:rounded-lg tw:px-2 tw:py-1 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-rose-200"
              />
              <div className="tw:flex tw:gap-2">
                <button
                  onClick={() => { onSave?.({ species, question }); setEditing(false) }}
                  className={buttonClassName}
                >저장</button>
                <button
                  onClick={() => setEditing(false)}
                  className="tw:border tw:rounded-lg tw:px-3 tw:py-1 hover:tw:bg-rose-50 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-rose-200"
                >취소</button>
              </div>
            </div>
          )}
        </div>
      )}

      {isAdmin && (
        <div className="tw:mt-3">
          <textarea
            className="tw:w-full tw:border tw:rounded-xl tw:px-3 tw:py-2 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-rose-200"
            value={answer}
            onChange={(e) => setAns(e.target.value)}
            placeholder="관리자 답변"
            rows={3}
          />
          <button
            onClick={() => onAnswer?.(answer)}
            className={`${buttonClassName} tw:mt-2`}
          >✅ 답변 등록</button>
        </div>
      )}

      {!isAdmin && item.answer && (
        <details className="tw:mt-3 tw:bg-emerald-50/40 tw:border tw:border-emerald-100 tw:rounded-2xl tw:p-3">
          <summary className="tw:cursor-pointer tw:select-none tw:text-sm tw:text-emerald-700">답변 보기</summary>
          <div className="tw:mt-2 tw:text-sm">{item.answer}</div>
        </details>
      )}
    </div>
  )
}