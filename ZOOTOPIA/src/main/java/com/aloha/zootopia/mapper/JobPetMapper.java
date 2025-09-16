package com.aloha.zootopia.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.aloha.zootopia.domain.JobPet;

@Mapper
public interface JobPetMapper {
    @Insert("INSERT INTO job_pet (job_id, pet_id) VALUES (#{jobId}, #{petId})")
    int insert(JobPet jobPet);

    @Select("SELECT * FROM job_pet WHERE job_id = #{jobId}")
    List<JobPet> findByJobId(@Param("jobId") Long jobId);

    @Delete("DELETE FROM job_pet WHERE job_id = #{jobId} AND pet_id = #{petId}")
    int delete(@Param("jobId") Long jobId, @Param("petId") Long petId);

    @Delete("DELETE FROM job_pet WHERE job_id = #{jobId}")
    int deleteByJobId(@Param("jobId") Long jobId);
}
