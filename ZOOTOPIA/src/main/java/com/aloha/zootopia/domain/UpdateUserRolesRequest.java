package com.aloha.zootopia.domain;

import java.util.List;
import lombok.*;

@Getter 
@Setter 
@NoArgsConstructor 
@AllArgsConstructor
public class UpdateUserRolesRequest {
    private List<String> roles; // ["ROLE_USER","ROLE_MOD","ROLE_MANAGER","ROLE_ADMIN"]
}
