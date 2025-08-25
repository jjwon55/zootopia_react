package com.aloha.zootopia.domain;

import java.time.LocalDateTime;

import org.springframework.format.annotation.NumberFormat;

import lombok.Data;

@Data
public class InsuranceProduct {
    private int productId;                // PK
    private String name;                  // 상품명
    private String slogan;
    private int coveragePercent;          // 보장 비율
    private String monthlyFeeRange;       // 월 보험료

    @NumberFormat(pattern = "#,###")
    private int maxCoverage;              // 최대 보장 한도
    private String company; 
    private String species;               // dog, cat, all
    private String joinCondition;         // 가입조건
    private String coverageItems;         // 보장항목
    private String precautions;           // 유의사항
    private LocalDateTime createdAt;      // 등록일시
    private String imagePath;             // 이미지 파일 경로

    // ── [추가] 외부 이동(보험사) 관련
    private String homepageUrl;           // 보험사 상품/상담 메인 페이지
    private String applyUrl;              // 상담/가입 시작 URL(없으면 homepageUrl 사용)
    private String partnerCode;           // 제휴코드/추천인 코드(선택)
    private String utmSource;             // 캠페인 트래킹용(선택)
    private String utmMedium;             // "
    private String utmCampaign;           // "
    private boolean isSponsored;          // 제휴/광고 여부
    private String disclaimer;            // 개별 면책 문구(TEXT)

    // ── [비영속] 최종 이동 URL(서버에서 조립해서 set해 내려줄 것)
    private String outboundApplyUrl;      // DB 컬럼 아님. Service에서 생성해 응답에 포함
}