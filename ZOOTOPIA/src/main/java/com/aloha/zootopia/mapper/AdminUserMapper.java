package com.aloha.zootopia.mapper;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.aloha.zootopia.domain.AdminUserDetail;
import com.aloha.zootopia.domain.AdminUserSummary;



@Mapper
public interface AdminUserMapper {
    List<AdminUserSummary> findUsers(
        @Param("q") String q,
        @Param("status") String status,
        @Param("role") String role,
        @Param("from") LocalDateTime from,
        @Param("to") LocalDateTime to,
        @Param("size") int size,
        @Param("offset") int offset,
        @Param("sortColumn") String sortColumn,
        @Param("sortDir") String sortDir
    );

    long countUsers(
        @Param("q") String q,
        @Param("status") String status,
        @Param("role") String role,
        @Param("from") LocalDateTime from,
        @Param("to") LocalDateTime to
    );

    AdminUserDetail findUserById(@Param("userId") Integer userId);

    List<String> findRolesByUserId(@Param("userId") Integer userId);

    int updateUserFields(@Param("userId") Integer userId,
                         @Param("fields") Map<String, Object> fields);

    int deleteRoles(@Param("userId") Integer userId);

    int insertRole(@Param("userId") Integer userId, @Param("role") String role);
    
    int insertRolesBatch(@Param("userId") Integer userId, @Param("roles") List<String> roles);
}
