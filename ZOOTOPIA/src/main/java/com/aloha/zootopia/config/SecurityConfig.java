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

import com.aloha.zootopia.security.filter.JwtAuthenticationFilter;
import com.aloha.zootopia.security.filter.JwtRequestFilter;
import com.aloha.zootopia.security.provider.JwtProvider;
import com.aloha.zootopia.service.UserDetailServiceImpl;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class SecurityConfig {

  @Autowired
  private UserDetailServiceImpl userDetailServiceImpl;
  @Autowired
  private JwtProvider jwtProvider;

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

    http
        .csrf(csrf -> csrf.disable())
        .formLogin(form -> form.disable())
        .httpBasic(basic -> basic.disable())
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .userDetailsService(userDetailServiceImpl)
        .addFilterAt(new JwtAuthenticationFilter(authenticationManager, jwtProvider),
            UsernamePasswordAuthenticationFilter.class)
        .addFilterBefore(new JwtRequestFilter(authenticationManager, jwtProvider),
            UsernamePasswordAuthenticationFilter.class)
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/posts/**").permitAll()
            .requestMatchers("/lost/**").permitAll()
            .requestMatchers("/showoff/**").permitAll()
            .requestMatchers( "/comments/**").authenticated()
            .requestMatchers("/upload/**").permitAll()
            .requestMatchers("/login").permitAll()
            .requestMatchers("/auth/**").permitAll()
            .requestMatchers("/images/**", "/upload/**", "/css/**", "/js/**", "/img/**").permitAll()
            .requestMatchers("/hospitals", "/hospitals/detail/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/hospitals/{hospitalId}/reviews").permitAll()

            .requestMatchers("/admin/**").hasRole("ADMIN")
            .requestMatchers("/user/**").hasAnyRole("USER", "ADMIN")
            .requestMatchers("/products/create/**").hasRole("ADMIN")
            .requestMatchers("/cart/**").authenticated()
            .requestMatchers("/mypage/**").authenticated()
            .requestMatchers(HttpMethod.POST, "/posts/*/like").authenticated()
            .anyRequest().authenticated());

    return http.build();
  }

}
