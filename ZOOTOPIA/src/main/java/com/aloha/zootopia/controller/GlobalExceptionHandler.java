package com.aloha.zootopia.controller;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(Exception.class)
    public String handleException(Exception e, Model model) {
        System.err.println("=== 전역 예외 핸들러 호출됨 ===");
        System.err.println("예외 타입: " + e.getClass().getName());
        System.err.println("예외 메시지: " + e.getMessage());
        e.printStackTrace();
        
        model.addAttribute("error", e.getMessage());
        model.addAttribute("exception", e.getClass().getSimpleName());
        
        return "error/500";
    }
}
