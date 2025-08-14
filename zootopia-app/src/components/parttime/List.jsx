import React from 'react'
import { Link } from 'react-router-dom'

const List = ({
  // 데이터
  jobs = [],
  totalPages = 1,
  currentPage = 1,
  region = '',
  location = '',
  cityOptions = [],
  animalGroup = '',
  animalType = '',
  speciesOptions = [],
  payRange = '',
  startDate = '',
  endDate = '',
  keyword = '',
  keywordDraft = '',
  comments = [],
  totalComments = 0,
  commentPage = 1,
  totalCommentPages = 1,
  user,

  // 이벤트
  onFilterChange,
  onSearch,
  onReset,
  onKeywordChange,
  onPageChange,
  onCommentPageChange,
  onCommentSubmit,
  onCommentDelete,
}) => {
  const BTN_PRIMARY = 'border border-[#F27A7A] bg-[#F27A7A] text-white rounded px-3 py-1 text-sm hover:bg-[#e86e6e]'
  const BTN_OUTLINE = 'border border-[#F27A7A] text-[#F27A7A] rounded px-3 py-1 text-sm hover:bg-[#f9d2d2]'
  const PAGE_BTN = 'px-3 py-1 border rounded'

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      <div className="mx-auto px-4 py-6" style={{ minWidth: 1000, minHeight: 1000 }}>
        <h2 className="text-center !text-4xl !font-bold mb-10 mt-4">펫 시터</h2>

        {/* ====== 필터 폼 ====== */}
        <form
          onSubmit={(e) => { e.preventDefault(); onSearch?.() }}
          className="flex flex-wrap justify-center items-center gap-2 p-3 rounded shadow-sm mx-auto mt-5"
          style={{ backgroundColor: '#ffecec', maxWidth: 900 }}
        >
          {/* 시/도 */}
          <div className="flex items-center gap-2">
            <span className="text-red-500">📍</span>
            <select
              name="region"
              value={region}
              onChange={onFilterChange}
              className="border rounded text-sm px-2 py-1 w-[150px] bg-white"
            >
              <option value="">시/도 선택</option>
              {['서울','경기','인천','부산','대구','광주','대전','울산','세종','강원','충북','충남','전북','전남','경북','경남','제주'].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* 시/군/구 */}
          <div className="flex items-center gap-2">
            <select
              name="location"
              value={location}
              onChange={onFilterChange}
              disabled={!region}
              className={`border rounded text-sm px-2 py-1 w-[180px] bg-white ${!region ? 'opacity-60 cursor-not-allowed' : ''}`}
              title={!region ? '시/도를 먼저 선택하세요' : ''}
            >
              <option value="">{region ? '시/군/구 선택' : '시/도를 먼저 선택'}</option>
              {cityOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          {/* 동물 대분류 */}
          <div className="flex items-center gap-2">
            <span>🐾</span>
            <select
              name="animalGroup"
              value={animalGroup}
              onChange={onFilterChange}
              className="border rounded text-sm px-2 py-1 w-[150px] bg-white"
            >
              <option value="">동물 분류</option>
              {['포유류','파충류','절지류','어류','양서류','조류'].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* 동물 세부 종 (서버 파라미터: animalType) */}
          <div className="flex items-center gap-2">
            <select
              name="animalType"
              value={animalType}
              onChange={onFilterChange}
              disabled={!animalGroup}
              className={`border rounded text-sm px-2 py-1 w-[160px] bg-white ${!animalGroup ? 'opacity-60 cursor-not-allowed' : ''}`}
              title={!animalGroup ? '동물 분류를 먼저 선택하세요' : ''}
            >
              <option value="">{animalGroup ? '세부 종 선택' : '분류 먼저 선택'}</option>
              {speciesOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          {/* 보수 */}
          <div className="flex items-center gap-2">
            <span className="text-green-600">💰</span>
            <select
              name="payRange"
              value={payRange}
              onChange={onFilterChange}
              className="border rounded text-sm px-2 py-1 w-[130px] bg-white"
            >
              <option value="">보수</option>
              <option value="low">1만원 미만</option>
              <option value="mid">1~2만원 사이</option>
              <option value="high">2만원 이상</option>
            </select>
          </div>

          {/* 날짜 */}
          <div className="flex items-center gap-2">
            <span className="text-blue-600">🗓️</span>
            <input type="date" name="startDate" value={startDate || ''} onChange={onFilterChange} className="border rounded text-sm px-2 py-1 w-[140px] bg-white" />
            <span>~</span>
            <input type="date" name="endDate" value={endDate || ''} onChange={onFilterChange} className="border rounded text-sm px-2 py-1 w-[140px] bg-white" />
          </div>

          {/* 키워드 (버튼 눌러야 검색) */}
          <div className="flex items-center gap-0 mt-2 sm:mt-0">
            <input
              type="text"
              name="keyword"
              value={keywordDraft}
              onChange={onKeywordChange}
              placeholder="검색어 입력"
              className="border border-r-0 rounded-l text-sm px-2 py-1 w-[250px] bg-white"
            />
            <button type="submit" className={`${BTN_PRIMARY} rounded-l-none`}>검색</button>
            <button type="button" onClick={onReset} className={`${BTN_OUTLINE} ml-2`}>초기화</button>
          </div>
        </form>

        {/* ====== 카드 영역 ====== */}
        <div className="mx-auto mt-8 mb-8 p-1 rounded shadow-sm max-w-[1000px] bg-white">
          {jobs.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-6 my-10">
              {jobs.map(job => (
                <div key={job.jobId} className="w-full max-w-[400px] md:max-w-[400px]">
                  <div className="bg-[#f8fbe9] rounded shadow-sm p-4">
                    <h5 className="!font-bold mb-4 text-base">🐾 {job.title}</h5>
                    <p className="mb-1">📍 {job.location}</p>
                    <p className="mb-1">🗓️ {job.startDate} ~ {job.endDate}</p>
                    <p className="mb-1">💰 {job.pay}원</p>
                    <p className="mb-1">👤 보호자: {job.nickname}</p>
                    <div className="flex justify-end gap-2 mt-2">
                      <Link to={`/parttime/read/${job.jobId}`} className={BTN_OUTLINE}>
                        상세보기
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center my-16 min-h-[220px]">
              <p className="text-gray-500 text-center">등록된 펫시터가 없습니다.</p>
            </div>
          )}

          {/* 페이지네이션 */}
          <div className="text-center my-4">
            <nav>
              <ul className="inline-flex items-center gap-1">
                <li>
                  <button
                    className={`${PAGE_BTN}`}
                    onClick={() => currentPage > 1 && onPageChange?.(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    이전
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <li key={p}>
                    <button
                      className={`${PAGE_BTN} ${p === currentPage ? 'bg-[#F27A7A] text-white' : ''}`}
                      onClick={() => onPageChange?.(p)}
                    >
                      {p}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    className={`${PAGE_BTN}`}
                    onClick={() => currentPage < totalPages && onPageChange?.(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    다음
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* 등록 버튼 */}
          <div className="text-right mb-5 mr-4">
            <Link to="/parttime/insert" className={`${BTN_PRIMARY} h-9 inline-flex items-center justify-center`}>
              등록하기
            </Link>
          </div>
        </div>

        {/* ====== 리뷰/댓글 ====== */}
        <div className="flex justify-center my-5">
          <div className="w-full max-w-3xl bg-[#f8f9fa] border rounded p-3 max-w-[900px]">
            <h5 className="font-bold mb-3 text-center">✍️ 당신의 이야기를 들려주세요</h5>

            <div className="mb-3 text-left">
              <span className="font-bold">💬 댓글</span> <span>{totalComments}</span>개
            </div>

            {comments.map((c) => (
              <div key={c.commentId} className="mb-3 bg-[#fdfdfd] border rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.03)]">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-[#F27A7A]">{c.writer}</span>
                  <span className="text-[#888] text-[0.85rem]">{c.createdAt}</span>
                </div>
                <p className="mt-2 text-[0.95rem]">{c.content}</p>

                {user && user.userId === c.userId && (
                  <div className="text-right mt-2">
                    <button
                      onClick={() => onCommentDelete?.(c.commentId)}
                      className={BTN_OUTLINE}
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* 댓글 페이지네이션 */}
            <div className="text-center mt-4">
              <nav>
                <ul className="inline-flex items-center gap-1 text-sm">
                  <li>
                    <button
                      className={`${PAGE_BTN}`}
                      onClick={() => commentPage > 1 && onCommentPageChange?.(commentPage - 1)}
                      disabled={commentPage === 1}
                    >
                      이전
                    </button>
                  </li>
                  {Array.from({ length: totalCommentPages }, (_, i) => i + 1).map(p => (
                    <li key={p}>
                      <button
                        className={`${PAGE_BTN} ${p === commentPage ? 'bg-[#F27A7A] text-white' : ''}`}
                        onClick={() => onCommentPageChange?.(p)}
                      >
                        {p}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      className={`${PAGE_BTN}`}
                      onClick={() => commentPage < totalCommentPages && onCommentPageChange?.(commentPage + 1)}
                      disabled={commentPage === totalCommentPages}
                    >
                      다음
                    </button>
                  </li>
                </ul>
              </nav>
            </div>

            {/* 댓글 폼 */}
            {user ? (
              <form
                className="mt-3"
                onSubmit={(e) => {
                  e.preventDefault()
                  const fd = new FormData(e.currentTarget)
                  onCommentSubmit?.({
                    writer: user.nickname,
                    content: fd.get('content'),
                  })
                  e.currentTarget.reset()
                }}
              >
                <textarea
                  name="content"
                  rows={3}
                  placeholder="자유롭게 생각 남겨주세요"
                  required
                  className="w-full border rounded p-2"
                />
                <div className="text-right mt-2">
                  <button type="submit" className={BTN_PRIMARY}>
                    남기기
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-3 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-700 p-3 rounded">
                댓글을 작성하려면 <Link to="/login" className="underline font-bold">로그인</Link>이 필요합니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default List