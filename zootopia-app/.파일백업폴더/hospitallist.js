import api from '../api';

const BASE_URL = '/service/hospitals';

/**
 * 병원 목록을 조회합니다.
 * @param {Array<number>} animal - 필터링할 동물 ID 배열
 * @param {number} pageNum - 페이지 번호
 * @returns {Promise<object>} - 병원 목록 및 페이지 정보
 */
export const list = (animal, pageNum = 1) => {
  return api.get(BASE_URL, {
    params: {
      animal: animal?.join(','), // 배열을 쉼표로 구분된 문자열로 전달
      pageNum
    }
  });
};
