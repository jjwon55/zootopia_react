package com.aloha.zootopia.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

import com.aloha.zootopia.domain.CustomUser;

import com.aloha.zootopia.domain.Users;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@ControllerAdvice
public class GlobalControllerAdvice {
    
    @ModelAttribute
    public void addUserToModel(@AuthenticationPrincipal CustomUser authUser, Model model) {
        if (authUser != null) {
            Users user = authUser.getUser();
            if (user != null) {
                model.addAttribute("user", user);
                model.addAttribute("nickname", user.getNickname());
                model.addAttribute("profileImg", user.getProfileImg() != null ? user.getProfileImg() : "/img/default-profile.png");
                log.info("User added to model: {}", user.getNickname());
            }

        }
    }
}
