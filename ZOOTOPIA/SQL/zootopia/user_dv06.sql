-- 사용자 계정 생성 스크립트 (dv06@gmail.com / 123456)
-- 실행 대상 DB: aloha (application.properties 설정 기준)

-- 비밀번호는 BCrypt 해시로 저장됨: '123456'
-- 해시 알고리즘: $2b$10 (BCrypt 10 라운드)

INSERT INTO users (email, password, nickname, enabled)
VALUES ('dv06@gmail.com', '$2b$10$d4eB8hQStuDGqYtJlL50CeVKbkPJ1tgUcB/OE/v2xy2T5A7EjIKum', 'dv06', 1)
ON DUPLICATE KEY UPDATE
  password = VALUES(password),
  nickname = VALUES(nickname),
  enabled = VALUES(enabled);

INSERT INTO user_auth (email, auth)
VALUES ('dv06@gmail.com', 'ROLE_USER')
ON DUPLICATE KEY UPDATE
  auth = VALUES(auth);
