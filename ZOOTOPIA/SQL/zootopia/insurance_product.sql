-- Active: 1745931868686@@127.0.0.1@3306@aloha
CREATE TABLE insurance_product (
product_id INT AUTO_INCREMENT PRIMARY KEY,             -- 상품 고유번호
name VARCHAR(100) NOT NULL,
slogan VARCHAR(255),                                   -- 슬로건
coverage_percent INT NOT NULL,                         -- 보장비율
monthly_fee_range VARCHAR(50),                         -- 월 보험료 (범위 표기용)
max_coverage INT,                                      -- 최대 보장 한도
species ENUM('dog', 'cat', 'all') DEFAULT 'all',       -- 보험 대상
company VARCHAR(50),                                   -- 보험사
join_condition TEXT,                                   -- 가입조건
coverage_items TEXT,                                   -- 보장항목
precautions TEXT,                                      -- 유의사항
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
image_path VARCHAR(255)
);

CREATE TABLE insurance_qna (
  qna_id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  user_id INT NOT NULL,               -- 질문 작성자 ID
  species VARCHAR(20),
  question TEXT NOT NULL,
  answer TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES insurance_product(product_id)
    ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE
);


ALTER TABLE insurance_qna CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
