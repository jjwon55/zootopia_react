package com.aloha.zootopia.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.aloha.zootopia.domain.Comment;
import com.aloha.zootopia.domain.CustomUser;
import com.aloha.zootopia.service.LostAnimalCommentService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping("/lost/comments")
public class LostAnimalCommentController {

    private final LostAnimalCommentService commentService;

    @PostMapping("/add")
    public String addComment(@ModelAttribute Comment comment,
                             @AuthenticationPrincipal CustomUser user) throws Exception {
        comment.setUserId(user.getUser().getUserId());
        commentService.addComment(comment);
        return "redirect:/lost/read/" + comment.getPostId();
    }

    @PostMapping("/update")
    public String updateComment(@ModelAttribute Comment comment,
                                 @AuthenticationPrincipal CustomUser user) throws Exception {
        Comment original = commentService.findById(comment.getCommentId());
        if (!original.getUserId().equals(user.getUser().getUserId())) {
            throw new RuntimeException("수정 권한이 없습니다.");
        }
        commentService.updateCommentContent(comment);
        return "redirect:/lost/read/" + comment.getPostId();
    }

    @PostMapping("/delete/{id}")
    public String deleteComment(@PathVariable("id") Integer commentId,
                                @RequestParam("postId") Integer postId) {
        commentService.deleteComment(commentId);
        return "redirect:/lost/read/" + postId;
    }


    @PostMapping("/reply")
    public String addReplyComment(
        @RequestParam("postId") Integer postId,
        @RequestParam("parentId") Integer parentId,
        @RequestParam("content") String content,
        @AuthenticationPrincipal CustomUser user
    ) throws Exception {
        Comment reply = new Comment();
        reply.setPostId(postId);
        reply.setParentId(parentId);
        reply.setContent(content);
        reply.setUserId(user.getUser().getUserId());

        commentService.addComment(reply); 
        return "redirect:/lost/read/" + postId;
    }
}
