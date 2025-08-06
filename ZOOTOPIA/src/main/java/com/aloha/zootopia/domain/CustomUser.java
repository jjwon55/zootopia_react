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
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isEnabled() {
        return user.getEnabled() == 1;
    }

    // OAuth2User 인터페이스 구현
    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public String getName() {
        // 소셜 로그인에서는 닉네임을 이름으로 사용
        return user.getNickname();
    }

    public Users getUser() {
        return user;
    }

    public Long getUserId() {
        return user.getUserId();
    }


    public boolean hasRole(String roleName) {
        return this.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_" + roleName));
    }

    public void setProfileImg(String profileImg) {
        this.user.setProfileImg(profileImg); // 내부 Users 객체에 위임
    }
            


}

