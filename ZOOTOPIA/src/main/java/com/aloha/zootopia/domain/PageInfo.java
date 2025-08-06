package com.aloha.zootopia.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageInfo {
    private int pageNum;           // 현재 페이지
    private int pageSize;          // 한 페이지당 데이터 수
    private int total;             // 전체 데이터 개수
    private int pages;             // 전체 페이지 수

    private int startPage;         // 네비게이션 시작 페이지
    private int endPage;           // 네비게이션 끝 페이지

    private boolean hasPreviousPage; // 이전 페이지 존재 여부
    private boolean hasNextPage;     // 다음 페이지 존재 여부

    private boolean hasFirstPage;    // 맨앞으로 가기 버튼 표시 여부
    private boolean hasLastPage;     // 맨뒤로 가기 버튼 표시 여부

    // getter/setter 생략
}
