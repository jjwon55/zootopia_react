package com.aloha.zootopia.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/safe")
public class SafeProductController {
    
    @GetMapping("/test")
    @ResponseBody
    public String test() {
        return "<h1>Safe Product Controller</h1><p>This controller is working!</p>";
    }
    
    @GetMapping("/detail/{no}")
    public String safeDetail(@PathVariable int no, Model model) {
        try {
            // 가장 기본적인 데이터만 추가
            model.addAttribute("productNo", no);
            model.addAttribute("productName", "Safe Product " + no);
            model.addAttribute("productPrice", no * 1000);
            model.addAttribute("productDescription", "This is a safe product " + no);
            
            return "products/detail";
            
        } catch (Exception e) {
            System.err.println("Safe controller error: " + e.getMessage());
            // 에러가 발생해도 안전한 응답
            model.addAttribute("productNo", no);
            model.addAttribute("productName", "Error Product " + no);
            model.addAttribute("productPrice", 0);
            model.addAttribute("productDescription", "Error occurred");
            return "products/detail";
        }
    }
}
