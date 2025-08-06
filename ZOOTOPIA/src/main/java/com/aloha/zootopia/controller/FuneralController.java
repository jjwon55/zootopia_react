package com.aloha.zootopia.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("/service/funeral")
public class FuneralController {

    @GetMapping("/cost")
    public String cost() {
        return "service/funeral/cost";
    }

    @GetMapping("/procedure")
    public String procedure() {
        return "service/funeral/procedure";
    }
    
}
