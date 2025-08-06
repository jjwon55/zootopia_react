-- posts (게시글) 테이블
DROP TABLE IF EXISTS `posts`;
CREATE Table `posts` (
    `no`            BIGINT          AUTO_INCREMENT PRIMARY KEY  COMMENT 'PK',
    `id`            VARCHAR(64)     UNIQUE                      COMMENT 'UK',
    `title`         VARCHAR(100)    NOT NULL                    COMMENT '제목',
    -- `writer`        VARCHAR(100)    NOT NULL                    COMMENT '작성자',
    `user_no`       BIGINT          NOT NULL                    COMMENT '회원번호(PK)',
    `content`       TEXT            NULL                        COMMENT '내용',
    `created_at`    TIMESTAMP       DEFAULT CURRENT_TIMESTAMP   COMMENT '등록일자',
    `updated_at`    TIMESTAMP       DEFAULT CURRENT_TIMESTAMP   
                                            ON UPDATE CURRENT_TIMESTAMP    
                                                                COMMENT '수정일자',
    FOREIGN KEY (user_no) REFERENCES `user`(no)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) COMMENT '게시글';

-- 샘플 데이터
TRUNCATE TABLE `posts`;

INSERT INTO `posts` ( id, title, user_no, content )
SELECT
    UUID() AS id,
    CONCAT('제목 ', LPAD(n, 4, '0')) AS title,
    ELT(FLOOR(1 + RAND() * 3), 1,2,3) AS user_no,
    CONCAT('내용 ', LPAD(n, 4, '0')) AS content
FROM
    (
        -- 1~1000 까지 
        WITH RECURSIVE seq AS (
            SELECT 1 AS n
            UNION ALL
            SELECT n + 1 FROM seq WHERE n < 1000
        )
        SELECT n FROM seq
    ) AS numbers
;

SELECT * FROM posts;