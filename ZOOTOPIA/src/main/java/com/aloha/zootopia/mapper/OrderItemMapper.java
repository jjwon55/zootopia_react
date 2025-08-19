package com.aloha.zootopia.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.aloha.zootopia.domain.OrderItem;

@Mapper
public interface OrderItemMapper {
    int insert(OrderItem item);
    List<OrderItem> findByOrderId(@Param("orderId") Long orderId);
    List<OrderItem> findByOrderCode(@Param("orderCode") String orderCode);
    int deleteByOrderId(@Param("orderId") Long orderId);
}
