package com.aloha.zootopia.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aloha.zootopia.domain.CustomUser;
import com.aloha.zootopia.domain.Users;
import com.aloha.zootopia.service.UserService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/users")
public class UserController {

  @Autowired
  private UserService userService;


  /**
   * 사용자 정보 조회
   * @param customUser
   * @return
  */
  @GetMapping("/info")
  public ResponseEntity<?> userInfo(
      @AuthenticationPrincipal CustomUser customUser
  ) {
      log.info("::::: 사용자 정보 조회 :::::");
      log.info("customUser : " + customUser);

      if( customUser == null ) {
          return new ResponseEntity<>("UNAUTHORIZED", HttpStatus.UNAUTHORIZED);
      }

      Users user = customUser.getUser();
      log.info("user : " + user);

      // 인증된 사용자 정보
      if( user != null ) {
          return new ResponseEntity<>(user, HttpStatus.OK);
      }
      // 인증 되지 않은 경우
      return new ResponseEntity<>("UNAUTHORIZED", HttpStatus.UNAUTHORIZED);
  }


    @GetMapping("/check")
    public ResponseEntity<?> check(
            @RequestParam(name = "email", required = false) String email,
            @RequestParam(name = "nickname", required = false) String nickname) {

        if (email != null && !email.isBlank()) {
            boolean exists = userService.existsByEmail(email);
            return ResponseEntity.ok(Map.of("available", !exists));
        }

        if (nickname != null && !nickname.isBlank()) {
            boolean exists = userService.existsByNickname(nickname);
            boolean available = !exists;
            log.info("nickname '{}' exists={}, available={}", nickname, exists, available);
            return ResponseEntity.ok(Map.of("available", available));
        }

        return ResponseEntity
                .badRequest()
                .body(Map.of("error", "Email or nickname is required"));
    }
    
  /**
   * 회원 가입
   * @param user
   * @return
   * @throws Exception
   */
    @PostMapping("")
    public ResponseEntity<?> join(@RequestBody Users user) throws Exception {
        log.info("회원 가입 요청");

        int affected = userService.join(user); // ✅ join으로 호출
        boolean result = affected > 0;         // ✅ int → boolean 판정

        if (result) {
            log.info("회원가입 성공!");
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } else {
            log.info("회원가입 실패!");
            return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        }
    }

  // /**
  //  * 회원 정보 수정
  //  * @param user
  //  * @return
  //  * @throws Exception
  //  */
  // // @PreAuthorize(" hasRole('ROLE_USER') ")                  // 👩‍💼 사용자 권한
  // // @PreAuthorize(" hasRole('ROLE_ADMIN') ")                 // 👮‍♀️ 관리자 권한
  // // @PreAuthorize(" hasAnyRole('ROLE_USER', 'ROLE_ADMIN') ")    // 👩‍💼 사용자 OR 👮‍♀️ 관리자
  // @PreAuthorize(" hasRole('ROLE_ADMIN') or #p0.username == authentication.name ")  // 👮‍♀️+👩‍💻
  // @PutMapping("")
  // public ResponseEntity<?> update(@RequestBody Users user) throws Exception {

  //   boolean result = userService.update(user);

  //   if( result ) {
  //     log.info("회원 수정 성공!");
  //     return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
  //   }
  //   else {
  //     log.info("회원 수정 실패!");
  //     return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
  //   }
  // }


  // // 회원 삭제(탈퇴)
  // @PreAuthorize(" hasRole('ROLE_ADMIN') or #p0 == authentication.name ")
  // @DeleteMapping("/{username}")
  // public ResponseEntity<?> delete(
  //   @PathVariable("username") String username
  // ) throws Exception {
  //   try {
  //     boolean result = userService.delete(username);
  //     if( result ) 
  //       return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
  //     else 
  //       return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
  //     } catch (Exception e) {
  //       return new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }
  
}
