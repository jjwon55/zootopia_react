CREATE TABLE `hospital_animal` (
    `hospital_id` int NOT NULL,
    `animal_id` int NOT NULL,
    PRIMARY KEY (`hospital_id`, `animal_id`),
    KEY `animal_id` (`animal_id`),
    CONSTRAINT `hospital_animal_ibfk_1` FOREIGN KEY (`hospital_id`) REFERENCES `hospital_info` (`hospital_id`),
    CONSTRAINT `hospital_animal_ibfk_2` FOREIGN KEY (`animal_id`) REFERENCES `possible_animal` (`animal_id`)
) 


CREATE TABLE `hospital_info` (
    `hospital_id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(64) NOT NULL,
    `address` varchar(100) NOT NULL,
    `homepage` varchar(128) DEFAULT NULL,
    `phone` varchar(64) NOT NULL,
    `email` varchar(64) DEFAULT NULL,
    `hosp_introduce` text NOT NULL,
    `thumbnail_image_url` varchar(255) DEFAULT NULL,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`hospital_id`)
)


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
    CONSTRAINT `hospital_review_ibfk_1` FOREIGN KEY (`hospital_id`) REFERENCES `hospital_info` (`hospital_id`),
    CONSTRAINT `hospital_review_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
    CONSTRAINT `hospital_review_chk_1` CHECK ((`rating` between 1 and 5))
)


CREATE TABLE `hospital_specialty` (
    `hospital_id` int NOT NULL,
    `specialty_id` int NOT NULL,
    PRIMARY KEY (`hospital_id`, `specialty_id`),
    KEY `specialty_id` (`specialty_id`),
    CONSTRAINT `hospital_specialty_ibfk_1` FOREIGN KEY (`hospital_id`) REFERENCES `hospital_info` (`hospital_id`),
    CONSTRAINT `hospital_specialty_ibfk_2` FOREIGN KEY (`specialty_id`) REFERENCES `specialty` (`specialty_id`)
)


CREATE TABLE `possible_animal` (
    `animal_id` int NOT NULL AUTO_INCREMENT,
    `species` varchar(50) NOT NULL,
    PRIMARY KEY (`animal_id`)
)


CREATE TABLE `specialty` (
    `specialty_id` int NOT NULL AUTO_INCREMENT,
    `category` varchar(20) NOT NULL,
    PRIMARY KEY (`specialty_id`)
)


-- =====================================================================


INSERT INTO possible_animal (species) VALUES ('포유류'), ('파충류'), ('조류'), ('양서류'), ('설치류');
INSERT INTO specialty (category) VALUES ('내과'), ('외과'), ('치과'), ('안과');

