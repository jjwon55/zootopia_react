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

-- 샘플 데이터 삽입 (번호 고정 1~55)
INSERT INTO products (no, name, category, description, price, image_url, stock) VALUES
(1,'새 사료 - 사랑에 빠진 새','사료','새들이 좋아하는 영양가 높은 사료입니다. 건강한 털과 활발한 활동을 도와줍니다.',25000,'/assets/dist/img/products/foodbirdfallinlove.png',10),
(2,'새 사료 - 부엉이가 본','사료','다양한 곡물과 씨앗이 포함된 프리미엄 새 사료입니다.',28000,'/assets/dist/img/products/foodbirdowlsee.png',10),
(3,'새 사료 - 스크림','사료','새들의 건강을 위한 특별한 배합의 사료입니다.',22000,'/assets/dist/img/products/foodbirdscream.png',10),
(4,'고양이 사료 - 피프티','사료','고양이의 영양 균형을 고려한 프리미엄 사료입니다.',35000,'/assets/dist/img/products/foodcatfifty.png',10),
(5,'고양이 사료 - 생선 맛','사료','신선한 생선을 주원료로 한 고양이 사료입니다.',32000,'/assets/dist/img/products/foodcatfishtaste.png',10),
(6,'고양이 사료 - 고뜨','사료','고양이가 좋아하는 맛과 영양을 동시에 충족하는 사료입니다.',38000,'/assets/dist/img/products/foodcatgoddu.png',10),
(7,'개 사료 - 아빠가 좋아해','사료','개들이 좋아하는 맛있는 사료입니다. 영양가가 풍부합니다.',42000,'/assets/dist/img/products/foodddogaddylovesit.png',10),
(8,'개&고양이 건조 사료','사료','개와 고양이 모두 먹을 수 있는 건조 사료입니다.',45000,'/assets/dist/img/products/fooddogandcatdried.png',10),
(9,'개&고양이 습식 사료','사료','수분이 풍부한 습식 사료로 기호성이 뛰어납니다.',48000,'/assets/dist/img/products/fooddogcatmoistured.png',10),
(10,'개 사료 - 껌1','사료','개의 치아 건강을 위한 껌 형태의 사료입니다.',18000,'/assets/dist/img/products/fooddoggum1.png',10),
(11,'개 사료 - 하트빔','사료','하트 모양의 귀여운 개 사료입니다.',25000,'/assets/dist/img/products/fooddogheartbeam.png',10),
(12,'개 사료 - 고기','사료','신선한 고기를 주원료로 한 프리미엄 개 사료입니다.',55000,'/assets/dist/img/products/fooddogmeat.png',10),
(13,'고양이 목걸이','용품','고양이용 방울이 달린 예쁜 목걸이입니다.',15000,'/assets/dist/img/products/productcatbellnecklace.png',10),
(14,'고양이 식기','용품','고양이 전용 식기입니다. 먹기 편한 높이와 각도로 설계되었습니다.',18000,'/assets/dist/img/products/productcatbowl.png',10),
(15,'고양이 위생패드','용품','고양이가 편안하게 쉴 수 있는 위생패드입니다.',25000,'/assets/dist/img/products/productcathygienepad.png',10),
(16,'고양이 물그릇','용품','고양이 전용 물그릇입니다. 물이 흘러넘치지 않도록 설계되었습니다.',12000,'/assets/dist/img/products/productcatwaterbowl.png',10),
(17,'개 식기','용품','개 전용 식기입니다. 크기별로 다양하게 준비되어 있습니다.',20000,'/assets/dist/img/products/productdogbowl.png',10),
(18,'개 하네스','산책','산책 시 사용하는 개 하네스입니다. 편안하고 안전합니다.',35000,'/assets/dist/img/products/productdogharness.png',10),
(19,'개 위생패드','용품','개가 편안하게 쉴 수 있는 위생패드입니다.',28000,'/assets/dist/img/products/productdoghygienepad.png',10),
(20,'개 물그릇','용품','개 전용 물그릇입니다. 넘어지지 않도록 바닥에 미끄럼 방지 처리가 되어 있습니다.',15000,'/assets/dist/img/products/productdogwaterbowl.png',10),
(21,'위생 플라스틱 봉투','산책','산책 시 사용하는 배변봉투입니다. 친환경 소재로 만들어졌습니다.',8000,'/assets/dist/img/products/producthygieneplasticbag.png',10),
(22,'위생 화장실','용품','반려동물 전용 화장실입니다. 냄새 차단과 청소가 쉬운 디자인으로 제작되었습니다.',45000,'/assets/dist/img/products/producthygienetoilet.png',10),
(23,'펫 침대','용품','반려동물이 편안하게 잠들 수 있는 침대입니다.',65000,'/assets/dist/img/products/productpetbed.png',10),
(24,'펫 케이지','용품','반려동물용 케이지입니다. 안전하고 통풍이 잘 됩니다.',120000,'/assets/dist/img/products/productpetcage.png',10),
(25,'펫 캐리어','산책','반려동물과 함께 외출할 때 사용하는 캐리어입니다.',85000,'/assets/dist/img/products/productpetcarriage.png',10),
(26,'펫 빗','용품','반려동물의 털을 정리하는 빗입니다.',22000,'/assets/dist/img/products/productpetcomb.png',10),
(27,'펫 쿠션','용품','반려동물이 편안하게 쉴 수 있는 쿠션입니다.',35000,'/assets/dist/img/products/productpetcousion.png',10),
(28,'펫 발톱깎이','용품','반려동물의 발톱을 안전하게 깎을 수 있는 도구입니다.',15000,'/assets/dist/img/products/productpetcutter.png',10),
(29,'펫 귀 청소용품','용품','반려동물의 귀를 깨끗하게 청소하는 용품입니다.',18000,'/assets/dist/img/products/productpetearcleaner.png',10),
(30,'펫 하우스','용품','반려동물을 위한 집입니다. 실내외 모두 사용 가능합니다.',150000,'/assets/dist/img/products/productpethouse.png',10),
(31,'펫 목걸이','용품','반려동물용 목걸이입니다. 이름표를 달 수 있습니다.',25000,'/assets/dist/img/products/productpetnecklace.png',10),
(32,'펫 샴푸','용품','반려동물 전용 샴푸입니다. 피부에 자극이 적습니다.',28000,'/assets/dist/img/products/productpetshampoo.png',10),
(33,'강아지 공','장난감','강아지가 좋아하는 탱탱볼입니다. 씹어도 안전합니다.',12000,'/assets/dist/img/products/toydogball.png',10),
(34,'고양이 낚시대','장난감','고양이와 함께 놀 수 있는 낚시대 장난감입니다.',15000,'/assets/dist/img/products/toycatfishingrod.png',10),
(35,'펫 로프','장난감','반려동물과 줄다리기를 할 수 있는 로프입니다.',8000,'/assets/dist/img/products/toypetrope.png',10),
(36,'스마트 레이저 포인터','장난감','고양이가 좋아하는 레이저 포인터입니다.',18000,'/assets/dist/img/products/toylaserpointer.png',10),
(37,'츄잉 본','장난감','개가 씹어도 안전한 뼈 모양 장난감입니다.',20000,'/assets/dist/img/products/toychewingbone.png',10),
(38,'강아지 목줄','산책','산책 시 사용하는 강아지 목줄입니다.',22000,'/assets/dist/img/products/walkdogleash.png',10),
(39,'LED 목걸이','산책','야간 산책 시 안전을 위한 LED 목걸이입니다.',25000,'/assets/dist/img/products/walklednecklace.png',10),
(40,'펫 운동화','산책','반려동물 발가락 보호를 위한 운동화입니다.',35000,'/assets/dist/img/products/walkpetshoes.png',10),
(41,'휴대용 물병','산책','산책 시 사용하는 반려동물 전용 물병입니다.',18000,'/assets/dist/img/products/walkwaterbottle.png',10),
(42,'산책 가방','산책','산책 시 필요한 용품을 담을 수 있는 가방입니다.',32000,'/assets/dist/img/products/walkpetbag.png',10),
(43,'고양이 스마트 레이저','장난감','고양이가 좋아하는 자동 스마트 레이저.',23000,'/assets/dist/img/products/toylaserpointer.png',10),
(44,'펫 로프 장난감','장난감','질긴 로프로 오래 놀 수 있어요.',9000,'/assets/dist/img/products/toypetrope.png',10),
(45,'츄잉 본(치석 관리)','장난감','치석 관리에 도움을 주는 츄잉 본.',18000,'/assets/dist/img/products/toychewingbone.png',10),
(46,'고양이 낚시대(인터랙션)','장난감','집사와 인터랙션 놀이 필수템.',14000,'/assets/dist/img/products/toycatfishingrod.png',10),
(47,'LED 목걸이(야간)','산책','야간 산책 필수 LED 목걸이.',19000,'/assets/dist/img/products/walklednecklace.png',10),
(48,'강아지 목줄(기본)','산책','튼튼한 재질의 기본 목줄.',16000,'/assets/dist/img/products/walkdogleash.png',10),
(49,'펫 운동화(2개 세트)','산책','발바닥 보호용 신발 2개 1세트.',30000,'/assets/dist/img/products/walkpetshoes.png',10),
(50,'휴대용 물병(원터치)','산책','한 손 급수 가능한 휴대용 물병.',12000,'/assets/dist/img/products/walkwaterbottle.png',10),
(51,'펫 하우스(우드)','용품','원목 감성의 펫 하우스.',155000,'/assets/dist/img/products/productpethouse.png',10),
(52,'펫 귀세정제','용품','부드럽고 안전한 귀 세정제.',17000,'/assets/dist/img/products/productpetearcleaner.png',10),
(53,'펫 쿠션(극세사)','용품','푹신한 극세사 쿠션.',34000,'/assets/dist/img/products/productpetcousion.png',10),
(54,'펫 캐리어(라이트)','산책','가벼운 이동용 캐리어.',72000,'/assets/dist/img/products/productpetcarriage.png',10),
(55,'고양이 물그릇(스테디)','용품','미끄럼 방지 베이스 적용.',19000,'/assets/dist/img/products/productcatwaterbowl.png',10)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 인덱스 생성 (성능 향상)
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_reg_date ON products(reg_date);
CREATE INDEX idx_products_name ON products(name);

