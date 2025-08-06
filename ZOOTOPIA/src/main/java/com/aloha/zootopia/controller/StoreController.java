package com.aloha.zootopia.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/store")
public class StoreController {

    @GetMapping("/products")
    public String products() {
        System.out.println("=== StoreController /store/products 호출됨 ===");
        return "products/listp";
    }
}
