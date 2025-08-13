package com.aloha.zootopia.domain;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Hospital {
    private Integer hospitalId;
    private String name;
    private String address;
    private String homepage;
    private String phone;
    private String email;
    private String hospIntroduce; // 250708 추가
    private String thumbnailImageUrl; // 추가될 필드
    private List<Animal> animals;
    private List<Specialty> specialties;
    private Double avgRating;

    // 화면에 표시될 태그 정보 (DB에 안들어가도 되는 내용)
    private List<String> tags;
}

