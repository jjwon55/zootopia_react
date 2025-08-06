package com.aloha.zootopia.service;

import com.aloha.zootopia.domain.UserPet;

public interface UserPetService {
    UserPet getByUserId(Long userId);
    boolean insert(UserPet pet);
    boolean update(UserPet pet);

}