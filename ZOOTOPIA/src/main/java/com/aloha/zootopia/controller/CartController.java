package com.aloha.zootopia.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cart")
// @CrossOrigin(origins = "http://localhost:5173")
public class CartController {

    // Cart Item 내부 클래스
    public static class CartItem {
        private Long id;
        private Long productId;
        private String productName;
        private Integer price;
        private Integer quantity;
        private String imageUrl;
        private String category;

        // 기본 생성자
        public CartItem() {}

        // 생성자
        public CartItem(Long id, Long productId, String productName, Integer price, 
                       Integer quantity, String imageUrl, String category) {
            this.id = id;
            this.productId = productId;
            this.productName = productName;
            this.price = price;
            this.quantity = quantity;
            this.imageUrl = imageUrl;
            this.category = category;
        }

        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }

        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }

        public Integer getPrice() { return price; }
        public void setPrice(Integer price) { this.price = price; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }

        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
    }

    // Mock 데이터 저장을 위한 Map
    private static Map<Long, List<CartItem>> userCarts = new HashMap<>();

    static {
        // 초기 Mock 데이터
        List<CartItem> mockCart = new ArrayList<>();
        mockCart.add(new CartItem(1L, 1L, "강아지 사료", 25000, 2, "/assets/dist/img/products/dogfood.jpg", "사료"));
        mockCart.add(new CartItem(2L, 2L, "고양이 장난감", 12000, 1, "/assets/dist/img/products/cattoy.jpg", "장난감"));
        mockCart.add(new CartItem(3L, 3L, "애완용품 세트", 35000, 1, "/assets/dist/img/products/petset.jpg", "용품"));
        userCarts.put(1L, mockCart);
    }

    // 장바구니 조회
    @GetMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> getCartItems(@PathVariable Long userId) {
        List<CartItem> cartItems = userCarts.getOrDefault(userId, new ArrayList<>());
        
        int totalAmount = cartItems.stream()
                .mapToInt(item -> item.getPrice() * item.getQuantity())
                .sum();
        
        int totalItems = cartItems.stream()
                .mapToInt(CartItem::getQuantity)
                .sum();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("cartItems", cartItems);
        response.put("totalAmount", totalAmount);
        response.put("totalItems", totalItems);

        return ResponseEntity.ok(response);
    }

    // 장바구니에 상품 추가
    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> addToCart(@RequestBody Map<String, Object> request) {
        Long userId = Long.valueOf(request.get("userId").toString());
        Long productId = Long.valueOf(request.get("productId").toString());
        Integer quantity = Integer.valueOf(request.get("quantity").toString());

        List<CartItem> cartItems = userCarts.getOrDefault(userId, new ArrayList<>());
        
        // 이미 존재하는 상품인지 확인
        Optional<CartItem> existingItem = cartItems.stream()
                .filter(item -> item.getProductId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            // 기존 상품의 수량 증가
            existingItem.get().setQuantity(existingItem.get().getQuantity() + quantity);
        } else {
            // 새로운 상품 추가 (실제로는 Product 정보를 DB에서 조회해야 함)
            Long newId = cartItems.size() + 1L;
            CartItem newItem = new CartItem(newId, productId, "상품 " + productId, 20000, 
                                          quantity, "/assets/dist/img/products/default.jpg", "기타");
            cartItems.add(newItem);
        }

        userCarts.put(userId, cartItems);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "장바구니에 추가되었습니다.");

        return ResponseEntity.ok(response);
    }

    // 장바구니 상품 수량 업데이트
    @PutMapping("/update/{cartItemId}")
    public ResponseEntity<Map<String, Object>> updateCartItem(
            @PathVariable Long cartItemId, 
            @RequestBody Map<String, Object> request) {
        
        Integer quantity = Integer.valueOf(request.get("quantity").toString());
        Map<String, Object> response = new HashMap<>();

        // 모든 사용자의 장바구니에서 해당 아이템 찾기
        boolean found = false;
        for (List<CartItem> cartItems : userCarts.values()) {
            Optional<CartItem> item = cartItems.stream()
                    .filter(cartItem -> cartItem.getId().equals(cartItemId))
                    .findFirst();
            
            if (item.isPresent()) {
                item.get().setQuantity(quantity);
                found = true;
                break;
            }
        }

        if (found) {
            response.put("success", true);
            response.put("message", "수량이 변경되었습니다.");
        } else {
            response.put("success", false);
            response.put("message", "해당 상품을 찾을 수 없습니다.");
        }

        return ResponseEntity.ok(response);
    }

    // 장바구니 상품 삭제
    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<Map<String, Object>> removeCartItem(@PathVariable Long cartItemId) {
        Map<String, Object> response = new HashMap<>();
        boolean found = false;

        // 모든 사용자의 장바구니에서 해당 아이템 삭제
        for (List<CartItem> cartItems : userCarts.values()) {
            if (cartItems.removeIf(item -> item.getId().equals(cartItemId))) {
                found = true;
                break;
            }
        }

        if (found) {
            response.put("success", true);
            response.put("message", "상품이 삭제되었습니다.");
        } else {
            response.put("success", false);
            response.put("message", "해당 상품을 찾을 수 없습니다.");
        }

        return ResponseEntity.ok(response);
    }

    // 장바구니 비우기
    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<Map<String, Object>> clearCart(@PathVariable Long userId) {
        userCarts.put(userId, new ArrayList<>());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "장바구니가 비워졌습니다.");

        return ResponseEntity.ok(response);
    }
}
