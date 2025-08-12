package com.aloha.zootopia.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.aloha.zootopia.domain.InsuranceProduct;
import com.aloha.zootopia.service.InsuranceProductService;

@RestController
@RequestMapping("/api/insurance")
public class InsuranceProductRestController {

    @Value("${file.upload.path}")
    private String uploadDir;

    @Autowired
    private InsuranceProductService productService;

    // 목록 + 필터 + 페이지네이션
    @GetMapping("/list")
    public Map<String, Object> listProducts(
            @RequestParam(required = false) String species,
            @RequestParam(required = false) String company,
            @RequestParam(defaultValue = "1") int page
    ) {
        int pageSize = 6;
        int offset = (page - 1) * pageSize;

        // 개별 파라미터로 서비스 호출
        List<InsuranceProduct> products =
                productService.getFilteredProducts(
                        (org.springframework.util.StringUtils.hasText(species) ? species : null),
                        (org.springframework.util.StringUtils.hasText(company) ? company : null),
                        offset, pageSize
                );

        int totalCount =
                productService.countFilteredProducts(
                        (org.springframework.util.StringUtils.hasText(species) ? species : null),
                        (org.springframework.util.StringUtils.hasText(company) ? company : null)
                );

        int totalPages = (int) Math.ceil((double) totalCount / pageSize);

        Map<String, Object> body = new HashMap<>();
        body.put("products", products);
        body.put("currentPage", page);
        body.put("totalPages", totalPages);
        return body;
    }

    // 단건 조회
    @GetMapping("/read/{productId}")
    public ResponseEntity<?> read(@PathVariable int productId) {
        InsuranceProduct product = productService.getProductById(productId);
        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "해당 보험 상품을 찾을 수 없습니다."));
        }
        return ResponseEntity.ok(Map.of("product", product));
    }

    // 등록 (ADMIN)
    @PostMapping("/register")
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
    @PostMapping("/update") // 프론트와 호환 위해 POST 유지 (원칙은 PUT /{id})
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> update(@RequestBody InsuranceProduct product) {
        productService.updateProduct(product);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    // 삭제 (ADMIN)
    @PostMapping("/delete/{productId}") // 프론트와 호환 위해 POST 유지 (원칙은 DELETE /{id})
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable int productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    // 이미지 업로드 (ADMIN)
    @PostMapping("/upload-image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadImage(@RequestParam("imageFile") MultipartFile imageFile) {
        try {
            if (imageFile.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "이미지 파일이 비어 있습니다."));
            }
            String safeName = imageFile.getOriginalFilename() == null ? "img"
                    : imageFile.getOriginalFilename().replaceAll("[^a-zA-Z0-9.]", "_");
            String fileName = UUID.randomUUID() + "_" + safeName;

            Path targetPath = Paths.get(uploadDir, fileName);
            Files.createDirectories(targetPath.getParent());
            Files.copy(imageFile.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            // 정적 제공 경로 (예: /upload/** → file:uploadDir/)
            String imagePath = "/upload/" + fileName;
            return ResponseEntity.ok(Map.of("imagePath", imagePath));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "업로드 실패: " + e.getMessage()));
        }
    }
}