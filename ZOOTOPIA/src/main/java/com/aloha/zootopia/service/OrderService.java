package com.aloha.zootopia.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.aloha.zootopia.domain.Order;
import com.aloha.zootopia.mapper.OrderMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderMapper orderMapper;

    public List<Order> getOrdersByUserId(Long userId) {
        return orderMapper.findByUserId(userId);
    }

    public Order createOrder(Order order) {
        // 기본 상태 지정 (예: 결제 직후 '배송준비중')
        if (order.getStatus() == null) {
            order.setStatus("배송준비중");
        }
        orderMapper.insert(order);
        return order;
    }

    public void updateStatus(Long id, String status) {
        orderMapper.updateStatus(id, status);
    }

    public Order getByOrderCode(String orderCode) {
        return orderMapper.findByOrderCode(orderCode);
    }

    public void setPayTid(String orderCode, String payTid) {
        orderMapper.updatePayTid(orderCode, payTid);
    }

    public void updateStatusByOrderCode(String orderCode, String status) {
        orderMapper.updateStatusByOrderCode(orderCode, status);
    }
}
