-- 리뷰 테이블 생성
CREATE TABLE reviews (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    content TEXT NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- 외래키 제약조건 (실제 테이블이 있을 때 주석 해제)
    -- FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    -- FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- 인덱스
    INDEX idx_product_id (product_id),
    INDEX idx_user_id (user_id),
    INDEX idx_rating (rating),
    INDEX idx_created_date (created_date),
    
    -- 중복 리뷰 방지 (한 사용자가 한 상품에 대해 하나의 리뷰만 작성 가능)
    UNIQUE KEY unique_user_product (product_id, user_id)
);

-- 더미 리뷰 데이터 삽입
INSERT INTO reviews (product_id, user_id, rating, content, created_date) VALUES
(1, 1, 5, '정말 귀여운 비숑프리제예요! 아이가 너무 좋아해요.', '2024-01-15 10:30:00'),
(1, 2, 4, '건강하고 활발한 아이를 받았습니다. 감사합니다.', '2024-01-20 14:45:00'),
(1, 3, 5, '털이 정말 부드럽고 성격도 온순해요.', '2024-02-01 09:15:00'),

(2, 1, 5, 'ZOOTOPIA 로고가 정말 예뻐요!', '2024-01-18 16:20:00'),
(2, 4, 4, '품질이 좋고 배송도 빨랐습니다.', '2024-01-25 11:30:00'),

(3, 2, 5, '활발한 코기 정말 최고입니다!', '2024-01-22 13:45:00'),
(3, 5, 4, '에너지가 넘치는 아이예요. 운동 많이 시켜주세요.', '2024-02-05 10:20:00'),
(3, 6, 5, '가족 모두가 사랑하는 코기입니다.', '2024-02-10 15:30:00'),

(4, 3, 5, '골든리트리버 정말 온순하고 똑똑해요!', '2024-01-28 12:00:00'),
(4, 7, 4, '아이들과 잘 어울리는 성격이에요.', '2024-02-03 14:15:00'),

(5, 4, 4, '페르시안 고양이 털이 정말 아름다워요.', '2024-02-01 11:45:00'),
(5, 8, 5, '우아하고 고급스러운 고양이입니다.', '2024-02-08 16:30:00'),

(6, 5, 5, '벵갈 고양이 무늬가 정말 독특하고 예뻐요!', '2024-02-05 13:20:00'),
(6, 9, 4, '활동적이고 놀기 좋아하는 성격이에요.', '2024-02-12 10:45:00'),

(7, 6, 4, '카나리아 노래 소리가 정말 아름다워요.', '2024-02-10 09:30:00'),
(7, 10, 5, '매일 아침 예쁜 노래로 깨워줍니다.', '2024-02-15 08:15:00'),

(8, 7, 5, '앵무새가 말도 따라하고 너무 재밌어요!', '2024-02-12 14:20:00'),
(8, 1, 4, '색깔이 정말 화려하고 아름답습니다.', '2024-02-18 11:30:00'),

(9, 8, 4, '열대어들이 정말 다양하고 예뻐요.', '2024-02-15 15:45:00'),
(9, 2, 5, '수족관이 정말 화려해졌습니다!', '2024-02-20 12:00:00');

-- 상품별 리뷰 통계 조회 쿼리 (참고용)
-- SELECT 
--     p.id as product_id,
--     p.name as product_name,
--     COUNT(r.id) as review_count,
--     ROUND(AVG(r.rating), 1) as average_rating
-- FROM products p
-- LEFT JOIN reviews r ON p.id = r.product_id
-- GROUP BY p.id, p.name
-- ORDER BY p.id;
