-- order_items 테이블 (주문 상세 라인아이템)
CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT NOT NULL,
  order_code VARCHAR(64) NOT NULL,
  product_id BIGINT NULL,
  product_name VARCHAR(255) NOT NULL,
  unit_price INT NOT NULL,
  quantity INT NOT NULL,
  line_total INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_order_items_order_id (order_id),
  INDEX idx_order_items_order_code (order_code),
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 샘플
-- INSERT INTO order_items(order_id, order_code, product_id, product_name, unit_price, quantity, line_total)
-- VALUES (1, 'ORD-EXAMPLE', 10, '샘플상품', 10000, 2, 20000);
