package com.aloha.zootopia.service;

import com.aloha.zootopia.domain.HospReview;
import com.aloha.zootopia.mapper.HospReviewMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j; // Import Slf4j

import java.util.List;

@Slf4j // Add Slf4j annotation
@Service
public class HospReviewService {

    @Autowired
    private HospReviewMapper hospReviewMapper;

    public List<HospReview> listByHospital(int hospitalId) {
        List<HospReview> reviews = hospReviewMapper.listByHospital(hospitalId);
        log.info("Reviews for hospitalId {}: {}", hospitalId, reviews); // Add log
        return reviews;
    }

    public void addReview(HospReview hospReview) {
        hospReviewMapper.insert(hospReview);
    }

    public void updateReview(HospReview hospReview) {
        hospReviewMapper.update(hospReview);
    }

    public void deleteReview(int reviewId) {
        hospReviewMapper.delete(reviewId);
    }

    public HospReview getReviewById(int reviewId) {
        return hospReviewMapper.select(reviewId);
    }
}
