package com.aloha.zootopia.service;

import java.util.List;

import com.aloha.zootopia.domain.AdminPost;

public interface AdminPostService {

    public record PageResult<T>(List<T> content, int page, int size, int totalElements) {}
    PageResult<AdminPost> list(String q, String category, Boolean hidden,
                               int page, int size, String sort, String dir);

    AdminPost get(Integer postId);

    void setHidden(Integer postId, boolean hidden);

    void delete(Integer postId);

    

}
