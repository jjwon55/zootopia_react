package com.aloha.zootopia.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.aloha.zootopia.domain.Product;

import jakarta.servlet.http.HttpSession;

@Controller
public class CheckoutController {
    
    // 더미 상품 생성 메소드 (ProductController와 동일)
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
    
    // 바로구매 처리
    @PostMapping("/checkout")
    public String checkout(
            @RequestParam("productNo") int productNo,
            @RequestParam("quantity") int quantity,
            Model model,
            HttpSession session) {
        
        System.out.println("=== CheckoutController 바로구매 호출됨 ===");
        System.out.println("상품번호: " + productNo + ", 수량: " + quantity);
        
        try {
            // 더미 상품 목록에서 해당 상품 조회
            List<Product> allProducts = createDummyProducts();
            Product product = allProducts.stream()
                .filter(p -> p.getNo() == productNo)
                .findFirst()
                .orElse(null);
            
            if (product == null) {
                model.addAttribute("error", "상품을 찾을 수 없습니다.");
                return "error/404";
            }
            
            // 결제할 상품 정보를 생성
            Map<String, Object> checkoutItem = new HashMap<>();
            checkoutItem.put("productNo", product.getNo());
            checkoutItem.put("name", product.getName());
            checkoutItem.put("price", product.getPrice());
            checkoutItem.put("quantity", quantity);
            checkoutItem.put("imageUrl", product.getImageUrl());
            checkoutItem.put("category", product.getCategory());
            
            // checkoutItems 리스트로 생성 (템플릿에서 사용)
            List<Map<String, Object>> checkoutItems = new ArrayList<>();
            checkoutItems.add(checkoutItem);
            
            // 총 금액 계산
            int totalAmount = product.getPrice() * quantity;
            int deliveryFee = totalAmount >= 30000 ? 0 : 3000;
            int finalAmount = totalAmount + deliveryFee;
            
            // 모델에 데이터 추가
            model.addAttribute("checkoutItems", checkoutItems);
            model.addAttribute("totalAmount", totalAmount);
            model.addAttribute("deliveryFee", deliveryFee);
            model.addAttribute("finalAmount", finalAmount);
            model.addAttribute("totalQuantity", quantity);
            
            System.out.println("바로구매 정보 설정 완료 - 상품: " + product.getName() + ", 총액: " + totalAmount);
            
            // 장바구니 결제 페이지를 재사용
            return "cart/checkout";
            
        } catch (Exception e) {
            System.err.println("바로구매 처리 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            model.addAttribute("error", "결제 처리 중 오류가 발생했습니다.");
            return "error/500";
        }
    }
}
