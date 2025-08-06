package com.aloha.zootopia.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Animal {
    private Integer animalId;
    private String species;
    // getter/setter

    public Integer getAnimalId() { return animalId; }
    public void setAnimalId(Integer animalId) { this.animalId = animalId; }
    public String getSpecies() { return species; }
    public void setSpecies(String species) { this.species = species; }
}
