-- 🚨 유저 신고 테이블
CREATE TABLE `user_report` (
  `report_id` BIGINT NOT NULL AUTO_INCREMENT,
  `reported_user_id` INT NOT NULL,     -- 신고당한 유저
  `reporter_user_id` INT NOT NULL,     -- 신고한 유저
  `reason_code` ENUM('SPAM','ABUSE','SEXUAL','ILLEGAL','OTHER') NOT NULL,
  `reason_text` VARCHAR(500) DEFAULT NULL,  -- 기타 사유
  -- ✅ 타겟: 아래 중 하나만 채워짐
  `post_id` INT DEFAULT NULL,                -- posts.post_id
  `comment_id` INT DEFAULT NULL,             -- post_comments.comment_id
  `lost_post_id` INT DEFAULT NULL,           -- lost_animals.post_id
  `lost_comment_id` INT DEFAULT NULL,        -- lost_animal_comments.comment_id
  `status` ENUM('PENDING','REVIEWED','REJECTED','ACTION_TAKEN') NOT NULL DEFAULT 'PENDING',
  `admin_note` VARCHAR(500) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `reviewed_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`report_id`),
  KEY `idx_report_user_status_created` (`reported_user_id`,`status`,`created_at`),
  KEY `idx_report_reporter_created` (`reporter_user_id`,`created_at`),
  CONSTRAINT `fk_report_users_reported` FOREIGN KEY (`reported_user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_report_users_reporter` FOREIGN KEY (`reporter_user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_report_posts` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_report_post_comments` FOREIGN KEY (`comment_id`) REFERENCES `post_comments` (`comment_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_report_lost_posts` FOREIGN KEY (`lost_post_id`) REFERENCES `lost_animals` (`post_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_report_lost_comments` FOREIGN KEY (`lost_comment_id`) REFERENCES `lost_animal_comments` (`comment_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nickname` varchar(50) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'ACTIVE',
  `memo` varchar(255) DEFAULT NULL,
  `intro` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `profile_img` varchar(255) DEFAULT '/img/default-profile.png',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ENABLED` int DEFAULT '1',
  `provider` varchar(20) DEFAULT NULL,
  `provider_id` varchar(100) DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uq_users_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='회원'



CREATE TABLE `user_auth` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `auth` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_auth` (`email`),
  CONSTRAINT `fk_user_auth` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci





-- workbench 에서 실행
CREATE TABLE `post_report` (
  `report_id` BIGINT NOT NULL AUTO_INCREMENT,
  `post_id` INT NOT NULL,                 -- 신고 대상 게시글
  `reporter_user_id` INT NOT NULL,        -- 신고자
  `reason_code` ENUM('SPAM','ABUSE','SEXUAL','ILLEGAL','OTHER') NOT NULL,
  `reason_text` VARCHAR(500) DEFAULT NULL, -- 상세 신고 내용
  `status` ENUM('PENDING','REVIEWED','REJECTED','ACTION_TAKEN') 
           NOT NULL DEFAULT 'PENDING',
  `admin_note` VARCHAR(500) DEFAULT NULL,  -- 관리자 메모
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `reviewed_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`report_id`),
  -- FK 연결
  CONSTRAINT `FK_post_report_posts` FOREIGN KEY (`post_id`) 
      REFERENCES `posts` (`post_id`) ON DELETE CASCADE,
  CONSTRAINT `FK_post_report_users` FOREIGN KEY (`reporter_user_id`) 
      REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  -- 동일 게시글 중복 신고 방지
  UNIQUE KEY `UK_post_report_unique` (`post_id`, `reporter_user_id`),
  -- 조회 최적화
  KEY `IDX_post_report_status` (`status`),
  KEY `IDX_post_report_post` (`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
