package com.aloha.zootopia.service;

import java.util.List;

import com.aloha.zootopia.domain.AdminPost;

public interface AdminPostService {

    public record PageResult<T>(List<T> content, int page, int size, int totalElements) {}

    // ✅ reportedOnly 추가
    PageResult<AdminPost> list(
            String q,
            String category,
            Boolean hidden,
            Boolean reportedOnly,
            int page,
            int size,
            String sort,
            String dir
    );

    AdminPost get(Integer postId);

    void setHidden(Integer postId, boolean hidden);

    void delete(Integer postId);

    /* (선택) 하위호환용 오버로드: reportedOnly 생략 시 false */
    default PageResult<AdminPost> list(
            String q, String category, Boolean hidden,
            int page, int size, String sort, String dir
    ) {
        return list(q, category, hidden, false, page, size, sort, dir);
    }
}
