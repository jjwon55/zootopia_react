import api from './api'

/** 1. 댓글 등록 */
export const createComment = (commentData) => 
  api.post('/parttime/comments', commentData)
// 예: { jobId, content }

/** 2. 특정 아르바이트의 댓글 목록 조회 (페이징 포함) */
export const getCommentsByJobId = (jobId, page = 1, size = 6) => 
  api.get(`/parttime/${jobId}/comments`, {
    params: { page, size }
  })

export const getAllCommentsPaged = (page = 1, size = 6) => {
  return api.get(`/parttime/comments`, {
    params: { page, size }
  })
}

/** 3. 댓글 수정 */
export const updateComment = (commentId, updatedData) =>
  api.put(`/parttime/comments/${commentId}`, updatedData)
// 예: { content }

/** 4. 댓글 삭제 */
export const deleteComment = (commentId) =>
  api.delete(`/parttime/comments/${commentId}`)