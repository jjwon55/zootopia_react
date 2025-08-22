package com.aloha.zootopia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class TossPayDtos {
    @Data @NoArgsConstructor @AllArgsConstructor
    public static class ConfirmRequest { private String paymentKey; private String orderId; private Integer amount; }
    @Data @NoArgsConstructor @AllArgsConstructor
    public static class ConfirmResponse { private boolean success; private String paymentKey; private String orderId; private Integer amount; private String method; private String approvedAt; }
    @Data @NoArgsConstructor @AllArgsConstructor
    public static class CancelRequest { private String paymentKey; private Integer amount; private String reason; }
    @Data @NoArgsConstructor @AllArgsConstructor
    public static class CancelResponse { private boolean success; private String paymentKey; private Integer canceledAmount; private String canceledAt; }
}
