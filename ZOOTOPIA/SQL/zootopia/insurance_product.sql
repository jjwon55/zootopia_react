CREATE TABLE insurance_product (
  product_id           INT AUTO_INCREMENT PRIMARY KEY,
  name                 VARCHAR(100) NOT NULL,
  slogan               VARCHAR(255),
  coverage_percent     TINYINT UNSIGNED,
  monthly_fee_range    VARCHAR(50),
  max_coverage         INT UNSIGNED,
  species              ENUM('dog','cat','all') NOT NULL,
  join_condition       VARCHAR(255),
  coverage_items       TEXT,
  precautions          TEXT,
  image_path           VARCHAR(255),
  company              VARCHAR(50) NOT NULL DEFAULT '',
  created_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_ins_product_species (species),
  INDEX idx_ins_product_company (company),
  INDEX idx_ins_product_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- QnA
CREATE TABLE insurance_qna (
  qna_id      INT AUTO_INCREMENT PRIMARY KEY,
  product_id  INT NOT NULL,
  user_id     INT NOT NULL,
  species     VARCHAR(20),
  question    VARCHAR(500) NOT NULL,
  answer      TEXT,
  nickname    VARCHAR(50) NOT NULL,         -- 질문자 표시용
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_qna_product FOREIGN KEY (product_id)
    REFERENCES insurance_product(product_id) ON DELETE CASCADE,
  CONSTRAINT fk_qna_user FOREIGN KEY (user_id)
    REFERENCES users(user_id) ON DELETE CASCADE,

  INDEX idx_qna_product (product_id),
  INDEX idx_qna_created (created_at),
  INDEX idx_qna_product_qna (product_id, qna_id) -- 목록 정렬 최적화 (product_id + qna_id DESC 정렬 대비)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;