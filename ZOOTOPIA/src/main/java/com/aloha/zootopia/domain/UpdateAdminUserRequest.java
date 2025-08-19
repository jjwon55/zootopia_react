package com.aloha.zootopia.domain;

import lombok.*;

@Getter 
@Setter
@NoArgsConstructor 
@AllArgsConstructor
public class UpdateAdminUserRequest {
    private String nickname; 
    private String status;   
    private String memo;     
}
