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



ALTER TABLE users ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' AFTER nickname;
ALTER TABLE users ADD COLUMN memo VARCHAR(255) NULL AFTER status;
ALTER TABLE users ADD COLUMN is_deleted TINYINT(1) NOT NULL DEFAULT 0 AFTER provider_id;
ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;


CREATE TABLE `user_auth` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `auth` varchar(100) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

ALTER TABLE user_auth
  DROP PRIMARY KEY,
  MODIFY user_id INT NOT NULL,  -- users.user_id와 타입 맞추기
  ADD CONSTRAINT fk_user_auth_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  ADD PRIMARY KEY (user_id, auth);  -- 1명당 여러 권한 가능, 중복 방지




CREATE TABLE user_auth (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  auth VARCHAR(50) NOT NULL,
  CONSTRAINT fk_user_auth FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

INSERT INTO user_auth (user_id, auth)
VALUES (12, 'ROLE_ADMIN');

ALTER TABLE users ADD COLUMN provider VARCHAR(20) DEFAULT NULL,
     ADD COLUMN provider_id VARCHAR(100) DEFAULT NULL;

