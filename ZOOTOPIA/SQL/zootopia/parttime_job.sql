DROP TABLE IF EXISTS `parttime_job`;

CREATE TABLE parttime_job (
job_id BIGINT AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(100) NOT NULL,
location VARCHAR(100) NOT NULL,
pay INT NOT NULL,
start_date DATE NOT NULL,
end_date DATE NOT NULL,
user_id INT NOT NULL,           -- 보호자(등록자)의 user_id
pet_info VARCHAR(100),
memo TEXT NOT NULL,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users(user_id)
ON DELETE CASCADE
);

DROP TABLE IF EXISTS `parttime_job_applicant`;

CREATE TABLE parttime_job_applicant (
applicant_id INT AUTO_INCREMENT PRIMARY KEY,
job_id BIGINT NOT NULL,
user_id INT NOT NULL,           -- 지원자 user_id
rating FLOAT DEFAULT 0,
review_count INT DEFAULT 0,
introduction TEXT,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (job_id) REFERENCES parttime_job(job_id)
ON DELETE CASCADE,
FOREIGN KEY (user_id) REFERENCES users(user_id)
ON DELETE CASCADE
);

DROP TABLE IF EXISTS `parttime_job_comment`;

CREATE TABLE parttime_job_comment (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,  -- 로그인 사용자용 (nullable)
    writer VARCHAR(100) NOT NULL,  -- 비로그인 사용자용 닉네임
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);


INSERT INTO `parttime_job` 
(`title`, `location`, `pay`, `start_date`, `end_date`, `user_id`, `pet_info`, `memo`, `created_at`) 
VALUES
('강아지 산책 도우미', '서울 강남구', 15000, '2025-08-01', '2025-08-31', 12, '소형견, 말티즈', '매일 오후 4시 산책 필요', NOW()),
('주말 고양이 돌봄', '부산 해운대구', 20000, '2025-08-03', '2025-08-04', 12, '고양이 2마리', '사료 급여 및 놀아주기', NOW()),
('애견 호텔 청소 알바', '인천 남동구', 13000, '2025-08-05', '2025-08-20', 12, NULL, '애견호텔 청소 및 사료 보충 업무', NOW()),
('고양이 약 먹이기', '서울 마포구', 18000, '2025-08-10', '2025-08-15', 12, '노령묘 1마리', '약 복용 도와줄 분 구합니다', NOW()),
('반려동물 사진 촬영 도우미', '경기도 성남시', 17000, '2025-08-12', '2025-08-12', 12, '대형견, 진돗개', '사진 촬영 시 보조 및 유도', NOW()),
('강아지 미용 보조', '대전 서구', 16000, '2025-08-20', '2025-08-25', 12, '중형견', '미용 보조 및 털 정리 업무', NOW()),
('애견 유치원 도우미', '광주 북구', 14000, '2025-08-01', '2025-08-31', 12, NULL, '유치원 내 반려견 케어 보조', NOW()),
('고양이 집 청소 도우미', '서울 종로구', 15000, '2025-08-05', '2025-08-10', 12, '고양이 털 많이 빠짐', '고양이 방 청소 집중', NOW()),
('강아지 산책 및 목욕', '경기도 고양시', 19000, '2025-08-18', '2025-08-20', 12, '시츄', '산책 후 목욕 도와주실 분', NOW()),
('반려동물 장례식 보조', '서울 강서구', 20000, '2025-08-28', '2025-08-28', 12, NULL, '조용하고 정중한 분위기 유지 필수', NOW());


