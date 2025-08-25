package com.aloha.zootopia.security.provider;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.aloha.zootopia.domain.CustomUser;
import com.aloha.zootopia.domain.UserAuth;
import com.aloha.zootopia.domain.Users;
import com.aloha.zootopia.mapper.UserMapper;
import com.aloha.zootopia.security.contants.SecurityConstants;
import com.aloha.zootopia.security.props.JwtProps;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

/**
 * 💍 JWT 토큰 관련 기능을 제공하는 클래스
 * ✅ 토큰 생성
 * ✅ 토큰 해석
 * ✅ 토큰 검증
 */
@Slf4j
@Component
public class JwtProvider {

    @Autowired
    private JwtProps jwtProps;

    @Autowired
    private UserMapper userMapper;

    /** 👩‍💼 ➡ 💍 토큰 생성 */
    public String createToken(String email, Long userId, List<String> roles) {
        SecretKey shaKey = getShaKey();
        int exp = 1000 * 60 * 60 * 24 * 5; // 5일

        String jwt = Jwts.builder()
                .signWith(shaKey, Jwts.SIG.HS512)
                .header().add("typ", SecurityConstants.TOKEN_TYPE).and()
                .expiration(new Date(System.currentTimeMillis() + exp))
                .claim("email", email)
                .claim("userId", userId)
                .claim("rol", roles)
                .compact();

        log.info("jwt : {}", jwt);
        return jwt;
    }

    /** 💍 ➡ 🔐🍩 토큰 해석 */
    public UsernamePasswordAuthenticationToken getAuthenticationToken(String tokenOrHeader) {
        if (tokenOrHeader == null || tokenOrHeader.isEmpty()) return null;

        // Bearer 있으면 제거
        String jwt = tokenOrHeader.startsWith(SecurityConstants.TOKEN_PREFIX)
                ? tokenOrHeader.replace(SecurityConstants.TOKEN_PREFIX, "")
                : tokenOrHeader;

        try {
            SecretKey shaKey = getShaKey();
            Jws<Claims> parsedToken = Jwts.parser()
                                          .verifyWith(shaKey)
                                          .build()
                                          .parseSignedClaims(jwt);

            Long userId = Long.parseLong(parsedToken.getPayload().get("userId").toString());
            String email = parsedToken.getPayload().get("email").toString();
            Object roles = parsedToken.getPayload().get("rol");

            Users user = new Users();
            user.setUserId(userId);
            user.setEmail(email);

            // 권한
            List<SimpleGrantedAuthority> authorities =
                    ((List<?>) roles).stream()
                            .map(r -> new SimpleGrantedAuthority(r.toString()))
                            .collect(Collectors.toList());

            List<UserAuth> authList =
                    ((List<?>) roles).stream()
                            .map(r -> UserAuth.builder().email(email).auth(r.toString()).build())
                            .collect(Collectors.toList());
            user.setAuthList(authList);

            // ✅ 추가 유저정보 로드 (status 포함!)
            try {
                Users userInfo = userMapper.select(email);
                if (userInfo != null) {
                    user.setNickname(userInfo.getNickname());
                    user.setProfileImg(userInfo.getProfileImg());
                    user.setEnabled(userInfo.getEnabled());
                    user.setStatus(userInfo.getStatus()); // ⬅⬅ 중요!
                }
            } catch (Exception e) {
                log.error("토큰 해석 중 회원 정보 조회 에러", e);
            }

            UserDetails userDetails = new CustomUser(user);
            return new UsernamePasswordAuthenticationToken(userDetails, null, authorities);

        } catch (ExpiredJwtException e) {
            log.warn("만료된 JWT: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.warn("지원하지 않는 JWT: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.warn("손상된 JWT: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.warn("비어있는 JWT: {}", e.getMessage());
        }
        return null;
    }

    /** 💍❓ 토큰 검증 */
    public boolean validateToken(String jwt) {
        try {
            Jws<Claims> claims = Jwts.parser()
                                     .verifyWith(getShaKey())
                                     .build()
                                     .parseSignedClaims(jwt);

            Date expiration = claims.getPayload().getExpiration();
            return expiration.after(new Date());
        } catch (ExpiredJwtException e) {
            log.error("토큰 만료");
        } catch (JwtException e) {
            log.error("토큰 손상");
        } catch (Exception e) {
            log.error("토큰 검증 시 예외", e);
        }
        return false;
    }

    /** "secret-key" ➡ SecretKey */
    public SecretKey getShaKey() {
        String secretKey = jwtProps.getSecretKey();
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    /** JWT에서 email 추출 */
    public String getEmail(String token) {
        try {
            Claims claims = parseClaims(token);
            return claims.get("email", String.class);
        } catch (Exception e) {
            log.warn("getEmail() 실패: {}", e.getMessage());
            return null;
        }
    }

    /** JWT에서 userId 추출 */
    public Long getUserId(String token) {
        try {
            Claims claims = parseClaims(token);
            Object v = claims.get("userId");
            return v == null ? null : Long.valueOf(v.toString());
        } catch (Exception e) {
            log.warn("getUserId() 실패: {}", e.getMessage());
            return null;
        }
    }

    /** 공통 claims 파싱 */
    private Claims parseClaims(String token) {
        Jws<Claims> jws = Jwts.parser()
                              .verifyWith(getShaKey())
                              .build()
                              .parseSignedClaims(token);
        return jws.getPayload();
    }

    /** (옵션) 토큰 기준 정지 계정 여부 체크 */
    public boolean isSuspended(String token) {
        try {
            String email = getEmail(token);
            if (email == null) return false;
            Users u = userMapper.select(email);
            return u != null && "SUSPENDED".equalsIgnoreCase(u.getStatus());
        } catch (Exception e) {
            log.warn("isSuspended() 확인 중 문제: {}", e.getMessage());
            return false;
        }
    }
}
