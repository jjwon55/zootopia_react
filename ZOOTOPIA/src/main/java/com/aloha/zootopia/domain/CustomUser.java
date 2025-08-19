package com.aloha.zootopia.domain;

import java.util.Collection;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import lombok.Getter;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

@Getter
@ToString
@Slf4j
public class CustomUser implements UserDetails, OAuth2User {

    private Users user;
    private Map<String, Object> attributes;

    // 일반 로그인 생성자
    public CustomUser(Users user) {
        this.user = user;
        log.info("✅ CustomUser 생성됨 - 권한 리스트: {}", user.getAuthList());
    }

    // 소셜 로그인 생성자
    public CustomUser(Users user, Map<String, Object> attributes) {
        this.user = user;
        this.attributes = attributes;
        log.info("✅ CustomUser (OAuth2) 생성됨 - 속성: {}", attributes);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return user.getAuthList().stream()
                .map(auth -> new SimpleGrantedAuthority(auth.getAuth()))
                .collect(Collectors.toList());
    }

    @Override
    public String getPassword() { return user.getPassword(); }

    @Override
    public String getUsername() { return user.getEmail(); }

    // ✅ 정지/삭제/비활성 계정은 비활성 처리
    @Override
    public boolean isEnabled() {
        // enabled 컬럼(1/0)도 함께 체크
        if (user.getEnabled() == 0) return false;

        // 상태값으로 정지 여부 체크
        if (isSuspended()) return false;

        // 소프트 삭제 계정이면 막기 (Users에 isDeleted 존재할 때)
        try {
            Integer isDeleted = user.getIsDeleted();
            if (isDeleted != null && isDeleted == 1) return false;
        } catch (Exception ignore) {}

        return true;
    }

    // 필요 시 다른 UserDetails 속성들도 기본 true로
    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return !isSuspended(); }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    // OAuth2User
    @Override
    public Map<String, Object> getAttributes() { return attributes; }

    @Override
    public String getName() { return user.getNickname(); }

    public Users getUser() { return user; }

    public Long getUserId() { return user.getUserId(); }

    public String getNickname() { return user.getNickname(); }

    public boolean hasRole(String roleName) {
        return this.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_" + roleName));
    }

    public void setProfileImg(String profileImg) { this.user.setProfileImg(profileImg); }

    // 🔎 정지 여부
    private boolean isSuspended() {
        String status = user.getStatus();
        return status != null && status.equalsIgnoreCase("SUSPENDED");
    }
}
