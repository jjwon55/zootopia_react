// src/containers/parttime/ReadContainer.jsx
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Read from '../../components/parttime/Read.jsx'
import * as parttimeApi from '../../apis/parttime'
import { useLoginContext } from '../../context/LoginContextProvider.jsx'

const ReadContainer = () => {
  const { id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const applicantPage = Number(searchParams.get('applicantPage')) || 1
  const { userInfo } = useLoginContext()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [hasApplied, setHasApplied] = useState(false)
  const [isWriter, setIsWriter] = useState(false)
  const [myApplication, setMyApplication] = useState(null)
  const [applicants, setApplicants] = useState([])
  const [totalApplicantPages, setTotalApplicantPages] = useState(1)

  useEffect(() => {
    fetchJobDetail()
  }, [id, applicantPage])

  const fetchJobDetail = async () => {
    const res = await parttimeApi.getJobDetail(id, applicantPage)

    setJob(res.job)
    setSuccessMessage(res.successMessage || '')
    setErrorMessage(res.errorMessage || '')
    setHasApplied(res.hasApplied || false)
    setIsWriter(res.isWriter || false)
    setMyApplication(res.myApplication || null)
    setApplicants(res.applicants || [])
    setTotalApplicantPages(res.totalApplicantPages || 1)
  }

  const onApply = async (e) => {
    e.preventDefault()
    const form = new FormData(e.target)
    const introduction = form.get('introduction')

    try {
      const result = await parttimeApi.applyToJob({ jobId: job.jobId, introduction })
      setSuccessMessage(result.message)
      fetchJobDetail()
    } catch (error) {
      setErrorMessage('신청 중 오류 발생')
    }
  }

  const onDelete = async () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      await parttimeApi.deleteJob(job.jobId)
      navigate('/parttime/list')
    }
  }

  const onCancel = async (applicantId) => {
    if (!window.confirm('신청을 취소하시겠습니까?')) return
    try {
      await parttimeApi.cancelApplication(applicantId || myApplication.applicantId, job.jobId)
      fetchJobDetail()
    } catch (err) {
      alert('신청 취소 실패')
    }
  }

  const onToggleContact = (applicantId) => {
    const el = document.querySelector(`#contact-${applicantId}`)
    if (el) el.classList.toggle('d-none')
  }

  const onPageChange = (newPage) => {
    searchParams.set('applicantPage', newPage)
    setSearchParams(searchParams)
  }

  if (!job) return <div>Loading...</div>

  return (
    <Read
      job={job}
      user={userInfo}
      writerId={job.userId}
      loginUserId={userInfo?.userId || null}
      successMessage={successMessage}
      errorMessage={errorMessage}
      hasApplied={hasApplied}
      isWriter={isWriter}
      myApplication={myApplication}
      applicants={applicants}
      totalApplicantPages={totalApplicantPages}
      applicantPage={applicantPage}
      onApply={onApply}
      onDelete={onDelete}
      onCancel={onCancel}
      onToggleContact={onToggleContact}
      onPageChange={onPageChange}
    />
  )
}

export default ReadContainer
