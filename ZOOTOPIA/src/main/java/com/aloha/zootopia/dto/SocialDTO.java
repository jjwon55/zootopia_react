package com.aloha.zootopia.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SocialDTO {
    private String email;
    private String nickname;
    private String provider;
    private String providerId;
}
