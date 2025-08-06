package com.aloha.zootopia.controller;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult; // Import BindingResult
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.aloha.zootopia.service.HospReviewService;
import com.aloha.zootopia.domain.CustomUser;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


import com.aloha.zootopia.domain.Animal;
import com.aloha.zootopia.domain.Specialty;
import com.aloha.zootopia.domain.Hospital;
import com.aloha.zootopia.domain.PageInfo;
import com.aloha.zootopia.domain.HospReview; // ADDED THIS LINE
import com.aloha.zootopia.dto.HospReviewForm;
import com.aloha.zootopia.dto.HospitalForm;
import com.aloha.zootopia.mapper.UserMapper;
import com.aloha.zootopia.service.hospital.HospitalService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("/service/hospitals")
public class HospitalController {

    @Autowired
    private HospitalService hospitalService;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private HospReviewService hospReviewService;




    // 병원 목록 페이지
    @GetMapping
    public String list(
        @RequestParam(required = false) List<Integer> animal,
        @RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
        Model model) {

        int pageSize = 6;
        int total = hospitalService.getHospitalCount(animal);
        List<Hospital> hospitalList = hospitalService.getHospitalList(animal, pageNum, pageSize);

        PageInfo pageInfo = new PageInfo();
        pageInfo.setPageNum(pageNum);
        pageInfo.setPageSize(pageSize);
        pageInfo.setTotal(total);
        int pages = (int) Math.ceil((double) total / pageSize);
        pageInfo.setPages(pages);

        // 네비게이션 계산 (5개씩)
        int navSize = 5;
        int startPage = ((pageNum - 1) / navSize) * navSize + 1;
        int endPage = Math.min(startPage + navSize - 1, pages);
        pageInfo.setStartPage(startPage);
        pageInfo.setEndPage(endPage);
        pageInfo.setHasPreviousPage(pageNum > 1);
        pageInfo.setHasNextPage(pageNum < pages);
        pageInfo.setHasFirstPage(pages > 1);
        pageInfo.setHasLastPage(endPage < pages);

        model.addAttribute("hospitalList", hospitalList);
        model.addAttribute("pageInfo", pageInfo);
        model.addAttribute("animalList", hospitalService.getAllAnimals());
        String selectedAnimalsString = "";
        if (animal != null && !animal.isEmpty()) {
            selectedAnimalsString = animal.stream()
                                        .map(String::valueOf)
                                        .collect(Collectors.joining(","));
        }
        model.addAttribute("selectedAnimals", animal == null ? new ArrayList<>() : animal); // 기존 리스트도 유지
        model.addAttribute("selectedAnimalsString", selectedAnimalsString); // 새로 추가

        return "service/hospital/hosp_list";
    }

    // 병원 상세 페이지
    @GetMapping("/detail/{id}")
    public String details(@PathVariable Integer id, Model model, Principal principal) {
        log.info("############################################################");
        log.info("HospitalController - details() 진입");
        log.info("로그인 사용자: {}", principal != null ? principal.getName() : "ANONYMOUS");
        //=================================================================================TODO: 병원 상세 정보 조회 로직 추가
        Hospital hospital = hospitalService.getHospital(id);


        model.addAttribute("hospital", hospital);

        log.info("############################################################");
        return "service/hospital/details";
    }





    // 병원 등록 폼 페이지
    @GetMapping("/create")
    public String createForm(Model model) {
        model.addAttribute("hospitalForm", new HospitalForm());
        try {
            model.addAttribute("specialtyList", hospitalService.getAllSpecialties());
            model.addAttribute("animalList", hospitalService.getAllAnimals());
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception
            // Handle error, e.g., add error message to model
        }
        return "service/hospital/create_hospital";
    }

