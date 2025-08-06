package com.aloha.zootopia.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.aloha.zootopia.domain.Product;

import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.HttpServletRequest;

@Controller
@RequestMapping("/cart")
public class CartController {
    
    // 더미 상품 생성 메소드 (ProductController와 동일하게 확장)
    private List<Product> createDummyProducts() {
        List<Product> dummyList = new ArrayList<>();
        // 사료 상품들
        addProduct(dummyList, 1, "새 사료 - 사랑에 빠진 새", "사료", "새들이 좋아하는 영양가 높은 사료입니다. 건강한 털과 활발한 활동을 도와줍니다.", 25000, "/assets/dist/img/products/foodbirdfallinlove.png");
        addProduct(dummyList, 2, "새 사료 - 부엉이가 본", "사료", "다양한 곡물과 씨앗이 포함된 프리미엄 새 사료입니다.", 28000, "/assets/dist/img/products/foodbirdowlsee.png");
        addProduct(dummyList, 3, "새 사료 - 스크림", "사료", "새들의 건강을 위한 특별한 배합의 사료입니다.", 22000, "/assets/dist/img/products/foodbirdscream.png");
        addProduct(dummyList, 4, "고양이 사료 - 피프티", "사료", "고양이의 영양 균형을 고려한 프리미엄 사료입니다.", 35000, "/assets/dist/img/products/foodcatfifty.png");
        addProduct(dummyList, 5, "고양이 사료 - 생선 맛", "사료", "신선한 생선을 주원료로 한 고양이 사료입니다.", 32000, "/assets/dist/img/products/foodcatfishtaste.png");
        addProduct(dummyList, 6, "고양이 사료 - 고뜨", "사료", "고양이가 좋아하는 맛과 영양을 동시에 충족하는 사료입니다.", 38000, "/assets/dist/img/products/foodcatgoddu.png");
        addProduct(dummyList, 7, "개 사료 - 아빠가 좋아해", "사료", "개들이 좋아하는 맛있는 사료입니다. 영양가가 풍부합니다.", 42000, "/assets/dist/img/products/foodddogaddylovesit.png");
        addProduct(dummyList, 8, "개&고양이 건조 사료", "사료", "개와 고양이 모두 먹을 수 있는 건조 사료입니다.", 45000, "/assets/dist/img/products/fooddogandcatdried.png");
        addProduct(dummyList, 9, "개&고양이 습식 사료", "사료", "수분이 풍부한 습식 사료로 기호성이 뛰어납니다.", 48000, "/assets/dist/img/products/fooddogcatmoistured.png");
        addProduct(dummyList, 10, "개 사료 - 껌1", "사료", "개의 치아 건강을 위한 껌 형태의 사료입니다.", 18000, "/assets/dist/img/products/fooddoggum1.png");
        addProduct(dummyList, 11, "개 사료 - 하트빔", "사료", "하트 모양의 귀여운 개 사료입니다.", 25000, "/assets/dist/img/products/fooddogheartbeam.png");
        addProduct(dummyList, 12, "개 사료 - 고기", "사료", "신선한 고기를 주원료로 한 프리미엄 개 사료입니다.", 55000, "/assets/dist/img/products/fooddogmeat.png");
        // 용품 상품들
        addProduct(dummyList, 13, "고양이 목걸이", "용품", "고양이용 방울이 달린 예쁜 목걸이입니다.", 15000, "/assets/dist/img/products/productcatbellnecklace.png");
        addProduct(dummyList, 14, "고양이 식기", "용품", "고양이 전용 식기입니다. 먹기 편한 높이와 각도로 설계되었습니다.", 18000, "/assets/dist/img/products/productcatbowl.png");
        addProduct(dummyList, 15, "고양이 위생패드", "용품", "고양이가 편안하게 쉴 수 있는 위생패드입니다.", 25000, "/assets/dist/img/products/productcathygienepad.png");
        addProduct(dummyList, 16, "고양이 물그릇", "용품", "고양이 전용 물그릇입니다. 물이 흘러넘치지 않도록 설계되었습니다.", 12000, "/assets/dist/img/products/productcatwaterbowl.png");
        addProduct(dummyList, 17, "개 식기", "용품", "개 전용 식기입니다. 크기별로 다양하게 준비되어 있습니다.", 20000, "/assets/dist/img/products/productdogbowl.png");
        addProduct(dummyList, 18, "개 하네스", "용품", "산책 시 사용하는 개 하네스입니다. 편안하고 안전합니다.", 35000, "/assets/dist/img/products/productdogharness.png");
        addProduct(dummyList, 19, "개 위생패드", "용품", "개가 편안하게 쉴 수 있는 위생패드입니다.", 28000, "/assets/dist/img/products/productdoghygienepad.png");
        addProduct(dummyList, 20, "개 물그릇", "용품", "개 전용 물그릇입니다. 넘어지지 않도록 바닥에 미끄럼 방지 처리가 되어 있습니다.", 15000, "/assets/dist/img/products/productdogwaterbowl.png");
        addProduct(dummyList, 21, "위생 플라스틱 봉투", "용품", "산책 시 사용하는 배변봉투입니다. 친환경 소재로 만들어졌습니다.", 8000, "/assets/dist/img/products/producthygieneplasticbag.png");
        addProduct(dummyList, 22, "위생 화장실", "용품", "반려동물 전용 화장실입니다. 냄새 차단과 청소가 쉬운 디자인으로 제작되었습니다.", 45000, "/assets/dist/img/products/producthygienetoilet.png");
        addProduct(dummyList, 23, "펫 침대", "용품", "반려동물이 편안하게 잠들 수 있는 침대입니다.", 65000, "/assets/dist/img/products/productpetbed.png");
        addProduct(dummyList, 24, "펫 케이지", "용품", "반려동물용 케이지입니다. 안전하고 통풍이 잘 됩니다.", 120000, "/assets/dist/img/products/productpetcage.png");
        addProduct(dummyList, 25, "펫 캐리어", "용품", "반려동물과 함께 외출할 때 사용하는 캐리어입니다.", 85000, "/assets/dist/img/products/productpetcarriage.png");
        addProduct(dummyList, 26, "펫 빗", "용품", "반려동물의 털을 정리하는 빗입니다.", 22000, "/assets/dist/img/products/productpetcomb.png");
        addProduct(dummyList, 27, "펫 쿠션", "용품", "반려동물이 편안하게 쉴 수 있는 쿠션입니다.", 35000, "/assets/dist/img/products/productpetcousion.png");
        addProduct(dummyList, 28, "펫 발톱깎이", "용품", "반려동물의 발톱을 안전하게 깎을 수 있는 도구입니다.", 15000, "/assets/dist/img/products/productpetcutter.png");
        addProduct(dummyList, 29, "펫 귀 청소용품", "용품", "반려동물의 귀를 깨끗하게 청소하는 용품입니다.", 18000, "/assets/dist/img/products/productpetearcleaner.png");
        addProduct(dummyList, 30, "펫 하우스", "용품", "반려동물을 위한 집입니다. 실내외 모두 사용 가능합니다.", 150000, "/assets/dist/img/products/productpethouse.png");
        addProduct(dummyList, 31, "펫 목걸이", "용품", "반려동물용 목걸이입니다. 이름표를 달 수 있습니다.", 25000, "/assets/dist/img/products/productpetnecklace.png");
        addProduct(dummyList, 32, "펫 샴푸", "용품", "반려동물 전용 샴푸입니다. 피부에 자극이 적습니다.", 28000, "/assets/dist/img/products/productpetshampoo.png");
        return dummyList;
    }

