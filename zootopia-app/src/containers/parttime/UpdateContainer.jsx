import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import * as parttimeApi from '../../apis/parttime'
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
    memo: ''
  })

  // 📌 데이터 불러오기
  useEffect(() => {
    (async () => {
      try {
        // getJobDetail이 data만 반환한다면: const data = await parttimeApi.getJobDetail(jobId)
        // getJobById가 axios 응답이라면: const { data } = await parttimeApi.getJobById(jobId)
        let data
        if (parttimeApi.getJobDetail) {
          data = await parttimeApi.getJobDetail(jobId) // .then(r => r.data)로 벗겨진 형태
        } else {
          const res = await parttimeApi.getJobById(jobId) // axios 응답
          data = res.data
        }
        const j = data?.job ?? data

        setForm({
          jobId: j.jobId ?? j.id ?? j.job_id ?? jobId,
          title: j.title || '',
          location: j.location || '',
          pay: j.pay ?? '',
          startDate: toDateInput(j.startDate ?? j.start_date),
          endDate: toDateInput(j.endDate ?? j.end_date),
          petInfo: j.petInfo ?? j.pet_info ?? '',
          memo: j.memo ?? ''
        })
      } catch (err) {
        console.error('수정할 데이터 조회 실패', err)
      }
    })()
  }, [jobId])

  // 📌 입력 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  // 📌 수정 요청
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const body = {
        title: form.title,
        location: form.location,
        pay: Number(form.pay || 0),
        startDate: form.startDate,
        endDate: form.endDate,
        petInfo: form.petInfo,
        memo: form.memo
      }
      // ✅ 실제 시그니처에 맞게
      const res = await parttimeApi.updateJob(form.jobId ?? jobId, body)
      if (!res || res.status === 200 || res.status === 204) {
        navigate(`/parttime/read/${form.jobId ?? jobId}`)
      }
    } catch (err) {
      console.error('수정 실패', err)
    }
  }

  return (
    <UpdateForm
      form={form}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onCancel={() => navigate(`/parttime/read/${form.jobId ?? jobId}`)}
    />
  )
}

export default UpdateContainer