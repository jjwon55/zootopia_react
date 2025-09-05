-- Active: 1750388003714@@127.0.0.1@3306@thejoeun
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

CREATE TABLE `user_pets` (
  `pet_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `species` varchar(100) DEFAULT NULL,
  `breed` varchar(100) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`pet_id`),
  KEY `FK_users_TO_user_pets` (`user_id`),
  CONSTRAINT `FK_users_TO_user_pets` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `tags` (
  `tag_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`tag_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='태그 목록'

CREATE TABLE `specialty` (
  `specialty_id` int NOT NULL AUTO_INCREMENT,
  `category` varchar(20) NOT NULL,
  PRIMARY KEY (`specialty_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `post_tags` (
  `post_id` int NOT NULL,
  `tag_id` int NOT NULL,
  PRIMARY KEY (`post_id`,`tag_id`),
  KEY `tag_id` (`tag_id`),
  CONSTRAINT `post_tags_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE,
  CONSTRAINT `post_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`tag_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='게시글-태그 연결'


CREATE TABLE `post_likes` (
  `like_id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  `post_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`like_id`),
  UNIQUE KEY `post_id` (`post_id`,`user_id`),
  UNIQUE KEY `uk_post_user` (`post_id`,`user_id`),
  UNIQUE KEY `uq_post_likes_post_user` (`post_id`,`user_id`),
  KEY `FK_users_TO_post_likes` (`user_id`),
  CONSTRAINT `FK_posts_TO_post_likes` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE,
  CONSTRAINT `FK_users_TO_post_likes` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


CREATE TABLE `post_comments` (
  `comment_id` int NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) DEFAULT '0',
  `user_id` int DEFAULT NULL,
  `post_id` int DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  PRIMARY KEY (`comment_id`),
  KEY `FK_users_TO_post_comments` (`user_id`),
  KEY `FK_posts_TO_post_comments` (`post_id`),
  CONSTRAINT `FK_posts_TO_post_comments` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE,
  CONSTRAINT `FK_users_TO_post_comments` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=196 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


CREATE TABLE `possible_animal` (
  `animal_id` int NOT NULL AUTO_INCREMENT,
  `species` varchar(50) NOT NULL,
  PRIMARY KEY (`animal_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `parttime_job_comment` (
  `comment_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `writer` varchar(100) NOT NULL,
  `content` text NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`comment_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `parttime_job_comment_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


CREATE TABLE `parttime_job_applicant` (
  `applicant_id` int NOT NULL AUTO_INCREMENT,
  `job_id` bigint NOT NULL,
  `user_id` int NOT NULL,
  `rating` float DEFAULT '0',
  `review_count` int DEFAULT '0',
  `introduction` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`applicant_id`),
  KEY `job_id` (`job_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `parttime_job_applicant_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `parttime_job` (`job_id`) ON DELETE CASCADE,
  CONSTRAINT `parttime_job_applicant_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


CREATE TABLE `parttime_job` (
  `job_id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `location` varchar(100) NOT NULL,
  `pay` int NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `user_id` int NOT NULL,
  `pet_info` varchar(100) DEFAULT NULL,
  `memo` text NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`job_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `parttime_job_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


CREATE TABLE `lost_animals` (
  `post_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `content` text NOT NULL,
  `lost_location` varchar(255) DEFAULT NULL,
  `lost_time` datetime DEFAULT NULL,
  `contact_phone` varchar(30) DEFAULT NULL,
  `view_count` int DEFAULT '0',
  `like_count` int DEFAULT '0',
  `comment_count` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_id` int DEFAULT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`post_id`),
  KEY `FK_users_TO_lost_animals` (`user_id`),
  CONSTRAINT `FK_users_TO_lost_animals` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=142 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


CREATE TABLE `lost_animal_tags` (
  `post_id` int NOT NULL,
  `tag_id` int NOT NULL,
  PRIMARY KEY (`post_id`,`tag_id`),
  KEY `tag_id` (`tag_id`),
  CONSTRAINT `lost_animal_tags_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `lost_animals` (`post_id`) ON DELETE CASCADE,
  CONSTRAINT `lost_animal_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`tag_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='유실동물 게시글-태그 연결'


CREATE TABLE `lost_animal_comments` (
  `comment_id` int NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) DEFAULT '0',
  `user_id` int DEFAULT NULL,
  `post_id` int DEFAULT NULL,
  `secret` tinyint(1) DEFAULT '0',
  `parent_id` int DEFAULT NULL,
  PRIMARY KEY (`comment_id`),
  KEY `FK_users_TO_lost_animal_comments` (`user_id`),
  KEY `FK_lost_post_TO_lost_animal_comments` (`post_id`),
  CONSTRAINT `FK_lost_post_TO_lost_animal_comments` FOREIGN KEY (`post_id`) REFERENCES `lost_animals` (`post_id`) ON DELETE CASCADE,
  CONSTRAINT `FK_users_TO_lost_animal_comments` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='유실동물 게시판 댓글'


CREATE TABLE `insurance_qna` (
  `qna_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `species` varchar(20) DEFAULT NULL,
  `question` text NOT NULL,
  `answer` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`qna_id`),
  KEY `product_id` (`product_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `insurance_qna_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `insurance_product` (`product_id`) ON DELETE CASCADE,
  CONSTRAINT `insurance_qna_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


CREATE TABLE `insurance_product` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slogan` varchar(255) DEFAULT NULL,
  `coverage_percent` int NOT NULL,
  `monthly_fee_range` varchar(50) DEFAULT NULL,
  `max_coverage` int DEFAULT NULL,
  `species` enum('dog','cat','all') DEFAULT 'all',
  `join_condition` text,
  `coverage_items` text,
  `precautions` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `image_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


CREATE TABLE `hospital_specialty` (
  `hospital_id` int NOT NULL,
  `specialty_id` int NOT NULL,
  PRIMARY KEY (`hospital_id`,`specialty_id`),
  KEY `specialty_id` (`specialty_id`),
  CONSTRAINT `hospital_specialty_ibfk_1` FOREIGN KEY (`hospital_id`) REFERENCES `hospital_info` (`hospital_id`),
  CONSTRAINT `hospital_specialty_ibfk_2` FOREIGN KEY (`specialty_id`) REFERENCES `specialty` (`specialty_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


CREATE TABLE `hospital_review` (
  `review_id` int NOT NULL AUTO_INCREMENT,
  `rating` int DEFAULT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `hospital_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`review_id`),
  KEY `hospital_id` (`hospital_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `hospital_review_ibfk_1` FOREIGN KEY (`hospital_id`) REFERENCES `hospital_info` (`hospital_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `hospital_review_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `hospital_review_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


CREATE TABLE `hospital_info` (
  `hospital_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `address` varchar(100) NOT NULL,
  `homepage` varchar(128) DEFAULT NULL,
  `phone` varchar(64) NOT NULL,
  `email` varchar(64) DEFAULT NULL,
  `hosp_introduce` text NOT NULL,
  `thumbnail_image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`hospital_id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


CREATE TABLE `hospital_animal` (
  `hospital_id` int NOT NULL,
  `animal_id` int NOT NULL,
  PRIMARY KEY (`hospital_id`,`animal_id`),
  KEY `animal_id` (`animal_id`),
  CONSTRAINT `hospital_animal_ibfk_1` FOREIGN KEY (`hospital_id`) REFERENCES `hospital_info` (`hospital_id`),
  CONSTRAINT `hospital_animal_ibfk_2` FOREIGN KEY (`animal_id`) REFERENCES `possible_animal` (`animal_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


CREATE TABLE `p2p_message` (
  `message_no` bigint NOT NULL AUTO_INCREMENT,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `content` text NOT NULL,
  `send_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_read` tinyint NOT NULL DEFAULT '0',
  `deleted_by_sender` tinyint NOT NULL DEFAULT '0',
  `deleted_by_receiver` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`message_no`),
  KEY `fk_message_sender` (`sender_id`),
  KEY `fk_message_receiver` (`receiver_id`),
  CONSTRAINT `fk_message_receiver` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `fk_message_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=112 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci



CREATE TABLE `p2p_message` (
  `message_no` bigint NOT NULL AUTO_INCREMENT,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `content` text NOT NULL,
  `send_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_read` tinyint NOT NULL DEFAULT '0',
  `deleted_by_sender` tinyint NOT NULL DEFAULT '0',
  `deleted_by_receiver` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`message_no`),
  KEY `fk_message_sender` (`sender_id`),
  KEY `fk_message_receiver` (`receiver_id`),
  CONSTRAINT `fk_message_receiver` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_message_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=119 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci