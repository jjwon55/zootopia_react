package com.aloha.zootopia.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.aloha.zootopia.domain.Animal;
import com.aloha.zootopia.domain.HospReview;
import com.aloha.zootopia.domain.Hospital;
import com.aloha.zootopia.domain.Specialty;

@Mapper
public interface HospitalMapper {
    List<Hospital> findAll();
    List<Hospital> findByAnimalIds(@Param("animalIds") List<Integer> animalIds);
    Hospital findById(@Param("hospitalId") Integer hospitalId);
    void insertHospital(Hospital hospital);
    void insertHospitalAnimal(@Param("hospitalId") Integer hospitalId, @Param("animalId") Integer animalId);
    void insertHospitalSpecialty(@Param("hospitalId") Integer hospitalId, @Param("specialtyId") Integer specialtyId);
    void updateHospital(Hospital hospital);
    void deleteHospitalAnimals(@Param("hospitalId") Integer hospitalId);
    void deleteHospitalSpecialties(@Param("hospitalId") Integer hospitalId);
    List<Hospital> selectHospitals(@Param("offset") int offset, @Param("limit") int limit, @Param("animalIds") List<Integer> animalIds);
    int countHospitals(@Param("animalIds") List<Integer> animalIds);
    void deleteHospital(@Param("hospitalId") Integer hospitalId);
}
