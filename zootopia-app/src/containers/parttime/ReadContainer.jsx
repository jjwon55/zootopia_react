import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Read from '../../components/parttime/Read.jsx'
import * as parttimeApi from '../../apis/parttime/parttime.js'
import { useLoginContext } from '../../context/LoginContextProvider.jsx'

const ReadContainer = () => {
  // /parttime/read/:jobId
  const { jobId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const applicantPage = Number(searchParams.get('applicantPage')) || 1

  const { userInfo } = useLoginContext()
  const navigate = useNavigate()

  // ✅ roles → isAdmin 안전 계산
  const rolesRaw = userInfo?.roles ?? userInfo?.rol ?? []
  const roles = Array.isArray(rolesRaw)
    ? rolesRaw
    : (typeof rolesRaw === 'string' ? [rolesRaw] : [])
  const isAdmin = roles.includes('ROLE_ADMIN')

  const [job, setJob] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [hasApplied, setHasApplied] = useState(false)
  const [isWriter, setIsWriter] = useState(false)
  const [myApplication, setMyApplication] = useState(null)
  const [applicants, setApplicants] = useState([])
  const [totalApplicantPages, setTotalApplicantPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const jid = Number(jobId)
    if (!jid) {
      setErrorMessage('잘못된 주소입니다. (jobId 없음)')
      setLoading(false)
      return
    }
    fetchJobDetail(jid) // ✅ 인자 전달
  }, [jobId, applicantPage])

  // ✅ 인자 사용하도록 통일
  const fetchJobDetail = async (jid) => {
    setLoading(true)
    setErrorMessage('')
    try {
      // 상세
      const resp = await parttimeApi.getJobById(jid)
      const payload = resp?.data ?? resp ?? {}

      const jobData = payload.job ?? payload.item ?? payload.data ?? payload.record ?? payload
      const finalJob = jobData && {
        ...jobData,
        jobId: jobData.jobId ?? jobData.job_id ?? jobData.id,
      }
      if (!finalJob?.jobId) throw new Error('데이터가 없습니다.')

      setJob(finalJob)
      setSuccessMessage(payload.successMessage ?? '')
      setErrorMessage(payload.errorMessage ?? '')
      setHasApplied(Boolean(payload.hasApplied))
      setIsWriter(Boolean(payload.isWriter))
      setMyApplication(payload.myApplication ?? null)

      // 지원자 목록 (보호 API)
      try {
        const aResp = await parttimeApi.getApplicantsByJob(jid, applicantPage)
        const aPayload = aResp?.data ?? aResp ?? {}
        setApplicants(aPayload.applicants ?? aPayload.items ?? aPayload.content ?? [])
        setTotalApplicantPages(aPayload.totalPages ?? 1)
      } catch {
        setApplicants([])
        setTotalApplicantPages(1)
      }
    } catch (e) {
      console.error('상세 불러오기 실패:', e)
      setErrorMessage(e?.response?.data?.message || e.message || '상세 불러오기 실패')
      setJob(null)
    } finally {
      setLoading(false)
    }
  }

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
      await fetchJobDetail(job.jobId) // ✅ 인자 전달
    } catch (err) {
      console.error(err)
      const msg = err?.response?.data?.message || '신청 중 오류가 발생했습니다.'
      setErrorMessage(msg)
    }
  }

  const onDelete = async () => {
    if (deleting) return
    if (!window.confirm('정말 삭제하시겠습니까?')) return
    try {
      setDeleting(true)
      await parttimeApi.deleteJob(job.jobId)
      navigate('/parttime/list')
    } catch (e) {
      alert(e?.response?.data?.message || '삭제 실패')
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
      await fetchJobDetail(job.jobId) // ✅ 인자 전달
    } catch (err) {
      alert(err?.response?.data?.message || '신청 취소 실패')
    }
  }

  const onToggleContact = (id) => {
    const el = document.querySelector(`#contact-${id}`)
    if (el) el.classList.toggle('hidden')
  }

  const onPageChange = (newPage) => {
    const next = new URLSearchParams(searchParams)
    next.set('applicantPage', newPage)
    setSearchParams(next)
  }

  if (loading) return <div>Loading...</div>
  if (!job)   return <div style={{ color: 'crimson' }}>{errorMessage || '데이터가 없습니다.'}</div>

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
      isAdmin={isAdmin}               
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