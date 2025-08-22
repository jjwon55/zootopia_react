package com.aloha.zootopia.service;

import java.nio.charset.StandardCharsets;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.aloha.zootopia.domain.Order;
import com.aloha.zootopia.dto.TossPayDtos.CancelRequest;
import com.aloha.zootopia.dto.TossPayDtos.CancelResponse;
import com.aloha.zootopia.dto.TossPayDtos.ConfirmRequest;
import com.aloha.zootopia.dto.TossPayDtos.ConfirmResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class TossPayService {

    @Value("${toss.pay.secret-key:}")
    private String secretKey;
    // success / fail URL 은 프론트 라우팅 확인용 (현재 미사용)

    private final OrderService orderService;

    private WebClient client() {
        String basic = Base64.getEncoder().encodeToString((secretKey + ":").getBytes(StandardCharsets.UTF_8));
        return WebClient.builder()
            .baseUrl("https://api.tosspayments.com")
            .defaultHeader(HttpHeaders.AUTHORIZATION, "Basic " + basic)
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .build();
    }

    public ConfirmResponse confirm(ConfirmRequest req) {
        log.info("Toss confirm: orderId={}, paymentKey={}", req.getOrderId(), req.getPaymentKey());
        Order order = orderService.getByOrderCode(req.getOrderId());
        if (order == null) {
            order = new Order();
            order.setOrderCode(req.getOrderId());
            order.setUserId(0L);
            order.setProductId(0L);
            order.setProductName("주문상품");
            order.setPrice(req.getAmount());
            order.setStatus("결제대기");
            orderService.createOrder(order);
        }
        if (order.getPrice() != req.getAmount()) {
            throw new IllegalStateException("AMOUNT_MISMATCH");
        }
        if (secretKey == null || secretKey.isBlank()) {
            finalizeOrder(order, req.getPaymentKey());
            return new ConfirmResponse(true, req.getPaymentKey(), req.getOrderId(), req.getAmount(), "DEMO", now());
        }
        String method = "CARD";
        try {
            var body = client().post()
                .uri("/v1/payments/confirm")
                .bodyValue(Map.of(
                    "paymentKey", req.getPaymentKey(),
                    "orderId", req.getOrderId(),
                    "amount", req.getAmount()
                ))
                .retrieve()
                .bodyToMono(Map.class)
                .block();
            if (body != null) {
                log.debug("Toss confirm raw response: {}", body);
                Object m = body.get("method");
                // touch size to mark usage
                int size = body.size();
                if (size < 0) log.trace("impossible size");
                if (m != null) method = String.valueOf(m);
            }
        } catch (Exception e) {
            log.error("Toss confirm API error", e);
            throw e;
        }
        finalizeOrder(order, req.getPaymentKey());
        return new ConfirmResponse(true, req.getPaymentKey(), req.getOrderId(), req.getAmount(), method, now());
    }

    public CancelResponse cancel(CancelRequest req) {
        log.info("Toss cancel: paymentKey={}, amount={}", req.getPaymentKey(), req.getAmount());
        if (secretKey == null || secretKey.isBlank()) {
            orderService.updateStatusByOrderCode(findOrderCodeByPaymentKey(req.getPaymentKey()), "결제취소(모의)");
            return new CancelResponse(true, req.getPaymentKey(), req.getAmount(), now());
        }
        try {
            var body = client().post()
                .uri("/v1/payments/{paymentKey}/cancel", req.getPaymentKey())
                .bodyValue(Map.of(
                    "cancelReason", req.getReason() == null ? "USER_REQUEST" : req.getReason(),
                    "cancelAmount", req.getAmount()
                ))
                .retrieve()
                .bodyToMono(Map.class)
                .block();
            if (body != null) log.debug("Toss cancel raw response: {}", body);
        } catch (Exception e) {
            log.error("Toss cancel API error", e);
            throw e;
        }
        orderService.updateStatusByOrderCode(findOrderCodeByPaymentKey(req.getPaymentKey()), "결제취소");
        return new CancelResponse(true, req.getPaymentKey(), req.getAmount(), now());
    }

    private String now() { return OffsetDateTime.now().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME); }

    private void finalizeOrder(Order order, String paymentKey) {
        orderService.updateStatusByOrderCode(order.getOrderCode(), "결제완료");
        try { orderService.setPayTid(order.getOrderCode(), paymentKey); } catch (Exception ignored) {}
    }

    private String findOrderCodeByPaymentKey(String paymentKey) {
        return paymentKey; // TODO implement reverse lookup if different
    }
}
