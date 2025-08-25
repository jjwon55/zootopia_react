-- ─────────────────────────────────────────────────────────────
-- 보험 상품
-- ─────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS insurance_outbound_click;
DROP TABLE IF EXISTS insurance_qna;
DROP TABLE IF EXISTS insurance_product;

CREATE TABLE insurance_product (
  product_id           INT AUTO_INCREMENT PRIMARY KEY,
  name                 VARCHAR(100) NOT NULL,
  slogan               VARCHAR(255),
  coverage_percent     TINYINT UNSIGNED,
  monthly_fee_range    VARCHAR(50),
  max_coverage         INT UNSIGNED,
  species              ENUM('dog','cat','all') NOT NULL,  -- 소문자 값 사용
  join_condition       VARCHAR(255),
  coverage_items       TEXT,
  precautions          TEXT,
  image_path           VARCHAR(255),
  company              VARCHAR(50) NOT NULL DEFAULT '',
  created_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- 외부 이동/제휴 필드
  homepage_url         VARCHAR(500),
  apply_url            VARCHAR(500),
  is_sponsored         TINYINT(1) NOT NULL DEFAULT 0,
  disclaimer           TEXT,

  INDEX idx_ins_product_species (species),
  INDEX idx_ins_product_company (company),
  INDEX idx_ins_product_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────────────────────
-- QnA (users.user_id가 BIGINT라고 가정)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE insurance_qna (
  qna_id      INT AUTO_INCREMENT PRIMARY KEY,
  product_id  INT      NOT NULL,
  user_id     INT   NOT NULL,                
  species     VARCHAR(20),
  question    VARCHAR(500) NOT NULL,
  answer      TEXT,
  nickname    VARCHAR(50) NOT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_qna_product FOREIGN KEY (product_id)
    REFERENCES insurance_product(product_id) ON DELETE CASCADE,
  CONSTRAINT fk_qna_user FOREIGN KEY (user_id)
    REFERENCES users(user_id) ON DELETE CASCADE,

  INDEX idx_qna_product (product_id),
  INDEX idx_qna_created (created_at),
  INDEX idx_qna_product_qna (product_id, qna_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────────────────────
-- 아웃바운드 클릭 로그
-- ─────────────────────────────────────────────────────────────
CREATE TABLE insurance_outbound_click (
  id          BIGINT       NOT NULL AUTO_INCREMENT,
  user_id     BIGINT       NULL,                -- BIGINT NULL (Users.userId=long 대응)
  product_id  INT          NOT NULL,
  label       VARCHAR(20)  NOT NULL,
  href        VARCHAR(700) NOT NULL,
  user_agent  VARCHAR(255) NULL,
  ip          VARCHAR(45)  NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_click_product (product_id),
  KEY idx_click_created (created_at),
  CONSTRAINT fk_click_product
    FOREIGN KEY (product_id) REFERENCES insurance_product(product_id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;