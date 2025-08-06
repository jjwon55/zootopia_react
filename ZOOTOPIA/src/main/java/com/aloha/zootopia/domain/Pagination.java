package com.aloha.zootopia.domain;

import lombok.Data;

/**
 * [페이지네이션]
 * ✅ 필수 정보
 * - 현재 페이지 번호       : page
 * - 페이지당 데이터 수     : size
 * - 노출할 페이지 수       : count
 * - 전체 데이터 수         : total
 * 
 * ⭐ 수식 정보
 * - 시작 페이지 번호       : start
 * - 끝 페이지 번호         : end
 * - 첫 페이지              : first
 * - 마지막 페이지          : last
 * - 이전 페이지            : prev
 * - 다음 페이지            : next
 * - OFFSET 값              : offset
 */

@Data
public class Pagination {
    // 기본값
    private static final long DEFAULT_PAGE = 1;
    private static final long DEFAULT_SIZE = 10;
    private static final long DEFAULT_COUNT = 10;

    // 필수 정보
    private long page = DEFAULT_PAGE;    // 현재 페이지
    private long size = DEFAULT_SIZE;    // 한 페이지에 보여줄 항목 수
    private long count = DEFAULT_COUNT;  // 화면에 보여줄 페이지 번호 수
    private long total;                  // 전체 항목 수

    // 수식 정보
    private long start;     // 시작 페이지 번호
    private long end;       // 끝 페이지 번호
    private long first;     // 첫 페이지
    private long last;      // 마지막 페이지
    private long prev;      // 이전 페이지
    private long next;      // 다음 페이지
    private int offset;     // OFFSET (limit 쿼리용)

    public long getLimit() {
        return size;
    }

    // 선택 필터 (예: category 필터 등)
    private String category;

    /* ====== 생성자 ====== */
    public Pagination() {}

    public Pagination(long total) {
        this(DEFAULT_PAGE, total);
    }

    public Pagination(long page, long total) {
        this(page, DEFAULT_SIZE, DEFAULT_COUNT, total);
    }

    public Pagination(long page, long size, long count, long total) {
        this.page = page;
        this.size = size;
        this.count = count;
        this.total = total;
        calc();
    }

    /* ====== 계산 메서드 ====== */
    public void calc() {
        this.first = 1;
        this.last = (total - 1) / size + 1;

        this.start = ((page - 1) / count) * count + 1;
        this.end = Math.min(start + count - 1, last);

        this.prev = page > 1 ? page - 1 : 1;
        this.next = page < last ? page + 1 : last;

        this.offset = (int)((page - 1) * size);
    }

    // 전체 데이터 수 변경 시 자동 재계산
    public void setTotal(long total) {
        this.total = total;
        calc();
    }
}
