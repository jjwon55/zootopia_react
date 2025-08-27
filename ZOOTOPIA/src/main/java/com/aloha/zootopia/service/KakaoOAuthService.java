package com.aloha.zootopia.service;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.aloha.zootopia.domain.UserAuth;
import com.aloha.zootopia.domain.Users;
import com.aloha.zootopia.mapper.UserMapper;
import com.aloha.zootopia.security.provider.JwtProvider;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class KakaoOAuthService {

    @Value("${kakao.oauth.client-id:}")
    private String clientId;
    @Value("${kakao.oauth.client-secret:}")
    private String clientSecret;
    @Value("${kakao.oauth.redirect-uri:http://192.168.30.3:8080/auth/kakao/callback}")
    private String redirectUri;

    private final UserMapper userMapper;
    private final JwtProvider jwtProvider;
    private final RestTemplate restTemplate = new RestTemplate();

    public String buildAuthorizeRedirectUrl(String state) {
        String base = "https://kauth.kakao.com/oauth/authorize";
        String query = "?response_type=code" +
                "&client_id=" + url(clientId) +
                "&redirect_uri=" + url(redirectUri) +
                (state != null ? "&state=" + url(state) : "");
        return base + query;
    }

    public record KakaoLoginResult(boolean success, String jwt, Long userId, String email, String nickname, String error) {}

    @SuppressWarnings("unchecked")
    public KakaoLoginResult handleCallback(String code) {
        if (clientId == null || clientId.isBlank()) {
            return new KakaoLoginResult(false, null, null, null, null, "Kakao clientId not configured");
        }
        try {
            // 1) token 요청
            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("grant_type", "authorization_code");
            params.add("client_id", clientId);
            params.add("redirect_uri", redirectUri);
            params.add("code", code);
            if (clientSecret != null && !clientSecret.isBlank()) params.add("client_secret", clientSecret);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            Map<String,Object> tokenResp = restTemplate.postForObject(URI.create("https://kauth.kakao.com/oauth/token"), new HttpEntity<>(params, headers), Map.class);
            if (tokenResp == null || tokenResp.get("access_token") == null) {
                return new KakaoLoginResult(false, null, null, null, null, "token error");
            }
            String accessToken = tokenResp.get("access_token").toString();

            // 2) 사용자 정보
            HttpHeaders uHeaders = new HttpHeaders();
            uHeaders.setBearerAuth(accessToken);
            Map<String,Object> userInfo = restTemplate.postForObject(URI.create("https://kapi.kakao.com/v2/user/me"), new HttpEntity<>(uHeaders), Map.class);
            if (userInfo == null || userInfo.get("id") == null) {
                return new KakaoLoginResult(false, null, null, null, null, "user info error");
            }
            String kakaoId = String.valueOf(userInfo.get("id"));
            Map<String,Object> kakaoAccount = (Map<String,Object>) userInfo.get("kakao_account");
            String email = kakaoAccount != null ? (String) kakaoAccount.getOrDefault("email", "kakao_"+kakaoId+"@example.com") : "kakao_"+kakaoId+"@example.com";
            Map<String,Object> profile = kakaoAccount != null ? (Map<String,Object>) kakaoAccount.get("profile") : null;
            String nickname = profile != null ? (String) profile.getOrDefault("nickname", "카카오사용자") : "카카오사용자";

            // 3) 기존 사용자 조회/없으면 생성
            Users user = userMapper.findByProviderAndProviderId("kakao", kakaoId);
            if (user == null) {
                user = Users.builder()
                        .email(email)
                        .nickname(nickname)
                        .enabled(1)
                        .provider("kakao")
                        .providerId(kakaoId)
                        .build();
                userMapper.insertSocialUser(user);
                // 기본 ROLE_USER 권한
                UserAuth auth = UserAuth.builder().email(email).auth("ROLE_USER").build();
                userMapper.insertAuth(auth);
                user.getAuthList().add(auth);
            } else {
                try { user.setAuthList(userMapper.findAuthByUserId(user.getUserId())); } catch (Exception ignored) {}
            }
            List<String> roles = user.getAuthList().stream().map(UserAuth::getAuth).toList();
            String jwt = jwtProvider.createToken(user.getEmail(), user.getUserId(), roles);
            return new KakaoLoginResult(true, jwt, user.getUserId(), user.getEmail(), user.getNickname(), null);
        } catch (Exception e) {
            log.error("Kakao OAuth callback error: {}", e.getMessage());
            return new KakaoLoginResult(false, null, null, null, null, e.getMessage());
        }
    }

    private String url(String v) { return URLEncoder.encode(v, StandardCharsets.UTF_8); }
}
