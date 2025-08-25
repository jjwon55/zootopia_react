import api from '../api'; 

// =============================
// 보험 상품 API
// =============================
export const listProducts = (params) =>
  api.get('/insurance/list', { params })
export const readProduct = (productId) =>
  api.get(`/insurance/read/${productId}`)
export const uploadImage = async (file) => {
  const fd = new FormData()
  fd.append('imageFile', file)
  const { data } = await api.post('/insurance/upload-image', fd)
  return data
}
export const registerProduct = (product) => api.post('/insurance/register', product)
export const updateProduct = (product) => api.post('/insurance/update', product)
export const deleteProduct = (productId) => api.post(`/insurance/delete/${productId}`)

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