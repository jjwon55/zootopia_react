package com.aloha.zootopia.domain;

public class JobPet {
    private Long jobId;
    private Long petId;

    public JobPet() {}
    public JobPet(Long jobId, Long petId) {
        this.jobId = jobId;
        this.petId = petId;
    }

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public Long getPetId() { return petId; }
    public void setPetId(Long petId) { this.petId = petId; }
}