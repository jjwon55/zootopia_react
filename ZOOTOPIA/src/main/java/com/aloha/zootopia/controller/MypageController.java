package com.aloha.zootopia.controller;

import java.io.File;
import java.util.UUID;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.aloha.zootopia.domain.CustomUser;
import com.aloha.zootopia.domain.UserPet;
import com.aloha.zootopia.domain.Users;
import com.aloha.zootopia.service.MypageService;
import com.aloha.zootopia.service.UserPetService;
import com.aloha.zootopia.service.UserService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("/mypage")
public class MypageController {

    private final MypageService mypageService;
    private final UserService userService;
    private final UserPetService userPetService;

    @GetMapping("/mypage")
    public String mypage(@AuthenticationPrincipal CustomUser user, Model model) {
        if (user == null) return "redirect:/login";

        Long userId = user.getUserId();
        model.addAttribute("user", mypageService.getUserInfo(userId));
        model.addAttribute("pets", mypageService.getPets(userId));
        model.addAttribute("myPosts", mypageService.getMyPosts(userId));
        model.addAttribute("myComments", mypageService.getMyComments(userId));
        model.addAttribute("likedPosts", mypageService.getLikedPosts(userId));

        return "mypage/mypage";
    }

    @GetMapping("/edit")
    public String showEditPage(@AuthenticationPrincipal CustomUser user, Model model) throws Exception {
        Long userId = user.getUserId();
        model.addAttribute("user", userService.findUserById(userId));
        model.addAttribute("userPet", userPetService.getByUserId(userId));
        return "mypage/edit";
    }

    @PostMapping("/edit/profile-image")
    public String updateProfileImage(
            @RequestParam MultipartFile profileFile,
            @AuthenticationPrincipal CustomUser loginUser,
            RedirectAttributes ra) throws Exception {

        Long userId = loginUser.getUserId();
        Users user = userService.findUserById(userId);

        if (profileFile != null && !profileFile.isEmpty()) {
            String uploadDirPath = "C:/upload/profile";
            File uploadDir = new File(uploadDirPath);
            if (!uploadDir.exists() && !uploadDir.mkdirs()) {
                ra.addFlashAttribute("error", "프로필 이미지 폴더 생성 실패");
                return "redirect:/mypage/edit";
            }

            String originalFilename = profileFile.getOriginalFilename();
            String ext = originalFilename.substring(originalFilename.lastIndexOf("."));
            String safeFileName = UUID.randomUUID().toString() + ext;

            File saveFile = new File(uploadDir, safeFileName);
            profileFile.transferTo(saveFile);

            String newProfileImgPath = "/upload/profile/" + safeFileName;
            user.setProfileImg("/upload/profile/" + safeFileName);
            userService.updateUser(user);

            loginUser.setProfileImg(newProfileImgPath);
            ra.addFlashAttribute("msg", "프로필 이미지가 수정되었습니다.");
        } else {
            ra.addFlashAttribute("error", "업로드할 파일이 없습니다.");
        }

        return "redirect:/mypage/edit";
    }


    @PostMapping("/edit/profile-info")
    public String updateProfileInfo(
            @RequestParam String nickname,
            @RequestParam(required = false) String intro,
            @AuthenticationPrincipal CustomUser loginUser,
            RedirectAttributes ra) throws Exception {

        Long userId = loginUser.getUserId();
        Users user = userService.findUserById(userId);

        user.setNickname(nickname);
        user.setIntro(intro);

        userService.updateUser(user);
        ra.addFlashAttribute("msg", "닉네임 및 소개글이 수정되었습니다.");
        return "redirect:/mypage/edit";
    }


    // ✅ 반려동물 정보 수정
    @PostMapping("/edit/pet")
    public String updatePet(
            @ModelAttribute UserPet userPet,
            @AuthenticationPrincipal CustomUser loginUser,
            RedirectAttributes ra) {

        Long userId = loginUser.getUserId();
        userPet.setUserId(userId);

        if (userPetService.getByUserId(userId) != null) {
            userPetService.update(userPet);
        } else {
            userPetService.insert(userPet);
        }

        ra.addFlashAttribute("msg", "반려동물 정보가 수정되었습니다.");
        return "redirect:/mypage/edit";
    }

    // ✅ 비밀번호 변경
    @PostMapping("/edit/password")
    public String updatePassword(
            @RequestParam String currentPassword,
            @RequestParam String newPassword,
            @RequestParam String newPasswordCheck,
            @AuthenticationPrincipal CustomUser loginUser,
            RedirectAttributes ra) throws Exception {

        Long userId = loginUser.getUserId();

        if (!newPassword.equals(newPasswordCheck)) {
            ra.addFlashAttribute("error", "새 비밀번호가 일치하지 않습니다.");
            return "redirect:/mypage/edit";
        }

        if (!userService.checkPassword(userId, currentPassword)) {
            ra.addFlashAttribute("error", "현재 비밀번호가 틀렸습니다.");
            return "redirect:/mypage/edit";
        }

        userService.updatePassword(userId, newPassword);
        ra.addFlashAttribute("msg", "비밀번호가 변경되었습니다.");
        return "redirect:/mypage/edit";
    }


    @GetMapping("/{userId}")
    public String viewOtherUserMypage(@PathVariable Long userId, Model model) throws Exception {
        Users user = userService.findUserById(userId);
        if (user == null) return "error/404"; 

        model.addAttribute("user", user);
        model.addAttribute("pets", mypageService.getPets(userId));
        model.addAttribute("myPosts", mypageService.getMyPosts(userId));
        return "mypage/user"; 
    }

    @PostMapping("/delete")
    public String deleteAccount(@AuthenticationPrincipal CustomUser user,
                                HttpSession session,
                                RedirectAttributes rttr) {
        try {
            Long userId = user.getUser().getUserId();
            userService.deleteById(userId); // 실제 DB에서 삭제 처리
            session.invalidate(); // 세션 만료 = 로그아웃
            rttr.addFlashAttribute("msg", "회원 탈퇴가 완료되었습니다.");
            return "redirect:/";
        } catch (Exception e) {
            rttr.addFlashAttribute("error", "탈퇴 중 오류가 발생했습니다.");
            return "redirect:/mypage/edit";
        }
    }

}
