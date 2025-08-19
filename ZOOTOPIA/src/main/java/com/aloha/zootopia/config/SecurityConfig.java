package com.aloha.zootopia.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.context.annotation.Lazy;

import com.aloha.zootopia.security.filter.JwtAuthenticationFilter;
import com.aloha.zootopia.security.filter.JwtRequestFilter;
import com.aloha.zootopia.security.provider.JwtProvider;
import com.aloha.zootopia.service.UserDetailServiceImpl;
import com.aloha.zootopia.security.handler.OAuth2LoginSuccessHandler;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class SecurityConfig {

  @Autowired
  private UserDetailServiceImpl userDetailServiceImpl;
  @Autowired
  private JwtProvider jwtProvider;
  @Lazy
  @Autowired
  private CustomOAuth2UserService customOAuth2UserService;
  @Autowired
  private OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler; // Add this line

  // ✅ PasswordEncoder 등록
  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  // ✅ AuthenticationManager 안전하게 주입
  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
    return authConfig.getAuthenticationManager();
  }

  // ✅ CORS 설정
  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.addAllowedOrigin("http://localhost:5173"); // Allow your frontend origin
    configuration.addAllowedMethod("*"); // Allow all HTTP methods
    configuration.addAllowedHeader("*"); // Allow all headers
    configuration.setAllowCredentials(true); // Allow credentials (cookies, authorization headers)
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration); // Apply CORS to all paths
    return source;
  }

  // ✅ SecurityFilterChain 구성
  // @Bean
  // public SecurityFilterChain securityFilterChain(HttpSecurity http,
  // AuthenticationConfiguration authConfig) throws Exception {

  // AuthenticationManager authenticationManager =
  // authConfig.getAuthenticationManager();

  // http
  // .csrf(csrf -> csrf.disable())
  // .formLogin(form -> form.disable())
  // .httpBasic(basic -> basic.disable())
  // .sessionManagement(session ->
  // session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
  // .userDetailsService(userDetailServiceImpl);

  // // ✅ 권한 설정
  // http.authorizeHttpRequests(auth -> auth
  // .requestMatchers("/login").permitAll()
  // .requestMatchers("/api/auth/**").permitAll() // 로그인/회원가입 허용
  // .requestMatchers("/images/**", "/upload/**", "/css/**", "/js/**",
  // "/img/**").permitAll()
  // .requestMatchers("/hospitals", "/hospitals/detail/**").permitAll()
  // .requestMatchers(HttpMethod.GET,
  // "/hospitals/{hospitalId}/reviews").permitAll()

  // .requestMatchers("/admin/**").hasRole("ADMIN")
  // .requestMatchers("/user/**").hasAnyRole("USER", "ADMIN")
  // .requestMatchers("/products/create/**").hasRole("ADMIN")
  // .requestMatchers("/comments/add").authenticated()
  // .requestMatchers("/cart/**").authenticated()
  // .requestMatchers("/mypage/**").authenticated()

  // .anyRequest().authenticated()
  // );

  // // ✅ JWT 필터 등록 (정상적으로 주입된 authenticationManager 사용)
  // http
  // .addFilterAt(new JwtAuthenticationFilter(authenticationManager, jwtProvider),
  // UsernamePasswordAuthenticationFilter.class)
  // .addFilterBefore(new JwtRequestFilter(authenticationManager, jwtProvider),
  // UsernamePasswordAuthenticationFilter.class);

  // return http.build();
  // }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http, AuthenticationConfiguration authConfig)
      throws Exception {
    AuthenticationManager authenticationManager = authConfig.getAuthenticationManager();

    // 로그인 필터 생성 + 실패 핸들러 연결
    var loginFilter = new JwtAuthenticationFilter(authenticationManager, jwtProvider);
    loginFilter.setFilterProcessesUrl("/login");
    loginFilter.setAuthenticationFailureHandler(new com.aloha.zootopia.config.CustomAuthFailureHandler());

    http
        .csrf(csrf -> csrf.disable())
        .formLogin(form -> form.disable())
        .httpBasic(basic -> basic.disable())
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .userDetailsService(userDetailServiceImpl)
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .oauth2Login(oauth2 -> oauth2
            .userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService))
            .successHandler(oAuth2LoginSuccessHandler)
            .failureUrl("/loginFailure"))
        // ⬇️ 여기서 우리가 만든 loginFilter를 등록
        .addFilterAt(loginFilter, UsernamePasswordAuthenticationFilter.class)
        .addFilterBefore(new JwtRequestFilter(authenticationManager, jwtProvider),
            UsernamePasswordAuthenticationFilter.class)
        .authorizeHttpRequests(auth -> auth
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            .requestMatchers("/login", "/join", "/users", "/auth/**").permitAll()
            .requestMatchers("/images/**", "/upload/**", "/css/**", "/js/**", "/img/**").permitAll()
            .requestMatchers("/posts/**", "/lost/**", "/showoff/**", "/insurance/**").permitAll()
            .requestMatchers("/service/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/parttime", "/parttime/**").permitAll()
            .requestMatchers("/hospitals", "/hospitals/detail/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/hospitals/{hospitalId}/reviews").permitAll()
            .requestMatchers("/admin/**").hasRole("ADMIN") // 중복 규칙 하나만 유지
            .requestMatchers("/user/**").hasAnyRole("USER", "ADMIN")
            .requestMatchers("/products/create/**").hasRole("ADMIN")
            .requestMatchers("/comments/**", "/cart/**", "/mypage/**").authenticated()
            .requestMatchers("/login", "/api/login").permitAll()
            .anyRequest().authenticated());

    return http.build();
  }

}
