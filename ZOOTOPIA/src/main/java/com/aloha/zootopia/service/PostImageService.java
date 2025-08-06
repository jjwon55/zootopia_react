package com.aloha.zootopia.service;

import java.util.List;

import com.aloha.zootopia.domain.PostImage;

public interface PostImageService {

    // 게시글 이미지 전체 가져오기
    List<PostImage> findByPostId(int postId) throws Exception;

    // 대표 이미지 1개
    PostImage getThumbnail(int postId) throws Exception;

    // 이미지 등록
    boolean insert(PostImage image) throws Exception;

    // 게시글 이미지 전체 삭제
    boolean deleteByPostId(int postId) throws Exception;
}
