import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import * as parttimeApi from '../../apis/parttime/parttime.js'
import UpdateForm from '../../components/parttime/Update.jsx'

const toDateInput = (d) => {
  if (!d) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d
  const dt = new Date(d)
  return Number.isNaN(dt) ? '' : dt.toISOString().slice(0, 10)
}

const UpdateContainer = () => {
  const { jobId } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    jobId: '',
    title: '',
    location: '',
    pay: '',
    startDate: '',
    endDate: '',
    petInfo: '',
    memo: '',
    petIds: [],
  })
  const [petsList, setPetsList] = useState([])

  useEffect(() => {
    (async () => {
      try {
        const data = await parttimeApi.getJobDetail(jobId)
        const job = data?.job ?? data

        setForm(prev => ({
          ...prev,
          jobId: job.jobId ?? job.id ?? job.job_id ?? jobId,
          title: job.title || '',
          location: job.location || '',
          pay: job.pay ?? '',
          startDate: toDateInput(job.startDate ?? job.start_date),
          endDate: toDateInput(job.endDate ?? job.end_date),
          petInfo: job.petInfo ?? job.pet_info ?? '',
          memo: job.memo ?? '',
          petIds: job.petIds?.map(p => p.petId) ?? [],
        }))

        // 기존 등록된 펫 리스트
        const pets = job.pets ?? []
        setPetsList(pets)
      } catch (err) {
        console.error('수정할 데이터 조회 실패', err)
      }
    })()
  }, [jobId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (submitForm) => {
    try {
      const body = {
        title: submitForm.title,
        location: submitForm.location,
        pay: Number(submitForm.pay || 0),
        startDate: submitForm.startDate,
        endDate: submitForm.endDate,
        petInfo: submitForm.petInfo,
        memo: submitForm.memo,
        petIds: submitForm.petIds ?? [],
      }

      const res = await parttimeApi.updateJob(submitForm.jobId ?? jobId, body)

      if (res?.data?.ok || res?.status === 200 || res?.status === 204) {
        navigate(`/parttime/read/${submitForm.jobId ?? jobId}`)
      } else {
        alert('수정 실패: 서버 응답을 확인하세요.')
      }
    } catch (err) {
      console.error('수정 실패', err)
      const msg = err?.response?.data?.message ?? err?.message ?? '알 수 없는 오류'
      alert('수정 실패: ' + msg)
    }
  }

  return (
    <UpdateForm
      form={form}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onCancel={() => navigate(`/parttime/read/${form.jobId ?? jobId}`)}
      petsList={petsList}       // 🔹 기존 펫 리스트 전달
      setPetsList={setPetsList} // 🔹 선택/삭제 처리
    />
  )
}

export default UpdateContainer