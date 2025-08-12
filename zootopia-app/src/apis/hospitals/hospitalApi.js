import Cookies from 'js-cookie';
import api from '../api';

/**
 * 병원 관련 API 엔드포인트 통합 모듈
 */
const BASE_URL = '/service/hospitals';

/* ================== 공통 설정 ================== */
// 모든 요청에 JWT 토큰 자동 추가
api.interceptors.request.use((config) => {
  const token = Cookies.get('jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ================== 목록 조회 ================== */
/**
 * 병원 목록 조회
 * @param {Array<number>} animal - 필터링할 동물 ID 배열
 * @param {number} pageNum - 페이지 번호
 */
export const list = (animal = [], pageNum = 1) =>
  api.get(BASE_URL, {
    params: {
      animal: animal?.length ? animal.join(',') : undefined,
      pageNum
    }
  });

/* ================== 병원 기본 CRUD ================== */
/** 단일 병원 조회 */
export const read = (id) => api.get(`${BASE_URL}/${id}`);

/** 병원 생성 */
export const create = (hospitalForm, thumbnailImageFile) => {
  const formData = new FormData();
  formData.append(
    'hospitalForm',
    new Blob([JSON.stringify(hospitalForm)], { type: 'application/json' })
  );
  if (thumbnailImageFile) {
    formData.append('thumbnailImageFile', thumbnailImageFile);
  }
  return api.post(BASE_URL, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

/** 병원 수정 */
export const update = (id, hospitalForm, thumbnailImageFile) => {
  const formData = new FormData();
  formData.append(
    'hospitalForm',
    new Blob([JSON.stringify(hospitalForm)], { type: 'application/json' })
  );
  if (thumbnailImageFile) {
    formData.append('thumbnailImageFile', thumbnailImageFile);
  }
  return api.put(`${BASE_URL}/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

/** 병원 삭제 */
export const remove = (id) => api.delete(`${BASE_URL}/${id}`);

/* ================== 동물 & 진료과목 ================== */
/** 모든 동물 목록 */
export const getAllAnimals = () => api.get(`${BASE_URL}/animals`);
/** 모든 진료 과목 목록 */
export const getAllSpecialties = () => api.get(`${BASE_URL}/specialties`);

/* ================== 리뷰 CRUD ================== */
/** 리뷰 목록 조회 */
export const getReviews = (hospitalId) =>
  api.get(`${BASE_URL}/${hospitalId}/reviews`);

/** 리뷰 등록 */
export const addReview = (hospitalId, review) =>
  api.post(`${BASE_URL}/${hospitalId}/reviews`, review);

/** 리뷰 수정 */
export const updateReview = (hospitalId, reviewId, review) =>
  api.put(`${BASE_URL}/${hospitalId}/reviews/${reviewId}`, review);

/** 리뷰 삭제 */
export const deleteReview = (hospitalId, reviewId) =>
  api.delete(`${BASE_URL}/${hospitalId}/reviews/${reviewId}`);
