package com.aloha.zootopia.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.aloha.zootopia.domain.Specialty;

@Mapper
public interface SpecialtyMapper {
    List<Specialty> findAll();
}
