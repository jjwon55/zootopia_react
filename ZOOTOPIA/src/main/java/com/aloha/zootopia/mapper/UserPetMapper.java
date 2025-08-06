package com.aloha.zootopia.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.aloha.zootopia.domain.UserPet;

@Mapper
public interface UserPetMapper {
    UserPet selectByUserId(Long userId);
    int insertUserPet(UserPet pet);
    int updateUserPet(UserPet pet);
}
