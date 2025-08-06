package com.aloha.zootopia.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface AdminMapper {
    @Select("SELECT COUNT(*) FROM users")
    int getMemberCount();

    @Select("SELECT COUNT(*) FROM posts")
    int getPostCount();

    // @Select("SELECT COUNT(*) FROM reports WHERE status = 'PENDING'")
    // int getReportCount();
}

