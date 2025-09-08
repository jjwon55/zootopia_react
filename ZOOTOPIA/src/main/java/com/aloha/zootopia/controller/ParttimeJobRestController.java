package com.aloha.zootopia.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import com.aloha.zootopia.domain.CustomUser;
import com.aloha.zootopia.domain.ParttimeJob;
import com.aloha.zootopia.domain.ParttimeJobApplicant;
import com.aloha.zootopia.domain.PetProfile;
import com.aloha.zootopia.domain.Users;
import com.aloha.zootopia.service.ParttimeJobApplicantService;
import com.aloha.zootopia.service.ParttimeJobService;
import com.aloha.zootopia.service.PetProfileService;
import com.aloha.zootopia.service.UserService;

@RestController
@RequestMapping("/parttime")
public class ParttimeJobRestController {

    @Autowired private ParttimeJobService jobService;
    @Autowired private UserService userService;
    @Autowired private ParttimeJobApplicantService applicantService;
    @Autowired private PetProfileService petProfileService;

    private long loginUserId(Authentication auth) {
        if (auth == null) return -1L;
        Object p = auth.getPrincipal();
        if (p instanceof CustomUser) return ((CustomUser) p).getUserId();
        return -1L;
    }

    private boolean isAdmin(Authentication auth) {
        if (auth == null) return false;
        for (GrantedAuthority a : auth.getAuthorities()) {
            if ("ROLE_ADMIN".equals(a.getAuthority())) return true;
        }
        return false;
    }

