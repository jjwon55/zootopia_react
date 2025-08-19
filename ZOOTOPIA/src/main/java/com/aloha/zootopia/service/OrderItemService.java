package com.aloha.zootopia.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.aloha.zootopia.domain.OrderItem;
import com.aloha.zootopia.mapper.OrderItemMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderItemService {
    private final OrderItemMapper mapper;

    public void saveItems(List<OrderItem> items) {
        if (items == null) return;
        for (OrderItem i : items) {
            if (i.getLineTotal() == 0) {
                i.setLineTotal(i.getUnitPrice() * i.getQuantity());
            }
            mapper.insert(i);
        }
    }
    public List<OrderItem> findByOrderCode(String orderCode) { return mapper.findByOrderCode(orderCode); }
}
