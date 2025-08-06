package com.aloha.zootopia.service;

import org.apache.ibatis.annotations.Param;

import com.aloha.zootopia.domain.UserAuth;
import com.aloha.zootopia.domain.Users;
import com.aloha.zootopia.dto.SocialDTO;

import jakarta.servlet.http.HttpServletRequest;

public interface UserService {

    // 회원 가입
    public int join(Users user) throws Exception;
    
    // 회원 권한 등록
    public int insertAuth(UserAuth userAuth) throws Exception;

    // 🔐 로그인
    public boolean login(Users user, HttpServletRequest request);

    // 회원 조회
    public Users select(String email) throws Exception;

    // userId로 회원 조회 (추가)
    public Users getUserById(Long userId) throws Exception;

    // 👮‍♀️ 관리자 확인
    public boolean isAdmin() throws Exception;
    
    boolean checkPassword(Long userId, String rawPassword) throws Exception;

    int updatePassword(Long userId, String newPassword) throws Exception;

    Users findUserById(Long userId) throws Exception;
    
    int updateUser(Users user) throws Exception;
    
    int deleteUserAuth(String email) throws Exception;

    void deleteById(Long userId);

    // 소셜 로그인 사용자 조회
    Users findOrCreateOAuthUser(SocialDTO dto) throws Exception;
}