    // 병원 수정 폼 페이지
    @GetMapping("/edit/{id}")
    public String editForm(@PathVariable Integer id, Model model) {
        try {
            Hospital hospital = hospitalService.getHospital(id);
            HospitalForm hospitalForm = new HospitalForm();
            hospitalForm.setHospitalId(hospital.getHospitalId());
            hospitalForm.setName(hospital.getName());
            hospitalForm.setAddress(hospital.getAddress());
            hospitalForm.setHomepage(hospital.getHomepage());
            hospitalForm.setPhone(hospital.getPhone());
            hospitalForm.setEmail(hospital.getEmail());
            hospitalForm.setHospIntroduce(hospital.getHospIntroduce());
            hospitalForm.setThumbnailImageUrl(hospital.getThumbnailImageUrl());

            // 동물 및 진료과목 ID 설정 (수정 폼에서 기존 선택값 표시용)
            if (hospital.getAnimals() != null) {
                hospitalForm.setAnimalIds(hospital.getAnimals().stream()
                                                .map(Animal::getAnimalId)
                                                .collect(Collectors.toList()));
            }
            if (hospital.getSpecialties() != null) {
                hospitalForm.setSpecialtyIds(hospital.getSpecialties().stream()
                                                    .map(Specialty::getSpecialtyId)
                                                    .collect(Collectors.toList()));
            }

            model.addAttribute("hospitalForm", hospitalForm);
            model.addAttribute("specialtyList", hospitalService.getAllSpecialties());
            model.addAttribute("animalList", hospitalService.getAllAnimals());
        } catch (Exception e) {
            log.error("Error loading hospital for edit: {}", e.getMessage());
            // 에러 처리 로직 추가 (예: 에러 페이지로 리다이렉트 또는 메시지 표시)
        }
        return "service/hospital/create_hospital"; // create_hospital.html을 재사용
    }

    // 병원 등록/수정 처리 (AJAX 요청 처리)
    @PostMapping
    @ResponseBody // For AJAX response
    public String processHospitalForm(@Valid @RequestPart("hospitalForm") HospitalForm hospitalForm,
                                      BindingResult bindingResult, // Add BindingResult
                                      @RequestParam(value = "thumbnailImageFile", required = false) MultipartFile thumbnailImageFile) {

        if (bindingResult.hasErrors()) {
            // Log validation errors
            bindingResult.getAllErrors().forEach(error -> System.err.println("Validation Error: " + error.getDefaultMessage()));
            return "{\"status\": \"error\", \"message\": \"Validation failed: " + bindingResult.getFieldError().getDefaultMessage().replace("\"", "") + "\"}";
        }

        try {
            if (hospitalForm.getHospitalId() == null) {
                // Create new hospital
                hospitalService.createHospital(hospitalForm, thumbnailImageFile);
            } else {
                // Update existing hospital
                hospitalService.updateHospital(hospitalForm, thumbnailImageFile);
            }
            return "{\"status\": \"success\", \"message\": \"Hospital data saved successfully.\"}";
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception
            return "{\"status\": \"error\", \"message\": \"Failed to save hospital data: " + e.getMessage().replace("\"", "") + "\"}";
        }
    }

    

    // 병원 삭제 처리
    @PostMapping("/delete/{id}")
    public String deleteHospital(@PathVariable("id") Integer id, RedirectAttributes redirectAttributes) {
        try {
            hospitalService.deleteHospital(id);
            redirectAttributes.addFlashAttribute("message", "Hospital deleted successfully!");
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception
            redirectAttributes.addFlashAttribute("error", "Failed to delete hospital: " + e.getMessage());
        }
        return "redirect:/service/hospitals"; // Redirect to hospital list page
    }






    

    // ################################## 리뷰 관련 CRUD ##################################

