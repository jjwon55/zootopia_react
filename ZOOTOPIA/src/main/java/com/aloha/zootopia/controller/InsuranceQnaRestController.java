package com.aloha.zootopia.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors; // ✅ JDK 8/11용

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aloha.zootopia.domain.CustomUser;
import com.aloha.zootopia.domain.InsuranceQna;
import com.aloha.zootopia.domain.InsuranceQnaResponse;
import com.aloha.zootopia.service.InsuranceQnaService;

@RestController
@RequestMapping("/api/insurance/qna")
public class InsuranceQnaRestController {

    @Autowired
    private InsuranceQnaService qnaService;

    // ===== 공통 헬퍼 (JDK 8/11 안전) =====
    private long getLoginUserId(Authentication auth) {
        if (auth == null) return -1L;
        Object principal = auth.getPrincipal();
        if (principal instanceof CustomUser) {
            return ((CustomUser) principal).getUser().getUserId();
        }
        return -1L;
    }

    private boolean isAdmin(Authentication auth) {
        if (auth == null) return false;
        for (GrantedAuthority a : auth.getAuthorities()) {
            if ("ROLE_ADMIN".equals(a.getAuthority())) return true;
        }
        return false;
    }
    // ===================================

    // 목록 (페이지 단위)
    @GetMapping("/list")
    public ResponseEntity<?> listQnaPaged(
            @RequestParam int productId,
            @RequestParam(defaultValue = "1") int page,
            Authentication authentication
    ) {
        final int pageSize = 4;

        // ✅ 람다에서 쓸 값은 final 변수로 확정
        final long uid = getLoginUserId(authentication);
        final boolean admin = isAdmin(authentication);

        List<InsuranceQnaResponse> qnaList = qnaService
                .getQnaListPaged(productId, page, pageSize).stream()
                .map(q -> InsuranceQnaResponse.from(q, uid, admin))
                .collect(Collectors.toList()); // ✅ JDK 8/11 호환

        int totalCount = qnaService.countByProduct(productId);

        Map<String, Object> body = new HashMap<>();
        body.put("qnaList", qnaList);
        body.put("pagination", getPagination(page, totalCount, pageSize));
        return ResponseEntity.ok(body);
    }

    // 질문 등록 (USER)
    @PostMapping("/register-ajax")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> registerAjax(
            @RequestBody InsuranceQna qna,
            Authentication authentication
    ) {
        final long uid = getLoginUserId(authentication);
        if (uid < 0) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "로그인이 필요합니다."));
        }
        if (!StringUtils.hasText(qna.getQuestion())) {
            return ResponseEntity.badRequest().body(Map.of("message", "질문 내용을 입력하세요."));
        }

        qna.setUserId(uid);
        qnaService.registerQuestion(qna);

        // 등록 후 1페이지 반환
        return okListWithPage(qna.getProductId(), 1, authentication);
    }

    // 질문 수정 (작성자)
    @PostMapping("/edit-ajax")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> editAjax(
            @RequestBody InsuranceQna qna,
            Authentication authentication
    ) {
        final long uid = getLoginUserId(authentication);

        InsuranceQna origin = qnaService.getQna(qna.getQnaId());
        if (origin == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "질문이 없습니다."));
        }
        if (origin.getUserId() != uid) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "본인만 수정할 수 있습니다."));
        }

        qna.setUserId(uid);
        qnaService.updateQnaQuestion(qna);
        return okListWithPage(qna.getProductId(), 1, authentication);
    }

    // 답변 등록/수정 (ADMIN)
    @PostMapping("/answer")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> answerAjax(
            @RequestBody InsuranceQna qna,
            Authentication authentication
    ) {
        qnaService.answerQna(qna);
        return okListWithPage(qna.getProductId(), 1, authentication);
    }

    // 질문 삭제 (작성자 or ADMIN)
    @PostMapping("/delete-ajax/{qnaId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteAjax(
            @PathVariable int qnaId,
            @RequestParam int productId,
            Authentication authentication
    ) {
        final long uid = getLoginUserId(authentication);
        final boolean admin = isAdmin(authentication);

        InsuranceQna origin = qnaService.getQna(qnaId);
        if (origin == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "질문이 없습니다."));
        }
        boolean isWriter = origin.getUserId() == uid;
        if (!isWriter && !admin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "작성자 또는 관리자만 삭제 가능합니다."));
        }

        qnaService.deleteQna(qnaId);
        return okListWithPage(productId, 1, authentication);
    }

    // ---- 공통 응답 생성 ----
    private ResponseEntity<Map<String, Object>> okListWithPage(int productId, int page, Authentication auth) {
        final int pageSize = 4;
        final long uid = getLoginUserId(auth);
        final boolean admin = isAdmin(auth);

        List<InsuranceQnaResponse> qnaList = qnaService
                .getQnaListPaged(productId, page, pageSize).stream()
                .map(q -> InsuranceQnaResponse.from(q, uid, admin))
                .collect(Collectors.toList()); // ✅

        int totalCount = qnaService.countByProduct(productId);

        Map<String, Object> body = new HashMap<>();
        body.put("qnaList", qnaList);
        body.put("pagination", getPagination(page, totalCount, pageSize));
        return ResponseEntity.ok(body);
    }

    private Map<String, Object> getPagination(int page, int totalCount, int pageSize) {
        int totalPage = (int) Math.ceil((double) totalCount / pageSize);
        int startPage = Math.max(1, page - 2);
        int endPage = Math.min(totalPage, page + 2);

        Map<String, Object> map = new HashMap<>();
        map.put("page", page);
        map.put("totalPage", totalPage);
        map.put("startPage", startPage);
        map.put("endPage", endPage);
        map.put("hasPrev", startPage > 1);
        map.put("hasNext", endPage < totalPage);
        return map;
    }
}