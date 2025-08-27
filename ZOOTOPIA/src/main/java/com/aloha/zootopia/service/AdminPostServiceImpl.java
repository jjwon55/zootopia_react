package com.aloha.zootopia.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.aloha.zootopia.domain.AdminPost;
import com.aloha.zootopia.mapper.AdminPostMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminPostServiceImpl implements AdminPostService {

    private final AdminPostMapper mapper;

    @Override
    public PageResult<AdminPost> list(
            String q,
            String category,
            Boolean hidden,
            Boolean reportedOnly,
            int page,
            int size,
            String sort,
            String dir
    ) {
        // 파라미터 보정
        int safeSize = Math.max(size, 1);
        int safePage = Math.max(page, 0);
        int offset = safePage * safeSize;

        int total = mapper.countByFilter(q, category, hidden, reportedOnly);
        List<AdminPost> rows = mapper.findByFilter(
                q, category, hidden, reportedOnly,
                offset, safeSize, sort, dir
        );

        return new PageResult<>(rows, safePage, safeSize, total);
    }

    @Override
    public AdminPost get(Integer postId) {
        if (postId == null) throw new IllegalArgumentException("postId가 필요합니다.");
        return mapper.selectOne(postId);
    }

    @Override
    public void setHidden(Integer postId, boolean hidden) {
        if (postId == null) throw new IllegalArgumentException("postId가 필요합니다.");
        mapper.updateHidden(postId, hidden);
    }

    @Override
    public void delete(Integer postId) {
        if (postId == null) throw new IllegalArgumentException("postId가 필요합니다.");
        mapper.delete(postId);
    }
}
