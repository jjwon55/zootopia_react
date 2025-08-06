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

import com.aloha.zootopia.domain.LostAnimalPost;
import com.aloha.zootopia.domain.Pagination;
import com.aloha.zootopia.domain.Tag;
import com.aloha.zootopia.mapper.LostAnimalMapper;
import com.aloha.zootopia.mapper.TagMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class LostAnimalServiceImpl implements LostAnimalService {

    @Autowired
    private LostAnimalMapper lostAnimalMapper;

    @Autowired
    private TagMapper tagMapper;

    @Override
    public List<LostAnimalPost> getAll(Pagination pagination) {
        long total = lostAnimalMapper.countAll();
        pagination.setTotal(total);

        List<LostAnimalPost> postList = lostAnimalMapper.findAll(pagination);

        for (LostAnimalPost post : postList) {
             post.setCategory("유실동물");
        }
        applyTagsToPostList(postList);
        return postList;
    }

    @Override
    public long countAll() {
        return lostAnimalMapper.countAll();
    }

    @Override
    public LostAnimalPost getById(int postId) {
        LostAnimalPost post = lostAnimalMapper.findById(postId);
        if (post != null) {
            post.setCategory("유실동물");
        }
        return post;
    }

    @Override
    public boolean insert(LostAnimalPost post) {
        boolean success = lostAnimalMapper.insert(post) > 0;
        if (!success) return false;

        extractAndSetThumbnail(post);
        insertTags(post);
        return true;
    }

    @Override
    public boolean update(LostAnimalPost post) {
        // 기존 게시글 가져오기
        LostAnimalPost oldPost = lostAnimalMapper.findById(post.getPostId());

        if (oldPost != null) {
            // 🔽 기존 vs 새로운 이미지 비교 후 삭제
            List<String> oldImages = extractImageFileNames(oldPost.getContent());
            List<String> newImages = extractImageFileNames(post.getContent());

            List<String> deletedImages = oldImages.stream()
                .filter(img -> !newImages.contains(img))
                .collect(Collectors.toList());

            deleteImages(deletedImages);
        }

        // 📝 게시글 내용 수정
        boolean success = lostAnimalMapper.update(post) > 0;
        if (!success) return false;

        // 🖼️ 썸네일 추출 및 저장
        Matcher matcher = Pattern.compile("<img[^>]+src=[\"']?([^\"'>]+)[\"']?")
            .matcher(post.getContent());
        if (matcher.find()) {
            post.setThumbnailUrl(matcher.group(1));
            lostAnimalMapper.updateThumbnail(post);
        }

        // 🏷️ 태그 재설정
        tagMapper.deleteLostPostTagsByPostId(post.getPostId());

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
                tagMapper.insertLostPostTag(post.getPostId(), tagId);
            }
        }

        return true;
    }


    @Override
    public boolean delete(int postId) {
        LostAnimalPost post = lostAnimalMapper.findById(postId);
        if (post != null) {
            List<String> imageFiles = extractImageFileNames(post.getContent());
            deleteImages(imageFiles);
        }

        return lostAnimalMapper.delete(postId) > 0;
    }

    @Override
    public void increaseViewCount(int postId) {
        lostAnimalMapper.increaseViewCount(postId);
    }

    // ==================== 유틸 ====================

    private void extractAndSetThumbnail(LostAnimalPost post) {
        Matcher matcher = Pattern.compile("<img[^>]+src=[\"']?([^\"'>]+)[\"']?")
            .matcher(post.getContent());
        if (matcher.find()) {
            post.setThumbnailUrl(matcher.group(1));
            lostAnimalMapper.updateThumbnail(post);
        }
    }

    private void insertTags(LostAnimalPost post) {
        String tagStr = post.getTags();
        if (tagStr == null || tagStr.trim().isEmpty()) return;

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

         tagMapper.insertLostPostTag(post.getPostId(), tagId);
        }
    }

    private void applyTagsToPostList(List<LostAnimalPost> postList) {
        List<Integer> postIds = postList.stream().map(LostAnimalPost::getPostId).toList();
        List<Tag> tagResults = tagMapper.selectTagsByPostIds(postIds); 
        Map<Integer, List<Tag>> tagMap = tagResults.stream()
            .collect(Collectors.groupingBy(Tag::getPostId));

        for (LostAnimalPost post : postList) {
            post.setTagList(tagMap.getOrDefault(post.getPostId(), new ArrayList<>()));
        }
    }
    private List<String> extractImageFileNames(String content) {
        List<String> imageFiles = new ArrayList<>();
        if (content == null) return imageFiles;

        Matcher matcher = Pattern.compile("<img[^>]+src=[\"']?/upload/([^\"'>]+)[\"']?")
            .matcher(content);
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


    @Override
    public boolean isOwner(int postId, Long userId)  {
        LostAnimalPost post = lostAnimalMapper.findById(postId);
        return post != null && post.getUserId().equals(userId);
    }

    @Override
    public void increaseCommentCount(int postId) {
        lostAnimalMapper.updateCommentCount(postId); 
    }

    @Override
    public void decreaseCommentCount(int postId) {
        lostAnimalMapper.minusCommentCount(postId);
    }

    @Override
    public List<LostAnimalPost> pageBySearch(String type, String keyword, Pagination pagination) throws Exception {
        return lostAnimalMapper.pageBySearch(type, keyword, pagination);
    }
    
    @Override
    public long countBySearch(String type, String keyword) throws Exception {
        return lostAnimalMapper.countBySearch(type, keyword);
    }





}
