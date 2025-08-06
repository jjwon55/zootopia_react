
CREATE TABLE `users` (
    `user_id` INT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `nickname` VARCHAR(50) NOT NULL,
    `intro` VARCHAR(255),
    `phone` VARCHAR(20),
    `profile_img` VARCHAR(255),
    `role` VARCHAR(20) NOT NULL, -- ROLE_USER, ROLE_ADMIN
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `hospital_info` (
    `hospital_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(64) NOT NULL,
    `address` VARCHAR(100) NOT NULL,
    `homepage` VARCHAR(128),
    `phone` VARCHAR(64) NOT NULL,
    `email` VARCHAR(64),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE `hospital_review` (
    `review_id` INT AUTO_INCREMENT PRIMARY KEY,
    `rating` INT CHECK (rating BETWEEN 1 AND 5),
    `content` TEXT NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `hospital_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    FOREIGN KEY (hospital_id) REFERENCES hospital_info(hospital_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
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
INSERT INTO specialty (category) VALUES ('내과'), ('외과'), ('치과'), ('안과'), ('영상의학과'), ('마취통증의학과'), ('중환자의학과');


ALTER TABLE users ADD COLUMN enabled TINYINT(1) DEFAULT 1;

SELECT r.review_id, r.user_id, u.nickname
FROM hospital_review r
LEFT JOIN users u ON r.user_id = u.user_id
WHERE r.review_id = 41