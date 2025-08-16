DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `user_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `nickname` VARCHAR(50) NOT NULL,
  `intro` VARCHAR(255) NULL,
  `phone` VARCHAR(20) NULL,
  `profile_img` VARCHAR(255) NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ENABLED` INT DEFAULT 1
) COMMENT='회원';

CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nickname` varchar(50) NOT NULL,
  `intro` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `profile_img` varchar(255) DEFAULT '/img/default-profile.png',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ENABLED` int DEFAULT '1',
  `provider` varchar(20) DEFAULT NULL,
  `provider_id` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='회원'



INSERT INTO users (user_id, email, password, nickname, intro, phone, profile_img, created_at) VALUES
(1, 'admin', '$2a$10$2XMPFzReUtpL32VoJznvmuD0n1eV5BNSczGb3oFGdDtd.6cqW5R5O', '관리자계정', '커뮤니티 관리 전담 운영자입니다.', '010-0000-0000', '/images/profile10.png', NOW());

ALTER TABLE users ADD COLUMN provider VARCHAR(20) DEFAULT NULL,
     ADD COLUMN provider_id VARCHAR(100) DEFAULT NULL;