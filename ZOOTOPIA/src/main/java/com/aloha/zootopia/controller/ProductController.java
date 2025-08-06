package com.aloha.zootopia.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.aloha.zootopia.domain.Pagination;
import com.aloha.zootopia.domain.Product;

@Controller
@RequestMapping("/products")
public class ProductController {
    
    @org.springframework.beans.factory.annotation.Autowired
    private com.aloha.zootopia.service.ProductService productService;

    @org.springframework.beans.factory.annotation.Autowired
    private com.aloha.zootopia.service.FileUploadService fileUploadService;
    
    // 테스트용 API 엔드포인트
    @GetMapping("/test")
    @ResponseBody
    public String test() {
        return "Product Controller is working!";
    }
    
    // 테스트용 단순 상품 목록 페이지
    @GetMapping("")
    public String productHome() {
        return "redirect:/products/listp";
    }
    
    // 동적 기능이 포함된 상품 목록 페이지 (Bootstrap + Thymeleaf)
    @GetMapping("/listp")
    public String list(@RequestParam(value = "category", required = false) String category,
                      @RequestParam(value = "search", required = false) String search,
                      @RequestParam(value = "page", defaultValue = "1") int page,
                      @RequestParam(value = "size", defaultValue = "9") int size,
                      Model model) {
        System.out.println("=== ProductController /listp 호출됨 ===");
        System.out.println("카테고리: " + category + ", 검색어: " + search + ", 페이지: " + page);
        
        try {
            // 더미 데이터 생성
            List<Product> allProducts = createDummyProducts();
            
            // 카테고리 필터링
            if (category != null && !category.isEmpty() && !"전체".equals(category)) {
                allProducts = allProducts.stream()
                    .filter(p -> category.equals(p.getCategory()))
                    .collect(java.util.stream.Collectors.toList());
            }
            
            // 검색 필터링
            if (search != null && !search.isEmpty()) {
                allProducts = allProducts.stream()
                    .filter(p -> p.getName().toLowerCase().contains(search.toLowerCase()) ||
                               p.getDescription().toLowerCase().contains(search.toLowerCase()))
                    .collect(java.util.stream.Collectors.toList());
            }
            
            // 페이지네이션 계산
            int totalProducts = allProducts.size();
            int startIndex = (page - 1) * size;
            int endIndex = Math.min(startIndex + size, totalProducts);
            
            List<Product> products = allProducts.subList(startIndex, endIndex);
            
            // 페이지네이션 count 동적 설정
            Pagination pagination = new Pagination(page, totalProducts);
            pagination.setSize(size);
            pagination.setCategory(category);
            
            // 카테고리 목록 (실제 더미 데이터에 있는 카테고리로 수정)
            List<String> categories = java.util.Arrays.asList("전체", "사료", "용품", "장난감", "산책");
            
            // 모델에 데이터 추가
            model.addAttribute("products", products);
            model.addAttribute("pagination", pagination);
            model.addAttribute("categories", categories);
            model.addAttribute("currentCategory", category != null ? category : "전체");
            model.addAttribute("currentSearch", search != null ? search : "");
            model.addAttribute("totalProducts", totalProducts);
            
            return "products/listp";
            
        } catch (Exception e) {
            System.err.println("상품 목록 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            model.addAttribute("error", "상품 목록을 불러오는 중 오류가 발생했습니다.");
            return "products/listp_minimal2";
        }
    }
    
    // 상품 상세 페이지 - 완성된 버전
    @GetMapping("/detail/{no}")
    public String detail(@PathVariable("no") Integer productNumber, Model model) {
        System.out.println("=== 상품 상세 페이지 호출됨: " + productNumber + " ===");
        // 더미 상품 데이터에서 해당 상품 찾기
        List<Product> allProducts = createDummyProducts();
        Product product = allProducts.stream()
            .filter(p -> p.getNo() == productNumber)
            .findFirst()
            .orElse(null);
        if (product == null) {
            model.addAttribute("error", "상품을 찾을 수 없습니다.");
            return "error/404";
        }
        model.addAttribute("productNo", product.getNo());
        model.addAttribute("productName", product.getName());
        model.addAttribute("productPrice", product.getPrice());
        model.addAttribute("productCategory", product.getCategory());
        model.addAttribute("productDescription", product.getDescription());
        model.addAttribute("productStock", product.getStock() > 0 ? product.getStock() : 50);
        model.addAttribute("productRating", product.getRating() > 0 ? product.getRating() : 4.5);
        model.addAttribute("productReviewCount", product.getReviewCount() > 0 ? product.getReviewCount() : 120);
        model.addAttribute("productImage", product.getImageUrl());
        // 기본 수량
        model.addAttribute("quantity", 1);
        System.out.println("상품 정보 설정 완료");
        return "products/detail";
    }
    
    // 테스트용 상품 상세 페이지
    @GetMapping("/detail-test/{no}")
    public String detailTest(@PathVariable int no, Model model) {
        System.out.println("=== 테스트용 상품 상세 페이지 호출됨: " + no + " ===");
        return "products/detail_test";
    }
    
    // 정적 테스트 페이지
    @GetMapping("/detail-static/{no}")
    public String detailStatic(@PathVariable int no, Model model) {
        System.out.println("=== 정적 테스트 페이지 호출됨: " + no + " ===");
        return "products/detail_static";
    }
    
    // 가장 단순한 테스트 페이지
    @GetMapping("/simple/{no}")
    public String simple(@PathVariable int no, Model model) {
        System.out.println("=== 간단 테스트 페이지 호출됨: " + no + " ===");
        return "products/detail";
    }
    
    // 최소한의 데이터로 상세 페이지 테스트
    @GetMapping("/minimal-detail/{no}")
    public String minimalDetail(@PathVariable int no, Model model) {
        System.out.println("=== 최소한 상세 페이지 호출됨: " + no + " ===");
        
        try {
            Product product = new Product();
            product.setNo(no);
            product.setName("테스트 상품 " + no);
            product.setPrice(10000 + (no * 1000));
            product.setCategory("테스트");
            product.setDescription("테스트 상품 설명");
            
            model.addAttribute("product", product);
            return "products/detail_minimal";
        } catch (Exception e) {
            System.err.println("최소한 상세 페이지 오류: " + e.getMessage());
            e.printStackTrace();
            return "error/500";
        }
    }
    
//     // 좋아요/싫어요 토글 기능
//     @PostMapping("/toggle-like/{no}")
//     @ResponseBody
//     public ResponseEntity<Map<String, Object>> toggleLike(@PathVariable int no, @RequestParam String type) {
//         Map<String, Object> response = new HashMap<>();
//         try {
//             // 로그인 확인
//             Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//             if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
//                 response.put("success", false);
//                 response.put("message", "로그인이 필요합니다.");
//                 return ResponseEntity.ok(response);

//             int result = 0;
//             if ("like".equals(type)) {
//                 result = productService.updateLikes(no);
//             } else if ("dislike".equals(type)) {
//                 result = productService.updateDislikes(no);
//             }
            
//             if (result > 0) {
//                 Product product = productService.getByNo(no);
//                 response.put("success", true);
//                 response.put("likes", product.getLikes());
//                 response.put("dislikes", product.getDislikes());
//                 response.put("message", "like".equals(type) ? "좋아요!" : "싫어요가 반영되었습니다.");
//             } else {
//                 response.put("success", false);
//                 response.put("message", "처리에 실패했습니다.");
//             }
//         } catch (Exception e) {
//             e.printStackTrace();
//             response.put("success", false);
//             response.put("message", "오류가 발생했습니다: " + e.getMessage());
//         }
//         return ResponseEntity.ok(response);
//     }
    
//     // 상품 등록 페이지
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/create")
    public String createForm(Model model) {
        model.addAttribute("product", new Product());
        return "products/create";
    }
    
//     // 상품 등록 처리
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create")
    public String create(Product product, 
                        @RequestParam(required = false) MultipartFile imageFile,
                        RedirectAttributes redirectAttributes) {
        try {
            // 이미지 파일 업로드 처리
            if (imageFile != null && !imageFile.isEmpty()) {
                String imageUrl = fileUploadService.uploadFile(imageFile);
                product.setImageUrl(imageUrl);
            } else {
                product.setImageUrl("/img/default-thumbnail.png");
            }
            
//             // 상품 등록
            int result = productService.insert(product);
            
            if (result > 0) {
                redirectAttributes.addFlashAttribute("success", "상품이 성공적으로 등록되었습니다.");
                return "redirect:/products/listp";
            } else {
                redirectAttributes.addFlashAttribute("error", "상품 등록에 실패했습니다.");
                return "redirect:/products/create";
            }
            
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "오류가 발생했습니다: " + e.getMessage());
            return "redirect:/products/create";
        }
    }
    
//     // 장바구니 추가 기능
    @PostMapping("/add-to-cart")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> addToCart(@RequestParam int productNo, 
                                                        @RequestParam String option,
                                                        @RequestParam int quantity) {
        Map<String, Object> response = new HashMap<>();
        try {
            // 로그인 확인
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
                response.put("success", false);
                response.put("message", "로그인이 필요합니다.");
                return ResponseEntity.ok(response);
            }
            
            // 상품 존재 확인
            Product product = productService.getByNo(productNo);
            if (product == null) {
                response.put("success", false);
                response.put("message", "상품을 찾을 수 없습니다.");
                return ResponseEntity.ok(response);
            }
            
            // 재고 확인
            if (product.getStock() < quantity) {
                response.put("success", false);
                response.put("message", "재고가 부족합니다.");
                return ResponseEntity.ok(response);
            }
            
            // 장바구니 추가 로직 (추후 CartService 구현)
            // cartService.addToCart(username, productNo, option, quantity);
            
            response.put("success", true);
            response.put("message", "장바구니에 추가되었습니다.");
            System.out.println("장바구니 추가: " + auth.getName() + " - 상품 " + productNo + " (옵션: " + option + ", 수량: " + quantity + ")");
            
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "오류가 발생했습니다: " + e.getMessage());
        }
        return ResponseEntity.ok(response);
    }
    
    // 바로 구매 기능
    @PostMapping("/buy-now")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> buyNow(@RequestParam int productNo,
                                                     @RequestParam String option,
                                                     @RequestParam int quantity) {
        Map<String, Object> response = new HashMap<>();
        try {
            // 로그인 확인
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
                response.put("success", false);
                response.put("message", "로그인이 필요합니다.");
                return ResponseEntity.ok(response);
            }
            
            // 상품 존재 확인
            Product product = productService.getByNo(productNo);
            if (product == null) {
                response.put("success", false);
                response.put("message", "상품을 찾을 수 없습니다.");
                return ResponseEntity.ok(response);
            }
            
            // 재고 확인
            if (product.getStock() < quantity) {
                response.put("success", false);
                response.put("message", "재고가 부족합니다.");
                return ResponseEntity.ok(response);
            }
            
            // 주문 페이지로 리다이렉트할 URL 생성 (추후 OrderController 구현)
            String orderUrl = "/orders/create?productNo=" + productNo + "&option=" + option + "&quantity=" + quantity;
            
            response.put("success", true);
            response.put("message", "주문 페이지로 이동합니다.");
            response.put("redirectUrl", orderUrl);
            System.out.println("바로구매: " + auth.getName() + " - 상품 " + productNo + " (옵션: " + option + ", 수량: " + quantity + ")");
            
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "오류가 발생했습니다: " + e.getMessage());
        }
        return ResponseEntity.ok(response);
    }
    
    // 리뷰 작성 기능
