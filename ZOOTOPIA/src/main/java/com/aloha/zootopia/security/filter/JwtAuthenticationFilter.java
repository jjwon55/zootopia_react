package com.aloha.zootopia.security.filter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

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

@Slf4j
public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

  private final AuthenticationManager authenticationManager;
  private final JwtProvider jwtProvider;

  public JwtAuthenticationFilter(AuthenticationManager authenticationManager, JwtProvider jwtProvider) {
    this.authenticationManager = authenticationManager;
    this.jwtProvider = jwtProvider;
    // 필터 URL 경로 설정 : /login
    setFilterProcessesUrl(SecurityConstants.LOGIN_URL);
  }

  /**
   * 🔐 인증 시도 메소드
   * : /login 경로로 (username, password) 요청하면 이 필터에서 로그인 인증을 시도합니다.
   */
  @Override
  public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
      throws AuthenticationException {

    String email = request.getParameter("email");
    String password = request.getParameter("password");

    log.info("email : " + email);
    log.info("password : " + password);

    // 인증토큰 객체 생성
    Authentication authentication = new UsernamePasswordAuthenticationToken(email, password);

    // 인증 시도
    try {
      authentication = authenticationManager.authenticate(authentication);
    } catch (AuthenticationException e) {
      log.warn("인증 실패: {}", e.getMessage());
      throw e; // ❗ 반드시 예외를 다시 던져야 Security가 실패 처리함
    }

    log.info("authentication : " + authentication);
    return authentication;
  }

  /**
   * ✅ 인증 성공 메소드
   * : attemptAuthentication() 호출 후,
   * 반환된 Authentication 객체가 인증된 것이 확인 되면 호출되는 메소드
   * 
   * ➡ 💍 JWT
   * : 로그인 인증에 성공, JWT 토큰 생성
   * Authorizaion 응답헤더에 jwt 토큰을 담아 응답
   * { Authorizaion : Bearer + {jwt} }
   */
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

    // JWT 생성
    String jwt = jwtProvider.createToken(email, userId, roles);
    log.info("✅ JWT 생성 완료: {}", jwt);

    // 응답 구조: { token: "...", user: {...} }
    Map<String, Object> responseBody = new HashMap<>();
    responseBody.put("token", jwt);
    responseBody.put("user", user);

    ObjectMapper objectMapper = new ObjectMapper();
    String json = objectMapper.writeValueAsString(responseBody);

    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");
    response.setStatus(200);

    PrintWriter printWriter = response.getWriter();
    printWriter.write(json);
    printWriter.flush();

    log.info("✅ JWT 및 사용자 정보 응답 완료");
  }

  @Override
  protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
      AuthenticationException failed)
      throws IOException, ServletException {

    log.warn("❌ 로그인 인증 실패: {}", failed.getMessage());

    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");

    Map<String, Object> result = new HashMap<>();
    result.put("error", "아이디 또는 비밀번호가 일치하지 않습니다");

    ObjectMapper objectMapper = new ObjectMapper();
    String json = objectMapper.writeValueAsString(result);

    PrintWriter writer = response.getWriter();
    writer.write(json);
    writer.flush();
  }

}
