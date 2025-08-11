import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import * as parttimeApi from '../../apis/parttime'
import UpdateForm from '../../components/parttime/Update.jsx'

const UpdateContainer = () => {
  const { jobId } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
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
    const fetchData = async () => {
      try {
        const res = await parttimeApi.getJob(jobId)
        const job = res.data
        setForm({
          title: job.title || '',
          location: job.location || '',
          pay: job.pay || '',
          startDate: job.startDate || '',
          endDate: job.endDate || '',
          petInfo: job.petInfo || '',
          memo: job.memo || ''
        })
      } catch (err) {
        console.error('수정할 데이터 조회 실패', err)
      }
    }
    fetchData()
  }, [jobId])

  // 📌 입력 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // 📌 수정 요청
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const updatedData = { ...form, jobId }
      const res = await parttimeApi.updateJob(updatedData)
      if (res.status === 200) {
        navigate(`/parttime/read/${jobId}`)
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
      onCancel={() => navigate(`/parttime/read/${jobId}`)}
    />
  )
}

export default UpdateContainer