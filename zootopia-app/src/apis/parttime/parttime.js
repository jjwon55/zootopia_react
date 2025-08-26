import api from '../api'; // src/apis/parttime.js

// ✅ 공개 API
export const getJobs = (params) => api.get('/parttime', { params })
export const getJobDetail = (jobId, applicantPage = 1) =>
  api.get(`/parttime/${jobId}`, { params: { applicantPage } }).then(r => r.data)
export const getJobById = (jobId) => api.get(`/parttime/${jobId}`)

// ✅ 보호 API
export const insertJob = (jobData) => api.post('/parttime', jobData)
export const updateJob = (jobId, jobData) => api.post(`/parttime/${jobId}`, jobData)
export const deleteJob = (jobId) => api.delete(`/parttime/${jobId}`)

// 지원자 관련
export const applyApplicants = (jobId, body) =>
  api.post(`/parttime/${jobId}/applicants`, body).then(r => r.data)
export const getApplicantsByJob = (jobId, page = 1, onlyMe = false) =>
  api.get(`/parttime/${jobId}/applicants`, { params: { page, onlyMe } }).then(r => r.data)
export const deleteApplication = (applicantId) =>
  api.delete(`/parttime/applicants/${applicantId}`)

// 로그인 사용자
export const getLoginUser = () => api.get('/auth/me')

export default api