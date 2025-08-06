/*
package com.aloha.zootopia.config;

import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.oauth2.core.user.OAuth2User;

import com.aloha.zootopia.domain.Users;

public class CustomUserDetails extends User implements OAuth2User {

    private final Users user;
    private final Map<String, Object> attributes;

    public CustomUserDetails(Users user, Map<String, Object> attributes) {
        super(user.getEmail(), "", user.getAuthList().stream()
              .map(auth -> new SimpleGrantedAuthority(auth.getAuth()))
              .collect(Collectors.toList()));
        this.user = user;
        this.attributes = attributes;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public String getName() {
        return user.getNickname();
    }

    public Users getUser() {
        return user;
    }

    public Long getUserId() {
        return user.getUserId();
    }
}
*/