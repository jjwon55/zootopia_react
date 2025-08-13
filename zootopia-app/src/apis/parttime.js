import api from './api'

// 목록
export const getJobs = (params) => api.get('/parttime', { params })

// 등록 (백엔드: @PostMapping)
export const insertJob = (jobData) => api.post('/parttime', jobData)

// 상세 (백엔드: GET /parttime/{jobId}?applicantPage=..)
export const getJobDetail = (jobId, applicantPage = 1) =>
  api.get(`/parttime/${jobId}`, { params: { applicantPage } }).then(r => r.data)

// (호환용) 상세 - ReadContainer에서 쓰는 버전
export const getJobById = (jobId) => api.get(`/parttime/${jobId}`)

// 수정 ⚠️ 백엔드가 @PostMapping("/{jobId}") 임 → PUT 아님!
export const updateJob = (jobId, jobData) => api.post(`/parttime/${jobId}`, jobData)

// 삭제 (백엔드: @DeleteMapping("/{jobId}"))
export const deleteJob = (jobId) => api.delete(`/parttime/${jobId}`)

// 지원하기 🔥 백엔드: POST /parttime/{jobId}/applicants (intro만 보내고 서버가 email/phone 채움)
export const applyApplicants = (jobId, body /* { introduction } */) =>
  api.post(`/parttime/${jobId}/applicants`, body).then(r => r.data)

// 지원자 조회 (백엔드: GET /parttime/{jobId}/applicants?page=..)
export const getApplicantsByJob = (jobId, page = 1) =>
  api.get(`/parttime/${jobId}/applicants`, { params: { page } }).then(r => r.data)

// 신청 취소 🔥 백엔드: DELETE /parttime/applicants/{applicantId} (jobId 경로에 없음)
export const deleteApplication = (applicantId, jobId) =>
  api.delete(`/parttime/${jobId}/applicants/${applicantId}`)

// 로그인 사용자
export const getLoginUser = () => api.get('/auth/me')