package com.aloha.zootopia.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aloha.zootopia.dto.TossPayDtos.*;
import com.aloha.zootopia.dto.TossPayDtos.CancelRequest;
import com.aloha.zootopia.dto.TossPayDtos.CancelResponse;
import com.aloha.zootopia.dto.TossPayDtos.ConfirmRequest;
import com.aloha.zootopia.dto.TossPayDtos.ConfirmResponse;
import com.aloha.zootopia.service.TossPayService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments/toss")
@RequiredArgsConstructor
public class TossPayController {
    private final TossPayService service;

    @PostMapping("/confirm")
    public ResponseEntity<ConfirmResponse> confirm(@RequestBody ConfirmRequest req) { return ResponseEntity.ok(service.confirm(req)); }

    @PostMapping("/cancel")
    public ResponseEntity<CancelResponse> cancel(@RequestBody CancelRequest req) { return ResponseEntity.ok(service.cancel(req)); }

    @GetMapping("/health")
    public ResponseEntity<String> health() { return ResponseEntity.ok("toss-pay-ok"); }
}
