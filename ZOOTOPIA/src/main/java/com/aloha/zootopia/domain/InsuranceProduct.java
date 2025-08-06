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
    
    private String species;               // dog, cat, all
    private String joinCondition;         // 가입조건
    private String coverageItems;         // 보장항목
    private String precautions;           // 유의사항
    private LocalDateTime createdAt;      // 등록일시
    private String imagePath;             // 이미지 파일 경로
}