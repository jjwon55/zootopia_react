import api from './api' // Axios 기본 설정 파일

export const insertJob = (formData) => {
  return api.post('/api/parttime', formData)
}