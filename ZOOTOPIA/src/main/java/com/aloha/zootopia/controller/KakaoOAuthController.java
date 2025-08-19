package com.aloha.zootopia.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aloha.zootopia.service.KakaoOAuthService;
import com.aloha.zootopia.service.KakaoOAuthService.KakaoLoginResult;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth/kakao")
@RequiredArgsConstructor
public class KakaoOAuthController {

    private final KakaoOAuthService kakaoOAuthService;

    // 프런트에서 이 URL( /auth/kakao/authorize ) 호출 -> 302 로 카카오 인증 페이지 이동
    @GetMapping("/authorize")
    public void authorize(@RequestParam(value = "state", required = false) String state, HttpServletResponse res) throws Exception {
        String redirect = kakaoOAuthService.buildAuthorizeRedirectUrl(state);
        res.sendRedirect(redirect);
    }

    // 카카오 redirect_uri 로 설정된 콜백
    @GetMapping(value = "/callback", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> callback(@RequestParam("code") String code, @RequestParam(value = "state", required = false) String state) {
        KakaoLoginResult result = kakaoOAuthService.handleCallback(code);
        if (result.success()) {
            String html = "<!DOCTYPE html><html><head><meta charset='utf-8'/><title>Kakao Login</title></head><body>" +
                    "<script>" +
                    "(function(){" +
                    "var jwt='" + result.jwt() + "';" +
                    "document.cookie='jwt='+jwt+'; path=/';" +
                    "localStorage.setItem('isLogin','true');" +
                    "localStorage.setItem('userInfo', JSON.stringify({userId:" + result.userId() + ", email:'" + result.email() + "', nickname:'" + result.nickname() + "', authList:[{auth:'ROLE_USER'}]}));" +
                    "localStorage.setItem('roles', JSON.stringify({isUser:true,isAdmin:false}));" +
                    "window.location.href='/'})();" +
                    "</script>로그인 처리 중...</body></html>";
            return ResponseEntity.ok(html);
        } else {
            String html = "<!DOCTYPE html><html><head><meta charset='utf-8'/><title>Kakao Login Error</title></head><body>" +
                    "<h3>카카오 로그인 실패</h3><p>" + result.error() + "</p><a href='/'>&lt; 홈으로</a></body></html>";
            return ResponseEntity.ok(html);
        }
    }
}
