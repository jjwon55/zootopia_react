package com.aloha.zootopia.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/debug")
public class DebugController {
    
    @GetMapping("/test")
    @ResponseBody
    public String test() {
        return "Debug Controller is working!";
    }
    
    @GetMapping("/simple-page")
    public String simplePage(Model model) {
        model.addAttribute("message", "간단한 페이지 테스트");
        return "debug/simple";
    }
    
    @GetMapping("/product-test/{no}")
    public String productTest(@PathVariable int no, Model model) {
        System.out.println("Debug: Product test called with no = " + no);
        
        model.addAttribute("productNo", no);
        model.addAttribute("productName", "테스트상품" + no);
        model.addAttribute("productPrice", no * 1000);
        
        return "debug/product_test";
    }
}
