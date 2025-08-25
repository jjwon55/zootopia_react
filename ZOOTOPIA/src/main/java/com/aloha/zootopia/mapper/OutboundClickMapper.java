package com.aloha.zootopia.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.aloha.zootopia.domain.OutboundClick;

@Mapper
public interface OutboundClickMapper {
    int insert(OutboundClick click);
}
