import axios from 'axios';
const api = axios.create({ baseURL: 'http://localhost:8080' });

export const addJobPet = (jobId, petId) => api.post('/job_pet', { jobId, petId });