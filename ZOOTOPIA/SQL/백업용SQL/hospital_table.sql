
-- CREATE TABLE `users` (
--     `user_id` INT AUTO_INCREMENT PRIMARY KEY,
--     `email` VARCHAR(100) NOT NULL,
--     `password` VARCHAR(255) NOT NULL,
--     `nickname` VARCHAR(50) NOT NULL,
--     `intro` VARCHAR(255),
--     `phone` VARCHAR(20),
--     `profile_img` VARCHAR(255),
--     `role` VARCHAR(20) NOT NULL, -- ROLE_USER, ROLE_ADMIN
--     `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
-- );

CREATE TABLE `hospital_info` (
    `hospital_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(64) NOT NULL,
    `address` VARCHAR(100) NOT NULL,
    `homepage` VARCHAR(128),
    `phone` VARCHAR(64) NOT NULL,
    `email` VARCHAR(64),
    `hosp_introduce` TEXT NOT NULL,
    `thumbnail_image_url` VARCHAR(255), -- 추가될 컬럼
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
    


CREATE TABLE `hospital_review` (
  `review_id` int NOT NULL AUTO_INCREMENT,
  `rating` INT CHECK (rating BETWEEN 1 AND 5),
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `hospital_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`review_id`),
  KEY `hospital_id` (`hospital_id`),
  KEY `user_id` (`user_id`)
);

CREATE TABLE `possible_animal` (
    `animal_id` INT AUTO_INCREMENT PRIMARY KEY,
    `species` VARCHAR(50) NOT NULL
);

CREATE TABLE `hospital_animal` (
    `hospital_id` INT NOT NULL,
    `animal_id` INT NOT NULL,
    PRIMARY KEY (hospital_id, animal_id),
    FOREIGN KEY (hospital_id) REFERENCES hospital_info(hospital_id),
    FOREIGN KEY (animal_id) REFERENCES possible_animal(animal_id)
);

CREATE TABLE `specialty` (
  `specialty_id` INT AUTO_INCREMENT PRIMARY KEY,
  `category` VARCHAR(20) NOT NULL -- 한글 저장 (예: '내과')
);

CREATE TABLE `hospital_specialty` (
    `hospital_id` INT NOT NULL,
    `specialty_id` INT NOT NULL,
    PRIMARY KEY (hospital_id, specialty_id),
    FOREIGN KEY (hospital_id) REFERENCES hospital_info(hospital_id),
    FOREIGN KEY (specialty_id) REFERENCES specialty(specialty_id)
);

-- 예시 데이터 삽입
INSERT INTO possible_animal (species) VALUES ('포유류'), ('파충류'), ('조류'), ('양서류'), ('설치류');
INSERT INTO specialty (category) VALUES ('내과'), ('외과'), ('치과'), ('안과');



INSERT INTO hospital_review (rating, content, hospital_id, user_id)
VALUES
(5, '정말 친절했어요!', 1, 1),
(4, '대기시간이 조금 길었지만 괜찮았어요.', 2, 2),
(3, '그럭저럭...', 3, 3),
(5, '믿고 맡깁니다.', 4, 4),
(2, '불친절했어요.', 5, 5),
(4, '다음에 또 올게요.', 6, 6),
(5, '의사 선생님이 너무 좋아요!', 7, 7),
(3, '시설은 낡았지만 실력은 좋음.', 8, 8),
(1, '별로였어요...', 9, 9),
(5, '우리 강아지가 건강해졌어요!', 10, 1);




ALTER TABLE hospital_info
ADD COLUMN hosp_introduce TEXT NOT NULL;


ALTER TABLE hospital_review
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;