import req from './request';

// 목록/조회 (인증 불필요)
export const listProducts = ({ species = '', company = '', page = 1 } = {}) => {
  const qs = new URLSearchParams({
    species,
    company,
    page: String(page),
  }).toString();
  return req(`/insurance/list?${qs}`);
};

export const readProduct = (productId) =>
  req(`/insurance/read/${productId}`);

// ⬇️ ADMIN 전용 (auth:true)
export const uploadImage = (file) => {
  const fd = new FormData();
  fd.append('imageFile', file);   // 서버 @RequestParam("imageFile")와 일치!
  return req('/insurance/upload-image', { method: 'POST', formData: fd, auth: true });
};

export const registerProduct = (product) =>
  req('/insurance/register', { method: 'POST', json: product, auth: true });

export const updateProduct = (product) =>
  req('/insurance/update', { method: 'POST', json: product, auth: true });

export const deleteProduct = (productId) =>
  req(`/insurance/delete/${productId}`, { method: 'POST', auth: true });