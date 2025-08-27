import api from '../api'; // 이미 axios 설정된 인스턴스

// -------------------- 공고 관련 --------------------

// 목록 조회 (필터 + 페이지)
export const getJobs = (params) => api.get('/parttime', { params })

// 단건 조회 (상세 + 지원자 + 내 신청 + hasApplied 포함)
export const getJobDetail = (jobId, applicantPage = 1) =>
  api.get(`/parttime/${jobId}`, { params: { applicantPage } })
     .then(res => {
       const data = res.data || {}
       data.job = data.job || {}
       data.job.pets = data.job.pets ?? []
       data.applicants = data.applicants ?? []
       data.myApplication = data.myApplication ?? null
       data.hasApplied = data.hasApplied ?? false
       data.totalApplicantPages = data.totalApplicantPages ?? 1
       return data
     })

// 특정 ID로 조회 (지원자 포함 X)
export const getJobById = (jobId) =>
  api.get(`/parttime/${jobId}`).then(res => {
    const data = res.data || {}
    data.job = data.job || {}
    data.job.pets = data.job.pets ?? []
    return data
  })

// 등록 / 수정 / 삭제
export const insertJob = (jobData) => api.post('/parttime', jobData)
export const updateJob = (jobId, jobData) => api.put(`/parttime/${jobId}`, jobData)
export const deleteJob = (jobId) => api.delete(`/parttime/${jobId}`)

// -------------------- 펫 관련 --------------------
export const getMyPets = () => api.get('/pets')
export const createPet = (petData) => api.post('/pets', petData)
export const uploadPetPhoto = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return api.post('/pets/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
export const deletePet = (petId) => api.delete(`/pets/${petId}`)

// -------------------- 지원자 관련 --------------------

// 신청
export const applyApplicants = (jobId, body) =>
  api.post(`/parttime/${jobId}/applicants`, body).then(r => r.data)

// 신청 취소
export const deleteApplication = (applicantId) =>
  api.delete(`/parttime/applicants/${applicantId}`)

// -------------------- 로그인 사용자 --------------------
export const getLoginUser = () => api.get('/auth/me')

export default api