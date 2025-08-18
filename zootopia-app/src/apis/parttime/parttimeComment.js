import api from '../api'
import { makeAuthHeaders, xsrfHeader } from '../utils/authHeaders'

// 1) 댓글 등록 (보호)
export const createComment = (commentData) =>
  api.post('/parttime/comments', commentData, {
    headers: { ...makeAuthHeaders(), ...xsrfHeader() },
  })

// 2) 특정 알바 댓글 목록 (공개)
export const getCommentsByJobId = (jobId, page = 1, size = 6) =>
  api.get('/parttime/comments', { params: { jobId, page, size } })

// 3) 전체 댓글 페이징 (공개)
export const getAllCommentsPaged = (page = 1, size = 6) =>
  api.get('/parttime/comments', { params: { page, size } })

// 4) 댓글 삭제 (보호)
export const deleteComment = (id) =>
  api.delete(`/parttime/comments/${id}`, {
    headers: { ...makeAuthHeaders(), ...xsrfHeader() },
  })