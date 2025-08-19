package com.aloha.zootopia.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aloha.zootopia.domain.Order;
import com.aloha.zootopia.service.OrderService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    // 로그인한 사용자의 구매 내역 조회
    @GetMapping("/my")
    public List<Order> getMyOrders(@RequestParam("userId") Long userId) {
        return orderService.getOrdersByUserId(userId);
    }

    // 일반 결제(카카오 외 카드/계좌 등) 완료 시 주문 생성
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        if (order.getOrderCode() == null || order.getOrderCode().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        Order created = orderService.createOrder(order);
        return ResponseEntity.ok(created);
    }
}