    // 상품 추가 헬퍼 메서드
    private void addProduct(List<Product> list, int no, String name, String category, String desc, int price, String imageUrl) {
        Product p = new Product();
        p.setNo(no);
        p.setName(name);
        p.setCategory(category);
        p.setDescription(desc);
        p.setPrice(price);
        p.setImageUrl(imageUrl);
        list.add(p);
    }
    
    // 장바구니 페이지
    @GetMapping("")
    public String cart(HttpSession session, Model model) {
        System.out.println("=== 🛒 장바구니 페이지 호출됨 ===");
        try {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> cartItems = (List<Map<String, Object>>) session.getAttribute("cartItems");
            
            System.out.println("=== 📋 세션에서 가져온 cartItems: " + cartItems);
            
            if (cartItems == null) {
                cartItems = new ArrayList<>();
                session.setAttribute("cartItems", cartItems);
                System.out.println("=== ⚠️ cartItems가 null이어서 빈 리스트 생성 ===");
            } else {
                System.out.println("=== 📊 cartItems 개수: " + cartItems.size());
            }
            
            // cart.html에서 요구하는 필드명으로 변환
            List<Map<String, Object>> mappedCartItems = new ArrayList<>();
            int totalAmount = 0;
            int totalQuantity = 0;
            
            for (Map<String, Object> item : cartItems) {
                System.out.println("=== 장바구니 아이템 처리: " + item);
                Map<String, Object> mapped = new HashMap<>();
                
                // 저장된 필드명에 따라 적절히 매핑 (productName/name, productPrice/price 등)
                mapped.put("productNo", item.get("productNo"));
                mapped.put("name", item.get("productName") != null ? item.get("productName") : item.get("name"));
                mapped.put("price", item.get("productPrice") != null ? item.get("productPrice") : item.get("price"));
                mapped.put("quantity", item.get("quantity"));
                mapped.put("imageUrl", item.get("productImage") != null ? item.get("productImage") : item.get("imageUrl"));
                mapped.put("category", item.get("category"));
                
                mappedCartItems.add(mapped);
                
                Integer price = (Integer) mapped.get("price");
                Integer quantity = (Integer) mapped.get("quantity");
                if (price != null && quantity != null) {
                    totalAmount += price * quantity;
                    totalQuantity += quantity;
                }
            }
            
            System.out.println("=== 매핑된 cartItems: " + mappedCartItems);
            System.out.println("=== totalAmount: " + totalAmount + ", totalQuantity: " + totalQuantity);
            
            model.addAttribute("cartItems", mappedCartItems);
            model.addAttribute("totalAmount", totalAmount);
            model.addAttribute("totalQuantity", totalQuantity);
            return "cart/cart";
        } catch (Exception e) {
            System.err.println("장바구니 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            model.addAttribute("error", "장바구니 정보를 불러오는 중 오류가 발생했습니다.");
            return "error/500";
        }
    }
    
    // 장바구니에 상품 추가
    @PostMapping("/add")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> addToCart(
        @RequestParam(name = "productNo") int productNo,
        @RequestParam(name = "quantity") int quantity,
        HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 상품 정보 조회
            List<Product> allProducts = createDummyProducts();
            Product product = allProducts.stream()
                .filter(p -> p.getNo() == productNo)
                .findFirst()
                .orElse(null);
            
            if (product == null) {
                response.put("success", false);
                response.put("message", "상품을 찾을 수 없습니다.");
                return ResponseEntity.ok(response);
            }
            
            // 세션에서 장바구니 정보 조회
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> cartItems = (List<Map<String, Object>>) session.getAttribute("cartItems");
            
            if (cartItems == null) {
                cartItems = new ArrayList<>();
                session.setAttribute("cartItems", cartItems);
            }
            
            // 이미 장바구니에 있는 상품인지 확인
            boolean found = false;
            for (Map<String, Object> item : cartItems) {
                if ((Integer) item.get("productNo") == productNo) {
                    // 수량 증가
                    int currentQuantity = (Integer) item.get("quantity");
                    item.put("quantity", currentQuantity + quantity);
                    found = true;
                    break;
                }
            }
            
            // 새로운 상품이면 추가
            if (!found) {
                Map<String, Object> newItem = new HashMap<>();
                newItem.put("productNo", product.getNo());
                newItem.put("name", product.getName());
                newItem.put("price", product.getPrice());
                newItem.put("quantity", quantity);
                newItem.put("imageUrl", product.getImageUrl());
                newItem.put("category", product.getCategory());
                // cart.html에서 요구하는 필드명으로 추가
                newItem.put("productName", product.getName());
                newItem.put("productPrice", product.getPrice());
                newItem.put("productImage", product.getImageUrl());
                newItem.put("productStock", 99); // 임시, 실제 재고 연동 필요시 수정
                cartItems.add(newItem);
            }
            
            response.put("success", true);
            response.put("message", "장바구니에 추가되었습니다.");
            response.put("cartCount", cartItems.size());
            
        } catch (Exception e) {
            System.err.println("장바구니 추가 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "장바구니 추가 중 오류가 발생했습니다.");
        }
        
        return ResponseEntity.ok(response);
    }
    
    // 장바구니에 상품 추가 (GET 방식 - 상품 상세 페이지에서 호출)
    @GetMapping("/add")
    public String addToCartGet(
        @RequestParam(name = "productNo") int productNo,
        @RequestParam(name = "quantity") int quantity,
        @RequestParam(name = "direct", required = false, defaultValue = "false") boolean direct,
        HttpSession session) {
        System.out.println("=== CartController /cart/add (GET) 호출됨 ===");
        System.out.println("상품번호: " + productNo + ", 수량: " + quantity + ", 바로구매: " + direct);
        
        try {
            // ProductController에서 상품 정보 조회
            Product product = createDummyProducts().stream()
                .filter(p -> p.getNo() == productNo)
                .findFirst()
                .orElse(null);
            
            if (product == null) {
                return "redirect:/products/detail/" + productNo + "?error=product_not_found";
            }
            
            // 세션에서 장바구니 정보 조회
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> cartItems = (List<Map<String, Object>>) session.getAttribute("cartItems");
            
            if (cartItems == null) {
                cartItems = new ArrayList<>();
                session.setAttribute("cartItems", cartItems);
            }
            
            // 이미 장바구니에 있는 상품인지 확인
            boolean found = false;
            for (Map<String, Object> item : cartItems) {
                if ((Integer) item.get("productNo") == productNo) {
                    // 수량 증가
                    int currentQuantity = (Integer) item.get("quantity");
                    item.put("quantity", currentQuantity + quantity);
                    found = true;
                    break;
                }
            }
            
            // 새로운 상품이면 추가
            if (!found) {
                Map<String, Object> newItem = new HashMap<>();
                newItem.put("productNo", product.getNo());
                newItem.put("name", product.getName());
                newItem.put("price", product.getPrice());
                newItem.put("quantity", quantity);
                newItem.put("imageUrl", product.getImageUrl());
                newItem.put("category", product.getCategory());
                // cart.html에서 요구하는 필드명으로 추가
                newItem.put("productName", product.getName());
                newItem.put("productPrice", product.getPrice());
                newItem.put("productImage", product.getImageUrl());
                newItem.put("productStock", 99); // 임시, 실제 재고 연동 필요시 수정
                cartItems.add(newItem);
            }
            
            // 바로 구매인 경우 결제 페이지로, 아니면 장바구니 페이지로
            if (direct) {
                return "redirect:/cart/checkout";
            } else {
                return "redirect:/cart?added=true";
            }
            
        } catch (Exception e) {
            System.err.println("장바구니 추가 중 오류: " + e.getMessage());
            e.printStackTrace();
            return "redirect:/products/detail/" + productNo + "?error=cart_add_failed";
        }
    }
    
    // 장바구니에 상품 추가 (폼 전송용)
    @PostMapping("/add-form")
    public String addToCartForm(
        @RequestParam(name = "productNo") int productNo,
        @RequestParam(name = "quantity") int quantity,
        HttpSession session) {
        try {
            System.out.println("=== 🛒 장바구니 추가 요청 수신됨! ===");
            System.out.println("=== 요청 파라미터: productNo=" + productNo + ", quantity=" + quantity);
            
            // 상품 정보 조회
            List<Product> allProducts = createDummyProducts();
            Product product = allProducts.stream()
                .filter(p -> p.getNo() == productNo)
                .findFirst()
                .orElse(null);
                
            if (product == null) {
                System.out.println("=== ❌ 상품을 찾을 수 없음: productNo=" + productNo);
                return "redirect:/products/detail/" + productNo + "?error=notfound";
            }
            
            System.out.println("=== ✅ 찾은 상품: " + product.getName() + " (가격: " + product.getPrice() + ")");
            
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> cartItems = (List<Map<String, Object>>) session.getAttribute("cartItems");
            if (cartItems == null) {
                cartItems = new ArrayList<>();
                session.setAttribute("cartItems", cartItems);
                System.out.println("=== 🆕 새로운 장바구니 생성");
            } else {
                System.out.println("=== 📋 기존 장바구니 아이템 수: " + cartItems.size());
            }
            
            boolean found = false;
            for (Map<String, Object> item : cartItems) {
                if ((Integer) item.get("productNo") == productNo) {
                    int currentQuantity = (Integer) item.get("quantity");
                    item.put("quantity", currentQuantity + quantity);
                    found = true;
                    System.out.println("=== 🔄 기존 상품 수량 업데이트: " + (currentQuantity + quantity));
                    break;
                }
            }
            
            if (!found) {
                Map<String, Object> newItem = new HashMap<>();
                newItem.put("productNo", product.getNo());
                newItem.put("productName", product.getName());
                newItem.put("productPrice", product.getPrice());
                newItem.put("quantity", quantity);
                newItem.put("productImage", product.getImageUrl());
                newItem.put("productStock", product.getStock() > 0 ? product.getStock() : 99);
                newItem.put("category", product.getCategory());
                
                // 하위 호환용 기존 필드도 저장
                newItem.put("name", product.getName());
                newItem.put("price", product.getPrice());
                newItem.put("imageUrl", product.getImageUrl());
                
                cartItems.add(newItem);
                System.out.println("=== ➕ 새 상품 장바구니에 추가: " + newItem);
            }
            
            session.setAttribute("cartItems", cartItems);
            System.out.println("=== 🎯 장바구니 최종 총 개수: " + cartItems.size());
            System.out.println("=== 🔄 장바구니 페이지로 리다이렉트 진행...");
            
            return "redirect:/cart?added=true";
        } catch (Exception e) {
            System.err.println("=== ❌ 장바구니 추가 중 오류: " + e.getMessage());
            e.printStackTrace();
            return "redirect:/products/detail/" + productNo + "?error=exception";
        }
    }
    
    // 테스트용 간단한 장바구니 추가 엔드포인트
    @PostMapping("/test-add")
    public String testAdd(
        @RequestParam(name = "productNo", defaultValue = "3") int productNo,
        @RequestParam(name = "quantity", defaultValue = "1") int quantity,
        HttpSession session) {
        System.out.println("=== 🧪 테스트 장바구니 추가 호출됨! ===");
        System.out.println("=== 파라미터: productNo=" + productNo + ", quantity=" + quantity);
        return addToCartForm(productNo, quantity, session);
    }
    
    // 장바구니 상품 수량 변경
    @PostMapping("/update")
    public String updateQuantity(
        @RequestParam(name = "productNo") int productNo,
        @RequestParam(name = "quantity") int quantity,
        HttpSession session) {
        
        try {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> cartItems = (List<Map<String, Object>>) session.getAttribute("cartItems");
            
            if (cartItems != null) {
                for (Map<String, Object> item : cartItems) {
                    if ((Integer) item.get("productNo") == productNo) {
                        if (quantity <= 0) {
                            cartItems.remove(item);
                        } else {
                            item.put("quantity", quantity);
                        }
                        break;
                    }
                }
            }
            
            return "redirect:/cart";
            
        } catch (Exception e) {
            System.err.println("장바구니 수량 변경 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return "redirect:/cart?error=update";
        }
    }
    
    // 장바구니 상품 삭제
    @PostMapping("/remove")
    public Object removeFromCart(
        @RequestParam(name = "productNo") int productNo,
        HttpSession session,
        HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> cartItems = (List<Map<String, Object>>) session.getAttribute("cartItems");
            if (cartItems != null) {
                cartItems.removeIf(item -> (Integer) item.get("productNo") == productNo);
            }
            response.put("success", true);
            response.put("message", "상품이 삭제되었습니다.");
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "상품 삭제 중 오류가 발생했습니다.");
        }
        String accept = request.getHeader("Accept");
        if (accept != null && accept.contains("application/json")) {
            return org.springframework.http.ResponseEntity.ok(response);
        } else {
            // 일반 폼 요청이면 삭제 메시지를 쿼리스트링으로 cart로 전달
            return "redirect:/cart?removed=" + java.net.URLEncoder.encode((String)response.get("message"), java.nio.charset.StandardCharsets.UTF_8);
        }
    }
    
