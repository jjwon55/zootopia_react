import React from 'react'

const CommentList = ({
  comments = [],
  user,
  commentPage,
  totalCommentPages,
  currentPage,
  onPageChange,
  onDelete,
}) => {
  const handleCommentPageChange = (page) => {
    onPageChange(currentPage, page) // 게시글 페이지는 유지, 댓글 페이지만 변경
  }

  return (
    <div>
      {/* 💬 댓글 목록 */}
      {Array.isArray(comments) && comments.length > 0 ? (
        comments.map((comment) => (
          <div
            key={comment.commentId}
            className="tw:bg-[#fdfdfd] tw:border tw:border-gray-200 tw:rounded-lg tw:p-4 tw:mb-3 tw:shadow-sm"
          >
            <div className="tw:flex tw:justify-between tw:text-xs tw:text-gray-500">
              <span className="tw:font-semibold tw:text-[#F27A7A]">
                {comment.writer}
              </span>
              <span>
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="tw:mt-2 tw:text-sm">{comment.content}</p>

            {user && user.userId === comment.userId && (
              <div className="tw:text-right tw:mt-2">
                <button
                  type="button"
                  onClick={() => onDelete?.(comment.commentId)}
                  className="
                    tw:border tw:border-[#F27A7A] tw:text-[#F27A7A]
                    tw:rounded tw:px-3 tw:py-1 tw:text-xs
                    hover:tw:bg-[#f9d2d2] tw:transition
                    focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#F27A7A]/40
                  "
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="tw:text-gray-400 tw:text-xs">등록된 댓글이 없습니다.</p>
      )}

      {/* 📄 댓글 페이지네이션 */}
      {totalCommentPages > 1 && (
        <nav className="tw:flex tw:justify-center tw:mt-4">
          <ul className="tw:flex tw:gap-1">
            {/* 이전 */}
            <li>
              <button
                onClick={() => handleCommentPageChange(commentPage - 1)}
                disabled={commentPage === 1}
                className={`
                  tw:px-3 tw:py-1 tw:rounded tw:border tw:border-[#F27A7A]
                  tw:text-[#F27A7A] tw:text-xs
                  focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#F27A7A]/40
                  ${commentPage === 1
                    ? 'tw:opacity-50 tw:cursor-not-allowed'
                    : 'hover:tw:bg-[#f9d2d2] tw:transition'}
                `}
              >
                이전
              </button>
            </li>

            {/* 번호 목록 */}
            {Array.from({ length: totalCommentPages }, (_, i) => i + 1).map((num) => (
              <li key={num}>
                <button
                  onClick={() => handleCommentPageChange(num)}
                  className={`
                    tw:px-3 tw:py-1 tw:rounded tw:border tw:border-[#F27A7A] tw:text-xs
                    focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#F27A7A]/40
                    ${num === commentPage
                      ? 'tw:bg-[#F27A7A] tw:text-white tw:font-bold'
                      : 'tw:text-[#F27A7A] hover:tw:bg-[#f9d2d2] tw:transition'}
                  `}
                >
                  {num}
                </button>
              </li>
            ))}

            {/* 다음 */}
            <li>
              <button
                onClick={() => handleCommentPageChange(commentPage + 1)}
                disabled={commentPage === totalCommentPages}
                className={`
                  tw:px-3 tw:py-1 tw:rounded tw:border tw:border-[#F27A7A]
                  tw:text-[#F27A7A] tw:text-xs
                  focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#F27A7A]/40
                  ${commentPage === totalCommentPages
                    ? 'tw:opacity-50 tw:cursor-not-allowed'
                    : 'hover:tw:bg-[#f9d2d2] tw:transition'}
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

export default CommentList