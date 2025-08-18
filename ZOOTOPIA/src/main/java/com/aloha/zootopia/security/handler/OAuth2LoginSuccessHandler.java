package com.aloha.zootopia.security.handler;

import com.aloha.zootopia.domain.CustomUser;
import com.aloha.zootopia.domain.Users;
import com.aloha.zootopia.security.provider.JwtProvider;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.net.URLEncoder;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtProvider jwtProvider;
    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        log.info("OAuth2 Login Success!");

        CustomUser customUser = (CustomUser) authentication.getPrincipal();
        Users user = customUser.getUser();

        String email = user.getEmail();
        Long userId = user.getUserId();
        List<String> roles = customUser.getAuthorities()
                .stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .collect(Collectors.toList());

        // JWT 생성
        String jwt = jwtProvider.createToken(email, userId, roles);
        log.info("✅ OAuth2 JWT 생성 완료: {}", jwt);

        // 응답 구조: { token: "...", user: {...} }
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("token", jwt);
        responseBody.put("user", user);

        // JWT 및 사용자 정보를 URL 쿼리 파라미터로 포함하여 프론트엔드로 리디렉션
        String redirectUrl = "http://localhost:5173/oauth2/callback?token=" + jwt + "&user=" + URLEncoder.encode(objectMapper.writeValueAsString(user), "UTF-8");
        response.sendRedirect(redirectUrl);

        log.info("✅ OAuth2 JWT 및 사용자 정보 응답 완료");
    }
}
