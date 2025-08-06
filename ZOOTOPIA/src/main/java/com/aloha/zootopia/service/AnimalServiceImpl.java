package com.aloha.zootopia.service;

import com.aloha.zootopia.domain.Animal;
import com.aloha.zootopia.mapper.AnimalMapper;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AnimalServiceImpl implements AnimalService {

    private final AnimalMapper animalMapper;

    public AnimalServiceImpl(AnimalMapper animalMapper) {
        this.animalMapper = animalMapper;
    }

    @Override
    public List<Animal> getAllAnimals() {
        return animalMapper.findAll();
    }
}