package com.aloha.zootopia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * KakaoPay 결제 Ready / Approve 통신용 DTO 모음 (개발/테스트 모드)
 * 필요한 필드만 최소한으로 정의. 추후 실제 운영 전 확장 가능.
 */
public class KakaoPayDtos {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReadyRequest {
        private String orderId;          // 가맹점 주문번호
        private String userId;           // 사용자 식별자 (로그인 사용자 ID 또는 이메일)
        private String itemName;         // 대표 상품명
        private int quantity;            // 총 수량
        private int totalAmount;         // 총 결제금액
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReadyResponse {
        private String tid;                  // 결제 고유번호
        private String next_redirect_pc_url; // PC 웹 결제 페이지 URL
        private String created_at;           // 생성시간 (문자열)
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ApproveRequest {
        private String orderId;   // 주문번호
        private String userId;    // 사용자 식별자
        private String pgToken;   // 카카오페이 콜백 pg_token
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ApproveResponse {
        private boolean approved;
        private String tid;
        private String orderId;
        private int amount; // 총 금액
        private String approvedAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CancelRequest {
        private String tid;       // 취소할 결제 TID
        private int cancelAmount; // 취소 금액 (전체취소 시 총금액)
        private String cancelReason; // 취소 사유(옵션)
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CancelResponse {
        private boolean canceled;
        private String tid;
        private int canceledAmount;
        private String canceledAt;
    }
}
