import api from '../api'; // 공통 axios 인스턴스 (baseURL=/api, JWT 헤더 등)

const base = '/reports/posts';

// 🔎 게시글 신고 목록 (어드민용 리스트)
export const listPostReports = (params) => api.get(base, { params });
// 🔎 특정 게시글의 신고만 조회
export const listReportsByPost = (postId, params = {}) =>
  api.get(base, { params: { ...params, postId } });

// 📝 신고 생성(게시글)
export const createPostReport = (data /* { postId, reason, details } */) =>
  api.post(base, data);

// 🛠️ 신고 상태 변경 (관리자 전용)
export const updatePostReportStatus = (reportId, { status, adminNote }) =>
  api.put(`${base}/${reportId}/status`, { status, adminNote });



export const listPosts = (params) => api.get("/admin/post", { params });
export const getPost  = (postId) => api.get(`/admin/post/${postId}`);
export const hidePost = (postId, hidden) => api.patch(`/admin/post/${postId}/hide`, null, { params: { hidden } });
export const deletePost = (postId) => api.delete(`/admin/post/${postId}`);

