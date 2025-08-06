package com.aloha.zootopia.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.aloha.zootopia.domain.InsuranceQna;

@Mapper
public interface InsuranceQnaMapper {
    
    void insertQna(InsuranceQna qna);                   // 질문 등록
    List<InsuranceQna> selectQnaByProductId(int productId);  // 특정 보험상품의 Q&A 목록
    InsuranceQna selectQnaById(int qnaId);              // 단일 Q&A 조회
    void updateQnaAnswer(InsuranceQna qna);             // 답변 등록/수정 (관리자)
    void updateQnaQuestion(InsuranceQna qna);           // 질문 수정 (작성자)
    void deleteQna(int qnaId);                          // 질문 삭제

    List<InsuranceQna> getQnaListPaged(@Param("productId") int productId,
                                   @Param("offset") int offset,
                                   @Param("pageSize") int pageSize);

    int countQnaByProduct(@Param("productId") int productId);
}
