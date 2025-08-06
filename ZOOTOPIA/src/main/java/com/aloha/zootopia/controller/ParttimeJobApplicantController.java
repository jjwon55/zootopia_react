package com.aloha.zootopia.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.aloha.zootopia.domain.CustomUser;
import com.aloha.zootopia.domain.ParttimeJobApplicant;
import com.aloha.zootopia.service.ParttimeJobApplicantService;

@Controller
@RequestMapping("/parttime/job/applicant")
public class ParttimeJobApplicantController {
    
    @Autowired
    private ParttimeJobApplicantService applicantService;


    @PostMapping("/apply")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public String apply(ParttimeJobApplicant applicant,
                        @AuthenticationPrincipal CustomUser user,
                        RedirectAttributes redirectAttributes) {

        if (user == null) {
            throw new SecurityException("로그인 정보가 없습니다.");
        }

        Long userId = user.getUserId();
        Long jobId = applicant.getJobId();

        // ✅ 중복 신청 방지
        if (applicantService.hasApplied((long) jobId, userId)) {
            redirectAttributes.addFlashAttribute("errorMessage", "⚠ 이미 신청하신 아르바이트입니다.");
            return "redirect:/parttime/read/" + jobId;
        }

        // ✅ 신청 처리
        applicant.setUserId(userId);
        applicantService.registerApplicant(applicant);

        redirectAttributes.addFlashAttribute("successMessage", "✅ 아르바이트 신청이 완료되었습니다!");
        return "redirect:/parttime/read/" + jobId;
    }

    @PostMapping("/delete/{applicantId}/job/{jobId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public String delete(@PathVariable int applicantId,
                        @PathVariable Long jobId,
                        @AuthenticationPrincipal CustomUser user) {

        ParttimeJobApplicant app = applicantService.getApplicant(applicantId);

        if (app.getUserId() != user.getUserId()) {
            throw new SecurityException("본인만 지원 취소가 가능합니다.");
        }

        applicantService.deleteApplicant(applicantId);
        return "redirect:/parttime/read/" + jobId;
    }

    @GetMapping("/list/{jobId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public String listApplicants(@PathVariable Long jobId, Model model) {
        model.addAttribute("applicants", applicantService.listApplicants(jobId));
        return "parttime/applicants";
    }
}
