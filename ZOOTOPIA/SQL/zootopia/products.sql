-- products 테이블 생성 (안전한 생성)
CREATE TABLE IF NOT EXISTS products (
    no INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    price INT NOT NULL DEFAULT 0,
    image_url VARCHAR(500),
    status VARCHAR(20) DEFAULT '판매중',
    stock INT DEFAULT 0,
    reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    upd_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    views INT DEFAULT 0,
    likes INT DEFAULT 0
);

-- 샘플 데이터 삽입 (깔끔한 상품명)
INSERT INTO products (name, category, description, price, image_url, stock) VALUES
('고양이 사료 피프티', '사료', '고양이의 영양 균형을 고려한 프리미엄 사료입니다.', 35000, '/assets/dist/img/products/foodcatfifty.png', 10),
('고양이 사료 생선맛', '사료', '신선한 생선을 주원료로 한 고양이 사료입니다.', 32000, '/assets/dist/img/products/foodcatfishtaste.png', 10),
('고양이 사료 고뜨', '사료', '고양이가 좋아하는 맛과 영양을 동시에 충족하는 사료입니다.', 38000, '/assets/dist/img/products/foodcatgoddu.png', 10),
('개 사료 아빠가 좋아해', '사료', '개들이 좋아하는 맛있는 사료입니다. 영양가가 풍부합니다.', 42000, '/assets/dist/img/products/foodddogaddylovesit.png', 10),
('개고양이 건조 사료', '사료', '개와 고양이 모두 먹을 수 있는 건조 사료입니다.', 45000, '/assets/dist/img/products/fooddogandcatdried.png', 10),
('개고양이 습식 사료', '사료', '수분이 풍부한 습식 사료로 기호성이 뛰어납니다.', 48000, '/assets/dist/img/products/fooddogcatmoistured.png', 10),
('개 사료 껌타입', '사료', '개의 치아 건강을 위한 껌 형태의 사료입니다.', 18000, '/assets/dist/img/products/fooddoggum1.png', 10),
('개 사료 하트빔', '사료', '하트 모양의 귀여운 개 사료입니다.', 25000, '/assets/dist/img/products/fooddogheartbeam.png', 10),
('개 사료 고기맛', '사료', '신선한 고기를 주원료로 한 프리미엄 개 사료입니다.', 55000, '/assets/dist/img/products/fooddogmeat.png', 10),
('고양이 목걸이', '용품', '고양이용 방울이 달린 예쁜 목걸이입니다.', 15000, '/assets/dist/img/products/productcatbellnecklace.png', 10),
('고양이 식기', '용품', '고양이 전용 식기입니다. 먹기 편한 높이 각도로 설계되었습니다.', 18000, '/assets/dist/img/products/productcatbowl.png', 10),
('고양이 위생패드', '용품', '고양이가 편안하게 쉴 수 있는 위생패드입니다.', 25000, '/assets/dist/img/products/productcathygienepad.png', 10),
('고양이 물그릇', '용품', '고양이 전용 물그릇입니다. 물이 흘러넘치지 않도록 설계되었습니다.', 12000, '/assets/dist/img/products/productcatwaterbowl.png', 10),
('개 식기', '용품', '개 전용 식기입니다. 크기별로 다양하게 비치되어 있습니다.', 20000, '/assets/dist/img/products/productdogbowl.png', 10),
('개 하네스', '용품', '산책 시 사용하는 개 하네스입니다. 편안하고 안전합니다.', 35000, '/assets/dist/img/products/productdogharness.png', 10),
('개 위생패드', '용품', '개가 편안하게 쉴 수 있는 위생패드입니다.', 28000, '/assets/dist/img/products/productdoghygienepad.png', 10),
('개 물그릇', '용품', '개 전용 물그릇입니다. 넘어지지 않도록 바닥에 미끄럼 방지 처리가 되어 있습니다.', 15000, '/assets/dist/img/products/productdogwaterbowl.png', 10),
('위생 플라스틱 봉투', '용품', '산책 시 사용하는 배변봉투입니다. 친환경 소재로 만들어졌습니다.', 8000, '/assets/dist/img/products/producthygieneplasticbag.png', 10),
('위생 화장실', '용품', '반려동물 전용 화장실입니다. 냄새 차단과 청소가 쉬운 디자인으로 제작되었습니다.', 45000, '/assets/dist/img/products/producthygienetoilet.png', 10),
('펫 침대', '용품', '반려동물이 편안하게 잠들 수 있는 침대입니다.', 65000, '/assets/dist/img/products/productpetbed.png', 10),
('펫 케이지', '용품', '반려동물용 케이지입니다. 안전하고 통풍이 잘 됩니다.', 120000, '/assets/dist/img/products/productpetcage.png', 10),
('펫 캐리어', '용품', '반려동물과 함께 외출할 때 사용하는 캐리어입니다.', 85000, '/assets/dist/img/products/productpetcarriage.png', 10),
('펫 빗', '용품', '반려동물의 털을 정리하는 빗입니다.', 12000, '/assets/dist/img/products/productpetcomb.png', 10),
('펫 쿠션', '용품', '반려동물이 편안하게 쉴 수 있는 쿠션입니다.', 35000, '/assets/dist/img/products/productpetcousion.png', 10),
('펫 발톱깎이', '용품', '반려동물의 발톱을 안전하게 깎을 수 있는 도구입니다.', 15000, '/assets/dist/img/products/productpetcutter.png', 10),
('펫 귀 청소용품', '용품', '반려동물의 귀를 깨끗하게 청소하는 용품입니다.', 18000, '/assets/dist/img/products/productpetearcleaner.png', 10),
('펫 하우스', '용품', '반려동물을 위한 집입니다. 실내외 모두 사용 가능합니다.', 150000, '/assets/dist/img/products/productpethouse.png', 10),
('펫 목걸이', '용품', '반려동물용 목걸이입니다. 이름표를 달 수 있습니다.', 25000, '/assets/dist/img/products/productpetnecklace.png', 10),
('펫 샴푸', '용품', '반려동물 전용 샴푸입니다. 피부에 자극이 적습니다.', 28000, '/assets/dist/img/products/productpetshampoo.png', 10),
('ZOOTOPIA 로고', '로고', 'ZOOTOPIA의 공식 로고입니다.', 0, '/assets/dist/img/zootopialogo.png', 100);

-- 인덱스 생성 (성능 향상)
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_reg_date ON products(reg_date);
CREATE INDEX idx_products_name ON products(name);

