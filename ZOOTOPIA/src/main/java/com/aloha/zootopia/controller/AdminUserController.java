package com.aloha.zootopia.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aloha.zootopia.domain.UpdateAdminUserRequest;
import com.aloha.zootopia.domain.UpdateUserRolesRequest;
import com.aloha.zootopia.service.AdminUserService;

import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin("*")
@RequestMapping("/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService service;

    @GetMapping
    public ResponseEntity<?> list(
            @RequestParam(name = "q", required = false) String q,
            @RequestParam(name = "status", required = false) String status,
            @RequestParam(name = "role", required = false) String role,
            @RequestParam(name = "from", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(name = "to", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size,
            @RequestParam(name = "sort", defaultValue = "createdAt") String sort,
            @RequestParam(name = "dir", defaultValue = "desc") String dir
    ) {
        var result = service.list(q, status, role, from, to, page, size, sort, dir);

        Map<String, Object> body = new HashMap<>();
        body.put("data", result.content());
        Map<String, Object> pageInfo = Map.of(
                "number", result.page(),
                "size", result.size(),
                "totalElements", result.totalElements(),
                "totalPages", (int) Math.ceil((double) result.totalElements() / result.size())
        );
        body.put("page", pageInfo);
        body.put("meta", Map.of("timestamp", LocalDateTime.now().toString()));
        return ResponseEntity.ok(body);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> get(@PathVariable("userId") Integer userId) {
        var data = service.get(userId);
        return ResponseEntity.ok(Map.of("data", data));
    }

    @PatchMapping("/{userId}")
    public ResponseEntity<?> update(
            @PathVariable("userId") Integer userId,
            @RequestBody UpdateAdminUserRequest req
    ) {
        service.update(userId, req);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    @PatchMapping("/{userId}/roles")
    public ResponseEntity<?> updateRoles(
            @PathVariable("userId") Integer userId,
            @RequestBody UpdateUserRolesRequest req
    ) {
        service.updateRoles(userId, req.getRoles());
        return ResponseEntity.ok(Map.of("ok", true));
    }

    // 편의: 정지/해제
    @PatchMapping("/{userId}/ban")
    public ResponseEntity<?> ban(
            @PathVariable("userId") Integer userId,
            @RequestParam(name = "ban", defaultValue = "true") boolean ban
    ) {
        var req = new UpdateAdminUserRequest();
        req.setStatus(ban ? "SUSPENDED" : "ACTIVE");
        service.update(userId, req);
        return ResponseEntity.ok(Map.of("ok", true));
    }
}
