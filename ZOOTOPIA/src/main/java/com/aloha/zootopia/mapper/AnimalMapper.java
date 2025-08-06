package com.aloha.zootopia.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.aloha.zootopia.domain.Animal;

@Mapper
public interface AnimalMapper {
    List<Animal> findAll();
    List<Animal> findByHospitalId(@Param("hospitalId") Integer hospitalId);
}