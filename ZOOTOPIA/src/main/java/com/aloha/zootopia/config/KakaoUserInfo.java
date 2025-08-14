package com.aloha.zootopia.config;

import java.util.Map;

public class KakaoUserInfo implements SocialLogin {

    private final Map<String, Object> attributes;

    public KakaoUserInfo(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    @Override
    public String getProvider() {
        return "kakao";
    }

    @Override
    public String getProviderId() {
        return attributes.get("id").toString();
    }

    @Override
    public String getEmail() {
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        if (kakaoAccount != null && kakaoAccount.containsKey("email")) {
            return kakaoAccount.get("email").toString();
        }
        return null; // Or throw an exception if email is mandatory
    }

    @Override
    public String getName() {
        Map<String, Object> properties = (Map<String, Object>) attributes.get("properties");
        if (properties != null && properties.containsKey("nickname")) {
            return properties.get("nickname").toString();
        }
        return null; // Or throw an exception if name is mandatory
    }
}
