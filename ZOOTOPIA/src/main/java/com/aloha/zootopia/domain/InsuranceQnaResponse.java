package com.aloha.zootopia.domain;

import java.time.format.DateTimeFormatter;

import lombok.Data;

@Data
public class InsuranceQnaResponse {
    private int qnaId;
    private int productId;
    private String species;
    private String question;
    private String answer;
    private String nickname;
    private long userId;
    private String createdAt;
    private boolean writer;  // 작성자인지 여부
    private boolean admin;   // 관리자인지 여부

    public static InsuranceQnaResponse from(InsuranceQna qna, long loginUserId, boolean isAdminUser) {
        InsuranceQnaResponse dto = new InsuranceQnaResponse();
        dto.setQnaId(qna.getQnaId());
        dto.setProductId(qna.getProductId());
        dto.setSpecies(qna.getSpecies());
        dto.setQuestion(qna.getQuestion());
        dto.setAnswer(qna.getAnswer());
        dto.setUserId(qna.getUserId());
        dto.setCreatedAt(qna.getCreatedAt() != null ? qna.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy.MM.dd")) : "");
        dto.setWriter(qna.getUserId() == loginUserId);
        dto.setAdmin(isAdminUser);
        dto.setNickname(qna.getNickname());
        return dto;
    }
}