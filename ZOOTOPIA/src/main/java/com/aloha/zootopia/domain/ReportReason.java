package com.aloha.zootopia.domain;

/**
 * 신고 사유 코드
 */
public enum ReportReason {
    SPAM,      // 광고/스팸
    ABUSE,     // 욕설/혐오/괴롭힘
    SEXUAL,    // 음란/성적 콘텐츠
    ILLEGAL,   // 불법 정보
    OTHER      // 기타
}
