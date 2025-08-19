package com.aloha.zootopia.security.filter;

import com.aloha.zootopia.domain.AuthenticationRequest;
import com.aloha.zootopia.domain.CustomUser;
import com.aloha.zootopia.domain.Users;
import com.aloha.zootopia.security.contants.SecurityConstants;
import com.aloha.zootopia.security.provider.JwtProvider;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

  private final AuthenticationManager authenticationManager;
  private final JwtProvider jwtProvider;

  public JwtAuthenticationFilter(AuthenticationManager authenticationManager, JwtProvider jwtProvider) {
    this.authenticationManager = authenticationManager;
    this.jwtProvider = jwtProvider;
    // 필터 URL 경로 설정 : /login (Vite 프록시가 /api 제거하면 서버엔 /login으로 들어옴)
    setFilterProcessesUrl(SecurityConstants.LOGIN_URL); // e.g. "/login"
  }

  @Override
  public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
      throws AuthenticationException {

    if (!"POST".equalsIgnoreCase(request.getMethod())) {
      throw new AuthenticationServiceException("Authentication method not supported: " + request.getMethod());
    }

    String contentType = request.getContentType();
    String email = null;
    String password = null;

    try {
      if (contentType != null && contentType.startsWith("application/json")) {
        ObjectMapper mapper = new ObjectMapper();
        AuthenticationRequest dto = mapper.readValue(request.getInputStream(), AuthenticationRequest.class);
        email = dto != null ? dto.getEmail() : null;
        password = dto != null ? dto.getPassword() : null;
      } else {
        email = request.getParameter("email");
        password = request.getParameter("password");
      }
    } catch (IOException e) {
      log.error("Error reading authentication request body", e);
      throw new AuthenticationServiceException("Error reading authentication request body", e);
    }

    if (email == null || password == null) {
      throw new AuthenticationServiceException("email/password required");
    }

    log.info("email : {}", email);
    log.info("password : {}", password);

    UsernamePasswordAuthenticationToken authRequest =
        new UsernamePasswordAuthenticationToken(email, password);

    try {
      return authenticationManager.authenticate(authRequest);
    } catch (AuthenticationException e) {
      log.warn("인증 실패: {}", e.getMessage());
      throw e;
    }
  }

  @Override
  protected void successfulAuthentication(
      HttpServletRequest request, HttpServletResponse response, FilterChain chain,
      Authentication authentication) throws IOException, ServletException {

    log.info("인증 성공!");
    CustomUser customUser = (CustomUser) authentication.getPrincipal();
    Users user = customUser.getUser();

    String email = user.getEmail();
    Long userId = user.getUserId();
    List<String> roles = customUser.getAuthorities()
        .stream()
        .map(GrantedAuthority::getAuthority)
        .collect(Collectors.toList());

    String jwt = jwtProvider.createToken(email, userId, roles);
    log.info("✅ JWT 생성 완료");

    Map<String, Object> responseBody = new HashMap<>();
    responseBody.put("token", jwt);
    responseBody.put("user", user);

    ObjectMapper objectMapper = new ObjectMapper();
    String json = objectMapper.writeValueAsString(responseBody);

    response.setStatus(HttpServletResponse.SC_OK);
    response.setContentType("application/json;charset=UTF-8");

    PrintWriter printWriter = response.getWriter();
    printWriter.write(json);
    printWriter.flush();

    log.info("✅ JWT 및 사용자 정보 응답 완료");
  }

  // ⬇⬇⬇ 여기만 바꾸면 됨: root cause가 DisabledException 이면 403으로 바로 응답하고 종료
  @Override
  protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                            AuthenticationException failed)
      throws IOException, ServletException {

    // root cause 추적
    Throwable cause = failed;
    while (cause.getCause() != null && cause.getCause() != cause) {
      cause = cause.getCause();
    }

    boolean suspended =
        (failed instanceof DisabledException) ||
        (cause instanceof DisabledException) ||
        (failed instanceof InternalAuthenticationServiceException
            && failed.getMessage() != null
            && failed.getMessage().contains("정지된 계정"));

    if (suspended) {
      log.warn("❌ 로그인 인증 실패(정지 계정): {}", failed.getMessage());
      response.setStatus(HttpServletResponse.SC_FORBIDDEN); // 403
      response.setContentType("application/json;charset=UTF-8");
      response.getWriter().write("{\"error\":\"정지된 계정입니다.\"}");
      response.getWriter().flush();
      return; // 실패 핸들러/다음 체인으로 넘기지 않음 (401로 덮이는 것 방지)
    }

    log.warn("❌ 로그인 인증 실패: {}", failed.getMessage());
    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
    response.setContentType("application/json;charset=UTF-8");
    response.getWriter().write("{\"error\":\"아이디 또는 비밀번호가 일치하지 않습니다.\"}");
    response.getWriter().flush();
  }
}
