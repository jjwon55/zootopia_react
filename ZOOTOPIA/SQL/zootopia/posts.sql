
DROP TABLE IF EXISTS `posts`;
CREATE TABLE posts (
  post_id INT AUTO_INCREMENT PRIMARY KEY,
  category ENUM('자유글', '질문글', '자랑글') DEFAULT '자유글',
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  view_count INT DEFAULT 0,
  like_count INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  created_at DATETIME DEFAULT NOW(),
  updated_at DATETIME DEFAULT NOW() ON UPDATE NOW(),
  user_id INT,
  thumbnail_url VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

DROP TABLE IF EXISTS `lost_animals`;
CREATE TABLE lost_animals (
  post_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  lost_location VARCHAR(255),
  lost_time DATETIME,
  contact_phone VARCHAR(30),
  view_count INT DEFAULT 0,
  like_count INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  user_id INT DEFAULT NULL,
  thumbnail_url VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

DROP TABLE IF EXISTS `post_comments`;
CREATE TABLE post_comments (
  comment_id INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT NOW(),
  updated_at DATETIME DEFAULT NOW() ON UPDATE NOW(),
  is_deleted BOOLEAN DEFAULT FALSE,
  user_id INT,
  post_id INT,
  parent_id INT,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `lost_animal_comments`;
CREATE TABLE lost_animal_comments (
  comment_id INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT(1) DEFAULT 0,
  user_id INT,
  post_id INT,
  secret TINYINT(1) DEFAULT 0,
  parent_id INT,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (post_id) REFERENCES lost_animals(post_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `post_likes`;
CREATE TABLE post_likes (
  like_id INT AUTO_INCREMENT PRIMARY KEY,
  created_at DATETIME NULL,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  UNIQUE (post_id, user_id),
  FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

DROP TABLE IF EXISTS `tags`;
CREATE TABLE tags (
  tag_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

DROP TABLE IF EXISTS `post_tags`;
CREATE TABLE post_tags (
  post_id INT,
  tag_id INT,
  PRIMARY KEY (post_id, tag_id),
  FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(tag_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `lost_animal_tags`;
CREATE TABLE lost_animal_tags (
  post_id INT,
  tag_id INT,
  PRIMARY KEY (post_id, tag_id),
  FOREIGN KEY (post_id) REFERENCES lost_animals(post_id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(tag_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `user_pets`;
CREATE TABLE user_pets (
  pet_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50),
  species VARCHAR(100),
  breed VARCHAR(100),
  birth_date DATE,
  created_at DATETIME DEFAULT NOW(),
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);






