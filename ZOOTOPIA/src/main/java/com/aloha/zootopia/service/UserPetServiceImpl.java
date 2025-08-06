package com.aloha.zootopia.service;

import org.springframework.stereotype.Service;

import com.aloha.zootopia.domain.UserPet;
import com.aloha.zootopia.mapper.UserPetMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserPetServiceImpl implements UserPetService {

    private final UserPetMapper userPetMapper;

    @Override
    public UserPet getByUserId(Long userId) {
        return userPetMapper.selectByUserId(userId);
    }

    @Override
    public boolean insert(UserPet pet) {
        return userPetMapper.insertUserPet(pet) > 0;
    }   

    @Override
    public boolean update(UserPet pet) {
        return userPetMapper.updateUserPet(pet) > 0;
    }


}
