package com.aloha.zootopia.security.filter;

import java.io.IOException;
import java.io.PrintWriter;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.aloha.zootopia.domain.CustomUser;
import com.aloha.zootopia.security.contants.SecurityConstants;
import com.aloha.zootopia.security.provider.JwtProvider;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class JwtRequestFilter extends OncePerRequestFilter {

    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;

    public JwtRequestFilter(AuthenticationManager authenticationManager, JwtProvider jwtProvider) {
        this.authenticationManager = authenticationManager;
        this.jwtProvider = jwtProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getServletPath();

        // ✅ 로그인 요청은 JWT 검증 건너뛰기
        if ("/login".equals(path) || "/api/login".equals(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        // 1) Authorization 헤더에서 JWT 추출
        String authorization = request.getHeader(SecurityConstants.TOKEN_HEADER); // "Authorization"
        log.info("authorization : {}", authorization);

        if (authorization == null || authorization.isEmpty()
                || !authorization.startsWith(SecurityConstants.TOKEN_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        // "Bearer " 제거
        String jwt = authorization.replace(SecurityConstants.TOKEN_PREFIX, "");

        // 2) 토큰으로 Authentication 생성 (내부에서 DB 조회해 CustomUser 채워둠)
        Authentication authentication = jwtProvider.getAuthenticationToken(jwt);

        // 정지 계정 체크 (authentication 이 만들어졌을 때만)
        if (authentication != null && authentication.getPrincipal() instanceof CustomUser cu) {
            String status = cu.getUser().getStatus(); // JwtProvider 에서 user.setStatus(...) 세팅되어 있어야 함
            if ("SUSPENDED".equalsIgnoreCase(status)) {
                // 403으로 응답하고 안내 메시지 반환
                writeForbiddenJson(response, "정지된 계정입니다.");
                return; // 다음 필터로 넘기지 않음
            }
        }

        // 3) JWT 서명/만료 검증
        boolean valid = jwtProvider.validateToken(jwt);
        if (valid && authentication != null && authentication.isAuthenticated()) {
            log.info("유효한 JWT 토큰 입니다.");
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        // 4) 다음 필터로 진행
        filterChain.doFilter(request, response);
    }

    private void writeForbiddenJson(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN); // 403
        response.setContentType("application/json; charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            out.write("{\"error\":\"" + message + "\"}");
            out.flush();
        }
    }
}