    // 병원 리뷰 목록
    @GetMapping("/{hospitalId}/reviews")
    @ResponseBody
    public ResponseEntity<List<HospReview>> getReviews(@PathVariable int hospitalId) {
        log.info("HospitalController - getReviews() 진입. hospitalId: {}", hospitalId); // 추가
        List<HospReview> reviews = hospReviewService.listByHospital(hospitalId);
        log.info("HospitalController - getReviews() 반환 리뷰 수: {}", reviews.size()); // 추가
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    // 리뷰 등록
    @PostMapping("/{hospitalId}/reviews")
    @ResponseBody
    public ResponseEntity<String> addReview(@PathVariable int hospitalId, @RequestBody HospReview hospReview, @AuthenticationPrincipal CustomUser customUser) {
        log.info("HospitalController - addReview() 진입. hospitalId: {}, hospReview: {}", hospitalId, hospReview); // 추가
        if (customUser == null) {
            log.warn("HospitalController - addReview() : Unauthorized access - customUser is null"); // 추가
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        Long userId = customUser.getUser().getUserId();
        hospReview.setUserId(userId);
        hospReview.setHospitalId(hospitalId);
        
        hospReviewService.addReview(hospReview);
        log.info("HospitalController - addReview() : Review added successfully"); // 추가
        return new ResponseEntity<>("Review added successfully", HttpStatus.CREATED);
    }

    // 리뷰 수정
    // @PutMapping("/{hospitalId}/reviews/{reviewId}")
    // @ResponseBody
    // public ResponseEntity<String> updateReview(@PathVariable int hospitalId, @PathVariable int reviewId, @RequestBody HospReview hospReview, @AuthenticationPrincipal CustomUser customUser) {
    //     log.info("HospitalController - updateReview() 진입. hospitalId: {}, reviewId: {}, hospReview: {}", hospitalId, reviewId, hospReview); // 추가
    //     if (customUser == null) {
    //         log.warn("HospitalController - updateReview() : Unauthorized access - customUser is null"); // 추가
    //         return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
    //     }
    //     HospReview existingReview = hospReviewService.getReviewById(reviewId);
    //     Long userId = customUser.getUser().getUserId();

    //     if (existingReview.getUserId() != userId) {
    //         log.warn("HospitalController - updateReview() : Forbidden access - userId mismatch. existing: {}, current: {}", existingReview.getUserId(), userId); // 추가
    //         return new ResponseEntity<>("Forbidden", HttpStatus.FORBIDDEN);
    //     }

    //     hospReview.setReviewId(reviewId);
    //     hospReview.setHospitalId(hospitalId);
    //     hospReviewService.updateReview(hospReview);
    //     log.info("HospitalController - updateReview() : Review updated successfully"); // 추가
    //     return new ResponseEntity<>("Review updated successfully", HttpStatus.OK);
    // }

    // 리뷰 삭제
    // @DeleteMapping("/{hospitalId}/reviews/{reviewId}")
    // @ResponseBody
    // public ResponseEntity<String> deleteReview(@PathVariable int hospitalId, @PathVariable int reviewId, @AuthenticationPrincipal CustomUser customUser) {
    //     log.info("HospitalController - deleteReview() 진입. hospitalId: {}, reviewId: {}", hospitalId, reviewId); // 추가
    //     if (customUser == null) {
    //         log.warn("HospitalController - deleteReview() : Unauthorized access - customUser is null"); // 추가
    //         return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
    //     }
    //     HospReview existingReview = hospReviewService.getReviewById(reviewId);
    //     Long userId = customUser.getUser().getUserId();

    //     if (existingReview.getUserId() != userId) {
    //         log.warn("HospitalController - deleteReview() : Forbidden access - userId mismatch. existing: {}, current: {}", existingReview.getUserId(), userId); // 추가
    //         return new ResponseEntity<>("Forbidden", HttpStatus.FORBIDDEN);
    //     }

    //     hospReviewService.deleteReview(reviewId);
    //     log.info("HospitalController - deleteReview() : Review deleted successfully"); // 추가
    //     return new ResponseEntity<>("Review deleted successfully", HttpStatus.OK);
    // }

    // 수정&삭제 CustomUserDetails 추가 수정본
    // 리뷰 수정
@PutMapping("/{hospitalId}/reviews/{reviewId}")
@ResponseBody
public ResponseEntity<String> updateReview(
    @PathVariable int hospitalId,
    @PathVariable int reviewId,
    @RequestBody HospReview hospReview,
    @AuthenticationPrincipal CustomUser customUser
) {
    log.info("HospitalController - updateReview() 진입. hospitalId: {}, reviewId: {}, hospReview: {}", hospitalId, reviewId, hospReview);

    // 인증 체크
    if (customUser == null) {
        log.warn("HospitalController - updateReview() : Unauthorized access - customUser is null");
        return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    HospReview existingReview = hospReviewService.getReviewById(reviewId);

    // userId 추출
    Long userId = customUser.getUser().getUserId();

    // 인가 체크: 작성자 본인만 수정 가능
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
@ResponseBody
public ResponseEntity<String> deleteReview(
    @PathVariable int hospitalId,
    @PathVariable int reviewId,
    @AuthenticationPrincipal CustomUser customUser
) {
    log.info("HospitalController - deleteReview() 진입. hospitalId: {}, reviewId: {}", hospitalId, reviewId);

    // 인증 체크
    if (customUser == null) {
        log.warn("HospitalController - deleteReview() : Unauthorized access - customUser is null");
        return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    HospReview existingReview = hospReviewService.getReviewById(reviewId);

    // userId 추출
    Long userId = customUser.getUser().getUserId();

    // 인가 체크: 작성자 본인만 삭제 가능
    if (!existingReview.getUserId().equals(userId)) {
        log.warn("HospitalController - deleteReview() : Forbidden access - userId mismatch. existing: {}, current: {}", existingReview.getUserId(), userId);
        return new ResponseEntity<>("Forbidden", HttpStatus.FORBIDDEN);
    }

    hospReviewService.deleteReview(reviewId);

    log.info("HospitalController - deleteReview() : Review deleted successfully");
    return new ResponseEntity<>("Review deleted successfully", HttpStatus.OK);
}


}
