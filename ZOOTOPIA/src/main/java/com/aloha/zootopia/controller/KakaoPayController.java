package com.aloha.zootopia.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

import com.aloha.zootopia.dto.KakaoPayDtos.ApproveRequest;
import com.aloha.zootopia.dto.KakaoPayDtos.ApproveResponse;
import com.aloha.zootopia.dto.KakaoPayDtos.ReadyRequest;
import com.aloha.zootopia.dto.KakaoPayDtos.ReadyResponse;
import com.aloha.zootopia.dto.KakaoPayDtos.CancelRequest;
import com.aloha.zootopia.dto.KakaoPayDtos.CancelResponse;
import com.aloha.zootopia.service.KakaoPayService;

import lombok.RequiredArgsConstructor;

/**
 * KakaoPay 테스트/개발용 REST 컨트롤러
 * 프론트엔드 axios base '/api' 기준으로 '/payments/kakao/*' 경로 사용.
 */
@RestController
@RequestMapping("/api/payments/kakao")
@RequiredArgsConstructor
public class KakaoPayController {

    private final KakaoPayService kakaoPayService;

    /**
     * 결제 준비
     */
    @PostMapping("/ready")
    public ResponseEntity<ReadyResponse> ready(@RequestBody ReadyRequest req) {
        if (req.getQuantity() <= 0) req.setQuantity(1);
        return ResponseEntity.ok(kakaoPayService.ready(req));
    }

    /**
     * 결제 승인 (카카오 콜백 이후 프론트에서 pg_token 전달)
     */
    @PostMapping("/approve")
    public ResponseEntity<ApproveResponse> approve(@RequestBody ApproveRequest req) {
        return ResponseEntity.ok(kakaoPayService.approve(req));
    }

    @PostMapping("/cancel")
    public ResponseEntity<CancelResponse> cancel(@RequestBody CancelRequest req) {
        return ResponseEntity.ok(kakaoPayService.cancel(req));
    }

    /**
     * (선택) 간단한 헬스 체크
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("kakao-pay-api-ok");
    }
}
