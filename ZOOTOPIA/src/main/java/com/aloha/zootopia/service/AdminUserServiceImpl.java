package com.aloha.zootopia.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aloha.zootopia.domain.AdminUserDetail;
import com.aloha.zootopia.domain.AdminUserSummary;
import com.aloha.zootopia.domain.UpdateAdminUserRequest;
import com.aloha.zootopia.mapper.AdminUserMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {

    private final AdminUserMapper mapper;

    private static final Set<String> SORTABLE = Set.of("createdAt","email","nickname");

    private String mapSortColumn(String sort) {
        return switch (sort) {
            case "email" -> "u.email";
            case "nickname" -> "u.nickname";
            default -> "u.created_at"; // createdAt
        };
    }

    @Override
    public PageResult<AdminUserSummary> list(String q, String status, String role,
                                             LocalDateTime from, LocalDateTime to,
                                             int page, int size, String sort, String dir) {
        if (!SORTABLE.contains(sort)) sort = "createdAt";
        if (!"asc".equalsIgnoreCase(dir)) dir = "desc";
        int offset = page * size;
        String sortColumn = mapSortColumn(sort);
        List<AdminUserSummary> rows = mapper.findUsers(q, status, role, from, to, size, offset, sortColumn, dir);
        long total = mapper.countUsers(q, status, role, from, to);

        // roles 채우기 (필요 시 최적화)
        for (var u : rows) {
            u.setRoles(mapper.findRolesByUserId(u.getUserId()));
        }
        return new PageResult<>(rows, total, page, size);
    }

    @Override
    public AdminUserDetail get(Integer userId) {
        AdminUserDetail d = mapper.findUserById(userId);
        if (d == null) throw new NoSuchElementException("User not found");
        d.setRoles(mapper.findRolesByUserId(userId));
        return d;
    }

    @Override
    @Transactional
    public void update(Integer userId, UpdateAdminUserRequest req) {
        Map<String, Object> fields = new HashMap<>();
        if (req.getNickname() != null) fields.put("nickname", req.getNickname());
        if (req.getStatus() != null) fields.put("status", req.getStatus());
        if (req.getMemo() != null) fields.put("memo", req.getMemo());
        if (fields.isEmpty()) return;
        mapper.updateUserFields(userId, fields);
    }
    private static final Set<String> ROLE_WHITELIST =
        Set.of("ROLE_USER", "ROLE_ADMIN");

    @Override
    @Transactional
    public void updateRoles(Integer userId, List<String> roles) {
        // null 방어 + 화이트리스트 + 중복 제거
        List<String> safe = (roles == null ? List.<String>of() : roles).stream()
                .filter(ROLE_WHITELIST::contains)
                .distinct()
                .toList();

        mapper.deleteRoles(userId);
        if (!safe.isEmpty()) {
            mapper.insertRolesBatch(userId, safe); // ✅ 배치 호출
        }
    }
}