    // 장바구니 전체 비우기
    @PostMapping("/clear")
    public Object clearAllCart(HttpSession session, HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> cartItems = (List<Map<String, Object>>) session.getAttribute("cartItems");
            if (cartItems != null) {
                cartItems.clear();
            }
            response.put("success", true);
            response.put("message", "장바구니가 비워졌습니다.");
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "장바구니 비우기 중 오류가 발생했습니다.");
        }
        
        String accept = request.getHeader("Accept");
        if (accept != null && accept.contains("application/json")) {
            return org.springframework.http.ResponseEntity.ok(response);
        } else {
            return "redirect:/cart?cleared=" + java.net.URLEncoder.encode((String)response.get("message"), java.nio.charset.StandardCharsets.UTF_8);
        }
    }

    // 결제 페이지로 이동
    @PostMapping("/checkout")
    public String checkout(
        @RequestParam(name = "productNos", required = false) String productNos,
        @RequestParam(name = "quantities", required = false) String quantities,
        HttpSession session,
        Model model) {
        try {
            List<Map<String, Object>> checkoutItems = new ArrayList<>();
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> cartItems = (List<Map<String, Object>>) session.getAttribute("cartItems");
            if (productNos != null && quantities != null) {
                // 직접 구매의 경우
                String[] productNoArray = productNos.split(",");
                String[] quantityArray = quantities.split(",");
                List<Product> allProducts = createDummyProducts();
                for (int i = 0; i < productNoArray.length; i++) {
                    int productNo = Integer.parseInt(productNoArray[i]);
                    int quantity = Integer.parseInt(quantityArray[i]);
                    Product product = allProducts.stream()
                        .filter(p -> p.getNo() == productNo)
                        .findFirst()
                        .orElse(null);
                    if (product != null) {
                        Map<String, Object> item = new HashMap<>();
                        item.put("productNo", product.getNo());
                        item.put("name", product.getName());
                        item.put("price", product.getPrice());
                        item.put("quantity", quantity);
                        item.put("imageUrl", product.getImageUrl());
                        checkoutItems.add(item);
                    }
                }
                // 결제된 상품만 cart에서 제거
                if (cartItems != null) {
                    for (String no : productNoArray) {
                        int pno = Integer.parseInt(no);
                        cartItems.removeIf(item -> (Integer)item.get("productNo") == pno);
                    }
                }
            } else {
                // 장바구니 전체 결제의 경우
                if (cartItems != null) {
                    checkoutItems.addAll(cartItems);
                    cartItems.clear(); // 전체 비우기
                }
            }
            // 총액 계산
            int totalAmount = 0;
            for (Map<String, Object> item : checkoutItems) {
                int price = (Integer) item.get("price");
                int quantity = (Integer) item.get("quantity");
                totalAmount += price * quantity;
            }
            model.addAttribute("checkoutItems", checkoutItems);
            model.addAttribute("totalAmount", totalAmount);
            return "cart/checkout";
        } catch (Exception e) {
            System.err.println("결제 페이지 이동 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            model.addAttribute("error", "결제 페이지로 이동하는 중 오류가 발생했습니다.");
            return "error/500";
        }
    }
}
