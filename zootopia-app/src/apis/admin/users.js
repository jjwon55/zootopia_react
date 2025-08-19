import api from "../api";  // ✅ 공용 axios 인스턴스 import

const base = "/admin/users";

// 사용자 목록
export const listUsers = (params) => api.get(base, { params });

// 사용자 상세
export const getUser = (id) => {
  if (!id) throw new Error("getUser: id is required");
  return api.get(`${base}/${id}`);
};

// 사용자 정지/해제 (PATCH + query param)
export const banUser = (id, suspend) =>
  api.patch(`${base}/${id}/ban`, null, { params: { ban: suspend } });

// 기본정보 수정 (PATCH + body DTO)
export const updateUser = (id, data) =>
  api.patch(`${base}/${id}`, data);

// 역할 수정 (PATCH + {roles: [...]})
export const updateUserRoles = (id, roles) =>
  api.patch(`${base}/${id}/roles`, { roles });
