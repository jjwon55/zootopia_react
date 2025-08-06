package com.aloha.zootopia.service;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aloha.zootopia.domain.Pagination;
import com.aloha.zootopia.domain.Posts;
import com.aloha.zootopia.domain.Tag;
import com.aloha.zootopia.mapper.PostMapper;
import com.aloha.zootopia.mapper.TagMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class PostServiceImpl implements PostService {

    @Autowired 
    private PostMapper postMapper;

    @Autowired 
    private TagMapper tagMapper;

    @Override
    public List<Posts> list() throws Exception {
        return postMapper.list();
    }

    @Override
    public List<Posts> page(Pagination pagination) throws Exception {
        // 전체 게시글 수 조회 후 pagination 계산
        long total = postMapper.count(pagination);
        pagination.setTotal(total);

        List<Posts> postList = postMapper.page(pagination);

        if (!postList.isEmpty()) {
            List<Integer> postIds = postList.stream()
                    .map(Posts::getPostId)
                    .toList();

            List<Tag> tagResults = postMapper.selectTagsByPostIds(postIds);
            Map<Integer, List<Tag>> tagMap = tagResults.stream()
                    .collect(Collectors.groupingBy(Tag::getPostId));

            for (Posts post : postList) {
                List<Tag> tagList = tagMap.get(post.getPostId());
                if (tagList != null) {
                    post.setTagList(tagList);
                }
            }
        }

        return postList;
    }

    @Override
    public List<Posts> getTopN(int limit) throws Exception {
        return postMapper.selectTopNByLikeCount(limit);
    }

    @Override
    public Posts selectById(int postId) throws Exception {
        return postMapper.selectById(postId);
    }

    @Override
    public boolean insert(Posts post) throws Exception {
        boolean success = postMapper.insert(post) > 0;
        if (!success) return false;

        // 썸네일 추출
        String content = post.getContent();
        if (content != null) {
            java.util.regex.Matcher matcher = java.util.regex.Pattern
                .compile("<img[^>]+src=[\"']?([^\"'>]+)[\"']?")
                .matcher(content);
            if (matcher.find()) {
                String firstImgSrc = matcher.group(1);
                post.setThumbnailUrl(firstImgSrc);
                postMapper.updateThumbnail(post);
            }
        }

        // 태그 처리
        String tagStr = post.getTags();
        if (tagStr != null && !tagStr.trim().isEmpty()) {
            String[] tagNames = tagStr.split(",");
            for (String rawName : tagNames) {
                String name = rawName.trim();
                if (name.isEmpty()) continue;

                Integer tagId = tagMapper.findTagIdByName(name);
                if (tagId == null) {
                    Tag tag = new Tag();
                    tag.setName(name);
                    tagMapper.insertTag(tag);
                    tagId = tag.getTagId();
                }

                tagMapper.insertPostTag(post.getPostId(), tagId);
            }
        }

        return true;
    }

        @Override
        public boolean updateById(Posts post) throws Exception {
            Posts oldPost = postMapper.selectById(post.getPostId());
            if (oldPost != null) {
                List<String> oldImages = extractImageFileNames(oldPost.getContent());
                List<String> newImages = extractImageFileNames(post.getContent());

                List<String> deletedImages = oldImages.stream()
                        .filter(img -> !newImages.contains(img))
                        .collect(Collectors.toList());
                deleteImages(deletedImages);
            }

            boolean success = postMapper.updateById(post) > 0;
            if (!success) return false;

            Matcher matcher = Pattern.compile("<img[^>]+src=[\"']?([^\"'>]+)[\"']?")
                    .matcher(post.getContent());
            if (matcher.find()) {
                post.setThumbnailUrl(matcher.group(1));
                postMapper.updateThumbnail(post);
            }

            tagMapper.deletePostTagsByPostId(post.getPostId());

            String tagStr = post.getTags();
            if (tagStr != null && !tagStr.trim().isEmpty()) {
                String[] tagNames = tagStr.split(",");
                for (String rawName : tagNames) {
                    String name = rawName.trim();
                    if (name.isEmpty()) continue;

                    Integer tagId = tagMapper.findTagIdByName(name);
                    if (tagId == null) {
                        Tag tag = new Tag();
                        tag.setName(name);
                        tagMapper.insertTag(tag);
                        tagId = tag.getTagId();
                    }
                    tagMapper.insertPostTag(post.getPostId(), tagId);
                }
            }

            return true;
        }


   @Override
    public boolean deleteById(int postId) throws Exception {
        Posts post = postMapper.selectById(postId);
        if (post != null) {
            List<String> imageFiles = extractImageFileNames(post.getContent());
            deleteImages(imageFiles); 
        }

        return postMapper.deleteById(postId) > 0;
    }

    @Override
    public boolean isOwner(int postId, Long userId) throws Exception {
        Posts post = postMapper.selectById(postId);
        return post != null && post.getUserId().equals(userId);
    }

    @Override
    public void increaseViewCount(Integer postId) {
        postMapper.updateViewCount(postId);
    }

    @Override
    public List<Posts> getTop10PopularPosts() {
        return postMapper.selectTop10ByPopularity();
    }

    @Override
    public void increaseCommentCount(int postId) {
        postMapper.updateCommentCount(postId); 
    }

    @Override
    public void decreaseCommentCount(int postId) {
        postMapper.minusCommentCount(postId);
    }

    @Override
    public List<Posts> pageBySearch(String type, String keyword, Pagination pagination) throws Exception {
        return postMapper.pageBySearch(type, keyword, pagination);
    }

    @Override
    public long countBySearch(String type, String keyword) throws Exception {
        return postMapper.countBySearch(type, keyword);
    }


    @Override
    public List<Posts> pageByPopularity(Pagination pagination) throws Exception {
        long total = postMapper.count(pagination);
        pagination.setTotal(total);
        List<Posts> postList = postMapper.pageByPopularity(pagination);

        // 태그 매핑 (기존 코드 재사용)
        if (!postList.isEmpty()) {
            List<Integer> postIds = postList.stream().map(Posts::getPostId).toList();
            List<Tag> tagResults = postMapper.selectTagsByPostIds(postIds);
            Map<Integer, List<Tag>> tagMap = tagResults.stream().collect(Collectors.groupingBy(Tag::getPostId));
            for (Posts post : postList) {
                List<Tag> tagList = tagMap.get(post.getPostId());
                if (tagList != null) post.setTagList(tagList);
            }
        }

        return postList;
    }


    private List<String> extractImageFileNames(String content) {
        List<String> imageFiles = new ArrayList<>();
        if (content == null) return imageFiles;

        Pattern pattern = Pattern.compile("<img[^>]+src=[\"']?/upload/([^\"'>]+)[\"']?");
        Matcher matcher = pattern.matcher(content);
        while (matcher.find()) {
            imageFiles.add(matcher.group(1)); 
        }
        return imageFiles;
    }

    private void deleteImages(List<String> filenames) {
        String uploadDir = "C:/upload"; 
        for (String name : filenames) {
            File file = new File(uploadDir, name);
            if (file.exists()) {
                boolean deleted = file.delete();
                log.info(deleted ? "✅ 삭제됨: {}" : "❌ 삭제 실패: {}", name);
            }
        }
    }

    
}
