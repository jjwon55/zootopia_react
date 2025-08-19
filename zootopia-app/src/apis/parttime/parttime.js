import api from '../api'
import { makeAuthHeaders, xsrfHeader } from '../utils/authHeaders'

// ✅ 공개 API (토큰 불필요)
export const getJobs = (params) =>
  api.get('/parttime', { params })

export const getJobDetail = (jobId, applicantPage = 1) =>
  api.get(`/parttime/${jobId}`, { params: { applicantPage } }).then(r => r.data)

export const getJobById = (jobId) =>
  api.get(`/parttime/${jobId}`)

// ✅ 보호 API (요청 단위로 headers 부착)
export const insertJob = (jobData) =>
  api.post('/parttime', jobData, {
    headers: { ...makeAuthHeaders(), ...xsrfHeader() },
  })

// 서버가 @PostMapping("/{jobId}") 사용 → PUT 아님
export const updateJob = (jobId, jobData) =>
  api.post(`/parttime/${jobId}`, jobData, {
    headers: { ...makeAuthHeaders(), ...xsrfHeader() },
  })

export const deleteJob = (jobId) =>
  api.delete(`/parttime/${jobId}`, {
    headers: { ...makeAuthHeaders(), ...xsrfHeader() },
  })

// 지원하기 (POST /parttime/{jobId}/applicants)
export const applyApplicants = (jobId, body /* { introduction } */) =>
  api.post(`/parttime/${jobId}/applicants`, body, {
    headers: { ...makeAuthHeaders(), ...xsrfHeader() },
  }).then(r => r.data)

// 지원자 조회 (GET /parttime/{jobId}/applicants?page=..)
export const getApplicantsByJob = (jobId, page = 1) =>
  api.get(`/parttime/${jobId}/applicants`, {
    params: { page },
    headers: { ...makeAuthHeaders(), ...xsrfHeader() },
  }).then(r => r.data)

// 신청 취소 (DELETE /parttime/applicants/{applicantId})
export const deleteApplication = (applicantId) =>
  api.delete(`/parttime/applicants/${applicantId}`, {
    headers: { ...makeAuthHeaders(), ...xsrfHeader() },
  })

// 로그인 사용자 (보호 API)
export const getLoginUser = () =>
  api.get('/auth/me', {
    headers: { ...makeAuthHeaders(), ...xsrfHeader() },
  })