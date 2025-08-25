// apis/posts/report.js
import api from '../api'; // 공통 axios 인스턴스

const base = '/reports';

// ✅ 신고 목록 (필터로 reportedUserId, reportedPostId, status 등 전달)
export const listReports = (params) =>
  api.get(base, { params });

// ✅ 특정 신고 조회(옵션)
export const readReport = (id) =>
  api.get(`${base}/${id}`);

// ✅ 신고 생성
export const createReport = (data) =>
  api.post(base, data);

// ✅ 신고 상태 변경 (관리자 전용) — /reports/{id}/status
export const updateReportStatus = (id, { status, adminNote }) =>
  api.put(`${base}/${id}/status`, { status, adminNote });

// ✅ 유저 대상 신고만 조회
export const listReportsByUser = (reportedUserId, params = {}) =>
  api.get(base, { params: { ...params, reportedUserId } });

// ✅ 게시글 대상 신고만 조회
export const listReportsByPost = (reportedPostId, params = {}) =>
  api.get(base, { params: { ...params, reportedPostId } });
