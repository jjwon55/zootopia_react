package com.aloha.zootopia.domain;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class InsuranceQna {
    private int qnaId;             // 질문 ID
    private int productId;         // 보험상품 ID
    private long userId;            // 질문 작성자 ID
    private String species;        // 종류
    private String question;       // 질문 내용
    private String answer;         // 관리자 답변
    private String nickname;
    private LocalDateTime createdAt;  // 작성일시
}
