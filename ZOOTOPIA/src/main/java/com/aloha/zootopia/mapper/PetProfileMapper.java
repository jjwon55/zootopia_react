package com.aloha.zootopia.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.aloha.zootopia.domain.PetProfile;

@Mapper
public interface PetProfileMapper {
    void insertPet(PetProfile pet);
    PetProfile selectPetById(Long petId);
    List<PetProfile> selectPetsByUserId(Long userId);
    List<PetProfile> selectPetsByJobId(@Param("jobId") Long jobId);
    void insertJobPetMapping(@Param("jobId") Long jobId, @Param("petId") Long petId);
    void deleteJobPetMapping(Long jobId);
    void deletePet(Long petId);
}