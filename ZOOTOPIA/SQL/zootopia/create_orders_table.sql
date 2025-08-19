-- orders 테이블 생성 스크립트
-- 애플리케이션의 com.aloha.zootopia.domain.Order, OrderMapper 와 매핑되는 기본 컬럼만 포함
-- 필요 시(order_code, tid 등) 결제/환불 추적 컬럼을 이후 ALTER TABLE 로 추가하세요.

CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_code VARCHAR(64) NOT NULL UNIQUE, -- 가맹점 주문번호 (외부표시용)
    user_id BIGINT NOT NULL,
    product_id BIGINT NULL,
    product_name VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    status VARCHAR(40) NOT NULL,
    pay_tid VARCHAR(100) NULL,            -- 카카오(또는 PG) TID
    image VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_orders_user_id (user_id),
    INDEX idx_orders_status (status),
    INDEX idx_orders_pay_tid (pay_tid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- (선택) 향후 결제 추적 확장을 위한 권장 컬럼
-- 이미 테이블 생성 후라면 (운영) 아래 ALTER 사용:
-- ALTER TABLE orders ADD COLUMN order_code VARCHAR(64) UNIQUE AFTER id;
-- ALTER TABLE orders ADD COLUMN pay_tid VARCHAR(100) NULL AFTER status;
-- ALTER TABLE orders ADD COLUMN pay_method VARCHAR(30) NULL AFTER pay_tid; -- KAKAOPAY 등
-- ALTER TABLE orders ADD COLUMN pay_total_amount INT NULL AFTER price;
-- ALTER TABLE orders ADD COLUMN canceled_at TIMESTAMP NULL AFTER updated_at;

-- (선택) 샘플 데이터
-- INSERT INTO orders (order_code, user_id, product_id, product_name, price, status, pay_tid, image) VALUES
-- ('ORD-LOCAL-1', 1, 10, '테스트상품', 15000, '배송준비중', NULL, NULL);
