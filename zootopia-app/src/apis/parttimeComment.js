import api from './api' // 반드시 토큰 인터셉터가 붙은 인스턴스

/** 1. 댓글 등록 */
export const createComment = (commentData) =>
  api.post('/parttime/comments', commentData)
// 예: { jobId, writer, content }

/** 2. 특정 아르바이트의 댓글 목록 조회 (페이징 포함)
 *   백엔드: GET /parttime/comments?jobId=...&page=...&size=...
 */
export const getCommentsByJobId = (jobId, page = 1, size = 6) =>
  api.get('/parttime/comments', { params: { jobId, page, size } })

/** 전체 댓글 페이징 */
export const getAllCommentsPaged = (page = 1, size = 6) =>
  api.get('/parttime/comments', { params: { page, size } })

/** 3. (백엔드에 PUT 없음) 필요 시 백엔드 추가 후 사용 */
// export const updateComment = (commentId, updatedData) =>
//   api.put(`/parttime/comments/${commentId}`, updatedData)

/** 4. 댓글 삭제 (토큰 자동 첨부) */
export const deleteComment = (id) =>
  api.delete(`/parttime/comments/${id}`)