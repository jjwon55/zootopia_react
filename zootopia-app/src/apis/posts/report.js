import api from '../api'; // ✅ 공통 axios 인스턴스

const base = '/reports';

// ✅ 신고 목록 조회
export const listReports = (params) => api.get(base, { params });

// ✅ 신고 상세 조회 (옵션 – 필요할 때만)
export const readReport = (id) => api.get(`${base}/${id}`);

// ✅ 신고 생성
export const createReport = (data) => api.post(base, data);

// ✅ 신고 상태 변경 (관리자 전용)
export const updateReportStatus = (id, { status, adminNote }) =>
  api.put(`${base}/${id}/status`, { status, adminNote });

export const listReportsByUser = (reportedUserId, params = {}) =>
  api.get('/reports', { params: { ...params, reportedUserId } });
