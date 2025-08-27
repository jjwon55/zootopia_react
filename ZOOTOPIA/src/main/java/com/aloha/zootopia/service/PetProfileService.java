package com.aloha.zootopia.service;

import java.util.List;
import com.aloha.zootopia.domain.PetProfile;

public interface PetProfileService {

    // 펫 등록
    void registerPet(PetProfile pet);

    // 단일 펫 조회
    PetProfile getPet(Long petId);

    // 유저의 펫 리스트 조회
    List<PetProfile> getPetsByUserId(Long userId);

    // 공고에 매핑된 펫 리스트 조회
    List<PetProfile> getPetsByJobId(Long jobId);

    // 공고-펫 매핑 (기존 매핑 삭제 후 새로 등록)
    void linkPetsToJob(Long jobId, List<Long> petIds);

    // 펫 삭제
    void deletePet(Long petId);
}