//     @PostMapping("/add-review")
//     @ResponseBody
//     public ResponseEntity<Map<String, Object>> addReview(@RequestParam int productNo,
//                                                         @RequestParam int rating,
//                                                         @RequestParam String content) {
//         Map<String, Object> response = new HashMap<>();
//         try {
//             // 로그인 확인
//             Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//             if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
//                 response.put("success", false);
//                 response.put("message", "로그인이 필요합니다.");
//                 return ResponseEntity.ok(response);
//             }
            
//             // 상품 존재 확인
//             Product product = productService.getByNo(productNo);
//             if (product == null) {
//                 response.put("success", false);
//                 response.put("message", "상품을 찾을 수 없습니다.");
//                 return ResponseEntity.ok(response);
//             }
            
//             // 리뷰 추가 로직 (추후 ReviewService 구현)
//             // reviewService.addReview(auth.getName(), productNo, rating, content);
            
//             response.put("success", true);
//             response.put("message", "리뷰가 등록되었습니다.");
//             System.out.println("리뷰 등록: " + auth.getName() + " - 상품 " + productNo + " (평점: " + rating + ")");
            
//         } catch (Exception e) {
//             e.printStackTrace();
//             response.put("success", false);
//             response.put("message", "오류가 발생했습니다: " + e.getMessage());
//         }
//         return ResponseEntity.ok(response);
//     }
    
    // 더미 데이터 생성 메서드 - 실제 상품 이미지 기반 (CartController에서도 사용)
    public List<Product> createDummyProducts() {
        List<Product> dummyList = new java.util.ArrayList<>();
        
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
        addProduct(dummyList, 18, "개 하네스", "산책", "산책 시 사용하는 개 하네스입니다. 편안하고 안전합니다.", 35000, "/assets/dist/img/products/productdogharness.png");
        addProduct(dummyList, 19, "개 위생패드", "용품", "개가 편안하게 쉴 수 있는 위생패드입니다.", 28000, "/assets/dist/img/products/productdoghygienepad.png");
        addProduct(dummyList, 20, "개 물그릇", "용품", "개 전용 물그릇입니다. 넘어지지 않도록 바닥에 미끄럼 방지 처리가 되어 있습니다.", 15000, "/assets/dist/img/products/productdogwaterbowl.png");
        addProduct(dummyList, 21, "위생 플라스틱 봉투", "산책", "산책 시 사용하는 배변봉투입니다. 친환경 소재로 만들어졌습니다.", 8000, "/assets/dist/img/products/producthygieneplasticbag.png");
        addProduct(dummyList, 22, "위생 화장실", "용품", "반려동물 전용 화장실입니다. 냄새 차단과 청소가 쉬운 디자인으로 제작되었습니다.", 45000, "/assets/dist/img/products/producthygienetoilet.png");
        addProduct(dummyList, 23, "펫 침대", "용품", "반려동물이 편안하게 잠들 수 있는 침대입니다.", 65000, "/assets/dist/img/products/productpetbed.png");
        addProduct(dummyList, 24, "펫 케이지", "용품", "반려동물용 케이지입니다. 안전하고 통풍이 잘 됩니다.", 120000, "/assets/dist/img/products/productpetcage.png");
        addProduct(dummyList, 25, "펫 캐리어", "산책", "반려동물과 함께 외출할 때 사용하는 캐리어입니다.", 85000, "/assets/dist/img/products/productpetcarriage.png");
        addProduct(dummyList, 26, "펫 빗", "용품", "반려동물의 털을 정리하는 빗입니다.", 22000, "/assets/dist/img/products/productpetcomb.png");
        addProduct(dummyList, 27, "펫 쿠션", "용품", "반려동물이 편안하게 쉴 수 있는 쿠션입니다.", 35000, "/assets/dist/img/products/productpetcousion.png");
        addProduct(dummyList, 28, "펫 발톱깎이", "용품", "반려동물의 발톱을 안전하게 깎을 수 있는 도구입니다.", 15000, "/assets/dist/img/products/productpetcutter.png");
        addProduct(dummyList, 29, "펫 귀 청소용품", "용품", "반려동물의 귀를 깨끗하게 청소하는 용품입니다.", 18000, "/assets/dist/img/products/productpetearcleaner.png");
        addProduct(dummyList, 30, "펫 하우스", "용품", "반려동물을 위한 집입니다. 실내외 모두 사용 가능합니다.", 150000, "/assets/dist/img/products/productpethouse.png");
        addProduct(dummyList, 31, "펫 목걸이", "용품", "반려동물용 목걸이입니다. 이름표를 달 수 있습니다.", 25000, "/assets/dist/img/products/productpetnecklace.png");
        addProduct(dummyList, 32, "펫 샴푸", "용품", "반려동물 전용 샴푸입니다. 피부에 자극이 적습니다.", 28000, "/assets/dist/img/products/productpetshampoo.png");
        
        // 장난감 상품들 추가
        addProduct(dummyList, 33, "강아지 공", "장난감", "강아지가 좋아하는 탱탱볼입니다. 씹어도 안전합니다.", 12000, "/assets/dist/img/products/toydogball.png");
        addProduct(dummyList, 34, "고양이 낚시대", "장난감", "고양이와 함께 놀 수 있는 낚시대 장난감입니다.", 15000, "/assets/dist/img/products/toycatfishingrod.png");
        addProduct(dummyList, 35, "펫 로프", "장난감", "반려동물과 줄다리기를 할 수 있는 로프입니다.", 8000, "/assets/dist/img/products/toypetrope.png");
        addProduct(dummyList, 36, "스마트 레이저 포인터", "장난감", "고양이가 좋아하는 레이저 포인터입니다.", 18000, "/assets/dist/img/products/toylaserpointer.png");
        addProduct(dummyList, 37, "츄잉 본", "장난감", "개가 씹어도 안전한 뼈 모양 장난감입니다.", 20000, "/assets/dist/img/products/toychewingbone.png");
        
        // 산책 상품들 추가
        addProduct(dummyList, 38, "강아지 목줄", "산책", "산책 시 사용하는 강아지 목줄입니다.", 22000, "/assets/dist/img/products/walkdogleash.png");
        addProduct(dummyList, 39, "LED 목걸이", "산책", "야간 산책 시 안전을 위한 LED 목걸이입니다.", 25000, "/assets/dist/img/products/walklednecklace.png");
        addProduct(dummyList, 40, "펫 운동화", "산책", "반려동물 발가락 보호를 위한 운동화입니다.", 35000, "/assets/dist/img/products/walkpetshoes.png");
        addProduct(dummyList, 41, "휴대용 물병", "산책", "산책 시 사용하는 반려동물 전용 물병입니다.", 18000, "/assets/dist/img/products/walkwaterbottle.png");
        addProduct(dummyList, 42, "산책 가방", "산책", "산책 시 필요한 용품을 담을 수 있는 가방입니다.", 32000, "/assets/dist/img/products/walkpetbag.png");
        
        return dummyList;
    }
    
    // 간단한 더미 데이터 생성 메서드 (안전함)
    public List<Product> createSimpleDummyProducts() {
        List<Product> dummyList = new java.util.ArrayList<>();
        
        try {
            // 기본 상품들만 생성
            Product p1 = new Product();
            p1.setNo(1);
            p1.setName("새 사료 - 사랑에 빠진 새");
            p1.setCategory("사료");
            p1.setDescription("새들이 좋아하는 영양가 높은 사료입니다.");
            p1.setPrice(25000);
            p1.setImageUrl("/assets/dist/img/products/foodbirdfallinlove.png");
            p1.setStatus("판매중");
            p1.setStock(10);
            p1.setViews(50);
            p1.setLikes(5);
            p1.setDislikes(0);
            dummyList.add(p1);
            
            Product p7 = new Product();
            p7.setNo(7);
            p7.setName("개 사료 - 아빠가 좋아해");
            p7.setCategory("사료");
            p7.setDescription("개들이 좋아하는 맛있는 사료입니다. 영양가가 풍부합니다.");
            p7.setPrice(42000);
            p7.setImageUrl("/assets/dist/img/products/foodddogaddylovesit.png");
            p7.setStatus("판매중");
            p7.setStock(15);
            p7.setViews(75);
            p7.setLikes(8);
            p7.setDislikes(1);
            dummyList.add(p7);
            
            Product p9 = new Product();
            p9.setNo(9);
            p9.setName("개&고양이 습식 사료");
            p9.setCategory("사료");
            p9.setDescription("수분이 풍부한 습식 사료로 기호성이 뛰어납니다.");
            p9.setPrice(48000);
            p9.setImageUrl("/assets/dist/img/products/fooddogcatmoistured.png");
            p9.setStatus("판매중");
            p9.setStock(8);
            p9.setViews(30);
            p9.setLikes(3);
            p9.setDislikes(0);
            dummyList.add(p9);
            
            Product p13 = new Product();
            p13.setNo(13);
            p13.setName("고양이 목걸이");
            p13.setCategory("용품");
            p13.setDescription("고양이용 방울이 달린 예쁜 목걸이입니다.");
            p13.setPrice(15000);
            p13.setImageUrl("/assets/dist/img/products/productcatbellnecklace.png");
            p13.setStatus("판매중");
            p13.setStock(20);
            p13.setViews(45);
            p13.setLikes(7);
            p13.setDislikes(0);
            dummyList.add(p13);
            
        } catch (Exception e) {
            System.err.println("간단한 더미 데이터 생성 중 오류: " + e.getMessage());
            e.printStackTrace();
        }
        
        return dummyList;
    }
    
    // 상품 추가 헬퍼 메서드 - 안전한 버전
    private void addProduct(List<Product> list, int no, String name, String category, String description, int price, String imageUrl) {
        try {
            Product product = new Product();
            product.setNo(no);
            product.setName(name);
            product.setCategory(category);
            product.setDescription(description);
            product.setPrice(price);
            product.setImageUrl(imageUrl);
            product.setStatus("판매중");
            product.setStock(10); // 고정값으로 변경
            product.setViews(50); // 고정값으로 변경
            product.setLikes(5); // 고정값으로 변경
            product.setDislikes(0); // 고정값으로 변경
            list.add(product);
        } catch (Exception e) {
            System.err.println("상품 추가 중 오류: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    // 더미 데이터 테스트용 엔드포인트
    @GetMapping("/test-dummy")
    @ResponseBody
    public String testDummy() {
        try {
            List<Product> products = createDummyProducts();
            StringBuilder sb = new StringBuilder();
            sb.append("총 상품 수: ").append(products.size()).append("<br>");
            
            for (Product p : products) {
                if (p.getNo() == 7) {
                    sb.append("상품 7번: ").append(p.getName())
                      .append(", 가격: ").append(p.getPrice())
                      .append(", 카테고리: ").append(p.getCategory())
                      .append(", 이미지: ").append(p.getImageUrl())
                      .append("<br>");
                    break;
                }
            }
            
            return sb.toString();
        } catch (Exception e) {
            return "오류: " + e.getMessage() + "<br>" + java.util.Arrays.toString(e.getStackTrace());
        }
    }
    
    // 기본 템플릿 테스트
    @GetMapping("/template-test/{no}")
    public String templateTest(@PathVariable int no, Model model) {
        System.out.println("=== 기본 템플릿 테스트 호출됨: " + no + " ===");
        return "test_basic";
    }
    
    // PathVariable 없는 테스트
    @GetMapping("/no-param-test")
    @ResponseBody
    public String noParamTest() {
        return "<h1>PathVariable 없는 테스트</h1><p>이 응답이 보인다면 기본 매핑은 작동합니다.</p>";
    }
    
    // 상품 번호로 상품 찾기 (단순화된 버전)
    public Product getProductByNo(int no) {
        System.out.println("getProductByNo 호출됨: " + no);
        
        try {
            Product product = new Product();
            
            // 단순한 switch 문으로 처리
            switch (no) {
                case 1:
                    product.setNo(1);
                    product.setName("새 사료 - 사랑에 빠진 새");
                    product.setCategory("사료");
                    product.setDescription("새들이 좋아하는 영양가 높은 사료입니다.");
                    product.setPrice(25000);
                    product.setImageUrl("/img/default-thumbnail.png");
                    break;
                case 2:
                    product.setNo(2);
                    product.setName("새 사료 - 부엉이가 본");
                    product.setCategory("사료");
                    product.setDescription("다양한 곡물과 씨앗이 포함된 프리미엄 새 사료입니다.");
                    product.setPrice(28000);
                    product.setImageUrl("/img/default-thumbnail.png");
                    break;
                case 3:
                    product.setNo(3);
                    product.setName("새 사료 - 스크림");
                    product.setCategory("사료");
                    product.setDescription("새들의 건강을 위한 특별한 배합의 사료입니다.");
                    product.setPrice(22000);
                    product.setImageUrl("/img/default-thumbnail.png");
                    break;
                default:
                    // 다른 번호는 기본 상품으로 처리
                    product.setNo(no);
                    product.setName("상품 " + no);
                    product.setCategory("기타");
                    product.setDescription("상품 " + no + "의 설명입니다.");
                    product.setPrice(10000 + (no * 1000));
                    product.setImageUrl("/img/default-thumbnail.png");
                    break;
            }
            
            // 공통 속성 설정
            product.setStatus("판매중");
            product.setStock(10);
            product.setViews(0);
            product.setLikes(0);
            product.setDislikes(0);
            
            System.out.println("상품 생성 완료: " + product.getName());
            return product;
            
        } catch (Exception e) {
            System.err.println("getProductByNo 오류: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
    
    // 관련 상품 가져오기 (하드코딩)
    // (메서드가 사용되지 않아 삭제됨)
    
    // 간단한 템플릿 테스트
    @GetMapping("/template-detail/{no}")
    public String templateDetail(@PathVariable int no, Model model) {
        System.out.println("=== 템플릿 테스트 /template-detail/" + no + " 호출됨 ===");
        model.addAttribute("productNo", no);
        model.addAttribute("productName", "테스트 상품");
        return "products/detail";
    }
    
    // 안전한 상품 상세 페이지 (예외 처리 강화)
    @GetMapping("/safe-detail/{no}")
    public String safeDetail(@PathVariable int no, Model model) {
        System.out.println("=== SAFE ProductController /safe-detail/" + no + " 호출됨 ===");
        
        try {
            System.out.println("SAFE 1. 메소드 시작, 상품번호: " + no);
            
            // 상품 번호 유효성 검증
            if (no < 1 || no > 50) {
                System.out.println("SAFE 2. 잘못된 상품 번호: " + no);
                model.addAttribute("error", "잘못된 상품 번호입니다.");
                return "error/404";
            }
            
            System.out.println("SAFE 3. 상품 조회 시작");
            
            // 직접 Product 객체 생성하여 테스트
            Product product = new Product();
            product.setNo(no);
            product.setName("테스트 상품 " + no);
            product.setCategory("테스트");
            product.setDescription("테스트용 상품입니다.");
            product.setPrice(10000 + (no * 1000));
            product.setImageUrl("/img/default-thumbnail.png");
            product.setStatus("판매중");
            product.setStock(10);
            product.setViews(0);
            product.setLikes(0);
            
            System.out.println("SAFE 4. 테스트 상품 생성 완료: " + product.getName());
            
            System.out.println("SAFE 5. 모델에 데이터 추가");
            model.addAttribute("product", product);
            
            System.out.println("SAFE 6. 템플릿 반환");
            return "products/detail";
            
        } catch (Exception e) {
            System.err.println("❌ SAFE 상품 상세 조회 중 오류 발생: " + e.getMessage());
            System.err.println("❌ SAFE 오류 클래스: " + e.getClass().getName());
            e.printStackTrace();
            
            // 매우 안전한 fallback
            return "products/detail_minimal";
        }
    }
    
    // 매우 단순한 테스트 엔드포인트
    @GetMapping("/ultra-simple/{no}")
    public String ultraSimple(@PathVariable int no, Model model) {
        System.out.println("=== ULTRA SIMPLE /ultra-simple/" + no + " 호출됨 ===");
        
        try {
            // 가장 기본적인 데이터만 추가
            model.addAttribute("message", "Ultra Simple Test for Product " + no);
            model.addAttribute("productNo", no);
            
            return "products/detail_minimal";
            
        } catch (Exception e) {
            System.err.println("❌ ULTRA SIMPLE 오류: " + e.getMessage());
            e.printStackTrace();
            return "error/500";
        }
    }
    
    // 정적 응답 테스트 (템플릿 없이)
    @GetMapping("/static-test/{no}")
    @ResponseBody
    public String staticTest(@PathVariable int no) {
        System.out.println("=== STATIC TEST /static-test/" + no + " 호출됨 ===");
        
        return "<html><body><h1>Static Test for Product " + no + "</h1><p>이 페이지가 보인다면 컨트롤러는 정상 작동합니다.</p><a href='/products'>목록으로</a></body></html>";
    }
    
    // 정적 템플릿 테스트
    @GetMapping("/template-static-test/{no}")
    public String templateStaticTest(@PathVariable int no, Model model) {
        System.out.println("=== TEMPLATE STATIC TEST /template-static-test/" + no + " 호출됨 ===");
        
        try {
            return "test_static";
        } catch (Exception e) {
            System.err.println("❌ TEMPLATE STATIC TEST 오류: " + e.getMessage());
            e.printStackTrace();
            return "error/500";
        }
    }
    
    // Thymeleaf 테스트
    @GetMapping("/thymeleaf-test/{no}")
    public String thymeleafTest(@PathVariable int no, Model model) {
        System.out.println("=== THYMELEAF TEST /thymeleaf-test/" + no + " 호출됨 ===");
        
        try {
            model.addAttribute("productNo", no);
            model.addAttribute("message", "Hello Thymeleaf for Product " + no);
            
            return "test_thymeleaf";
        } catch (Exception e) {
            System.err.println("❌ THYMELEAF TEST 오류: " + e.getMessage());
            e.printStackTrace();
            return "error/500";
        }
    }
    
    // Product 객체 테스트
    @GetMapping("/product-object-test/{no}")
    public String productObjectTest(@PathVariable int no, Model model) {
        System.out.println("=== PRODUCT OBJECT TEST /product-object-test/" + no + " 호출됨 ===");
        
        try {
            System.out.println("1. Product 객체 생성 시작");
            
            Product product = new Product();
            product.setNo(no);
            product.setName("테스트 상품 " + no);
            product.setPrice(10000);
            
            System.out.println("2. Product 객체 생성 완료: " + product.getName());
            
            model.addAttribute("product", product);
            
            System.out.println("3. 모델에 추가 완료");
            
            return "test_thymeleaf";
            
        } catch (Exception e) {
            System.err.println("❌ PRODUCT OBJECT TEST 오류: " + e.getMessage());
            e.printStackTrace();
            return "error/500";
        }
    }
    
    // 정적 테스트용 상품 상세 페이지
    @GetMapping("/detail-static-test/{no}")
    public String detailStaticTest(@PathVariable int no) {
        System.out.println("=== 정적 테스트 페이지 호출됨: " + no + " ===");
        return "products/detail_static_test";
    }
    
    // Thymeleaf 테스트용 상품 상세 페이지
    @GetMapping("/detail-thymeleaf-test/{no}")
    public String detailThymeleafTest(@PathVariable int no, Model model) {
        System.out.println("=== Thymeleaf 테스트 페이지 호출됨: " + no + " ===");
        model.addAttribute("no", no);
        return "products/detail_thymeleaf_test";
    }
    
    // JSON 응답 테스트
    @GetMapping("/detail/{no}/json")
    @ResponseBody
    public Map<String, Object> detailJson(@PathVariable int no) {
        System.out.println("=== JSON 상세 페이지 호출됨: " + no + " ===");
        
        Map<String, Object> result = new HashMap<>();
        result.put("no", no);
        result.put("name", "상품" + no);
        result.put("price", no * 10000);
        result.put("desc", "설명" + no);
        result.put("success", true);
        
        return result;
    }
    
    /*
     * SafeProductController 마이그레이션 안내:
     * 
     * 기존 SafeProductController 엔드포인트 → ProductController 대응 엔드포인트
     * 
     * /safe/test                → /products/test (기존 기능 사용)
     * /safe/detail/{no}         → /products/safe-detail/{no} (기존 기능 사용)
     * 
     * 사용자는 /products/safe-detail/{no} 엔드포인트를 사용하시기 바랍니다.
     */
    
    // Safe 기능은 이미 /products/safe-detail/{no} 엔드포인트에 구현되어 있음
}
