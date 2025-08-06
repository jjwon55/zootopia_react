package com.aloha.zootopia.service;

import java.util.List;

import com.aloha.zootopia.domain.InsuranceQna;

public interface  InsuranceQnaService {
    
    void registerQuestion(InsuranceQna qna);                    // 질문 등록
    List<InsuranceQna> getQnaList(int productId);                // 특정 보험상품 QnA 목록
    InsuranceQna getQna(int qnaId);                              // 단일 QnA 조회
    void answerQna(InsuranceQna qna);                            // 답변 등록/수정 (관리자)
    void updateQnaQuestion(InsuranceQna qna);                    // 질문 수정 (작성자)
    void deleteQna(int qnaId);                                   // 질문 삭제

    // Service 인터페이스
    List<InsuranceQna> getQnaListPaged(int productId, int page, int pageSize);
    int countByProduct(int productId);
}
