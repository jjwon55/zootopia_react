package com.aloha.zootopia.domain;

/**
 * 유저 신고 처리 상태
 */
public enum ReportStatus {
    PENDING,       // 신고 접수됨 (검토 전)
    REVIEWED,      // 검토 완료 (단순 확인)
    REJECTED,      // 기각됨
    ACTION_TAKEN   // 실제 조치(정지 등) 완료
}