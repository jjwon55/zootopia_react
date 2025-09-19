package com.aloha.zootopia.service.hospital;

import java.io.File;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.aloha.zootopia.domain.Animal;
import com.aloha.zootopia.domain.Hospital;
import com.aloha.zootopia.domain.PageInfo;
import com.aloha.zootopia.domain.HospReview;
import com.aloha.zootopia.domain.Specialty;
import com.aloha.zootopia.dto.HospitalForm;
import com.aloha.zootopia.dto.HospReviewForm;
import com.aloha.zootopia.mapper.AnimalMapper;
import com.aloha.zootopia.mapper.HospitalMapper;
import com.aloha.zootopia.mapper.SpecialtyMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class HospitalServiceImpl implements HospitalService {
    @Autowired HospitalMapper hospitalMapper;
    @Autowired AnimalMapper animalMapper;
    @Autowired SpecialtyMapper specialtyMapper;

    @Value("${file.upload.path}")
    private String uploadPath;

    // 이미지 저장 헬퍼 메서드
    private String saveImage(MultipartFile file) throws Exception {
        if (file == null || file.isEmpty()) {
            return null;
        }
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String uuid = UUID.randomUUID().toString();
        String savedFilename = uuid + extension;
        File uploadDir = new File(uploadPath);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }
        File targetFile = new File(uploadDir, savedFilename);
        file.transferTo(targetFile);
        return "/upload/" + savedFilename; // Return a relative path for web access
    }

    // @Override
    // public String saveImage(MultipartFile file) throws Exception {
    //     if (file == null || file.isEmpty()) return null;

    //     String originalFilename = file.getOriginalFilename();
    //     String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
    //     String uuid = UUID.randomUUID().toString();
    //     String savedFilename = uuid + extension;

    //     File uploadDir = new File(uploadPath, "hospital");
    //     if (!uploadDir.exists()) uploadDir.mkdirs();

    //     File targetFile = new File(uploadDir, savedFilename);
    //     file.transferTo(targetFile);

    //     return "/upload/hospital/" + savedFilename; // 프론트용 URL
    // }



    @Override
    public List<Hospital> getHospitals(List<Integer> animalIds) {
        if(animalIds == null || animalIds.isEmpty()) return hospitalMapper.findAll();
        return hospitalMapper.findByAnimalIds(animalIds);
    }


    @Override
    public void createHospital(HospitalForm form, MultipartFile thumbnailImageFile) throws Exception {
        String thumbnailImageUrl = saveImage(thumbnailImageFile);
        form.setThumbnailImageUrl(thumbnailImageUrl);

        Hospital hospital = new Hospital();
        hospital.setName(form.getName());
        hospital.setAddress(form.getAddress());
        hospital.setHomepage(form.getHomepage());
        hospital.setPhone(form.getPhone());
        hospital.setEmail(form.getEmail());
        hospital.setThumbnailImageUrl(form.getThumbnailImageUrl());
        hospital.setHospIntroduce(form.getHospIntroduce());
        hospitalMapper.insertHospital(hospital);
        for(Integer animalId : form.getAnimalIds()) {
            hospitalMapper.insertHospitalAnimal(hospital.getHospitalId(), animalId);
        }
        for(Integer specialtyId : form.getSpecialtyIds()) {
            hospitalMapper.insertHospitalSpecialty(hospital.getHospitalId(), specialtyId);
        }
    }

    // @Override
    // public void createHospital(HospitalForm form) throws Exception {
    //     Hospital hospital = new Hospital();
    //     hospital.setName(form.getName());
    //     hospital.setAddress(form.getAddress());
    //     hospital.setHomepage(form.getHomepage());
    //     hospital.setPhone(form.getPhone());
    //     hospital.setEmail(form.getEmail());
    //     hospital.setThumbnailImageUrl(form.getThumbnailImageUrl()); // 업로드된 URL
    //     hospital.setHospIntroduce(form.getHospIntroduce());

    //     hospitalMapper.insertHospital(hospital);

    //     for (Integer animalId : form.getAnimalIds()) {
    //         hospitalMapper.insertHospitalAnimal(hospital.getHospitalId(), animalId);
    //     }
    //     for (Integer specialtyId : form.getSpecialtyIds()) {
    //         hospitalMapper.insertHospitalSpecialty(hospital.getHospitalId(), specialtyId);
    //     }
    // }



    @Override
    public List<Animal> getAllAnimals() { return animalMapper.findAll(); }

    @Override
    public List<Specialty> getAllSpecialties() { return specialtyMapper.findAll(); }




