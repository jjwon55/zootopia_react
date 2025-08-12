import api from './api' // axios 인스턴스 (baseURL, interceptor 설정된 파일)

/** 1. 아르바이트 전체 목록 조회 (필터링 포함) */
export const getJobs = (params) => api.get('/parttime', { params })

/** 2. 아르바이트 등록 */
export const insertJob = (jobData) => api.post('/parttime', jobData)

/** 3. 아르바이트 상세 조회 */
export const getJobById = (jobId) => api.get(`/parttime/${jobId}`)

/** 4. 아르바이트 수정 */
export const updateJob = (jobId, jobData) => api.put(`/parttime/${jobId}`, jobData)

/** 5. 아르바이트 삭제 */
export const deleteJob = (jobId) => api.delete(`/parttime/${jobId}`)

/** 6. 아르바이트 지원 신청 */
export const applyToJob = (applyData) => api.post('/parttime/apply', applyData)
// 예: { jobId, introduction, email, phone }

/** 7. 특정 아르바이트의 지원자 전체 조회 */
export const getApplicantsByJob = (jobId) => api.get(`/parttime/${jobId}/applicants`)

/** 8. 특정 지원 신청 취소 */
export const deleteApplication = (applicantId, jobId) =>
  api.delete(`/parttime/${jobId}/applicants/${applicantId}`)

/** 9. 로그인 사용자 정보 조회 */
export const getLoginUser = () => api.get('/auth/me')  // 또는 /users/me