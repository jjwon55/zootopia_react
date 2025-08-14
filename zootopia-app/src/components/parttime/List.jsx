import React from 'react'
import { Link } from 'react-router-dom'

const List = ({
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
  keywordDraft = '',
  comments = [],
  totalComments = 0,
  commentPage = 1,
  totalCommentPages = 1,
  user,
  onFilterChange,
  onSearch,
  onReset,
  onKeywordChange,
  onPageChange,
  onCommentPageChange,
  onCommentSubmit,
  onCommentDelete,
}) => {
  return (
    <div className="tw:bg-[#f8f9fa] tw:min-h-screen">
      <div className="tw:mx-auto tw:px-4 tw:py-6 tw:min-w-[1000px] tw:min-h-[1000px]">
        <h2 className="tw:text-center tw:text-4xl tw:font-bold tw:mb-10 tw:mt-4">펫 시터</h2>

        {/* ====== 필터 폼 ====== */}
        <form
          onSubmit={(e) => { e.preventDefault(); onSearch?.() }}
          className="tw:flex tw:flex-wrap tw:justify-center tw:items-center tw:gap-2 tw:p-3 tw:rounded tw:shadow-sm tw:mx-auto tw:mt-5 tw:bg-[#ffecec] tw:max-w-[900px]"
        >
          {/* 시/도 */}
          <div className="tw:flex tw:items-center tw:gap-2">
            <span className="tw:text-red-500">📍</span>
            <select
              name="region"
              value={region}
              onChange={onFilterChange}
              className="tw:border tw:rounded tw:text-sm tw:px-2 tw:py-1 tw:w-[150px] tw:bg-white"
            >
              <option value="">시/도 선택</option>
              {['서울','경기','인천','부산','대구','광주','대전','울산','세종','강원','충북','충남','전북','전남','경북','경남','제주'].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* 시/군/구 */}
          <div className="tw:flex tw:items-center tw:gap-2">
            <select
              name="location"
              value={location}
              onChange={onFilterChange}
              disabled={!region}
              className={`tw:border tw:rounded tw:text-sm tw:px-2 tw:py-1 tw:w-[180px] tw:bg-white ${!region ? 'tw:opacity-60 tw:cursor-not-allowed' : ''}`}
              title={!region ? '시/도를 먼저 선택하세요' : ''}
            >
              <option value="">{region ? '시/군/구 선택' : '시/도를 먼저 선택'}</option>
              {cityOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          {/* 동물 대분류 */}
          <div className="tw:flex tw:items-center tw:gap-2">
            <span>🐾</span>
            <select
              name="animalGroup"
              value={animalGroup}
              onChange={onFilterChange}
              className="tw:border tw:rounded tw:text-sm tw:px-2 tw:py-1 tw:w-[150px] tw:bg-white"
            >
              <option value="">동물 분류</option>
              {['포유류','파충류','절지류','어류','양서류','조류'].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* 동물 세부 종 */}
          <div className="tw:flex tw:items-center tw:gap-2">
            <select
              name="animalType"
              value={animalType}
              onChange={onFilterChange}
              disabled={!animalGroup}
              className={`tw:border tw:rounded tw:text-sm tw:px-2 tw:py-1 tw:w-[160px] tw:bg-white ${!animalGroup ? 'tw:opacity-60 tw:cursor-not-allowed' : ''}`}
              title={!animalGroup ? '동물 분류를 먼저 선택하세요' : ''}
            >
              <option value="">{animalGroup ? '세부 종 선택' : '분류 먼저 선택'}</option>
              {speciesOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          {/* 보수 */}
          <div className="tw:flex tw:items-center tw:gap-2">
            <span className="tw:text-green-600">💰</span>
            <select
              name="payRange"
              value={payRange}
              onChange={onFilterChange}
              className="tw:border tw:rounded tw:text-sm tw:px-2 tw:py-1 tw:w-[130px] tw:bg-white"
            >
              <option value="">보수</option>
              <option value="low">1만원 미만</option>
              <option value="mid">1~2만원 사이</option>
              <option value="high">2만원 이상</option>
            </select>
          </div>

          {/* 날짜 */}
          <div className="tw:flex tw:items-center tw:gap-2">
            <span className="tw:text-blue-600">🗓️</span>
            <input type="date" name="startDate" value={startDate || ''} onChange={onFilterChange} className="tw:border tw:rounded tw:text-sm tw:px-2 tw:py-1 tw:w-[140px] tw:bg-white" />
            <span>~</span>
            <input type="date" name="endDate" value={endDate || ''} onChange={onFilterChange} className="tw:border tw:rounded tw:text-sm tw:px-2 tw:py-1 tw:w-[140px] tw:bg-white" />
          </div>

          {/* 키워드 */}
          <div className="tw:flex tw:items-center tw:gap-0 tw:mt-2 sm:tw:mt-0">
            <input
              type="text"
              name="keyword"
              value={keywordDraft}
              onChange={onKeywordChange}
              placeholder="검색어 입력"
              className="tw:border tw:border-r-0 tw:rounded-l tw:text-sm tw:px-2 tw:py-1 tw:w-[250px] tw:bg-white"
            />
            <button type="submit" className="tw:border tw:border-[#F27A7A] tw:bg-[#F27A7A] tw:text-white tw:rounded tw:px-3 tw:py-1 tw:text-sm hover:tw:bg-[#e86e6e] tw:rounded-l-none">
              검색
            </button>
            <button type="button" onClick={onReset} className="tw:border tw:border-[#F27A7A] tw:text-[#F27A7A] tw:rounded tw:px-3 tw:py-1 tw:text-sm hover:tw:bg-[#f9d2d2] tw:ml-2">
              초기화
            </button>
          </div>
        </form>

        {/* ====== 카드 영역 ====== */}
        <div className="tw:mx-auto tw:mt-8 tw:mb-8 tw:p-1 tw:rounded tw:shadow-sm tw:max-w-[1000px] tw:bg-white">
          {jobs.length > 0 ? (
            <div className="tw:flex tw:flex-wrap tw:justify-center tw:gap-6 tw:my-10">
              {jobs.map(job => (
                <div key={job.jobId} className="tw:w-full tw:max-w-[400px]">
                  <div className="tw:bg-[#f8fbe9] tw:rounded tw:shadow-sm tw:p-4">
                    <h5 className="tw:font-bold tw:mb-4 tw:text-base">🐾 {job.title}</h5>
                    <p className="tw:mb-1">📍 {job.location}</p>
                    <p className="tw:mb-1">🗓️ {job.startDate} ~ {job.endDate}</p>
                    <p className="tw:mb-1">💰 {job.pay}원</p>
                    <p className="tw:mb-1">👤 보호자: {job.nickname}</p>
                    <div className="tw:flex tw:justify-end tw:gap-2 tw:mt-2">
                      <Link to={`/parttime/read/${job.jobId}`} className="tw:border tw:border-[#F27A7A] tw:text-[#F27A7A] tw:rounded tw:px-3 tw:py-1 tw:text-sm hover:tw:bg-[#f9d2d2]">
                        상세보기
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="tw:flex tw:justify-center tw:items-center tw:my-16 tw:min-h-[220px]">
              <p className="tw:text-gray-500 tw:text-center">등록된 펫시터가 없습니다.</p>
            </div>
          )}

          {/* 페이지네이션 */}
          <div className="tw:text-center tw:my-4">
            <nav>
              <ul className="tw:inline-flex tw:items-center tw:gap-1">
                <li>
                  <button
                    className="tw:px-3 tw:py-1 tw:border tw:rounded"
                    onClick={() => currentPage > 1 && onPageChange?.(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    이전
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <li key={p}>
                    <button
                      className={`tw:px-3 tw:py-1 tw:border tw:rounded ${p === currentPage ? 'tw:bg-[#F27A7A] tw:text-white' : ''}`}
                      onClick={() => onPageChange?.(p)}
                    >
                      {p}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    className="tw:px-3 tw:py-1 tw:border tw:rounded"
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
          <div className="tw:text-right tw:mb-5 tw:mr-4">
            <Link to="/parttime/insert" className="tw:border tw:border-[#F27A7A] tw:bg-[#F27A7A] tw:text-white tw:rounded tw:px-3 tw:py-1 tw:text-sm hover:tw:bg-[#e86e6e] tw:h-9 tw:inline-flex tw:items-center tw:justify-center">
              등록하기
            </Link>
          </div>
        </div>

        {/* ====== 댓글 ====== */}
        <div className="tw:flex tw:justify-center tw:my-5">
          <div className="tw:w-full tw:bg-[#f8f9fa] tw:border tw:rounded tw:p-3 tw:max-w-[900px]">
            <h5 className="tw:font-bold tw:mb-3 tw:text-center">✍️ 당신의 이야기를 들려주세요</h5>

            <div className="tw:mb-3 tw:text-left">
              <span className="tw:font-bold">💬 댓글</span> <span>{totalComments}</span>개
            </div>

            {comments.map((c) => (
              <div key={c.commentId} className="tw:mb-3 tw:bg-[#fdfdfd] tw:border tw:rounded-lg tw:p-4 tw:shadow-[0_2px_6px_rgba(0,0,0,0.03)]">
                <div className="tw:flex tw:justify-between tw:text-sm">
                  <span className="tw:font-semibold tw:text-[#F27A7A]">{c.writer}</span>
                  <span className="tw:text-[#888] tw:text-[0.85rem]">{c.createdAt}</span>
                </div>
                <p className="tw:mt-2 tw:text-[0.95rem]">{c.content}</p>

                {user && user.userId === c.userId && (
                  <div className="tw:text-right tw:mt-2">
                    <button
                      onClick={() => onCommentDelete?.(c.commentId)}
                      className="tw:border tw:border-[#F27A7A] tw:text-[#F27A7A] tw:rounded tw:px-3 tw:py-1 tw:text-sm hover:tw:bg-[#f9d2d2]"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* 댓글 페이지네이션 */}
            <div className="tw:text-center tw:mt-4">
              <nav>
                <ul className="tw:inline-flex tw:items-center tw:gap-1 tw:text-sm">
                  <li>
                    <button
                      className="tw:px-3 tw:py-1 tw:border tw:rounded"
                      onClick={() => commentPage > 1 && onCommentPageChange?.(commentPage - 1)}
                      disabled={commentPage === 1}
                    >
                      이전
                    </button>
                  </li>
                  {Array.from({ length: totalCommentPages }, (_, i) => i + 1).map(p => (
                    <li key={p}>
                      <button
                        className={`tw:px-3 tw:py-1 tw:border tw:rounded ${p === commentPage ? 'tw:bg-[#F27A7A] tw:text-white' : ''}`}
                        onClick={() => onCommentPageChange?.(p)}
                      >
                        {p}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      className="tw:px-3 tw:py-1 tw:border tw:rounded"
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
                className="tw:mt-3"
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
                  className="tw:w-full tw:border tw:rounded tw:p-2"
                />
                <div className="tw:text-right tw:mt-2">
                  <button type="submit" className="tw:border tw:border-[#F27A7A] tw:bg-[#F27A7A] tw:text-white tw:rounded tw:px-3 tw:py-1 tw:text-sm hover:tw:bg-[#e86e6e]">
                    남기기
                  </button>
                </div>
              </form>
            ) : (
              <div className="tw:mt-3 tw:bg-yellow-100 tw:border-l-4 tw:border-yellow-400 tw:text-yellow-700 tw:p-3 tw:rounded">
                댓글을 작성하려면 <Link to="/login" className="tw:underline tw:font-bold">로그인</Link>이 필요합니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default List