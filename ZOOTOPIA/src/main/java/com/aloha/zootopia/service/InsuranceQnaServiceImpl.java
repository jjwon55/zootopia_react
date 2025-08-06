package com.aloha.zootopia.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aloha.zootopia.domain.InsuranceQna;
import com.aloha.zootopia.mapper.InsuranceQnaMapper;

@Service
public class InsuranceQnaServiceImpl implements InsuranceQnaService {

    @Autowired
    private InsuranceQnaMapper qnaMapper;

    @Override
    public void registerQuestion(InsuranceQna qna) {
        qnaMapper.insertQna(qna);
    }

    @Override
    public List<InsuranceQna> getQnaList(int productId) {
        return qnaMapper.selectQnaByProductId(productId);
    }

    @Override
    public InsuranceQna getQna(int qnaId) {
        return qnaMapper.selectQnaById(qnaId);
    }

    @Override
    public void answerQna(InsuranceQna qna) {
        qnaMapper.updateQnaAnswer(qna);
    }

    @Override
    public void updateQnaQuestion(InsuranceQna qna) {
        qnaMapper.updateQnaQuestion(qna);
    }

    @Override
    public void deleteQna(int qnaId) {
        qnaMapper.deleteQna(qnaId);
    }
    
    @Override
    public List<InsuranceQna> getQnaListPaged(int productId, int page, int pageSize) {
        int offset = (page - 1) * pageSize;
        return qnaMapper.getQnaListPaged(productId, offset, pageSize);
    }
    
    @Override
    public int countByProduct(int productId) {
        return qnaMapper.countQnaByProduct(productId);
    }
}
