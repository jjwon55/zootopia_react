package com.aloha.zootopia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HospReviewForm {
    private Integer rating;
    private String content;
    // getter/setter
}