INSERT INTO hospital_info (name, address, homepage, phone, email, hosp_introduce, created_at) VALUES
('서울동물병원', '서울특별시 강남구 테헤란로 123', 'http://seoulvet.com', '02-1234-5678', 'info@seoulvet.com', '반려동물과 보호자의 행복한 삶을 위해 최선을 다합니다.', NOW()),
('해맑은동물의료원', '서울특별시 마포구 월드컵북로 25', 'http://haemalk.vet', '02-5678-1234', 'contact@haemalk.vet', '진심을 다한 진료로 반려동물의 건강을 책임집니다.', NOW()),
('하늘동물병원', '부산광역시 해운대구 센텀중앙로 55', 'http://skyvet.co.kr', '051-222-3344', 'sky@skyvet.co.kr', '24시간 진료 가능한 응급 전문 동물병원입니다.', NOW()),
('스마일펫동물병원', '대전광역시 서구 둔산대로 112', 'http://smilepet.kr', '042-345-6789', 'smile@smilepet.kr', '편안한 분위기에서 친절한 서비스를 제공합니다.', NOW()),
('웰케어동물병원', '광주광역시 북구 무등로 23', 'http://wellcare.vet', '062-987-6543', 'help@wellcare.vet', '노령견 케어와 재활 치료에 특화된 병원입니다.', NOW()),
('펫플러스동물병원', '인천광역시 연수구 송도과학로 27', 'http://petplus.kr', '032-111-2222', 'plus@petplus.kr', '국내 최고 수준의 장비와 의료진이 함께합니다.', NOW()),
('더나은동물병원', '울산광역시 남구 번영로 100', 'http://betternan.vet', '052-333-4444', 'info@betternan.vet', '고양이 전문 진료 서비스를 제공합니다.', NOW()),
('사랑이동물병원', '세종특별자치시 한누리대로 300', 'http://sarangi.vet', '044-555-6666', 'love@sarangi.vet', '청결한 환경과 체계적인 진료 시스템을 갖추었습니다.', NOW()),
('펫케어의료센터', '경기도 수원시 영통구 광교로 55', 'http://petcarecenter.kr', '031-777-8888', 'care@petcarecenter.kr', '소동물부터 특수동물까지 진료가 가능합니다.', NOW()),
('희망동물병원', '강원도 춘천시 중앙로 10', 'http://hopevet.kr', '033-112-3344', 'hope@hopevet.kr', '반려동물과 보호자의 입장을 먼저 생각합니다.', NOW()),
('참동물병원', '충청북도 청주시 상당구 상당로 42', 'http://chamvet.kr', '043-778-8899', 'cham@chamvet.kr', '수의사 모두가 반려동물 보호자이기에 공감합니다.', NOW()),
('올리브동물의료센터', '경상북도 구미시 산업로 140', 'http://olivevet.kr', '054-322-1111', 'olive@olivevet.kr', '반려동물을 위한 종합검진 프로그램 운영 중입니다.', NOW()),
('나비동물병원', '제주특별자치도 제주시 중앙로 250', 'http://navivet.jeju', '064-445-7788', 'nabi@navivet.jeju', '고양이 중심의 진료로 스트레스를 최소화합니다.', NOW()),
('플랜펫동물병원', '경기도 고양시 덕양구 행신로 33', 'http://planpet.kr', '031-543-9876', 'plan@planpet.kr', '반려동물의 삶의 질 향상을 도와드립니다.', NOW()),
('믿음동물병원', '충청남도 천안시 서북구 서부대로 99', 'http://trustvet.kr', '041-998-8877', 'trust@trustvet.kr', '정확하고 신속한 진단을 지향합니다.', NOW()),
('프렌즈동물병원', '전라북도 전주시 완산구 태평로 60', 'http://friendsvet.kr', '063-311-0000', 'friends@friendsvet.kr', '반려동물과 친구가 되어드리는 병원입니다.', NOW()),
('러브펫동물병원', '경상남도 창원시 성산구 중앙대로 25', 'http://lovepet.kr', '055-555-1234', 'love@lovepet.kr', '건강검진 및 예방접종 전문 병원입니다.', NOW()),
('휴동물병원', '서울특별시 은평구 통일로 500', 'http://huvet.kr', '02-4000-4000', 'hu@huvet.kr', '한의학과 양의학을 접목한 치료를 제공합니다.', NOW()),
('라온동물병원', '부산광역시 동래구 충렬대로 321', 'http://laonvet.kr', '051-1212-3434', 'laon@laonvet.kr', '정직한 진료와 투명한 진료비로 신뢰를 드립니다.', NOW()),
('펫조이동물병원', '대구광역시 수성구 달구벌대로 1010', 'http://petjoy.kr', '053-777-1234', 'joy@petjoy.kr', '반려동물과 함께하는 즐거운 진료실을 지향합니다.', NOW()),
('닥터펫동물병원', '경기도 용인시 기흥구 중부대로 50', 'http://drpet.kr', '031-234-5678', 'dr@drpet.kr', '정밀 진단 및 수술 전문 동물병원입니다.', NOW()),
('아이펫동물병원', '충청북도 충주시 중원대로 12', 'http://ipet.kr', '043-212-4343', 'ipet@ipet.kr', '다양한 건강관리 프로그램을 운영하고 있습니다.', NOW()),
('모던펫동물병원', '전라남도 목포시 백년대로 77', 'http://modernpet.kr', '061-234-8888', 'modern@modernpet.kr', '최신 장비를 통한 체계적인 진료 제공.', NOW()),
('휴먼펫동물병원', '강원도 강릉시 경강로 190', 'http://humanpet.kr', '033-123-9999', 'human@humanpet.kr', '사람과 동물 모두를 위한 따뜻한 진료.', NOW()),
('포레스트동물병원', '경상북도 포항시 북구 중앙로 75', 'http://forestvet.kr', '054-787-3434', 'forest@forestvet.kr', '자연친화적인 환경에서 진료를 받으세요.', NOW()),
('맘스펫동물병원', '충청남도 공주시 무령로 88', 'http://momspet.kr', '041-232-1112', 'moms@momspet.kr', '엄마의 마음으로 진료하는 병원입니다.', NOW()),
('골든펫동물병원', '제주특별자치도 서귀포시 일주동로 56', 'http://goldenpet.kr', '064-222-3333', 'golden@goldenpet.kr', '황금 같은 건강을 책임지는 병원입니다.', NOW()),
('펫하우스동물병원', '서울특별시 송파구 올림픽로 240', 'http://pethouse.kr', '02-9292-8888', 'house@pethouse.kr', '반려동물이 집처럼 편안한 병원입니다.', NOW()),
('비타동물병원', '경기도 성남시 분당구 판교로 70', 'http://vitavet.kr', '031-456-9999', 'vita@vitavet.kr', '건강을 위한 비타민 같은 진료.', NOW()),
('케어펫동물병원', '인천광역시 미추홀구 인주대로 456', 'http://carepet.kr', '032-678-1234', 'care@carepet.kr', '작은 생명도 소중하게 여깁니다.', NOW());




