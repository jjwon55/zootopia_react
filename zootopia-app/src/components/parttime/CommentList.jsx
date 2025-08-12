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
    onPageChange(currentPage, page) // 게시글 페이지 유지, 댓글 페이지만 변경
  }

  return (
    <div>
      {/* 💬 댓글 목록 */}
      {Array.isArray(comments) && comments.length > 0 ? (
        comments.map((comment) => (
          <div
            key={comment.commentId}
            className="bg-[#fdfdfd] border border-gray-200 rounded-lg p-4 mb-3 shadow-sm"
          >
            <div className="flex justify-between text-xs text-gray-500">
              <span className="font-semibold text-[#F27A7A]">{comment.writer}</span>
              <span className="">{new Date(comment.createdAt).toLocaleString()}</span>
            </div>
            <p className="mt-2 text-sm">{comment.content}</p>

            {user && user.userId === comment.userId && (
              <div className="text-end mt-2">
                <form method="post" action={`/parttime/job/comment/delete/${comment.commentId}`}>
                  <button
                    type="submit"
                    className="border border-[#F27A7A] text-[#F27A7A] rounded px-3 py-1 text-xs hover:bg-[#f9d2d2] transition"
                    onClick={() => onDelete?.(comment.commentId)}
                  >
                    삭제
                  </button>
                </form>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-xs">등록된 댓글이 없습니다.</p>
      )}

      {/* 📄 댓글 페이지네이션 */}
      {totalCommentPages > 1 && (
        <nav className="flex justify-center mt-4">
          <ul className="flex gap-1">
            {/* 이전 */}
            <li>
              <button
                className={`px-3 py-1 rounded border border-[#F27A7A] text-[#F27A7A] text-xs ${commentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#f9d2d2] transition'}`}
                onClick={() => handleCommentPageChange(commentPage - 1)}
                disabled={commentPage === 1}
              >
                이전
              </button>
            </li>

            {/* 번호 목록 */}
            {Array.from({ length: totalCommentPages }, (_, i) => i + 1).map((num) => (
              <li key={num}>
                <button
                  className={`px-3 py-1 rounded border border-[#F27A7A] text-xs ${num === commentPage
                    ? 'bg-[#F27A7A] text-white font-bold'
                    : 'text-[#F27A7A] hover:bg-[#f9d2d2] transition'
                  }`}
                  onClick={() => handleCommentPageChange(num)}
                >
                  {num}
                </button>
              </li>
            ))}

            {/* 다음 */}
            <li>
              <button
                className={`px-3 py-1 rounded border border-[#F27A7A] text-[#F27A7A] text-xs ${commentPage === totalCommentPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#f9d2d2] transition'}`}
                onClick={() => handleCommentPageChange(commentPage + 1)}
                disabled={commentPage === totalCommentPages}
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