import api from '../api'; // 공통 axios 인스턴스 (baseURL=/api, JWT 헤더 등)

/* ================================
   📌 게시글 신고 관련 API
   base = /reports/posts
================================ */
const base = '/reports/posts';

// 🔎 게시글 신고 전체 목록 (관리자용)
export const listPostReports = (params) =>
  api.get(base, { params });

// 🔎 특정 게시글의 신고 목록 조회
export const listReportsByPost = (postId, params = {}) =>
  api.get(base, { params: { ...params, postId } });

// 📝 신고 생성(사용자)
export const createPostReport = (data /* { postId, reason, details } */) =>
  api.post(base, data);

// 🛠️ 신고 상태 변경 (관리자)
export const updatePostReportStatus = (reportId, { status, adminNote }) =>
  api.put(`${base}/${reportId}/status`, { status, adminNote });


/* ================================
   📌 관리자 전용 게시글 관리 API
   base = /admin/post
================================ */
const adminBase = '/admin/post';

// 🔎 게시글 목록 조회 (검색/필터 포함)
// ✅ reportCount 포함됨
export const listPosts = (params) =>
  api.get(adminBase, { params });

// 🔎 단일 게시글 조회 (reportCount 포함)
export const getPost = (postId) =>
  api.get(`${adminBase}/${postId}`);

// 👁️ 게시글 숨김/표시
export const hidePost = (postId, hidden) =>
  api.patch(`${adminBase}/${postId}/hide`, null, { params: { hidden } });

// ❌ 게시글 삭제
export const deletePost = (postId) =>
  api.delete(`${adminBase}/${postId}`);
