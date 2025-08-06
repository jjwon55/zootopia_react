package com.aloha.zootopia.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank; // Import @NotBlank
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HospitalForm {
    private Integer hospitalId;
    @NotBlank(message = "병원 이름은 필수입니다.")
    private String name;
    @NotBlank(message = "병원 주소는 필수입니다.")
    private String address;
    private String homepage;
    @NotBlank(message = "대표번호는 필수입니다.")
    private String phone;
    private String email;
    @NotBlank(message = "병원 소개는 필수입니다.")
    private String hospIntroduce; // 250708 추가
    private String thumbnailImageUrl; // 추가될 필드
    private List<Integer> specialtyIds;
    private List<Integer> animalIds;
    // getter/setter
}
