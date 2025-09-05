import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Read from '../../components/parttime/Read.jsx'
import * as parttimeApi from '../../apis/parttime/parttime.js'
import { useLoginContext } from '../../context/LoginContextProvider.jsx'

const ReadContainer = () => {
  const { jobId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const applicantPage = Number(searchParams.get('applicantPage')) || 1

  const { userInfo } = useLoginContext()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [myApplication, setMyApplication] = useState(null)
  const [applicants, setApplicants] = useState([])
  const [totalApplicantPages, setTotalApplicantPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  const fetchJobDetail = async (jid) => {
    try {
      const data = await parttimeApi.getJobDetail(jid, applicantPage)
      console.log('📦 getJobDetail 응답:', data) 

      if (!data || !data.job) {
        setErrorMessage('채용 정보를 가져오지 못했습니다.')
        setLoading(false)
        return
      }

      setJob(data.job)
      setApplicants(data.applicants || [])
      setMyApplication(data.myApplication || null) // ✅ myApplication만 사용
      setTotalApplicantPages(data.totalApplicantPages || 1)
      setLoading(false)
    } catch (error) {
      console.error(error)
      setErrorMessage('채용 정보를 가져오는 중 오류가 발생했습니다.')
      setLoading(false)
    }
  }

  useEffect(() => {
    const jid = Number(jobId)
    if (!jid) {
      setErrorMessage('잘못된 주소입니다. (jobId 없음)')
      setLoading(false)
      return
    }
    fetchJobDetail(jid)
  }, [jobId, applicantPage, userInfo?.userId])

  const onApply = async (e) => {
    e.preventDefault()
    setSuccessMessage('')
    setErrorMessage('')

    const introduction = e.target.introduction.value.trim()
    if (!introduction) {
      setErrorMessage('자기소개를 입력하세요.')
      return
    }

    try {
      await parttimeApi.applyApplicants(job.jobId, { introduction })
      setSuccessMessage('신청이 완료되었습니다.')
      e.target.reset()
      await fetchJobDetail(job.jobId)
    } catch (err) {
      console.error(err)
      setErrorMessage(err?.response?.data?.message || '신청 중 오류가 발생했습니다.')
      if (err.response?.status === 409) {
        await fetchJobDetail(job.jobId)
      }
    }
  }

  const onDelete = async () => {
    if (deleting) return
    if (!window.confirm('정말 삭제하시겠습니까?')) return
    try {
      setDeleting(true)
      await parttimeApi.deleteJob(job.jobId)
      navigate('/parttime/list')
    } catch (err) {
      console.error(err)
      alert(err?.response?.data?.message || '삭제 실패')
    } finally {
      setDeleting(false)
    }
  }

  const onCancel = async (applicantIdParam) => {
    if (!window.confirm('신청을 취소하시겠습니까?')) return
    try {
      const id = Number(applicantIdParam ?? myApplication?.applicantId)
      if (!id) throw new Error('신청 ID를 찾을 수 없습니다.')
      await parttimeApi.deleteApplication(id)
      await fetchJobDetail(job.jobId)
    } catch (err) {
      console.error(err)
      alert(err?.response?.data?.message || '신청 취소 실패')
    }
  }

  const onPageChange = (newPage) => {
    const next = new URLSearchParams(searchParams)
    next.set('applicantPage', newPage)
    setSearchParams(next)
  }

  if (loading) return <div className="tw:text-center tw:py-10">Loading...</div>
  if (!job) return <div className="tw:text-center tw:text-red-600">{errorMessage || '데이터가 없습니다.'}</div>

  return (
    <Read
      job={job}
      user={userInfo}
      writerId={job.userId}
      loginUserId={userInfo?.userId || null}
      successMessage={successMessage}
      errorMessage={errorMessage}
      myApplication={myApplication} 
      applicants={applicants}
      totalApplicantPages={totalApplicantPages}
      applicantPage={applicantPage}
      onApply={onApply}
      onDelete={onDelete}
      onCancel={onCancel}
      onPageChange={onPageChange}
    />
  )
}

export default ReadContainer