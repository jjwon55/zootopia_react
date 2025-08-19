package com.aloha.zootopia.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.aloha.zootopia.domain.Order;

@Mapper
public interface OrderMapper {
    List<Order> findByUserId(@Param("userId") Long userId);
    int insert(Order order);
    int updateStatus(@Param("id") Long id, @Param("status") String status);
    Order findByOrderCode(@Param("orderCode") String orderCode);
    int updatePayTid(@Param("orderCode") String orderCode, @Param("payTid") String payTid);
    int updateStatusByOrderCode(@Param("orderCode") String orderCode, @Param("status") String status);
}
