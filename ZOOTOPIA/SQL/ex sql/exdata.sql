-- === 샘플에 사용할 사용자 ID ===
SET @U1 = 1;  -- 예: alice
SET @U2 = 2;  -- 예: bob
SET @U3 = 3;  -- 예: charlie

-- =========================
-- 1) 보험 상품 (insurance_product)
-- =========================
INSERT INTO insurance_product
(name, slogan, coverage_percent, monthly_fee_range, max_coverage,
 species, join_condition, coverage_items, precautions, image_path, company)
VALUES
('KB 펫케어', '우리집 반려의 든든한 버팀목', 70, '15000~40000', 150,
 'dog', '생후 3개월~8세', '입원/수술/통원', '기왕증 제외', '/upload/kb.png', 'KB');
SET @P1 = LAST_INSERT_ID();

INSERT INTO insurance_product
(name, slogan, coverage_percent, monthly_fee_range, max_coverage,
 species, join_condition, coverage_items, precautions, image_path, company)
VALUES
('삼성 펫러브', '삼성의 펫보험', 80, '20000~50000', 200,
 'cat', '생후 3개월~7세', '입원/수술/통원', '기왕증 제외', '/upload/ss.png', '삼성화재');
SET @P2 = LAST_INSERT_ID();

INSERT INTO insurance_product
(name, slogan, coverage_percent, monthly_fee_range, max_coverage,
 species, join_condition, coverage_items, precautions, image_path, company)
VALUES
('메리츠 펫안심', '반려에게 든든함을', 70, '13000~38000', 120,
 'all', '생후 2개월~8세', '입원/수술/통원/배상', '특약 확인 필요', '/upload/meritz.png', '메리츠');
SET @P3 = LAST_INSERT_ID();

-- =========================
-- 2) 보험 QnA (insurance_qna)
-- =========================
INSERT INTO insurance_qna (product_id, user_id, species, question, answer)
VALUES
(1, 39, '강아지', '슬개골 탈구 보장되나요?', '특약 가입 시 보장됩니다.');

INSERT INTO insurance_qna (product_id, user_id, species, question, answer)
VALUES
(2, 41, '고양이', '중성화 수술도 보장되나요?', NULL);

INSERT INTO insurance_qna (product_id, user_id, species, question, answer)
VALUES
(4, 42, '강아지', '피부병 재발도 보장 가능한가요?', '기왕증/재발은 약관에 따라 제외될 수 있어요.');

-- =========================
-- 3) 알바 공고 (parttime_job)
-- =========================
INSERT INTO parttime_job
(user_id, title, location, pay, start_date, end_date, pet_info, memo)
VALUES
(39, '강아지 산책(30분)', '서울 성북구', 10000, '2025-08-15', '2025-08-17', '말티즈 2살, 온순', '저녁 7시쯤 산책希望');
SET @J1 = LAST_INSERT_ID();

INSERT INTO parttime_job
(user_id, title, location, pay, start_date, end_date, pet_info, memo)
VALUES
(41, '앵무새 돌봄(20분)', '경기 안산시', 9000, '2025-08-20', '2025-08-20', '소형 앵무새 1마리', '사료/물 교체, 케이지 청소');
SET @J2 = LAST_INSERT_ID();

INSERT INTO parttime_job
(user_id, title, location, pay, start_date, end_date, pet_info, memo)
VALUES
(42, '고양이 방문 케어', '부산 수영구', 15000, '2025-08-25', '2025-08-27', '코숏 3살', '화장실 정리 및 간식 급여');
SET @J3 = LAST_INSERT_ID();

-- =========================
-- 4) 알바 지원자 (parttime_job_applicant)
-- =========================
INSERT INTO parttime_job_applicant (job_id, user_id, introduction, rating, review_count, email, phone)
VALUES
(4, 39, '강아지 산책 경험 다수', 4.8, 12, 'bob@example.com', '010-2222-3333');

INSERT INTO parttime_job_applicant (job_id, user_id, introduction, rating, review_count, email, phone)
VALUES
(5, 41, '소형견 케어 가능', 4.5, 7, 'charlie@example.com', '010-3333-4444');

INSERT INTO parttime_job_applicant (job_id, user_id, introduction, rating, review_count, email, phone)
VALUES
(6, 42, '조류 돌봄 경험 있어요', 4.9, 20, 'alice@example.com', '010-1111-2222');

-- =========================
-- 5) 알바 댓글 (parttime_job_comment)
-- =========================
INSERT INTO parttime_job_comment (job_id, user_id, writer, content)
VALUES
(4, 39, 'bob', '시간 협의 가능한가요?');

INSERT INTO parttime_job_comment (job_id, user_id, writer, content)
VALUES
(5, 41, 'charlie', '초보도 가능한가요?');

INSERT INTO parttime_job_comment (job_id, user_id, writer, content)
VALUES
(6, 42, 'alice', '위치 자세히 알려주실 수 있나요?');


SHOW CREATE TABLE users\G

SHOW CREATE TABLE parttime_job\G

-- 현재 스키마 확인
SELECT DATABASE();

-- users.user_id / parttime_job.user_id 타입 확인
SELECT TABLE_NAME, COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_KEY, EXTRA
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME IN ('users','parttime_job')
  AND COLUMN_NAME = 'user_id';

-- 스토리지 엔진(InnoDB 여부) 확인
SELECT TABLE_NAME, ENGINE
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME IN ('users','parttime_job');

  SELECT COUNT(*) AS cnt FROM users WHERE user_id = 123;

INSERT INTO users
(email, password, nickname, intro, phone, profile_img, provider, provider_id)
VALUES
('test@naver.com', '123456', '테스트', '소개', '010-1234-5678', 'profile.jpg', 'local', 'user123'),
('test2@naver.com', '123456', '테스토', '소개', '010-1234-5678', 'profile.jpg', 'local', 'user123'),
('test3@naver.com', '123456', '테스티', '소개', '010-1234-5678', 'profile.jpg', 'local', 'user123');