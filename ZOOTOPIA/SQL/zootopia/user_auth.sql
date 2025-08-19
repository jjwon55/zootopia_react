-- user_auth
CREATE TABLE `user_auth` (
      `user_id` bigint NOT NULL AUTO_INCREMENT         -- 권한번호
    , `email` VARCHAR(100) NOT NULL          -- 아이디
    , `auth` varchar(100) NOT NULL                 -- 권한 (ROLE_USER, ROLE_ADMIN, ...)
    , PRIMARY KEY(user_id)                      
);



CREATE TABLE `user_auth` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `auth` varchar(100) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci



CREATE TABLE `user_auth` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,       -- 내부 PK (auto increment)
  `email` VARCHAR(100) NOT NULL,             -- Users.email 참조 (로그인 기준)
  `auth` VARCHAR(100) NOT NULL,              -- 권한명 (예: ROLE_USER, ROLE_ADMIN)
  PRIMARY KEY (`id`),
  CONSTRAINT fk_user_auth FOREIGN KEY (`email`)
      REFERENCES `users`(`email`)
      ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


ALTER TABLE users ADD UNIQUE KEY uq_users_email (email)