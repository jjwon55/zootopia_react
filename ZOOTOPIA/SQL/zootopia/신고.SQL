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


SELECT COUNT(*) FROM user_report WHERE reported_user_id = 42;
SELECT * FROM user_report WHERE reported_user_id = 42 ORDER BY created_at DESC LIMIT 20;