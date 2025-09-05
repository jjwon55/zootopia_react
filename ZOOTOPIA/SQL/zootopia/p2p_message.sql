CREATE TABLE P2P_Message (
    `message_no`  BIGINT          NOT NULL AUTO_INCREMENT,
    `sender_id`   INT             NOT NULL,
    `receiver_id` INT             NOT NULL,
    `content`     TEXT            NOT NULL,
    `send_time`   DATETIME        DEFAULT CURRENT_TIMESTAMP,
    `is_read`     TINYINT         NOT NULL DEFAULT 0,
    PRIMARY KEY (`message_no`),
    CONSTRAINT `fk_message_sender` FOREIGN KEY (`sender_id`)   REFERENCES `users` (`user_id`),
    CONSTRAINT `fk_message_receiver` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`user_id`)
);


ALTER TABLE P2P_Message
ADD COLUMN deleted_by_sender TINYINT NOT NULL DEFAULT 0 AFTER is_read,
ADD COLUMN deleted_by_receiver TINYINT NOT NULL DEFAULT 0 AFTER deleted_by_sender;


-- 외래키 제약조건 수정 (ON DELETE CASCADE 추가)
-- 1. 기존 외래키 제약조건 삭제
-- 2. 새로운 외래키 제약조건 추가 (ON DELETE CASCADE 포함)
-- 회원 탈퇴에 영향이 있어서 일단 메시지까지 전체 삭제하는 방향으로 변경
ALTER TABLE p2p_message
  DROP FOREIGN KEY fk_message_sender; -- 기존 FK 이름 확인해서 사용
  
ALTER TABLE p2p_message
  DROP FOREIGN KEY fk_message_receiver; -- 기존 FK 이름 확인해서 사용

ALTER TABLE p2p_message
  ADD CONSTRAINT fk_message_sender
  FOREIGN KEY (sender_id) REFERENCES users(user_id)
  ON DELETE CASCADE;

ALTER TABLE p2p_message
  ADD CONSTRAINT fk_message_receiver
  FOREIGN KEY (receiver_id) REFERENCES users(user_id)
  ON DELETE CASCADE;





-- 더미데이터 

INSERT INTO `p2p_message` (`sender_id`, `receiver_id`, `content`, `send_time`, `is_read`)
VALUES
-- 12 -> 169
(12, 169, '안녕하세요, 잘 지내시나요?', NOW(), 0),
(12, 169, '혹시 내일 시간 되세요?', NOW(), 0),
(12, 169, '지난번에 말씀드린 자료 보셨나요?', NOW(), 0),
(12, 169, '오늘 저녁 약속 괜찮으세요?', NOW(), 0),
(12, 169, '메일 확인 부탁드려요.', NOW(), 0),
(12, 169, '새 프로젝트 관련 이야기 나눠요.', NOW(), 0),
(12, 169, '회의 시간 조금 늦춰도 될까요?', NOW(), 0),
(12, 169, '좋은 아침입니다!', NOW(), 0),
(12, 169, '주말은 잘 보내셨어요?', NOW(), 0),
(12, 169, '자료 업데이트했습니다.', NOW(), 0),
(12, 169, '이번 건은 어떻게 생각하세요?', NOW(), 0),
(12, 169, '커피 한 잔 하실래요?', NOW(), 0),
(12, 169, '다음주 일정 공유 부탁드립니다.', NOW(), 0),
(12, 169, '고맙습니다!', NOW(), 0),
(12, 169, '수정된 문서 다시 보냈습니다.', NOW(), 0),
(12, 169, '금요일 회의는 몇 시에 시작하나요?', NOW(), 0),
(12, 169, '그 문제는 해결됐나요?', NOW(), 0),
(12, 169, '저녁에 전화드리겠습니다.', NOW(), 0),
(12, 169, '파일 첨부했습니다.', NOW(), 0),
(12, 169, '확인 부탁드릴게요.', NOW(), 0),
-- 169 -> 12
(169, 12, '네, 잘 지내고 있어요!', NOW(), 0),
(169, 12, '내일 오후 3시는 괜찮습니다.', NOW(), 0),
(169, 12, '자료 확인했어요, 감사합니다.', NOW(), 0),
(169, 12, '저녁 약속 좋아요.', NOW(), 0),
(169, 12, '메일 확인했습니다.', NOW(), 0),
(169, 12, '새 프로젝트 기대되네요.', NOW(), 0),
(169, 12, '회의 시간 늦춰도 괜찮습니다.', NOW(), 0),
(169, 12, '좋은 아침이에요!', NOW(), 0),
(169, 12, '주말에 여행 다녀왔습니다.', NOW(), 0),
(169, 12, '업데이트 감사합니다.', NOW(), 0),
(169, 12, '이번 건은 동의합니다.', NOW(), 0),
(169, 12, '커피 좋습니다.', NOW(), 0),
(169, 12, '일정 정리해서 보내드리겠습니다.', NOW(), 0),
(169, 12, '저야말로 감사합니다.', NOW(), 0),
(169, 12, '수정된 문서 확인했습니다.', NOW(), 0),
(169, 12, '금요일 10시에 시작합니다.', NOW(), 0),
(169, 12, '문제는 해결됐습니다.', NOW(), 0),
(169, 12, '전화 기다리겠습니다.', NOW(), 0),
(169, 12, '파일 잘 받았습니다.', NOW(), 0),
(169, 12, '확인 완료했습니다.', NOW(), 0);





