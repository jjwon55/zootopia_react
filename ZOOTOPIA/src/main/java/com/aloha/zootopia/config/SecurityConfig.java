package com.aloha.zootopia.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
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
import com.aloha.zootopia.security.handler.OAuth2LoginSuccessHandler;
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
    @Lazy
    @Autowired
    private CustomOAuth2UserService customOAuth2UserService;
    @Autowired
    private OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

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
        configuration.addAllowedOrigin("http://localhost:5173");
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // ✅ SecurityFilterChain 구성
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
            // ⬇️ 우리가 만든 loginFilter 등록
            .addFilterAt(loginFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(new JwtRequestFilter(authenticationManager, jwtProvider),
                    UsernamePasswordAuthenticationFilter.class)
            .authorizeHttpRequests(auth -> auth
                // CORS 프리플라이트
                .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()

                // 로그인/회원가입/인증 관련 공개
                .requestMatchers("/login", "/api/login", "/join", "/users", "/auth/**").permitAll()

                // 정적 리소스
                .requestMatchers("/images/**", "/upload/**", "/css/**", "/js/**", "/img/**").permitAll()

                // 공개 API
                .requestMatchers("/posts/**", "/lost/**", "/showoff/**", "/insurance/**", "/service/**").permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/parttime", "/parttime/**").permitAll()
                .requestMatchers("/hospitals", "/hospitals/detail/**").permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/hospitals/{hospitalId}/reviews").permitAll()

                // 결제 콜백
                .requestMatchers("/api/payments/kakao/**").permitAll()

                // 권한 영역
                .requestMatchers("/admin/**").hasAnyRole("ADMIN","MANAGER","MOD")
                .requestMatchers("/user/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers("/products/create/**").hasRole("ADMIN")

                // 인증 필요
                .requestMatchers("/comments/**", "/cart/**", "/mypage/**").authenticated()

                // 그 외
                .anyRequest().authenticated()
            ); // 🔹 빠졌던 괄호 추가

        return http.build();
    }
}
