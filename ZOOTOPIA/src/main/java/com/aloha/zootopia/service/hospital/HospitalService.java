package com.aloha.zootopia.service.hospital;

import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.aloha.zootopia.domain.Animal;
import com.aloha.zootopia.domain.Hospital;
import com.aloha.zootopia.domain.Specialty;
import com.aloha.zootopia.dto.HospitalForm;

public interface HospitalService {
    List<Hospital> getHospitals(List<Integer> animalIds);
    void createHospital(HospitalForm form, MultipartFile thumbnailImageFile) throws Exception;
    List<Animal> getAllAnimals();
    List<Specialty> getAllSpecialties();
    List<Hospital> getHospitalList(List<Integer> animalIds, List<Integer> specialtyIds, int pageNum, int pageSize);
    int getHospitalCount(List<Integer> animalIds, List<Integer> specialtyIds);
    void updateHospital(HospitalForm form, MultipartFile thumbnailImageFile) throws Exception;
    void deleteHospital(Integer id);
    Hospital getHospital(Integer id);
}