-- 사용자
CREATE TABLE `users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `nickname` VARCHAR(50) NOT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  `memo` VARCHAR(255) DEFAULT NULL,
  `intro` VARCHAR(255) DEFAULT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `profile_img` VARCHAR(255) DEFAULT '/img/default-profile.png',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ENABLED` INT DEFAULT '1',
  `provider` VARCHAR(20) DEFAULT NULL,
  `provider_id` VARCHAR(100) DEFAULT NULL,
  `is_deleted` TINYINT(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uq_users_email` (`email`)
);

-- 사용자 신고
CREATE TABLE `user_report` (
  `report_id` INT AUTO_INCREMENT PRIMARY KEY,
  `reporter_id` INT NOT NULL,
  `reported_id` INT NOT NULL,
  `reason` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`reporter_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`reported_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
);

-- 사용자 인증
CREATE TABLE `user_auth` (
  `auth_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `provider` VARCHAR(50) NOT NULL,
  `provider_id` VARCHAR(100) NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
);

-- 반려동물 프로필 (별도 관리)
CREATE TABLE `pet_profile` (
  `pet_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `species` VARCHAR(50) NOT NULL,
  `breed` VARCHAR(50),
  `age` INT,
  `gender` VARCHAR(10),
  `neutered` BOOLEAN DEFAULT FALSE,
  `profile_img` VARCHAR(255),
  `personality` VARCHAR(255),
  `weight` DECIMAL(5,2),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
);

-- 게시글
CREATE TABLE `posts` (
  `post_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `post_type` VARCHAR(50),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `views` INT DEFAULT 0,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
);

-- 게시글 신고
CREATE TABLE `post_report` (
  `report_id` INT AUTO_INCREMENT PRIMARY KEY,
  `post_id` INT NOT NULL,
  `reporter_id` INT NOT NULL,
  `reason` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`post_id`) REFERENCES `posts`(`post_id`) ON DELETE CASCADE,
  FOREIGN KEY (`reporter_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
);

-- 태그
CREATE TABLE `tags` (
  `tag_id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE
);

-- 전문 분야
CREATE TABLE `specialty` (
  `specialty_id` INT AUTO_INCREMENT PRIMARY KEY,
  `category` VARCHAR(100) NOT NULL
);

-- 게시글-태그 관계
CREATE TABLE `post_tags` (
  `post_tag_id` INT AUTO_INCREMENT PRIMARY KEY,
  `post_id` INT NOT NULL,
  `tag_id` INT NOT NULL,
  FOREIGN KEY (`post_id`) REFERENCES `posts`(`post_id`) ON DELETE CASCADE,
  FOREIGN KEY (`tag_id`) REFERENCES `tags`(`tag_id`) ON DELETE CASCADE
);

-- 게시글 좋아요
CREATE TABLE `post_likes` (
  `like_id` INT AUTO_INCREMENT PRIMARY KEY,
  `post_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (`post_id`, `user_id`),
  FOREIGN KEY (`post_id`) REFERENCES `posts`(`post_id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
);

-- 게시글 댓글
CREATE TABLE `post_comments` (
  `comment_id` INT AUTO_INCREMENT PRIMARY KEY,
  `post_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `content` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`post_id`) REFERENCES `posts`(`post_id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
);

-- 가능 동물
CREATE TABLE `possible_animal` (
  `possible_id` INT AUTO_INCREMENT PRIMARY KEY,
  `specialty_id` INT NOT NULL,
  `animal` VARCHAR(50) NOT NULL,
  FOREIGN KEY (`specialty_id`) REFERENCES `specialty`(`specialty_id`) ON DELETE CASCADE
);

-- 알바 구인
CREATE TABLE `parttime_job` (
  `job_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `pay` VARCHAR(50) NOT NULL,
  `work_date` DATE NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
);

-- 알바 지원자
CREATE TABLE `parttime_job_applicant` (
  `applicant_id` INT AUTO_INCREMENT PRIMARY KEY,
  `job_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `status` VARCHAR(20) DEFAULT 'PENDING',
  `applied_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`job_id`) REFERENCES `parttime_job`(`job_id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
);

-- 알바 댓글
CREATE TABLE `parttime_job_comment` (
  `comment_id` INT AUTO_INCREMENT PRIMARY KEY,
  `job_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `content` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`job_id`) REFERENCES `parttime_job`(`job_id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
);

-- 유실동물
CREATE TABLE `lost_animals` (
  `lost_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `species` VARCHAR(50) NOT NULL,
  `breed` VARCHAR(50),
  `color` VARCHAR(50),
  `location` VARCHAR(255) NOT NULL,
  `lost_date` DATE NOT NULL,
  `description` TEXT,
  `image_url` VARCHAR(255),
  `status` VARCHAR(20) DEFAULT 'LOST',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
);

-- 유실동물 태그
CREATE TABLE `lost_animal_tags` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `lost_id` INT NOT NULL,
  `tag_id` INT NOT NULL,
  FOREIGN KEY (`lost_id`) REFERENCES `lost_animals`(`lost_id`) ON DELETE CASCADE,
  FOREIGN KEY (`tag_id`) REFERENCES `tags`(`tag_id`) ON DELETE CASCADE
);

-- 유실동물 댓글
CREATE TABLE `lost_animal_comments` (
  `comment_id` INT AUTO_INCREMENT PRIMARY KEY,
  `lost_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `content` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`lost_id`) REFERENCES `lost_animals`(`lost_id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
);

-- 보험 QnA
CREATE TABLE `insurance_qna` (
  `qna_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `question` TEXT NOT NULL,
  `answer` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `answered_at` TIMESTAMP NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
);

-- 보험 상품
CREATE TABLE `insurance_product` (
  `product_id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `coverage` TEXT,
  `premium` DECIMAL(10,2) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 병원 정보
CREATE TABLE `hospital_info` (
  `hospital_id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20),
  `opening_hours` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 병원-전문분야
CREATE TABLE `hospital_specialty` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `hospital_id` INT NOT NULL,
  `specialty_id` INT NOT NULL,
  FOREIGN KEY (`hospital_id`) REFERENCES `hospital_info`(`hospital_id`) ON DELETE CASCADE,
  FOREIGN KEY (`specialty_id`) REFERENCES `specialty`(`specialty_id`) ON DELETE CASCADE
);

-- 병원-진료동물
CREATE TABLE `hospital_animal` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `hospital_id` INT NOT NULL,
  `animal` VARCHAR(50) NOT NULL,
  FOREIGN KEY (`hospital_id`) REFERENCES `hospital_info`(`hospital_id`) ON DELETE CASCADE
);

-- 병원 리뷰
CREATE TABLE `hospital_review` (
  `review_id` INT AUTO_INCREMENT PRIMARY KEY,
  `hospital_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `rating` INT CHECK (`rating` BETWEEN 1 AND 5),
  `comment` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`hospital_id`) REFERENCES `hospital_info`(`hospital_id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
);

-- 쪽지
CREATE TABLE `p2p_message` (
  `message_id` INT AUTO_INCREMENT PRIMARY KEY,
  `sender_id` INT NOT NULL,
  `receiver_id` INT NOT NULL,
  `content` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`sender_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`receiver_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
);
