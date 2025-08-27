-- 🐾 알바 공고 테이블 (parttime_job)
CREATE TABLE parttime_job (
    job_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NOT NULL,
    title       VARCHAR(200) NOT NULL,
    location    VARCHAR(100) NOT NULL,
    pay         INT NOT NULL,
    start_date  DATE NOT NULL,
    end_date    DATE NOT NULL,
    memo        TEXT,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_job_user FOREIGN KEY (user_id)
        REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_job_created (created_at),
    INDEX idx_job_location (location),
    INDEX idx_job_pay (pay),
    INDEX idx_job_start (start_date),
    INDEX idx_job_end (end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 🙋 알바 지원자 테이블 (parttime_job_applicant)
CREATE TABLE parttime_job_applicant (
    applicant_id  INT AUTO_INCREMENT PRIMARY KEY,
    job_id        BIGINT NOT NULL,
    user_id       INT NOT NULL,
    introduction  TEXT,
    rating        DECIMAL(2,1) DEFAULT 0.0,
    review_count  INT DEFAULT 0,
    email         VARCHAR(100),
    phone         VARCHAR(30),
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_appl_job FOREIGN KEY (job_id)
        REFERENCES parttime_job(job_id) ON DELETE CASCADE,
    CONSTRAINT fk_appl_user FOREIGN KEY (user_id)
        REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY uq_appl_job_user (job_id, user_id),
    INDEX idx_appl_job_created (job_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- 💬 알바 댓글 테이블 (parttime_job_comment)
CREATE TABLE parttime_job_comment (
    comment_id  BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_id      BIGINT,
    user_id     INT,
    writer      VARCHAR(100) NOT NULL,
    content     TEXT NOT NULL,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cmt_job FOREIGN KEY (job_id)
        REFERENCES parttime_job(job_id) ON DELETE CASCADE,
    CONSTRAINT fk_cmt_user FOREIGN KEY (user_id)
        REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_cmt_job (job_id, created_at),
    INDEX idx_cmt_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 🐕 펫 프로필 테이블 (pet_profile)
CREATE TABLE pet_profile (
    pet_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NOT NULL,             -- 보호자
    name        VARCHAR(100) NOT NULL,
    species     VARCHAR(50),              -- 강아지, 고양이 등
    breed       VARCHAR(50),              -- 품종
    age         INT,
    gender      VARCHAR(10),
    description TEXT,
    photo_url   VARCHAR(255),
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pet_user FOREIGN KEY (user_id)
        REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_pet_user (user_id),
    INDEX idx_pet_species (species)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 📎 공고-펫 매핑 테이블 (job_pet) – N:M 관계
CREATE TABLE job_pet (
    job_id BIGINT NOT NULL,
    pet_id BIGINT NOT NULL,
    PRIMARY KEY (job_id, pet_id),
    CONSTRAINT fk_jobpet_job FOREIGN KEY (job_id)
        REFERENCES parttime_job(job_id) ON DELETE CASCADE,
    CONSTRAINT fk_jobpet_pet FOREIGN KEY (pet_id)
        REFERENCES pet_profile(pet_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;