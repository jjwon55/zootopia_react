import axios from 'axios';
import Cookies from 'js-cookie';

// axios 객체 생성
const api = axios.create({
  baseURL: '/service/hospitals', // 백엔드 컨트롤러에 명시된 기본 URL
  withCredentials: true,
});

// 요청 인터셉터를 사용하여 모든 요청에 JWT 토큰을 추가합니다.
api.interceptors.request.use((config) => {
  const token = Cookies.get('jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * 병원 목록을 조회합니다.
 * @param {Array<number>} animal - 필터링할 동물 ID 배열
 * @param {number} pageNum - 페이지 번호
 * @returns {Promise<object>} - 병원 목록 및 페이지 정보
 */
export const list = (animal, pageNum = 1) => {
  return api.get('', { 
    params: { 
      animal: animal?.join(','), // 배열을 쉼표로 구분된 문자열로 전달
      pageNum 
    }
  });
};

// ID로 단일 병원 정보를 가져옵니다.
export const read = (id) => api.get(`/${id}`);

/**
 * 새 병원을 생성합니다.
 * @param {object} hospitalForm - 병원 폼 데이터
 * @param {File} thumbnailImageFile - 썸네일 이미지 파일
 * @returns {Promise<object>} 
 */
export const create = (hospitalForm, thumbnailImageFile) => {
  const formData = new FormData();
  // hospitalForm 객체를 Blob으로 변환하여 FormData에 추가
  formData.append('hospitalForm', new Blob([JSON.stringify(hospitalForm)], { type: 'application/json' }));
  if (thumbnailImageFile) {
    formData.append('thumbnailImageFile', thumbnailImageFile);
  }

  return api.post('', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * 기존 병원 정보를 업데이트합니다.
 * @param {number} id - 병원 ID
 * @param {object} hospitalForm - 병원 폼 데이터
 * @param {File} thumbnailImageFile - 썸네일 이미지 파일
 * @returns {Promise<object>}
 */
export const update = (id, hospitalForm, thumbnailImageFile) => {
  const formData = new FormData();
  formData.append('hospitalForm', new Blob([JSON.stringify(hospitalForm)], { type: 'application/json' }));
  if (thumbnailImageFile) {
    formData.append('thumbnailImageFile', thumbnailImageFile);
  }

  return api.put(`/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// ID로 병원을 삭제합니다.
export const remove = (id) => api.delete(`/${id}`);

// ###################### 리뷰 관련 API ######################

// 병원의 모든 리뷰 목록을 가져옵니다.
export const getReviews = (hospitalId) => api.get(`/${hospitalId}/reviews`);

// 병원에 새 리뷰를 추가합니다.
export const addReview = (hospitalId, review) => api.post(`/${hospitalId}/reviews`, review);

// 리뷰를 수정합니다.
export const updateReview = (hospitalId, reviewId, review) => api.put(`/${hospitalId}/reviews/${reviewId}`, review);

// 리뷰를 삭제합니다.
export const deleteReview = (hospitalId, reviewId) => api.delete(`/${hospitalId}/reviews/${reviewId}`);
