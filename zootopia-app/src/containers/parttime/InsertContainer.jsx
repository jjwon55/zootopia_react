import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Insert from '../../components/parttime/Insert.jsx'
import * as parttimeApi from '../../apis/parttime/parttime.js'
import { useLoginContext } from '../../context/LoginContextProvider.jsx'
import api from '../../apis/parttime/parttime.js' // Axios 인스턴스 사용

const InsertContainer = () => {
  const navigate = useNavigate()
  const { userInfo } = useLoginContext()

  const [form, setForm] = useState({
    title: '',
    location: '',
    pay: '',
    startDate: '',
    endDate: '',
    petInfo: '',
    memo: ''
  })

  const [petsList, setPetsList] = useState([])

  // 로그인한 사용자의 기존 펫 리스트 불러오기
  useEffect(() => {
    async function fetchPets() {
      try {
        const res = await api.get('/pets')
        if (res.data.pets) setPetsList(res.data.pets)
      } catch (err) {
        console.error('펫 리스트 조회 실패', err)
      }
    }
    fetchPets()
  }, [])

  const onChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (submitData) => {
    try {
      const jobData = { ...submitData, userId: userInfo.userId }
      await parttimeApi.insertJob(jobData)
      navigate('/parttime/list')
    } catch (error) {
      console.error('등록 실패:', error)
      alert('등록에 실패했습니다.')
    }
  }

  return (
    <Insert
      form={form}
      onChange={onChange}
      onSubmit={onSubmit}
      petsList={petsList}
      setPetsList={setPetsList}
    />
  )
}

export default InsertContainer