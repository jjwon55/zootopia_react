package com.aloha.zootopia.service;

import java.time.LocalDateTime;
import java.util.List;

import com.aloha.zootopia.domain.AdminUserDetail;
import com.aloha.zootopia.domain.AdminUserSummary;
import com.aloha.zootopia.domain.UpdateAdminUserRequest;

public interface AdminUserService {
    record PageResult<T>(List<T> content, long totalElements, int page, int size) {}

    PageResult<AdminUserSummary> list(String q, String status, String role,
                                      LocalDateTime from, LocalDateTime to,
                                      int page, int size, String sort, String dir);

    AdminUserDetail get(Integer userId);

    void update(Integer userId, UpdateAdminUserRequest req);

    void updateRoles(Integer userId, List<String> roles);
}