public HospitalServiceImpl(HospitalMapper hospitalMapper) {
        this.hospitalMapper = hospitalMapper;
    }

    @Override
    public List<Hospital> getHospitalList(List<Integer> animalIds, List<Integer> specialtyIds, int pageNum, int pageSize) {

        int offset = (pageNum - 1) * pageSize;
        List<Hospital> hospitalList = hospitalMapper.selectHospitals(offset, pageSize, animalIds, specialtyIds);

        for (Hospital hospital : hospitalList) {
            List<String> tags = new ArrayList<>();
            if (hospital.getAnimals() != null) {
                for (Animal animal : hospital.getAnimals()) {
                    tags.add(animal.getSpecies());
                }
            }
            if (hospital.getSpecialties() != null) {
                for (Specialty specialty : hospital.getSpecialties()) {
                    tags.add(specialty.getCategory());
                }
            }
            hospital.setTags(tags);
        }

        // Sorting logic
        hospitalList.sort((h1, h2) -> {
            long h1MatchCount = 0;
            if (animalIds != null) {
                h1MatchCount += h1.getAnimals().stream().filter(a -> animalIds.contains(a.getAnimalId())).count();
            }
            if (specialtyIds != null) {
                h1MatchCount += h1.getSpecialties().stream().filter(s -> specialtyIds.contains(s.getSpecialtyId())).count();
            }

            long h2MatchCount = 0;
            if (animalIds != null) {
                h2MatchCount += h2.getAnimals().stream().filter(a -> animalIds.contains(a.getAnimalId())).count();
            }
            if (specialtyIds != null) {
                h2MatchCount += h2.getSpecialties().stream().filter(s -> specialtyIds.contains(s.getSpecialtyId())).count();
            }

            if (h1MatchCount != h2MatchCount) {
                return Long.compare(h2MatchCount, h1MatchCount);
            }

            return h1.getName().compareTo(h2.getName());
        });

        return hospitalList;
    }

    @Override
    public int getHospitalCount(List<Integer> animalIds, List<Integer> specialtyIds) {
        return hospitalMapper.countHospitals(animalIds, specialtyIds);
    }


    @Override
    public void updateHospital(HospitalForm form, MultipartFile thumbnailImageFile) throws Exception {
        // 기존 병원 정보 조회 (기존 이미지 URL을 얻기 위함)
        Hospital existingHospital = hospitalMapper.findById(form.getHospitalId());
        String oldThumbnailImageUrl = existingHospital != null ? existingHospital.getThumbnailImageUrl() : null;

        String newThumbnailImageUrl = saveImage(thumbnailImageFile);

        // 새 이미지가 업로드되었으면 기존 이미지 삭제
        if (newThumbnailImageUrl != null && oldThumbnailImageUrl != null) {
            File oldImageFile = new File(uploadPath, oldThumbnailImageUrl.replace("/upload/", ""));
            if (oldImageFile.exists()) {
                oldImageFile.delete();
            }
        }
        // 새 이미지가 없으면 기존 이미지 URL 유지
        if (newThumbnailImageUrl == null) {
            form.setThumbnailImageUrl(oldThumbnailImageUrl);
        } else {
            form.setThumbnailImageUrl(newThumbnailImageUrl);
        }

        Hospital hospital = new Hospital();
        hospital.setHospitalId(form.getHospitalId());
        hospital.setName(form.getName());
        hospital.setAddress(form.getAddress());
        hospital.setHomepage(form.getHomepage());
        hospital.setPhone(form.getPhone());
        hospital.setEmail(form.getEmail());
        hospital.setThumbnailImageUrl(form.getThumbnailImageUrl());
        hospital.setHospIntroduce(form.getHospIntroduce()); // 추가

        hospitalMapper.updateHospital(hospital);

        hospitalMapper.deleteHospitalAnimals(hospital.getHospitalId());
        hospitalMapper.deleteHospitalSpecialties(hospital.getHospitalId());

        if (form.getAnimalIds() != null) {
            for(Integer animalId : form.getAnimalIds()) {
                hospitalMapper.insertHospitalAnimal(hospital.getHospitalId(), animalId);
            }
        }
        if (form.getSpecialtyIds() != null) {
            for(Integer specialtyId : form.getSpecialtyIds()) {
                hospitalMapper.insertHospitalSpecialty(hospital.getHospitalId(), specialtyId);
            }
        }
    }

    @Override
    public void deleteHospital(Integer id) {
        // 병원 정보 조회하여 이미지 파일 경로 가져오기
        Hospital hospital = hospitalMapper.findById(id);
        if (hospital != null && hospital.getThumbnailImageUrl() != null) {
            File imageFile = new File(uploadPath, hospital.getThumbnailImageUrl().replace("/upload/", ""));
            if (imageFile.exists()) {
                imageFile.delete();
            }
        }
        hospitalMapper.deleteHospitalAnimals(id);
        hospitalMapper.deleteHospitalSpecialties(id);
        hospitalMapper.deleteHospital(id);
    }

    @Override
    public Hospital getHospital(Integer id) {
        return hospitalMapper.findById(id);
    }

}