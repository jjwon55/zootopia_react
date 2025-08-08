import React, { useState } from 'react'
import InsertForm from '../../components/parttime/InsertForm'
import { useNavigate } from 'react-router-dom'
import * as parttimeApi from '../../apis/parttime'

const InsertContainer = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    location: '',
    animalType: '',
    startDate: '',
    endDate: '',
    pay: '',
    content: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await parttimeApi.insertJob(form)
      alert('등록 완료')
      navigate('/parttime/list')
    } catch (err) {
      console.error(err)
      alert('등록 실패')
    }
  }

  return (
    <InsertForm form={form} onChange={handleChange} onSubmit={handleSubmit} />
  )
}

export default InsertContainer