package com.aloha.zootopia.controller;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.aloha.zootopia.domain.InsuranceProduct;
import com.aloha.zootopia.service.InsuranceProductService;

@RestController
@RequestMapping("/insurance")
public class InsuranceProductRestController {

    @Value("${file.upload.path}")
    private String uploadDir;

    @Autowired
    private InsuranceProductService productService;

    // 목록 + 필터 + 페이지네이션
    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> listProducts(
            @RequestParam(name = "species", required = false) String species,
            @RequestParam(name = "company", required = false) String company,
            @RequestParam(name = "sponsored", required = false) Integer sponsored, // 0/1 또는 null
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "6") int size
    ) {
        page = Math.max(1, page);
        size = Math.max(1, size);
        final int offset = (page - 1) * size;

        // species는 소문자로 정규화 (ENUM: 'dog','cat','all')
        String normalizedSpecies = null;
        if (StringUtils.hasText(species)) {
            String s = species.trim().toLowerCase();
            if ("dog".equals(s) || "cat".equals(s) || "all".equals(s)) {
                normalizedSpecies = s;
            } else {
                normalizedSpecies = s;
            }
        }
        String normalizedCompany = StringUtils.hasText(company) ? company.trim() : null;

        // ✅ sponsored를 서비스로 전달
        List<InsuranceProduct> products =
                productService.getFilteredProducts(normalizedSpecies, normalizedCompany, sponsored, offset, size);
        int totalCount =
                productService.countFilteredProducts(normalizedSpecies, normalizedCompany, sponsored);

        int totalPages = (int) Math.ceil((double) totalCount / size);

        Map<String, Object> body = new HashMap<>();
        body.put("products", products);
        body.put("currentPage", page);
        body.put("pageSize", size);
        body.put("totalPages", totalPages);
        body.put("totalCount", totalCount);
        return ResponseEntity.ok(body);
    }

    // 단건 조회 (겸용 매핑)
    @GetMapping(value = {"/{productId}", "/read/{productId}"}, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> read(@PathVariable("productId") int productId) {
        InsuranceProduct product = productService.getProductById(productId);
        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "해당 보험 상품을 찾을 수 없습니다."));
        }
        return ResponseEntity.ok(Map.of("product", product));
    }

    // 등록 (ADMIN)
    @PostMapping(value = "/register", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> register(@RequestBody InsuranceProduct product) {
        if (!StringUtils.hasText(product.getSpecies())) {
            return ResponseEntity.badRequest().body(Map.of("message", "반려동물 종류를 선택하세요."));
        }
        if (!StringUtils.hasText(product.getImagePath())) {
            return ResponseEntity.badRequest().body(Map.of("message", "이미지를 먼저 업로드하세요."));
        }
        productService.registerProduct(product);
        return ResponseEntity.ok(Map.of("ok", true, "productId", product.getProductId()));
    }

    // 수정 (ADMIN)
    @PutMapping(value = "/{productId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updatePut(@PathVariable int productId, @RequestBody InsuranceProduct product) {
        product.setProductId(productId);
        productService.updateProduct(product);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    @PostMapping(value = "/update", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updatePost(@RequestBody InsuranceProduct product) {
        productService.updateProduct(product);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    // 삭제 (ADMIN)
    @DeleteMapping(value = "/{productId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteDelete(@PathVariable int productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    @PostMapping(value = "/delete/{productId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deletePost(@PathVariable int productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    // 이미지 업로드 (ADMIN)
    @PostMapping(value = "/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadImage(@RequestParam(name = "imageFile") MultipartFile imageFile) {
        try {
            if (imageFile == null || imageFile.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "이미지 파일이 비어 있습니다."));
            }
            String original = imageFile.getOriginalFilename();
            String safeName = (original == null ? "img" : original).replaceAll("[^a-zA-Z0-9.]", "_");
            String fileName = java.util.UUID.randomUUID() + "_" + safeName;

            Path targetPath = Paths.get(uploadDir, fileName);
            Files.createDirectories(targetPath.getParent());
            Files.copy(imageFile.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            String imagePath = "/upload/" + fileName; // 정적 매핑 필요
            return ResponseEntity.ok(Map.of("imagePath", imagePath));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "업로드 실패: " + e.getMessage()));
        }
    }
}