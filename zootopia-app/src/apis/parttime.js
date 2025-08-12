import api from './api'

// 목록
export const getJobs = (params) => api.get('/parttime', { params })

// 등록
export const insertJob = (jobData) => api.post('/parttime', jobData)

// 상세 (✅ ReadContainer가 기대하는 이름)
export const getJobDetail = (jobId, applicantPage = 1) =>
  api.get(`/parttime/${jobId}`, { params: { applicantPage } })
     .then(r => r.data)   // ReadContainer는 .data가 벗겨진 형태를 기대

// 기존 함수도 유지하고 싶으면 그대로 두세요
export const getJobById = (jobId) => api.get(`/parttime/${jobId}`)

// 수정/삭제
export const updateJob = (jobId, jobData) => api.put(`/parttime/${jobId}`, jobData)
export const deleteJob = (jobId) => api.delete(`/parttime/${jobId}`)

// 지원하기 (ReadContainer는 { jobId, introduction } 바디를 보냄)
export const applyToJob = ({ jobId, introduction, email, phone }) =>
  api.post('/parttime/apply', { jobId, introduction, email, phone })
    .then(r => r.data)

// 지원자 조회(필요시 페이징 파라미터 추가)
export const getApplicantsByJob = (jobId, page = 1) =>
  api.get(`/parttime/${jobId}/applicants`, { params: { page } })
    .then(r => r.data)

// 취소 (✅ ReadContainer의 cancelApplication과 이름 맞추기)
export const cancelApplication = (applicantId, jobId) =>
  api.delete(`/parttime/${jobId}/applicants/${applicantId}`)
    .then(r => r.data)

// 로그인 사용자
export const getLoginUser = () => api.get('/auth/me')