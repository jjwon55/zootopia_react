package com.aloha.zootopia.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.aloha.zootopia.domain.CustomUser;
import com.aloha.zootopia.domain.PetProfile;
import com.aloha.zootopia.service.PetProfileService;

@RestController
@RequestMapping("/pets")
public class PetProfileRestController {

    @Autowired
    private PetProfileService petProfileService;

    private long loginUserId(Authentication auth) {
        if (auth == null) return -1L;
        Object p = auth.getPrincipal();
        if (p instanceof CustomUser) return ((CustomUser) p).getUserId();
        return -1L;
    }

    // -------------------- 펫 리스트 --------------------
    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> list(Authentication auth) {
        long uid = loginUserId(auth);
        if (uid < 0) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "로그인 필요"));
        }
        List<PetProfile> pets = petProfileService.getPetsByUserId(uid);
        return ResponseEntity.ok(Map.of("pets", pets));
    }

    // -------------------- 펫 등록 --------------------
    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> create(@RequestBody PetProfile pet, Authentication auth) {
        long uid = loginUserId(auth);
        if (uid < 0) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "로그인 필요"));
        }
        pet.setUserId(uid);
        petProfileService.registerPet(pet);
        return ResponseEntity.ok(Map.of("ok", true, "petId", pet.getPetId()));
    }

    // -------------------- 펫 삭제 --------------------
    @DeleteMapping("/{petId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable("petId") Long petId, Authentication auth) {
        long uid = loginUserId(auth);
        PetProfile pet = petProfileService.getPet(petId);
        if (pet == null || !pet.getUserId().equals(uid)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "삭제 권한 없음"));
        }
        petProfileService.deletePet(petId);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    // -------------------- 사진 업로드 --------------------
    @PostMapping("/upload")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> uploadPhoto(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "파일 없음"));
        }

        try {
            // 1️⃣ C 드라이브 경로로 변경
            String uploadDir = "C:/upload/pets/";
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            // 2️⃣ 랜덤 파일명 생성
            String ext = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
            String filename = UUID.randomUUID().toString() + ext;
            Path filePath = Paths.get(uploadDir, filename);

            // 3️⃣ 파일 저장
            Files.write(filePath, file.getBytes());

            // 4️⃣ URL 반환 (프론트에서 접근 가능)
            String url = "/upload/pets/" + filename;
            return ResponseEntity.ok(Map.of("ok", true, "url", url));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "업로드 실패"));
        }
    }
}