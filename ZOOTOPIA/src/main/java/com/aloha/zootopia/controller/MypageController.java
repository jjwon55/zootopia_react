package com.aloha.zootopia.controller;

import java.io.File;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.aloha.zootopia.domain.CustomUser;
import com.aloha.zootopia.domain.UserPet;
import com.aloha.zootopia.domain.Users;
import com.aloha.zootopia.service.MypageService;
import com.aloha.zootopia.service.UserPetService;
import com.aloha.zootopia.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/mypage")
public class MypageController {

    private final MypageService mypageService;
    private final UserService userService;
    private final UserPetService userPetService;

    /* 공통 응답 포맷 */
    static class ApiResponse<T> {
        public boolean success;
        public String message;
        public T data;
        public ApiResponse(boolean success, String message, T data) {
            this.success = success; this.message = message; this.data = data;
        }
        public static <T> ApiResponse<T> ok(T data) { return new ApiResponse<>(true, null, data); }
        public static <T> ApiResponse<T> ok(String msg, T data) { return new ApiResponse<>(true, msg, data); }
        public static ApiResponse<Void> okMsg(String msg) { return new ApiResponse<>(true, msg, null); }
        public static ApiResponse<Void> error(String msg) { return new ApiResponse<>(false, msg, null); }
    }

    /* 내 마이페이지 묶음 조회 */
    @GetMapping
    public ResponseEntity<?> mypage(@AuthenticationPrincipal CustomUser user) {
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("로그인이 필요합니다."));
        Long userId = user.getUserId();
        var payload = Map.of(
                "user", mypageService.getUserInfo(userId),
                "pets", mypageService.getPets(userId),
                "myPosts", mypageService.getMyPosts(userId),
                "myComments", mypageService.getMyComments(userId),
                "likedPosts", mypageService.getLikedPosts(userId)
        );
        return ResponseEntity.ok(ApiResponse.ok(payload));
    }

    /* 프로필/펫/기본정보 단건 조회(필요시) */
    @GetMapping("/me")
    public ResponseEntity<?> me(@AuthenticationPrincipal CustomUser user) throws Exception {
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("로그인이 필요합니다."));
        Long userId = user.getUserId();
        Users me = userService.findUserById(userId);
        return ResponseEntity.ok(ApiResponse.ok(me));
    }

    /* 프로필 이미지 변경 */
    @PostMapping("/edit/profile-image")
    public ResponseEntity<?> updateProfileImage(
            @RequestParam("profileFile") MultipartFile profileFile,
            @AuthenticationPrincipal CustomUser loginUser) throws Exception {

        if (loginUser == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("로그인이 필요합니다."));

        if (profileFile == null || profileFile.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("업로드할 파일이 없습니다."));
        }

        Long userId = loginUser.getUserId();
        Users user = userService.findUserById(userId);
        if (user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("사용자를 찾을 수 없습니다."));

        String uploadDirPath = "C:/upload/profile";
        File uploadDir = new File(uploadDirPath);
        if (!uploadDir.exists() && !uploadDir.mkdirs()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("프로필 이미지 폴더 생성 실패"));
        }

        String originalFilename = profileFile.getOriginalFilename();
        String ext = (originalFilename != null && originalFilename.contains(".")) ?
                originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
        String safeFileName = UUID.randomUUID().toString() + ext;

        File saveFile = new File(uploadDir, safeFileName);
        profileFile.transferTo(saveFile);

        String newProfileImgPath = "/upload/profile/" + safeFileName;
        user.setProfileImg(newProfileImgPath);
        userService.updateUser(user);

        // 세션(Principal)에도 반영
        loginUser.setProfileImg(newProfileImgPath);

        var payload = Map.of("profileImg", newProfileImgPath);
        return ResponseEntity.ok(ApiResponse.ok("프로필 이미지가 수정되었습니다.", payload));
    }

    /* 닉네임/소개 변경 */
    @PutMapping("/edit/profile-info")
    public ResponseEntity<?> updateProfileInfo(
            @RequestParam String nickname,
            @RequestParam(required = false) String intro,
            @AuthenticationPrincipal CustomUser loginUser) throws Exception {

        if (loginUser == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("로그인이 필요합니다."));
        Long userId = loginUser.getUserId();

        Users user = userService.findUserById(userId);
        if (user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("사용자를 찾을 수 없습니다."));

        user.setNickname(nickname);
        user.setIntro(intro);
        userService.updateUser(user);

        var payload = Map.of("nickname", user.getNickname(), "intro", user.getIntro());
        return ResponseEntity.ok(ApiResponse.ok("닉네임 및 소개글이 수정되었습니다.", payload));
    }

    /* 반려동물 정보 수정/등록 (UPSERT) */
    @PostMapping("/edit/pet")
    public ResponseEntity<?> updatePet(
            @RequestBody UserPet userPet,
            @AuthenticationPrincipal CustomUser loginUser) {

        if (loginUser == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("로그인이 필요합니다."));
        Long userId = loginUser.getUserId();

        userPet.setUserId(userId);
        if (userPetService.getByUserId(userId) != null) {
            userPetService.update(userPet);
        } else {
            userPetService.insert(userPet);
        }
        return ResponseEntity.ok(ApiResponse.ok("반려동물 정보가 수정되었습니다.", userPet));
    }

    /* 비밀번호 변경 */
    @PutMapping("/edit/password")
    public ResponseEntity<?> updatePassword(
            @RequestParam String currentPassword,
            @RequestParam String newPassword,
            @RequestParam String newPasswordCheck,
            @AuthenticationPrincipal CustomUser loginUser) throws Exception {

        if (loginUser == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("로그인이 필요합니다."));
        Long userId = loginUser.getUserId();

        if (!newPassword.equals(newPasswordCheck)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("새 비밀번호가 일치하지 않습니다."));
        }
        if (!userService.checkPassword(userId, currentPassword)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("현재 비밀번호가 틀렸습니다."));
        }

        userService.updatePassword(userId, newPassword);
        return ResponseEntity.ok(ApiResponse.okMsg("비밀번호가 변경되었습니다."));
    }

    /* 다른 사용자 마이페이지 공개 정보 */
    @GetMapping("/{userId}")
    public ResponseEntity<?> viewOtherUserMypage(@PathVariable Long userId) throws Exception {
        Users user = userService.findUserById(userId);
        if (user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("사용자를 찾을 수 없습니다."));

        var payload = Map.of(
                "user", user,
                "pets", mypageService.getPets(userId),
                "myPosts", mypageService.getMyPosts(userId)
        );
        return ResponseEntity.ok(ApiResponse.ok(payload));
    }

    /* 회원 탈퇴 */
    @DeleteMapping
    public ResponseEntity<?> deleteAccount(@AuthenticationPrincipal CustomUser user) {
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("로그인이 필요합니다."));
        try {
            Long userId = user.getUser().getUserId();
            userService.deleteById(userId);
            // 세션 무효화는 프론트에서 로그아웃 처리 or 필터에서 수행
            return ResponseEntity.ok(ApiResponse.okMsg("회원 탈퇴가 완료되었습니다."));
        } catch (Exception e) {
            log.error("탈퇴 중 오류", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("탈퇴 중 오류가 발생했습니다."));
        }
    }
}
