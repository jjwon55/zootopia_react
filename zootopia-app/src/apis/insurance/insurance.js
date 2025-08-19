// apis/insurance.js  ← posts.js와 동일 패턴
import axios from 'axios'
import Cookies from 'js-cookie'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // 쿠키 자동 전송
})

// ✅ 매 요청마다 쿠키에서 jwt 읽어 Authorization 헤더에 세팅
api.interceptors.request.use((config) => {
  const jwt = Cookies.get('jwt')
  if (jwt && typeof jwt === 'string') {
    config.headers.Authorization = `Bearer ${jwt}`
  }
  // (선택) CSRF 더블서브밋 쓰면 같이 실어주기
  const xsrf = Cookies.get('XSRF-TOKEN')
  if (xsrf) config.headers['X-XSRF-TOKEN'] = xsrf
  return config
})

// =============================
// 보험 상품 API
// =============================
export const listProducts = (params) =>
  api.get('/insurance/list', { params })  // { species, company, page }

export const readProduct = (productId) =>
  api.get(`/insurance/read/${productId}`)

export const uploadImage = async (file) => {
  const fd = new FormData()
  fd.append('imageFile', file)
  const { data } = await api.post('/insurance/upload-image', fd)
  return data              // { imagePath: '/upload/xxx.jpg' }
  // 또는: return data.imagePath
}
export const registerProduct = (product) =>
  api.post('/insurance/register', product)

export const updateProduct = (product) =>
  api.post('/insurance/update', product)

export const deleteProduct = (productId) =>
  api.post(`/insurance/delete/${productId}`)

// =============================
// 보험 QnA API
// =============================
export const getQnaList = ({ productId, page = 1 }) =>
  api.get('/insurance/qna/list', { params: { productId, page } })

export const registerQna = ({ productId, species, question }) =>
  api.post('/insurance/qna/register-ajax', { productId, species, question })

export const editQna = ({ qnaId, productId, species, question }) =>
  api.post('/insurance/qna/edit-ajax', { qnaId, productId, species, question })

export const deleteQna = ({ qnaId, productId }) =>
  api.post(`/insurance/qna/delete-ajax/${qnaId}`, null, { params: { productId } })

export const answerQna = ({ qnaId, productId, answer }) =>
  api.post('/insurance/qna/answer', { qnaId, productId, answer })

export default api
