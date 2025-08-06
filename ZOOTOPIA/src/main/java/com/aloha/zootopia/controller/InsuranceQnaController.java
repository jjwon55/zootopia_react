package com.aloha.zootopia.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.aloha.zootopia.domain.CustomUser;
import com.aloha.zootopia.domain.InsuranceProduct;
import com.aloha.zootopia.domain.InsuranceQna;
import com.aloha.zootopia.domain.InsuranceQnaResponse;
import com.aloha.zootopia.service.InsuranceProductService;
import com.aloha.zootopia.service.InsuranceQnaService;

@Controller
@RequestMapping("/insurance/qna")
public class InsuranceQnaController {

    @Autowired
    private InsuranceQnaService qnaService;

    @Autowired
    private InsuranceProductService productService;

    // 특정 보험상품 Q&A 목록
    @GetMapping("/read/{productId}")
    public String read(@PathVariable int productId,
                       @AuthenticationPrincipal CustomUser customUser,
                       Model model) {

        InsuranceProduct product = productService.getProduct(productId);
        model.addAttribute("product", product);

        if (customUser != null) {
            long userId = customUser.getUser().getUserId();
            boolean isAdmin = customUser.getAuthorities().stream()
                                        .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            model.addAttribute("loginUserId", userId);
            model.addAttribute("isAdmin", isAdmin);
        }

        return "insurance/read";
    }

    // AJAX: QnA 리스트 조회
    @GetMapping("/list")
    @ResponseBody
    public Map<String, Object> listQnaPaged(@RequestParam int productId,
                                            @RequestParam(defaultValue = "1") int page,
                                            @AuthenticationPrincipal CustomUser user) {
        int pageSize = 4;
        long loginUserId = user != null ? user.getUser().getUserId() : -1;
        boolean isAdmin = user != null && user.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        List<InsuranceQnaResponse> qnaList = qnaService.getQnaListPaged(productId, page, pageSize).stream()
                .map(q -> InsuranceQnaResponse.from(q, loginUserId, isAdmin))
                .toList();
        int totalCount = qnaService.countByProduct(productId);

        Map<String, Object> response = new HashMap<>();
        response.put("qnaList", qnaList);
        response.put("pagination", getPagination(page, totalCount, pageSize));
        return response;
    }

    // 질문 등록
    @PostMapping("/register")
    @PreAuthorize("hasRole('USER')")
    public String register(InsuranceQna qna, @AuthenticationPrincipal CustomUser customUser) {
        qna.setUserId(Integer.parseInt(customUser.getUsername()));
        qnaService.registerQuestion(qna);
        return "redirect:/insurance/qna/" + qna.getProductId();
    }

    // AJAX 방식
    @PostMapping("/register-ajax")
    @PreAuthorize("hasRole('USER')")
    @ResponseBody
    public ResponseEntity<?> registerAjax(@RequestBody InsuranceQna qna,
                                        @AuthenticationPrincipal CustomUser customUser) {
        try {
            if (customUser == null) {
                return ResponseEntity.status(401).body("로그인이 필요합니다.");
            }

            long loginUserId = customUser.getUser().getUserId();
            boolean isAdmin = customUser.getAuthorities().stream()
                                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

            qna.setUserId(loginUserId);
            qnaService.registerQuestion(qna);

            List<InsuranceQnaResponse> list = qnaService.getQnaList(qna.getProductId()).stream()
                .map(q -> InsuranceQnaResponse.from(q, loginUserId, isAdmin))
                .toList();

            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("❌ 서버 오류: " + e.getMessage());
        }
    }


    // 질문 수정 폼
    @GetMapping("/edit/{qnaId}")
    @PreAuthorize("hasRole('USER')")
    public String showUpdateQuestion(@PathVariable int qnaId,
                                     @AuthenticationPrincipal User user,
                                     Model model) {
        InsuranceQna qna = qnaService.getQna(qnaId);
        if (qna.getUserId() != Integer.parseInt(user.getUsername())) {
            throw new SecurityException("작성자만 수정 가능합니다.");
        }
        model.addAttribute("qna", qna);
        return "insurance/qnaEdit";  // 예: qnaEdit.jsp
    }

    // 질문 수정 처리
    @PostMapping("/edit-ajax")
    @PreAuthorize("hasRole('USER')")
    @ResponseBody
    public List<InsuranceQnaResponse> editAjax(@RequestBody InsuranceQna qna,
                                            @AuthenticationPrincipal CustomUser user) {
        InsuranceQna origin = qnaService.getQna(qna.getQnaId());

        if (origin.getUserId() != user.getUser().getUserId()) {
            throw new SecurityException("본인만 수정할 수 있습니다.");
        }

        qna.setUserId(user.getUser().getUserId());
        qnaService.updateQnaQuestion(qna);

        return qnaService.getQnaList(qna.getProductId()).stream()
                .map(q -> InsuranceQnaResponse.from(q, user.getUser().getUserId(), false))  // isAdmin은 false
                .toList();
    }

    // AJAX: 답변 등록/수정 (관리자)
    @PostMapping("/answer")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseBody
    public List<InsuranceQnaResponse> answerAjax(@RequestBody InsuranceQna qna,
                                                 @AuthenticationPrincipal CustomUser user) {
        qnaService.answerQna(qna);

        long loginUserId = user.getUser().getUserId();
        boolean isAdmin = true;

        return qnaService.getQnaList(qna.getProductId()).stream()
                .map(q -> InsuranceQnaResponse.from(q, loginUserId, isAdmin))
                .toList();
    }

    // AJAX: 질문 삭제
    @PostMapping("/delete-ajax/{qnaId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @ResponseBody
    public List<InsuranceQnaResponse> deleteAjax(@PathVariable int qnaId,
                                                 @RequestParam int productId,
                                                 @AuthenticationPrincipal CustomUser user) {
        InsuranceQna qna = qnaService.getQna(qnaId);
        long loginId = user.getUser().getUserId();

        boolean isWriter = qna.getUserId() == loginId;
        boolean isAdmin = user.getUser().getAuthList().stream()
                .anyMatch(auth -> auth.getAuth().equals("ROLE_ADMIN"));

        if (!isWriter && !isAdmin) {
            throw new SecurityException("작성자 또는 관리자만 삭제 가능합니다.");
        }

        qnaService.deleteQna(qnaId);

        return qnaService.getQnaList(productId).stream()
                .map(q -> InsuranceQnaResponse.from(q, loginId, isAdmin))
                .toList();
    }

        // ✅ 페이지네이션 계산 함수
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
