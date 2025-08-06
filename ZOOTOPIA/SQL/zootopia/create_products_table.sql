-- products 테이블이 존재하는지 확인하고 없으면 생성
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

-- 샘플 데이터가 없으면 삽입
INSERT IGNORE INTO products (no, name, category, description, price, image_url, stock) VALUES
(1, '귀여운 비숑프리제', '개', '사랑스러운 비숑프리제입니다. 건강하고 활발한 성격을 가지고 있어요.', 1500000, '/img/catppl.jpg', 5),
(2, 'ZOOTOPIA 로고', '기타', 'ZOOTOPIA 공식 로고가 들어간 굿즈입니다.', 25000, '/img/default-thumbnail.png', 50),
(3, '활발한 코기', '개', '에너지 넘치는 웰시코기입니다. 산책을 좋아하고 사람을 잘 따라요.', 1800000, '/img/default-thumbnail.png', 3),
(4, '온순한 골든리트리버', '개', '온순하고 착한 골든리트리버입니다. 아이들과 잘 어울려요.', 2000000, '/img/default-thumbnail.png', 2),
(5, '아름다운 페르시안 고양이', '고양이', '우아하고 아름다운 페르시안 고양이입니다. 조용하고 차분한 성격이에요.', 1200000, '/img/default-thumbnail.png', 4),
(6, '활동적인 벵갈 고양이', '고양이', '야생의 느낌을 가진 벵갈 고양이입니다. 활동적이고 똑똑해요.', 1500000, '/img/default-thumbnail.png', 6),
(7, '노래하는 카나리아', '새', '아름다운 노래를 부르는 카나리아입니다. 밝은 노란색이 매력적이에요.', 150000, '/img/default-thumbnail.png', 15),
(8, '화려한 앵무새', '새', '다양한 색깔을 가진 아름다운 앵무새입니다. 말을 배울 수 있어요.', 800000, '/img/default-thumbnail.png', 8),
(9, '열대어 세트', '물고기', '다양한 열대어들이 포함된 세트입니다. 수족관이 화려해져요.', 300000, '/img/default-thumbnail.png', 20),
(10, '신비로운 베타', '물고기', '아름다운 지느러미를 가진 베타 물고기입니다. 혼자 키우기 좋아요.', 50000, '/img/default-thumbnail.png', 30),
(11, '귀여운 햄스터', '기타', '작고 귀여운 햄스터입니다. 아이들이 좋아하는 반려동물이에요.', 80000, '/img/default-thumbnail.png', 25),
(12, '온순한 토끼', '기타', '부드러운 털을 가진 토끼입니다. 당근을 좋아해요.', 200000, '/img/default-thumbnail.png', 12);
