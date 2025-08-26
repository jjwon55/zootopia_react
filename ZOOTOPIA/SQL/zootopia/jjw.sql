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


CREATE TABLE `user_report` (
  `report_id` bigint NOT NULL AUTO_INCREMENT,
  `reported_user_id` int NOT NULL,
  `reporter_user_id` int NOT NULL,
  `reason_code` enum('SPAM','ABUSE','SEXUAL','ILLEGAL','OTHER') NOT NULL,
  `reason_text` varchar(500) DEFAULT NULL,
  `post_id` int DEFAULT NULL,
  `comment_id` int DEFAULT NULL,
  `lost_post_id` int DEFAULT NULL,
  `lost_comment_id` int DEFAULT NULL,
  `status` enum('PENDING','REVIEWED','REJECTED','ACTION_TAKEN') NOT NULL DEFAULT 'PENDING',
  `admin_note` varchar(500) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `reviewed_at` datetime DEFAULT NULL,
  PRIMARY KEY (`report_id`),
  KEY `idx_report_user_status_created` (`reported_user_id`,`status`,`created_at`),
  KEY `idx_report_reporter_created` (`reporter_user_id`,`created_at`),
  KEY `fk_report_posts` (`post_id`),
  KEY `fk_report_post_comments` (`comment_id`),
  KEY `fk_report_lost_posts` (`lost_post_id`),
  KEY `fk_report_lost_comments` (`lost_comment_id`),
  CONSTRAINT `fk_report_lost_comments` FOREIGN KEY (`lost_comment_id`) REFERENCES `lost_animal_comments` (`comment_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_report_lost_posts` FOREIGN KEY (`lost_post_id`) REFERENCES `lost_animals` (`post_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_report_post_comments` FOREIGN KEY (`comment_id`) REFERENCES `post_comments` (`comment_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_report_posts` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_report_users_reported` FOREIGN KEY (`reported_user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_report_users_reporter` FOREIGN KEY (`reporter_user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


CREATE TABLE `user_auth` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `auth` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_auth` (`email`),
  CONSTRAINT `fk_user_auth` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `posts` (
  `post_id` int NOT NULL AUTO_INCREMENT,
  `category` enum('자유글','질문글','자랑글') DEFAULT '자유글',
  `title` varchar(200) NOT NULL,
  `content` text NOT NULL,
  `view_count` int NOT NULL DEFAULT '0',
  `like_count` int NOT NULL DEFAULT '0',
  `comment_count` int NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_id` int DEFAULT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `hidden` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`post_id`),
  KEY `FK_users_TO_posts` (`user_id`),
  CONSTRAINT `FK_users_TO_posts` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=383 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


CREATE TABLE `post_report` (
  `report_id` bigint NOT NULL AUTO_INCREMENT,
  `post_id` int NOT NULL,
  `reporter_user_id` int NOT NULL,
  `reason_code` enum('SPAM','ABUSE','SEXUAL','ILLEGAL','OTHER') NOT NULL,
  `reason_text` varchar(500) DEFAULT NULL,
  `status` enum('PENDING','REVIEWED','REJECTED','ACTION_TAKEN') NOT NULL DEFAULT 'PENDING',
  `admin_note` varchar(500) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `reviewed_at` datetime DEFAULT NULL,
  PRIMARY KEY (`report_id`),
  UNIQUE KEY `UK_post_report_unique` (`post_id`,`reporter_user_id`),
  KEY `FK_post_report_users` (`reporter_user_id`),
  KEY `IDX_post_report_status` (`status`),
  KEY `IDX_post_report_post` (`post_id`),
  CONSTRAINT `FK_post_report_posts` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE,
  CONSTRAINT `FK_post_report_users` FOREIGN KEY (`reporter_user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci