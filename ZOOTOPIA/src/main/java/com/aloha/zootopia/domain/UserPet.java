package com.aloha.zootopia.domain;

import java.time.LocalDate;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPet {
    private int petId;           
    private String name;          
    private String species;   
    private String breed;        
    private LocalDate birthDate; 
    private Date createdAt;      
    private Long userId;         
}
