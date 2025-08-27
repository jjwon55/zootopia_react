import React from 'react'

const CommentList = ({
  comments = [],
  user,
  commentPage,
  totalCommentPages,
  onPageChange,
  onDelete,
}) => {
  const handleCommentPageChange = (page) => {
    if (page < 1 || page > totalCommentPages) return
    onPageChange(page)
  }

  return (
    <div>
      {/* 댓글 목록 */}
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div
            key={comment.commentId}
            className="tw:bg-white tw:border tw:border-rose-100 tw:rounded-2xl tw:p-4 tw:mb-3 tw:shadow-sm"
          >
            <div className="tw:flex tw:items-start tw:gap-3">
              <Avatar name={comment.writer} />
              <div className="tw:flex-1">
                <div className="tw:flex tw:justify-between tw:text-xs tw:text-gray-500">
                  <span className="tw:font-semibold tw:text-[#F27A7A]">{comment.writer}</span>
                  <span>{new Date(comment.createdAt).toLocaleString()}</span>
                </div>
                <p className="tw:mt-2 tw:text-sm tw:text-[#333]">{comment.content}</p>

                {user && user.userId === comment.userId && (
                  <div className="tw:text-right tw:mt-2">
                    <button
                      type="button"
                      onClick={() => onDelete(comment.commentId)}
                      className="
                        tw:border tw:border-[#F27A7A] tw:text-[#F27A7A]
                        tw:rounded-xl tw:px-3 tw:py-1 tw:text-xs
                        tw:shadow-sm hover:tw:shadow-md
                        hover:tw:bg-[#FFECEA] hover:-tw-translate-y-0.5 active:tw-translate-y-0.5
                        tw:transition tw:duration-200
                        focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#F27A7A]/40
                      "
                    >
                      🗑 삭제
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="tw:text-gray-400 tw:text-xs">등록된 댓글이 없습니다.</p>
      )}

      {/* 댓글 페이지네이션 */}
      {totalCommentPages > 1 && (
        <nav className="tw:flex tw:justify-center tw:mt-4">
          <ul className="tw:flex tw:gap-1">
            <li>
              <button
                onClick={() => handleCommentPageChange(commentPage - 1)}
                disabled={commentPage === 1}
                className={`
                  tw:px-3 tw:py-1 tw:rounded-xl tw:border tw:border-[#F27A7A]
                  tw:text-[#F27A7A] tw:text-xs
                  focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#F27A7A]/40
                  ${commentPage === 1 ? 'tw:opacity-50 tw:cursor-not-allowed' : 'hover:tw:bg-rose-50 tw:transition'}
                `}
              >
                이전
              </button>
            </li>

            {Array.from({ length: totalCommentPages }, (_, i) => i + 1).map((num) => (
              <li key={num}>
                <button
                  onClick={() => handleCommentPageChange(num)}
                  className={`
                    tw:px-3 tw:py-1 tw:rounded-xl tw:border tw:border-[#F27A7A] tw:text-xs
                    focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#F27A7A]/40
                    ${num === commentPage ? 'tw:bg-[#F27A7A] tw:text-white tw:font-bold' : 'tw:text-[#F27A7A] hover:tw:bg-rose-50 tw:transition'}
                  `}
                >
                  {num}
                </button>
              </li>
            ))}

            <li>
              <button
                onClick={() => handleCommentPageChange(commentPage + 1)}
                disabled={commentPage === totalCommentPages}
                className={`
                  tw:px-3 tw:py-1 tw:rounded-xl tw:border tw:border-[#F27A7A]
                  tw:text-[#F27A7A] tw:text-xs
                  focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#F27A7A]/40
                  ${commentPage === totalCommentPages ? 'tw:opacity-50 tw:cursor-not-allowed' : 'hover:tw:bg-rose-50 tw:transition'}
                `}
              >
                다음
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  )
}

function Avatar({ name }) {
  const letter = (name || '익명').trim().charAt(0).toUpperCase()
  return (
    <div className="tw:w-9 tw:h-9 tw:rounded-full tw:bg-rose-50 tw:border tw:border-rose-100 tw:text-rose-600 tw:flex tw:items-center tw:justify-center tw:font-bold">
      {letter || '익'}
    </div>
  )
}

export default CommentList