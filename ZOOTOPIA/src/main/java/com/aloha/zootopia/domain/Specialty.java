package com.aloha.zootopia.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Specialty {
    private Integer specialtyId;
    private String category;
    // getter/setter
}
