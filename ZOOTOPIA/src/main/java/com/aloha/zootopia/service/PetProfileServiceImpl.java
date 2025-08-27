package com.aloha.zootopia.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.aloha.zootopia.domain.PetProfile;
import com.aloha.zootopia.mapper.PetProfileMapper;

@Service
public class PetProfileServiceImpl implements PetProfileService {

    @Autowired
    private PetProfileMapper petProfileMapper;

    @Override
    public void registerPet(PetProfile pet) {
        petProfileMapper.insertPet(pet);
    }

    @Override
    public PetProfile getPet(Long petId) {
        return petProfileMapper.selectPetById(petId);
    }

    @Override
    public List<PetProfile> getPetsByUserId(Long userId) {
        return petProfileMapper.selectPetsByUserId(userId);
    }

    @Override
    public List<PetProfile> getPetsByJobId(Long jobId) {
        return petProfileMapper.selectPetsByJobId(jobId);
    }

    @Override
    public void linkPetsToJob(Long jobId, List<Long> petIds) {
        // 기존 매핑 삭제
        petProfileMapper.deleteJobPetMapping(jobId);
        // 새로 삽입
        for (Long petId : petIds) {
            petProfileMapper.insertJobPetMapping(jobId, petId);
        }
    }

    @Override
    public void deletePet(Long petId) {
        petProfileMapper.deletePet(petId);
    }
}