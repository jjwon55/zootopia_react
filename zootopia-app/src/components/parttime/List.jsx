import React from 'react'
import { Link } from 'react-router-dom'

// 컴포넌트 임포트
import JobCard from './JobCard'
import Pagination from './Pagination'
import CommentList from './CommentList'
import CommentForm from './CommentForm'
import JobFilter from './JobFilter'

const List = ({
  jobs = [],
  totalPages = 1,
  currentPage = 1,

  // 필터 상태
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

  // 댓글
  comments = [],
  totalComments = 0,
  commentPage = 1,
  totalCommentPages = 1,
  jobId = null, // 현재 댓글이 연관된 jobId

  // 유저/핸들러
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
    <div className="tw:to-white tw:min-h-screen">
      <div className="tw:mx-auto tw:px-4 tw:py-8">
        {/* 헤더 */}
        <div className="tw:max-w-5xl tw:mx-auto tw:mb-8">
          <div className="tw:bg-white tw:border tw:border-rose-100 tw:rounded-3xl tw:p-6 tw:shadow-sm tw:text-center">
            <h2 className="tw:text-3xl tw:font-extrabold tw:text-[#F27A7A]">펫 시터</h2>
            <p className="tw:text-sm tw:text-gray-500 tw:mt-1">주토피아 파트타임 · 안심 매칭</p>
          </div>
        </div>

        {/* 필터 폼 */}
        <JobFilter
          region={region}
          location={location}
          cityOptions={cityOptions}
          animalGroup={animalGroup}
          animalType={animalType}
          speciesOptions={speciesOptions}
          payRange={payRange}
          startDate={startDate}
          endDate={endDate}
          keywordDraft={keywordDraft}
          onFilterChange={onFilterChange}
          onKeywordChange={onKeywordChange}
          onSearch={onSearch}
          onReset={onReset}
        />

        {/* 카드 영역 */}
        <div className="tw:max-w-4xl tw:mx-auto tw:mt-8 tw:mb-6">
          {jobs.length > 0 ? (
            <div className="tw:grid tw:grid-cols-2 tw:gap-6 tw:my-4">
              {jobs.map(job => (
                <JobCard key={job.jobId} job={job} />
              ))}
            </div>
          ) : (
            <div className="tw:flex tw:justify-center tw:items-center tw:my-16 tw:min-h-[220px]">
              <p className="tw:text-gray-500 tw:text-center">등록된 펫시터가 없습니다.</p>
            </div>
          )}

          <div className="tw:text-center tw:my-6">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
          </div>

          {user && (
            <div className="tw:text-right tw:mb-2">
              <Link
                to="/parttime/insert"
                className="tw:inline-flex tw:items-center tw:justify-center tw:h-10 tw:px-4 tw:border tw:border-[#F27A7A] tw:bg-[#F27A7A] tw:text-white tw:rounded-xl tw:text-sm hover:tw:bg-[#e86e6e]"
              >
                등록하기
              </Link>
            </div>
          )}
        </div>

        {/* 댓글 영역 */}
        <div className="tw:flex tw:justify-center tw:my-8">
          <div className="tw:w-full tw:bg-white tw:border tw:border-rose-100 tw:rounded-3xl tw:p-5 tw:max-w-5xl tw:shadow-sm">
            <h5 className="tw:font-bold tw:mb-4 tw:text-center">✍️ 당신의 이야기를 들려주세요</h5>

            <div className="tw:mb-3 tw:text-left">
              <span className="tw:font-bold">💬 댓글</span>{' '}
              <span className="tw:text-[#F27A7A] tw:font-semibold">{totalComments}</span>개
            </div>

            <CommentList
              comments={comments}
              user={user}
              commentPage={commentPage}
              totalCommentPages={totalCommentPages}
              currentPage={currentPage}
              onPageChange={(_, page) => onCommentPageChange?.(page)}
              onDelete={onCommentDelete}
            />

            {user ? (
              <CommentForm
                user={user}
                onSubmit={(data) => onCommentSubmit({ ...data, jobId })}
              />
            ) : (
              <div className="tw:mt-3 tw:bg-yellow-50 tw:border tw:border-yellow-200 tw:text-yellow-700 tw:p-3 tw:rounded-xl">
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