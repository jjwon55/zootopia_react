package com.aloha.zootopia.controller;

import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.aloha.zootopia.domain.Animal;
import com.aloha.zootopia.domain.CustomUser;
import com.aloha.zootopia.domain.HospReview;
import com.aloha.zootopia.domain.Hospital;
import com.aloha.zootopia.domain.PageInfo;
import com.aloha.zootopia.domain.Specialty;
import com.aloha.zootopia.dto.HospitalForm;
import com.aloha.zootopia.service.HospReviewService;
import com.aloha.zootopia.service.hospital.HospitalService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
// @CrossOrigin("*")
@RequestMapping("/service/hospitals")
public class HospitalController {

    @Autowired
    private HospitalService hospitalService;

    @Autowired
    private HospReviewService hospReviewService;

    // @Value("${file.upload.path}")
    // private String uploadDir;

    // 병원 목록
    @GetMapping
    public ResponseEntity<Map<String, Object>> list(
            @RequestParam(value = "animal", required = false) List<Integer> animal,
            @RequestParam(value = "specialty", required = false) List<Integer> specialty,
            @RequestParam(value = "pageNum", defaultValue = "1") int pageNum) {

        List<Integer> animalListParam = (animal != null) ? new ArrayList<>(animal) : null;
        List<Integer> specialtyListParam = (specialty != null) ? new ArrayList<>(specialty) : null;

        int pageSize = 6;
        int total = hospitalService.getHospitalCount(animalListParam, specialtyListParam);
        List<Hospital> hospitalList = hospitalService.getHospitalList(animalListParam, specialtyListParam, pageNum, pageSize);

        PageInfo pageInfo = new PageInfo();
        pageInfo.setPageNum(pageNum);
        pageInfo.setPageSize(pageSize);
        pageInfo.setTotal(total);
        int pages = (int) Math.ceil((double) total / pageSize);
        pageInfo.setPages(pages);

        int navSize = 5;
        int startPage = ((pageNum - 1) / navSize) * navSize + 1;
        int endPage = Math.min(startPage + navSize - 1, pages);
        pageInfo.setStartPage(startPage);
        pageInfo.setEndPage(endPage);
        pageInfo.setHasPreviousPage(pageNum > 1);
        pageInfo.setHasNextPage(pageNum < pages);
        pageInfo.setHasFirstPage(pages > 1);
        pageInfo.setHasLastPage(endPage < pages);

        Map<String, Object> response = new HashMap<>();
        response.put("hospitalList", hospitalList);
        response.put("pageInfo", pageInfo);
        response.put("animalList", hospitalService.getAllAnimals());
        response.put("specialtyList", hospitalService.getAllSpecialties());
        response.put("selectedAnimals", animal == null ? new ArrayList<>() : animal);
        response.put("selectedSpecialties", specialty == null ? new ArrayList<>() : specialty);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // 모든 동물 목록 조회
    @GetMapping("/animals")
    public ResponseEntity<List<Animal>> getAllAnimals() {
        List<Animal> animals = hospitalService.getAllAnimals();
        return new ResponseEntity<>(animals, HttpStatus.OK);
    }

    // 모든 진료 과목 목록 조회
    @GetMapping("/specialties")
    public ResponseEntity<List<Specialty>> getAllSpecialties() {
        List<Specialty> specialties = hospitalService.getAllSpecialties();
        return new ResponseEntity<>(specialties, HttpStatus.OK);
    }

    // 병원 상세 정보
    @GetMapping("/{id}")
    public ResponseEntity<Hospital> details(@PathVariable("id") Integer id) {
        Hospital hospital = hospitalService.getHospital(id);
        log.info("HospitalController - details() 반환 hospital: {}", hospital);
        return new ResponseEntity<>(hospital, HttpStatus.OK);
    }

    // 병원 등록 (배포환경에서 이미지 안올라가던 원래 거)
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<String> createHospital(
            @Valid @RequestPart("hospitalForm") HospitalForm hospitalForm,
            BindingResult bindingResult,
            @RequestParam(value = "thumbnailImageFile", required = false) MultipartFile thumbnailImageFile) {

        if (bindingResult.hasErrors()) {
            return new ResponseEntity<>("Validation failed: " + bindingResult.getFieldError().getDefaultMessage(), HttpStatus.BAD_REQUEST);
        }

        try {
            hospitalService.createHospital(hospitalForm, thumbnailImageFile);
            return new ResponseEntity<>("Hospital created successfully.", HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Failed to create hospital: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

// ================== 이미지 업로드 ==================
//     @PostMapping(value = "/upload-thumbnail", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//     @PreAuthorize("hasRole('ADMIN')")
//     public ResponseEntity<Map<String, Object>> uploadThumbnail(@RequestParam("file") MultipartFile file) {
//         try {
//             if (file == null || file.isEmpty()) {
//                 return ResponseEntity.badRequest()
//                         .body(Map.of("message", "이미지 파일이 비어 있습니다."));
//             }

//             String savedPath = hospitalService.saveImage(file); // 기존 saveImage 재사용
//             return ResponseEntity.ok(Map.of("imagePath", savedPath));
//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body(Map.of("message", "업로드 실패: " + e.getMessage()));
//         }
//     }



// // ================== 병원 등록 ==================
//     @PostMapping
//     @PreAuthorize("hasRole('ADMIN')")
//     public ResponseEntity<Map<String, Object>> createHospital(@Valid @RequestBody HospitalForm form,
//                                                               BindingResult bindingResult) {
//         if (bindingResult.hasErrors()) {
//             return ResponseEntity.badRequest()
//                     .body(Map.of("message", bindingResult.getFieldError().getDefaultMessage()));
//         }

//         try {
//             hospitalService.createHospital(form);
//             return ResponseEntity.status(HttpStatus.CREATED)
//                     .body(Map.of("ok", true, "hospitalName", form.getName()));
//         } catch (Exception e) {
//             e.printStackTrace();
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body(Map.of("message", e.getMessage()));
//         }
//     }





    // 병원 수정
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<String> updateHospital(
            @PathVariable("id") Integer id,
            @Valid @RequestPart("hospitalForm") HospitalForm hospitalForm,
            BindingResult bindingResult,
            @RequestParam(value = "thumbnailImageFile", required = false) MultipartFile thumbnailImageFile) {

        log.info("HospitalController - updateHospital() 진입. id: {}", id);
        log.info("HospitalController - updateHospital() hospitalForm: {}", hospitalForm);
        log.info("HospitalController - updateHospital() thumbnailImageFile: {}", thumbnailImageFile != null ? thumbnailImageFile.getOriginalFilename() : "null");

        if (bindingResult.hasErrors()) {
            return new ResponseEntity<>("Validation failed: " + bindingResult.getFieldError().getDefaultMessage(), HttpStatus.BAD_REQUEST);
        }

        try {
            hospitalForm.setHospitalId(id);
            hospitalService.updateHospital(hospitalForm, thumbnailImageFile);
            return new ResponseEntity<>("Hospital updated successfully.", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Failed to update hospital: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // 병원 삭제
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteHospital(@PathVariable("id") Integer id) {
        try {
            hospitalService.deleteHospital(id);
            return new ResponseEntity<>("Hospital deleted successfully!", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Failed to delete hospital: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ################################## 리뷰 관련 CRUD ##################################

    // 병원 리뷰 목록
    @GetMapping("/{hospitalId}/reviews")
    public ResponseEntity<List<HospReview>> getReviews(@PathVariable("hospitalId") int hospitalId) {
        log.info("HospitalController - getReviews() 진입. hospitalId: {}", hospitalId);
        List<HospReview> reviews = hospReviewService.listByHospital(hospitalId);
        log.info("HospitalController - getReviews() 반환 리뷰 수: {}", reviews.size());
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    // 리뷰 등록
    @PostMapping("/{hospitalId}/reviews")
    public ResponseEntity<String> addReview(@PathVariable("hospitalId") int hospitalId, @RequestBody HospReview hospReview, @AuthenticationPrincipal CustomUser customUser) {
        log.info("HospitalController - addReview() 진입. hospitalId: {}, hospReview: {}", hospitalId, hospReview);
        if (customUser == null) {
            log.warn("HospitalController - addReview() : Unauthorized access - customUser is null");
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        Long userId = customUser.getUser().getUserId();
        hospReview.setUserId(userId);
        hospReview.setHospitalId(hospitalId);
        
        try { // try-catch 블록 추가
            log.info("리뷰 서비스 호출 전: {}", hospReview);
            hospReviewService.addReview(hospReview);
            log.info("리뷰 서비스 호출 후 성공");
            return new ResponseEntity<>("Review added successfully", HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("리뷰 등록 중 에러 발생: {}", e.getMessage(), e); // 에러 로그 추가
            return new ResponseEntity<>("Failed to add review: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 리뷰 수정
    @PutMapping("/{hospitalId}/reviews/{reviewId}")
    public ResponseEntity<String> updateReview(
        @PathVariable("hospitalId") int hospitalId,
        @PathVariable("reviewId") int reviewId,
        @RequestBody HospReview hospReview,
        @AuthenticationPrincipal CustomUser customUser
    ) {
        log.info("HospitalController - updateReview() 진입. hospitalId: {}, reviewId: {}, hospReview: {}", hospitalId, reviewId, hospReview);

        if (customUser == null) {
            log.warn("HospitalController - updateReview() : Unauthorized access - customUser is null");
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }

        HospReview existingReview = hospReviewService.getReviewById(reviewId);
        Long userId = customUser.getUser().getUserId();

        if (!existingReview.getUserId().equals(userId)) {
            log.warn("HospitalController - updateReview() : Forbidden access - userId mismatch. existing: {}, current: {}", existingReview.getUserId(), userId);
            return new ResponseEntity<>("Forbidden", HttpStatus.FORBIDDEN);
        }

        hospReview.setReviewId(reviewId);
        hospReview.setHospitalId(hospitalId);
        hospReviewService.updateReview(hospReview);

        log.info("HospitalController - updateReview() : Review updated successfully");
        return new ResponseEntity<>("Review updated successfully", HttpStatus.OK);
    }

    // 리뷰 삭제
    @DeleteMapping("/{hospitalId}/reviews/{reviewId}")
    public ResponseEntity<String> deleteReview(
        @PathVariable("hospitalId") int hospitalId,
        @PathVariable("reviewId") int reviewId,
        @AuthenticationPrincipal CustomUser customUser
    ) {
        log.info("HospitalController - deleteReview() 진입. hospitalId: {}, reviewId: {}", hospitalId, reviewId);

        if (customUser == null) {
            log.warn("HospitalController - deleteReview() : Unauthorized access - customUser is null");
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }

        HospReview existingReview = hospReviewService.getReviewById(reviewId);
        Long userId = customUser.getUser().getUserId();

        if (!existingReview.getUserId().equals(userId)) {
            log.warn("HospitalController - deleteReview() : Forbidden access - userId mismatch. existing: {}, current: {}", existingReview.getUserId(), userId);
            return new ResponseEntity<>("Forbidden", HttpStatus.FORBIDDEN);
        }

        hospReviewService.deleteReview(reviewId);

        log.info("HospitalController - deleteReview() : Review deleted successfully");
        return new ResponseEntity<>("Review deleted successfully", HttpStatus.OK);
    }
}