INSERT INTO hospital_animal (hospital_id, animal_id) VALUES (27, 2);
INSERT INTO hospital_animal (hospital_id, animal_id) VALUES (17, 5);
INSERT INTO hospital_animal (hospital_id, animal_id) VALUES (12, 1);
INSERT INTO hospital_animal (hospital_id, animal_id) VALUES (8, 5);
INSERT INTO hospital_animal (hospital_id, animal_id) VALUES (6, 2);
INSERT INTO hospital_animal (hospital_id, animal_id) VALUES (25, 4);
INSERT INTO hospital_animal (hospital_id, animal_id) VALUES (9, 2);
INSERT INTO hospital_animal (hospital_id, animal_id) VALUES (28, 5);
INSERT INTO hospital_animal (hospital_id, animal_id) VALUES (3, 3);
INSERT INTO hospital_animal (hospital_id, animal_id) VALUES (7, 1);
INSERT INTO hospital_animal (hospital_id, animal_id) VALUES (15, 1);
INSERT INTO hospital_animal (hospital_id, animal_id) VALUES (12, 3);
INSERT INTO hospital_animal (hospital_id, animal_id) VALUES (22, 5);
INSERT INTO hospital_animal (hospital_id, animal_id) VALUES (21, 1);
INSERT INTO hospital_animal (hospital_id, animal_id) VALUES (7, 3);
INSERT INTO hospital_animal (hospital_id, animal_id) VALUES (28, 3);
INSERT INTO hospital_animal (hospital_id, animal_id) VALUES (29, 1);
INSERT INTO hospital_animal (hospital_id, animal_id) VALUES (5, 2);
INSERT INTO hospital_animal (hospital_id, animal_id) VALUES (1, 3);
INSERT INTO hospital_animal (hospital_id, animal_id) VALUES (27, 4);
INSERT INTO hospital_animal (hospital_id, animal_id) VALUES (10, 1);
INSERT INTO hospital_animal (hospital_id, animal_id) VALUES (26, 1);

-- INSERT INTO possible_animal (species) VALUES ('포유류'), ('파충류'), ('조류'), ('양서류'), ('설치류');
-- INSERT INTO specialty (category) VALUES ('내과'), ('외과'), ('치과'), ('안과'), ('영상의학과'), ('마취통증의학과'), ('중환자의학과');



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


INSERT INTO hospital_review (rating, content, hospital_id, user_id)
VALUES
(5, '친절하고 빠르게 진료받았어요.', 1, 101),
(4, '의사 선생님 설명이 자세했어요.', 2, 102),
(3, '기본적인 진료만 했어요. 무난했습니다.', 3, 103),
(2, '대기 시간이 너무 길었어요.', 1, 104),
(5, '시설도 깨끗하고 만족스러웠습니다.', 4, 105),
(1, '진료도 불친절하고 다시는 안 갑니다.', 5, 106),
(4, '아이를 데리고 갔는데 잘 봐주셨어요.', 2, 107),
(3, '진료는 무난했지만 주차가 불편했어요.', 3, 108),
(5, '응급 상황에서 빠르게 대응해주셔서 감사합니다.', 1, 109),
(2, '접수 직원의 응대가 별로였어요.', 4, 110);


INSERT INTO hospital_info (name, address, homepage, phone, email)
VALUES
('서울동물병원', '서울시 강남구 1번지', 'http://seoulvet.com', '02-1111-1111', 'info@seoulvet.com'),
('행복펫병원', '부산시 해운대구 2번지', 'http://happyvet.co.kr', '051-2222-2222', 'contact@happyvet.co.kr'),
('러브펫동물병원', '대구시 달서구 3번지', NULL, '053-3333-3333', NULL),
('우리아이병원', '광주시 북구 4번지', NULL, '062-4444-4444', 'uri@ai.com'),
('굿모닝동물병원', '인천시 연수구 5번지', 'http://goodvet.com', '032-5555-5555', NULL),
('펫케어병원', '대전시 중구 6번지', NULL, '042-6666-6666', 'care@vet.com'),
('동물사랑병원', '울산시 남구 7번지', NULL, '052-7777-7777', 'love@animal.com'),
('스마일동물병원', '제주시 조천읍 8번지', 'http://smilevet.kr', '064-8888-8888', 'smile@vet.kr'),
('프렌즈동물병원', '수원시 장안구 9번지', NULL, '031-9999-9999', NULL),
('메디펫병원', '창원시 성산구 10번지', 'http://medipet.co.kr', '055-1010-1010', 'medipet@hospital.com');



INSERT INTO hospital_animal (hospital_id, animal_id)
VALUES
(1, 1), (1, 2), (1, 4),
(2, 1), (2, 3),
(3, 2), (5, 3),
(4, 1), (4, 4),
(5, 1), (5, 5),
(6, 3),
(7, 4), (7, 2),
(8, 1), (8, 3),
(9, 1),
(10, 1), (10, 5);


INSERT INTO hospital_specialty (hospital_id, specialty_id) VALUES
(1, 1),
(1, 2),
(2, 3),
(3, 1),
(4, 2),
(5, 4),
(6, 1),
(6, 3),
(7, 2),
(8, 4),
(9, 1),
(10, 3),
(11, 2),
(12, 4),
(13, 1),
(14, 3),
(15, 4),
(16, 2),
(17, 1),
(18, 4),
(19, 2),
(20, 3),
(21, 1),
(22, 4),
(23, 2),
(24, 3),
(25, 1),
(26, 2),
(27, 3),
(28, 4),
(29, 1),
(30, 2);




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