import React, { useState, useEffect } from 'react'
import Insert from '../../components/parttime/Insert.jsx'
import api from '../../apis/parttime/parttime.js' // Axios 인스턴스 사용
import { useLoginContext } from '../../context/LoginContextProvider.jsx'

const InsertContainer = () => {
  const { userInfo } = useLoginContext()

  const [form, setForm] = useState({
    title: '',
    location: '',
    pay: '',
    startDate: '',
    endDate: '',
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

  return (
    <Insert
      form={form}
      onChange={onChange}
      petsList={petsList}
      setPetsList={setPetsList}
      userInfo={userInfo} // 필요하면 Insert에서 userId 사용할 수 있게 전달
    />
  )
}

export default InsertContainer