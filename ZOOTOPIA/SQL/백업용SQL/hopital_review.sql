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
)