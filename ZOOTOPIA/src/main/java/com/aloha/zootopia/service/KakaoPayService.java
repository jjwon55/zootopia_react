package com.aloha.zootopia.service;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.aloha.zootopia.dto.KakaoPayDtos.ApproveRequest;
import com.aloha.zootopia.dto.KakaoPayDtos.ApproveResponse;
import com.aloha.zootopia.dto.KakaoPayDtos.ReadyRequest;
import com.aloha.zootopia.dto.KakaoPayDtos.ReadyResponse;
import com.aloha.zootopia.dto.KakaoPayDtos.CancelRequest;
import com.aloha.zootopia.dto.KakaoPayDtos.CancelResponse;
import com.aloha.zootopia.domain.Order;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * KakaoPay 테스트/개발용 서비스.
 * - 테스트(CID=TC0ONETIME) 기반 ready/approve 흐름 제공
 * - 현재는 메모리에 tid 저장. 운영 시 DB/Redis 로 이전 권장
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class KakaoPayService {

    @Value("${kakao.pay.host:https://kapi.kakao.com}")
    private String kakaoHost;
    @Value("${kakao.pay.cid:TC0ONETIME}")
    private String cid; // 테스트 CID 기본값
    @Value("${kakao.pay.approval-url:http://localhost:5173/pay/success}")
    private String approvalUrl;
    @Value("${kakao.pay.cancel-url:http://localhost:5173/pay/cancel}")
    private String cancelUrl;
    @Value("${kakao.pay.fail-url:http://localhost:5173/pay/fail}")
    private String failUrl;

    @Value("${KAKAO_PAY_ADMIN_KEY:}")
    private String adminKey; // 환경 변수에서 주입 (없어도 데모 가능)

    private final RestTemplate restTemplate = new RestTemplate(); // TODO 실제 API 호출 시 사용
    private final OrderService orderService;

    // orderId -> tid 매핑 저장 (승인 후 환불 위해 승인 뒤에도 유지)
    private final Map<String, String> tidStore = new ConcurrentHashMap<>();
    private final Map<String, Integer> amountStore = new ConcurrentHashMap<>();
    // 역방향: tid -> orderId (취소시 주문 상태 업데이트 용이)
    private final Map<String, String> tidToOrderId = new ConcurrentHashMap<>();

    private boolean isRealMode() {
        return adminKey != null && !adminKey.isBlank();
    }

    private HttpHeaders buildHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.add(HttpHeaders.AUTHORIZATION, "KakaoAK " + adminKey);
        return headers;
    }

    /**
     * 결제 준비: 카카오페이 /v1/payment/ready 호출 또는 데모 반환
     */
    public ReadyResponse ready(ReadyRequest req) {
        log.info("KakaoPay ready 요청: orderId={}, userId={}, itemName={}, totalAmount={}",
                req.getOrderId(), req.getUserId(), req.getItemName(), req.getTotalAmount());

    if (isRealMode()) {
            try {
                MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
                params.add("cid", cid);
                params.add("partner_order_id", req.getOrderId());
                params.add("partner_user_id", req.getUserId());
                params.add("item_name", req.getItemName());
                params.add("quantity", String.valueOf(req.getQuantity()));
                params.add("total_amount", String.valueOf(req.getTotalAmount()));
                params.add("tax_free_amount", "0");
                params.add("approval_url", approvalUrl + "?orderId=" + req.getOrderId());
                params.add("cancel_url", cancelUrl + "?orderId=" + req.getOrderId());
                params.add("fail_url", failUrl + "?orderId=" + req.getOrderId());

                HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, buildHeaders());
                String url = kakaoHost + "/v1/payment/ready";
                @SuppressWarnings("unchecked")
                Map<String, Object> body = restTemplate.postForObject(url, entity, Map.class);
                if (body == null) body = new ConcurrentHashMap<>();
                String tid = (String) body.getOrDefault("tid", "TID" + System.currentTimeMillis());
                String redirect = (String) body.getOrDefault("next_redirect_pc_url", "/kakao-pay-mock");
                tidStore.put(req.getOrderId(), tid);
                tidToOrderId.put(tid, req.getOrderId());
                amountStore.put(req.getOrderId(), req.getTotalAmount());
                // 주문 사전 레코드 없으면 생성 (결제전 상태) - 선택적
                ensurePreOrder(req.getOrderId(), req.getUserId(), req.getItemName(), req.getTotalAmount());
                return new ReadyResponse(tid, redirect,
                        (String) body.getOrDefault("created_at", OffsetDateTime.now().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)));
            } catch (Exception e) {
                log.error("KakaoPay ready 실 호출 실패 - fallback to mock: {}", e.getMessage());
            }
        }

        // Fallback / Mock
    String generatedTid = "TID" + Long.toHexString(System.currentTimeMillis());
        tidStore.put(req.getOrderId(), generatedTid);
        tidToOrderId.put(generatedTid, req.getOrderId());
        amountStore.put(req.getOrderId(), req.getTotalAmount());
    ensurePreOrder(req.getOrderId(), req.getUserId(), req.getItemName(), req.getTotalAmount());
        return new ReadyResponse(
            generatedTid,
            "/kakao-pay-mock",
            OffsetDateTime.now().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
    }

    /**
     * 결제 승인: 카카오페이 /v1/payment/approve 호출 또는 데모 승인
     */
    public ApproveResponse approve(ApproveRequest req) {
        log.info("KakaoPay approve 요청: orderId={}, userId={}, pgToken={}", req.getOrderId(), req.getUserId(), req.getPgToken());
        String tid = tidStore.get(req.getOrderId());
        if (tid == null) {
            throw new IllegalStateException("TID not found for orderId=" + req.getOrderId());
        }
        int amount = amountStore.getOrDefault(req.getOrderId(), 0);

        if (isRealMode()) {
            try {
                MultiValueMap<String, String> params = buildApproveParams(tid, req.getOrderId(), req.getUserId(), req.getPgToken());
                HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, buildHeaders());
                String url = kakaoHost + "/v1/payment/approve";
                @SuppressWarnings("unchecked")
                Map<String, Object> body = restTemplate.postForObject(url, entity, Map.class);
                if (body == null) body = new ConcurrentHashMap<>();
                int approvedAmount = extractTotalAmount(body, amount);
        persistOrUpdateOnApprove(req, tid, approvedAmount);
                amountStore.remove(req.getOrderId()); // tid 유지(환불용)
                return new ApproveResponse(true, tid, req.getOrderId(), approvedAmount,
                        (String) body.getOrDefault("approved_at", OffsetDateTime.now().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)));
            } catch (Exception e) {
                log.error("KakaoPay approve 실 호출 실패 - fallback to mock: {}", e.getMessage());
            }
        }

    // MOCK Fallback (실 호출 실패 또는 adminKey 미설정 시)
    persistOrUpdateOnApprove(req, tid, amount);
        amountStore.remove(req.getOrderId());
        return new ApproveResponse(true, tid, req.getOrderId(), amount,
                OffsetDateTime.now().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
    }

    public CancelResponse cancel(CancelRequest req) {
        log.info("KakaoPay cancel 요청: tid={}, amount={}", req.getTid(), req.getCancelAmount());
        if (isRealMode()) {
            try {
                MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
                params.add("cid", cid);
                params.add("tid", req.getTid());
                params.add("cancel_amount", String.valueOf(req.getCancelAmount()));
                params.add("cancel_tax_free_amount", "0");
                HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, buildHeaders());
                String url = kakaoHost + "/v1/payment/cancel";
                @SuppressWarnings("unchecked")
                Map<String, Object> body = restTemplate.postForObject(url, entity, Map.class);
                if (body == null) body = new ConcurrentHashMap<>();
                int canceledAmount = extractCanceledAmount(body, req.getCancelAmount());
                updateOrderStatusByTid(req.getTid(), "결제취소");
                return new CancelResponse(true, req.getTid(), canceledAmount,
                        (String) body.getOrDefault("canceled_at", OffsetDateTime.now().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)));
            } catch (Exception e) {
                log.error("KakaoPay cancel 실 호출 실패 - fallback to mock: {}", e.getMessage());
            }
        }
    updateOrderStatusByTid(req.getTid(), "결제취소(모의)");
        return new CancelResponse(true, req.getTid(), req.getCancelAmount(),
                OffsetDateTime.now().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
    }

    private Long parseUserId(String userId) {
        try { return Long.valueOf(userId); } catch (Exception e) { return 0L; }
    }

    // (추후 확장) 실제 승인 파라미터 빌드 메서드 예시
    @SuppressWarnings("unused")
    private MultiValueMap<String, String> buildApproveParams(String tid, String orderId, String userId, String pgToken) {
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("cid", cid);
        params.add("tid", tid);
        params.add("partner_order_id", orderId);
        params.add("partner_user_id", userId);
        params.add("pg_token", pgToken);
        return params;
    }
    private int extractTotalAmount(Map<String, Object> body, int fallback) {
        try {
            Object amountObj = body.get("amount");
            if (amountObj instanceof Map<?,?> map) {
                Object total = map.get("total");
                if (total != null) return Integer.parseInt(String.valueOf(total));
            }
        } catch (Exception ignored) {}
        return fallback;
    }

    private int extractCanceledAmount(Map<String, Object> body, int fallback) {
        try {
            Object amountObj = body.get("canceled_amount"); // 일부 응답필드 구조 차이 대비
            if (amountObj instanceof Map<?,?> map) {
                Object total = map.get("total");
                if (total != null) return Integer.parseInt(String.valueOf(total));
            }
            // 또는 amount.total 참조
            Object amountAll = body.get("amount");
            if (amountAll instanceof Map<?,?> map2) {
                Object canceled = map2.get("total");
                if (canceled != null) return Integer.parseInt(String.valueOf(canceled));
            }
        } catch (Exception ignored) {}
        return fallback;
    }

    private void updateOrderStatusByTid(String tid, String status) {
        String orderCode = tidToOrderId.get(tid);
        if (orderCode == null) {
            return; // no mapped order
        }
        try {
            orderService.updateStatusByOrderCode(orderCode, status);
        } catch (Exception e) {
            log.warn("Failed to update status by tid: {} -> {} ({})", tid, status, e.getMessage());
        }
    }
    private void persistOrUpdateOnApprove(ApproveRequest req, String tid, int amount) {
        try {
            Order existing = orderService.getByOrderCode(req.getOrderId());
            if (existing == null) {
                Order order = new Order();
                order.setOrderCode(req.getOrderId());
                order.setUserId(parseUserId(req.getUserId()));
                order.setProductId(0L); // TODO 실제 상품 ID 전달
                order.setProductName("주문상품");
                order.setPrice(amount);
                order.setStatus("결제완료");
                order.setPayTid(tid);
                orderService.createOrder(order);
            } else {
                orderService.setPayTid(req.getOrderId(), tid);
                orderService.updateStatusByOrderCode(req.getOrderId(), "결제완료");
            }
        } catch (Exception e) {
            log.warn("Order approve persistence failed: {}", e.getMessage());
        }
    }

    private void ensurePreOrder(String orderCode, String userId, String itemName, int amount) {
        try {
            if (orderService.getByOrderCode(orderCode) != null) return;
            Order order = new Order();
            order.setOrderCode(orderCode);
            order.setUserId(parseUserId(userId));
            order.setProductId(0L);
            order.setProductName(itemName);
            order.setPrice(amount);
            order.setStatus("결제대기");
            orderService.createOrder(order);
        } catch (Exception e) {
            log.debug("Pre-order creation skipped: {}", e.getMessage());
        }
    }
}
