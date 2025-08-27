const linkPetToJob = async (petId) => {
  if (!job?.jobId) return
  try {
    await parttimeApi.linkPets(job.jobId, [petId])
    await fetchJobDetail(job.jobId) // 연결 후 최신 job 정보 갱신
  } catch (err) {
    console.error(err)
    alert('펫 연결 실패: ' + (err?.response?.data?.message || '알 수 없는 오류'))
  }
}