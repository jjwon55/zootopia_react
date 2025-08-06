package com.aloha.zootopia.mapper;

import com.aloha.zootopia.domain.HospReview;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface HospReviewMapper {

    // 병원 리뷰 목록 조회
    List<HospReview> listByHospital(int hospitalId);

    // 리뷰 등록
    int insert(HospReview hospReview);

    // 리뷰 수정
    int update(HospReview hospReview);

    // 리뷰 삭제
    int delete(int reviewId);

    // 특정 리뷰 조회
    HospReview select(int reviewId);
}