    // -------------------- 목록 + 필터 + 페이지 --------------------
    @GetMapping
    public ResponseEntity<?> list(
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "location", required = false) String location,
            @RequestParam(name = "animalType", required = false) String animalType,
            @RequestParam(name = "payRange", required = false) String payRange,
            @RequestParam(name = "startDate", required = false) String startDate,
            @RequestParam(name = "endDate", required = false) String endDate,
            @RequestParam(name = "keyword", required = false) String keyword
    ) {
        page = Math.max(1, page);
        int pageSize = 8;
        int offset = (page - 1) * pageSize;

        Map<String, Object> filters = new HashMap<>();
        filters.put("location", location);
        filters.put("animalType", animalType);
        filters.put("payRange", payRange);
        filters.put("startDate", startDate);
        filters.put("endDate", endDate);
        filters.put("keyword", keyword);
        filters.put("offset", offset);
        filters.put("limit", pageSize);

        List<ParttimeJob> jobs = jobService.getFilteredJobs(filters);
        int total = jobService.countFilteredJobs(filters);
        int totalPages = Math.max(1, (int) Math.ceil((double) total / pageSize));

        for (ParttimeJob j : jobs) {
            try {
                Long writerId = j.getUserId();
                if (writerId != null) {
                    Users writer = userService.getUserById(writerId);
                    if (writer != null) j.setNickname(writer.getNickname());
                }
            } catch (Exception ignore) {}
        }

        Map<String, Object> body = new HashMap<>();
        body.put("jobs", jobs);
        body.put("currentPage", page);
        body.put("totalPages", totalPages);
        return ResponseEntity.ok(body);
    }

    // -------------------- 단건 조회 (상세 + 펫 포함) --------------------
    @GetMapping("/{jobId}")
    public ResponseEntity<?> read(
            @PathVariable("jobId") Long jobId,
            @RequestParam(name = "applicantPage", defaultValue = "1") int applicantPage,
            Authentication auth
    ) {
        ParttimeJob job = jobService.getJob(jobId);
        if (job == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "알바를 찾을 수 없습니다."));

        Users writer = null;
        Long writerId = job.getUserId();
        try { if (writerId != null) writer = userService.getUserById(writerId); } catch (Exception ignore) {}

        long uid = loginUserId(auth);
        boolean admin = isAdmin(auth);
        boolean writerView = (uid > 0 && writerId != null && writerId.equals(uid));

        // ✅ 펫 리스트 포함
        List<PetProfile> pets = petProfileService.getPetsByJobId(jobId);
        job.setPets(pets);

        Map<String, Object> body = new HashMap<>();
        body.put("job", job);
        body.put("writerNickname", writer != null ? writer.getNickname() : "");
        body.put("writerEmail", writer != null ? writer.getEmail() : "");
        body.put("writerId", writerId);
        body.put("loginUserId", uid);
        body.put("isWriter", writerView);

        // 작성자/관리자는 지원자 목록 페이징 조회
        if (writerView || admin) {
            int pageSize = 3;
            int offset = (applicantPage - 1) * pageSize;
            List<ParttimeJobApplicant> applicants = applicantService.getPagedApplicants(jobId, offset, pageSize);
            int totalApplicants = applicantService.countApplicantsByJobId(jobId);
            int totalApplicantPages = Math.max(1, (int) Math.ceil((double) totalApplicants / pageSize));

            body.put("applicants", applicants);
            body.put("applicantPage", applicantPage);
            body.put("totalApplicantPages", totalApplicantPages);
        } else if (uid > 0) {
            boolean hasApplied = applicantService.hasApplied(jobId, uid);
            body.put("hasApplied", hasApplied);
            if (hasApplied) body.put("myApplication", applicantService.getApplicantByJobIdAndUserId(jobId, uid));
        } else {
            body.put("hasApplied", false);
        }

        return ResponseEntity.ok(body);
    }

    // -------------------- 알바 상품 등록 --------------------
    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> createJob(@RequestBody ParttimeJob job, Authentication auth) {
        long uid = loginUserId(auth);
        if (uid < 0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "로그인 필요"));

        job.setUserId(uid);
        jobService.registerJob(job);

        // 펫 연동
        if (job.getPetIds() != null && !job.getPetIds().isEmpty()) {
            petProfileService.linkPetsToJob(job.getJobId(), job.getPetIds());
        }

        return ResponseEntity.ok(Map.of("ok", true, "jobId", job.getJobId()));
    }

    // -------------------- 알바 + 펫 동시 등록 --------------------
    @PostMapping("/with-pets")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> createJobWithPets(@RequestBody Map<String, Object> body,
                                               Authentication auth) {
        long uid = loginUserId(auth);
        if (uid < 0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "로그인 필요"));

        // 1. ParttimeJob 등록
        Map<String, Object> jobMap = (Map<String, Object>) body.get("job");
        ParttimeJob job = new com.fasterxml.jackson.databind.ObjectMapper()
                .convertValue(jobMap, ParttimeJob.class);
        job.setUserId(uid);
        jobService.registerJob(job);

        // 2. PetProfile 등록 및 연동
        List<Map<String, Object>> pets = (List<Map<String, Object>>) body.get("pets");
        if (pets != null) {
            for (Map<String, Object> p : pets) {
                PetProfile pet = new com.fasterxml.jackson.databind.ObjectMapper()
                        .convertValue(p, PetProfile.class);
                pet.setUserId(uid);
                petProfileService.registerPet(pet);
                petProfileService.linkPetsToJob(job.getJobId(), List.of(pet.getPetId()));
            }
        }

        return ResponseEntity.ok(Map.of("ok", true, "jobId", job.getJobId()));
    }

    // -------------------- 수정 --------------------
    @PutMapping("/{jobId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> update(@PathVariable("jobId") Long jobId, @RequestBody ParttimeJob job, Authentication auth) {
        ParttimeJob origin = jobService.getJob(jobId);
        if (origin == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "존재하지 않습니다."));

        long uid = loginUserId(auth);
        boolean admin = isAdmin(auth);
        Long ownerId = origin.getUserId();
        if (!admin && !ownerId.equals(uid)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "작성자 또는 관리자만 수정 가능"));

        job.setJobId(jobId);
        job.setUserId(ownerId);
        jobService.updateJob(job);

        // 펫 연동
        if (job.getPetIds() != null) {
            petProfileService.linkPetsToJob(jobId, job.getPetIds());
        }

        return ResponseEntity.ok(Map.of("ok", true));
    }

    // -------------------- 삭제 --------------------
    @DeleteMapping("/{jobId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable("jobId") Long jobId, Authentication auth) {
        ParttimeJob origin = jobService.getJob(jobId);
        if (origin == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "존재하지 않습니다."));

        long uid = loginUserId(auth);
        boolean admin = isAdmin(auth);
        Long ownerId = origin.getUserId();
        if (!admin && !ownerId.equals(uid)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "작성자 또는 관리자만 삭제 가능"));

        jobService.deleteJob(jobId);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    // -------------------- 공고-펫 매핑 --------------------
    @PostMapping("/{jobId}/pets")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> linkPets(@PathVariable Long jobId,
                                      @RequestBody Map<String, List<Long>> body,
                                      Authentication auth) {
        Long uid = ((CustomUser) auth.getPrincipal()).getUserId();
        ParttimeJob job = jobService.getJob(jobId);
        if (job == null || !job.getUserId().equals(uid)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message","권한 없음"));
        }

        List<Long> petIds = body.get("petIds");
        if (petIds == null) return ResponseEntity.badRequest().body(Map.of("message","petIds 필요"));

        petProfileService.linkPetsToJob(jobId, petIds);
        return ResponseEntity.ok(Map.of("ok", true));
    }
}