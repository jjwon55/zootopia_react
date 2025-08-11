package com.aloha.zootopia.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.aloha.zootopia.domain.InsuranceQna;

@Mapper
public interface InsuranceQnaMapper {

    void insertQna(InsuranceQna qna);
    List<InsuranceQna> selectQnaByProductId(@Param("productId") int productId);
    InsuranceQna selectQnaById(@Param("qnaId") int qnaId);
    void updateQnaAnswer(InsuranceQna qna);
    void updateQnaQuestion(InsuranceQna qna);
    void deleteQna(@Param("qnaId") int qnaId);

    List<InsuranceQna> getQnaListPaged(@Param("productId") int productId,
                                       @Param("offset") int offset,
                                       @Param("pageSize") int pageSize);

    int countQnaByProduct(@Param("productId") int productId);
}