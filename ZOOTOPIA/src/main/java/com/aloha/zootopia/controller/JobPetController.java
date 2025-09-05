package com.aloha.zootopia.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aloha.zootopia.domain.JobPet;
import com.aloha.zootopia.service.JobPetService;

@RestController
@RequestMapping("/job_pet")
public class JobPetController {

    private final JobPetService service;

    public JobPetController(JobPetService service) {
        this.service = service;
    }

    @PostMapping
    public String add(@RequestBody JobPet jobPet) {
        service.addJobPet(jobPet.getJobId(), jobPet.getPetId());
        return "ok";
    }

    @GetMapping("/job/{jobId}")
    public List<JobPet> getByJob(@PathVariable Long jobId) {
        return service.getPetsByJob(jobId);
    }

    @DeleteMapping
    public String delete(@RequestParam Long jobId, @RequestParam Long petId) {
        service.removeJobPet(jobId, petId);
        return "deleted";
    }
}
