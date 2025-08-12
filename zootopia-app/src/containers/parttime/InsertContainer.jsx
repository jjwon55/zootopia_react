// src/containers/parttime/InsertContainer.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Insert from '../../components/parttime/Insert.jsx'
import * as parttimeApi from '../../apis/parttime'
import { useLoginContext } from '../../context/LoginContextProvider.jsx'

const InsertContainer = () => {
  const navigate = useNavigate()
  const { userInfo } = useLoginContext() // 로그인 사용자 정보 가져오기 (Context 기반)

  const [form, setForm] = useState({
    title: '',
    location: '',
    pay: '',
    startDate: '',
    endDate: '',
    petInfo: '',
    memo: ''
  })

  const onChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      const jobData = {
        ...form,
        userId: userInfo.userId // 백엔드에서 보안을 위해 다시 확인하지만, 명시적으로 전달 가능
      }

      await parttimeApi.insertJob(jobData)
      navigate('/parttime/list')
    } catch (error) {
      console.error('등록 실패:', error)
      alert('등록에 실패했습니다.')
    }
  }

  return <Insert form={form} onChange={onChange} onSubmit={onSubmit} />
}

export default InsertContainer
