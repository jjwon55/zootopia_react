package com.aloha.zootopia.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.aloha.zootopia.domain.CustomUser;
import com.aloha.zootopia.domain.Users;
import com.aloha.zootopia.mapper.UserMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class UserDetailServiceImpl implements UserDetailsService {

  @Autowired
  private UserMapper userMapper;

 @Override
public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    log.info(":::::::::: UserDetailServiceImpl ::::::::::");
    Users user;
    try {
        user = userMapper.select(email);
    } catch (Exception e) {
        log.error("사용자 정보 조회 시 에러 발생 : ", e);
        throw new UsernameNotFoundException("사용자 정보를 찾을 수 없습니다. - " + email);
    }

    if (user == null) {
        throw new UsernameNotFoundException("사용자 정보를 찾을 수 없습니다. - " + email);
    }

    // ✅ 정지 계정인 경우 DisabledException 바로 던짐
    if ("SUSPENDED".equalsIgnoreCase(user.getStatus())) {
        log.warn("정지된 계정 로그인 시도: {}", email);
        throw new org.springframework.security.authentication.DisabledException("정지된 계정입니다.");
    }

    return new CustomUser(user);
}
}
