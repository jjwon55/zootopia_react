package com.aloha.zootopia.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.aloha.zootopia.domain.Order;

@Service
public class OrderService {
    // 임시 Mock 데이터 (실제 DB 연동 전)
    private static final List<Order> MOCK_ORDERS = new ArrayList<>();
    static {
        Order o1 = new Order();
        o1.setId(1L);
        o1.setUserId(1L);
        o1.setProductId(101L);
        o1.setProductName("강아지 사료");
        o1.setPrice(25000);
        o1.setStatus("배송중");
        o1.setImage("/assets/dist/img/products/dogfood.jpg");
        MOCK_ORDERS.add(o1);

        Order o2 = new Order();
        o2.setId(2L);
        o2.setUserId(1L);
        o2.setProductId(102L);
        o2.setProductName("고양이 장난감");
        o2.setPrice(12000);
        o2.setStatus("배달 완료");
        o2.setImage("/assets/dist/img/products/cattoy.jpg");
        MOCK_ORDERS.add(o2);
    }

    public List<Order> getOrdersByUserId(Long userId) {
        List<Order> result = new ArrayList<>();
        for (Order o : MOCK_ORDERS) {
            if (o.getUserId().equals(userId)) {
                result.add(o);
            }
        }
        return result;
    }
}
