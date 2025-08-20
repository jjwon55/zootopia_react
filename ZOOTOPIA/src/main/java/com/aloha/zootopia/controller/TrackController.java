package com.aloha.zootopia.controller;

import java.util.Map;
import java.util.Optional;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.aloha.zootopia.domain.OutboundClick;
import com.aloha.zootopia.domain.Users;       // principal이 Users인 경우
import com.aloha.zootopia.domain.CustomUser; // principal이 CustomUser인 경우
import com.aloha.zootopia.mapper.OutboundClickMapper;

@RestController
@RequestMapping("/track")
@RequiredArgsConstructor
public class TrackController {

    private final OutboundClickMapper clickMapper;

    @PostMapping("/outbound/insurance")
    public ResponseEntity<Void> trackOutbound(@RequestBody Map<String, Object> body,
                                              HttpServletRequest req,
                                              Authentication auth) {
        try {
            // 1) productId 안전 파싱 (NOT NULL)
            Integer productId = null;
            Object pid = body.get("productId");
            if (pid instanceof Number) {
                productId = ((Number) pid).intValue();
            } else if (pid instanceof String s && !s.isBlank()) {
                productId = Integer.parseInt(s.trim());
            }
            if (productId == null) return ResponseEntity.badRequest().build();

            // 2) 필수값: href
            String href = String.valueOf(body.getOrDefault("href", "")).trim();
            if (href.isEmpty()) return ResponseEntity.badRequest().build();

            // 3) 라벨 기본값
            String label = String.valueOf(body.getOrDefault("label", "apply"));

            // 4) 엔티티 구성
            OutboundClick c = new OutboundClick();
            c.setProductId(productId);
            c.setHref(href);
            c.setLabel(label);
            c.setUserAgent(req.getHeader("User-Agent"));

            // X-Forwarded-For 우선 → 없으면 remote addr
            String ip = Optional.ofNullable(req.getHeader("X-Forwarded-For"))
                                .map(x -> x.split(",")[0].trim())
                                .orElse(req.getRemoteAddr());
            c.setIp(ip);

            // 5) 로그인 유저 매핑 (있을 때만)
            c.setUserId(extractUserId(auth)); // Long 또는 null

            clickMapper.insert(c);

        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            // log.warn("trackOutbound error", e);
        }
        return ResponseEntity.accepted().build(); // 202
    }

    /** Authentication에서 userId(Long)를 안전 추출 */
    private Long extractUserId(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) return null;
        Object principal = auth.getPrincipal();

        // 1) principal이 Users 도메인일 때
        if (principal instanceof Users u) {
            return u.getUserId(); // long → Long 자동 박싱
        }

        // 2) principal이 CustomUser일 때 (프로젝트에 맞게 userId 접근)
        if (principal instanceof CustomUser cu) {
            try {
                // CustomUser에 getUserId()가 있는 경우
                return cu.getUserId();
            } catch (Throwable ignore) {
                // (옵션) CustomUser가 Users를 감싸고 있으면 getUser() → getUserId()
                try {
                    Object inner = cu.getClass().getMethod("getUser").invoke(cu);
                    if (inner instanceof Users uu) return uu.getUserId();
                } catch (Throwable ignore2) {}
            }
        }

        // 3) 그 외(문자열 'anonymousUser' 등)
        return null;
    }
}