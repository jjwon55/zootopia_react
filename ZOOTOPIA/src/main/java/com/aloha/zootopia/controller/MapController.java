package com.aloha.zootopia.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/map")
public class MapController {

    // GET /api/map  → 간단한 상태 응답
    @GetMapping
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "map api is alive"
        ));
    }

    // GET /api/map/ping  → 핑/퐁
    @GetMapping("/ping")
    public ResponseEntity<?> ping() {
        return ResponseEntity.ok(Map.of("pong", true));
    }
}
