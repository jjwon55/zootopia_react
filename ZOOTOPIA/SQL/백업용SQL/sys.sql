CREATE TABLE `lost_animal_videos` (
	`video_id`	INT	NULL,
	`video_url`	VARCHAR(255)	NOT NULL,
	`post_id`	INT	NULL
);

CREATE TABLE `hospital_specialty` (
	`PK`	int	NOT NULL,
	`specialty_id`	int	NOT NULL
);

CREATE TABLE `post_comments` (
	`comment_id`	INT	NULL,
	`content`	TEXT	NOT NULL,
	`created_at`	DATETIME	NULL,
	`updated_at`	DATETIME	NULL,
	`is_deleted`	BOOLEAN	NULL,
	`user_id`	INT	NULL,
	`post_id`	INT	NULL
);

CREATE TABLE `post_videos` (
	`video_id`	INT	NULL,
	`video_url`	VARCHAR(255)	NOT NULL,
	`post_id`	INT	NULL
);

CREATE TABLE `post_images` (
	`image_id`	INT	NULL,
	`image_url`	VARCHAR(255)	NOT NULL,
	`ordering`	INT	NULL,
	`post_id`	INT	NULL
);

CREATE TABLE `insurance_product` (
	`product_id`	INT	NULL,
	`name`	VARCHAR(100)	NOT NULL,
	`coverage_percent`	INT	NOT NULL,
	`monthly_fee_range`	VARCHAR(50)	NULL,
	`max_coverage`	INT	NULL,
	`species`	ENUM('dog', 'cat', 'all')	NULL	DEFAULT 'all',
	`join_condition`	TEXT	NULL,
	`coverage_items`	TEXT	NULL,
	`precautions`	TEXT	NULL,
	`description`	TEXT	NULL,
	`created_at`	DATETIME	NULL
);

CREATE TABLE `specialty` (
	`specialty_id`	int	NOT NULL,
	`category`	ENUM('INTERNAL', 'SURGICAL', 'DIAGNOSTIC', 'PREVENTIVE', 'SPECIALIZED')	NOT NULL
);

CREATE TABLE `parttime_job` (
	`job_id`	INT	NULL,
	`title`	VARCHAR(100)	NOT NULL,
	`location`	VARCHAR(100)	NOT NULL,
	`pay`	INT	NOT NULL,
	`work_date`	DATETIME	NOT NULL,
	`owner_id`	VARCHAR(50)	NOT NULL,
	`pet_info`	VARCHAR(100)	NULL,
	`memo`	TEXT	NULL,
	`created_at`	DATETIME	NULL
);

CREATE TABLE `user_pets` (
	`pet_id`	INT	NULL,
	`name`	VARCHAR(50)	NOT NULL,
	`species`	VARCHAR(100)	NOT NULL,
	`breed`	VARCHAR(100)	NULL,
	`birth_date`	DATE	NULL,
	`created_at`	DATETIME	NULL,
	`user_id`	INT	NULL
);

CREATE TABLE `parttime_job_applicant` (
	`applicant_id`	INT	NULL,
	`job_id`	INT	NOT NULL,
	`user_id`	VARCHAR(50)	NOT NULL,
	`rating`	FLOAT	NULL,
	`review_count`	INT	NULL,
	`introduction`	TEXT	NULL,
	`created_at`	DATETIME	NULL
);

CREATE TABLE `post_likes` (
	`like_id`	INT	NULL,
	`created_at`	DATETIME	NULL,
	`UNIQUE(post_id,`	user_id)	NULL,
	`post_id`	INT	NULL,
	`user_id`	INT	NULL
);

CREATE TABLE `parttime_job_comment` (
	`comment_id`	INT	NULL,
	`job_id`	INT	NOT NULL,
	`user_id`	VARCHAR(50)	NOT NULL,
	`content`	TEXT	NOT NULL,
	`created_at`	DATETIME	NULL
);

CREATE TABLE `lost_animals` (
	`post_id`	INT	NULL,
	`title`	VARCHAR(200)	NOT NULL,
	`description`	TEXT	NULL,
	`lost_location`	VARCHAR(255)	NULL,
	`lost_time`	DATETIME	NULL,
	`contact_phone`	VARCHAR(30)	NULL,
	`view_count`	INT	NULL,
	`like_count`	INT	NULL,
	`comment_count`	INT	NULL,
	`created_at`	DATETIME	NULL,
	`updated_at`	DATETIME	NULL,
	`is_deleted`	BOOLEAN	NULL,
	`user_id`	INT	NULL
);

CREATE TABLE `possible_animal` (
	`PK`	int	NOT NULL,
	`species`	ENUM('MAMMAL, BIRD, REPTILE, AMPHIBIAN, ARTHROPOD, FISH')	NULL
);

CREATE TABLE `posts` (
	`post_id`	INT	NULL,
	`category`	ENUM('자유글', '질문글', '자랑글')	NULL	DEFAULT '자유글',
	`title`	VARCHAR(200)	NOT NULL,
	`content`	TEXT	NOT NULL,
	`view_count`	INT	NULL,
	`like_count`	INT	NULL,
	`comment_count`	INT	NULL,
	`is_deleted`	BOOLEAN	NULL,
	`created_at`	DATETIME	NULL,
	`updated_at`	DATETIME	NULL,
	`user_id`	INT	NULL
);

CREATE TABLE `hopital_animal` (
	`PK2`	int	NOT NULL,
	`PK`	int	NOT NULL
);

CREATE TABLE `lost_animal_images` (
	`image_id`	INT	NULL,
	`image_url`	VARCHAR(255)	NOT NULL,
	`ordering`	INT	NULL,
	`post_id`	INT	NULL
);

CREATE TABLE `users` (
	`user_id`	INT	NULL,
	`email`	VARCHAR(100)	NOT NULL,
	`password`	VARCHAR(255)	NOT NULL,
	`nickname`	VARCHAR(50)	NOT NULL,
	`intro`	VARCHAR(255)	NULL,
	`phone`	VARCHAR(20)	NULL,
	`profile_img`	VARCHAR(255)	NULL,
	`created_at`	DATETIME	NULL
);

CREATE TABLE `insurance_qna` (
	`qna_id`	INT	NULL,
	`product_id`	INT	NULL,
	`question`	TEXT	NOT NULL,
	`answer`	TEXT	NULL,
	`created_at`	DATETIME	NULL
);

CREATE TABLE `hospital_info` (
	`PK`	int	NOT NULL,
	`name`	varchar(64)	NULL,
	`address`	varchar(100)	NULL,
	`homepage`	varchar(64)	NULL,
	`phone`	varchar(64)	NULL,
	`email`	varchar(64)	NULL,
	`created_at`	timestamp	NULL
);

