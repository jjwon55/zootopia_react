import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Read from '../../components/parttime/Read.jsx'
import * as parttimeApi from '../../apis/parttime/parttime.js'
import { useLoginContext } from '../../context/LoginContextProvider.jsx'

const ReadContainer = () => {
  // ✅ 라우터는 반드시 /parttime/read/:jobId 여야 합니다.
  const { jobId } = useParams()
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
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

useEffect(() => {
  const jid = parseInt(jobId, 10);
  if (!jid || Number.isNaN(jid)) {
    // 안전하게 리다이렉트 혹은 에러 처리
    // navigate('/parttime');  // 원하면 자동 복귀
    setErrorMessage('잘못된 주소입니다. (jobId 없음)');
    setLoading(false);
    return;
  }
  fetchJobDetail(jid);
}, [jobId, applicantPage]);

  const fetchJobDetail = async () => {
    setLoading(true)
    setErrorMessage('')
    try {
      if (!jobId) throw new Error('jobId 파라미터가 없습니다.')

      // ✅ 인터셉터가 data만 리턴하든, axios 응답을 리턴하든 모두 대비
      const resp = await parttimeApi.getJobById(Number(jobId))
      const payload = resp?.data ?? resp ?? {}

      // ✅ 다양한 키 대응 (job / item / data / record / etc.)
      const jobData =
        payload.job ??
        payload.item ??
        payload.data ??
        payload.record ??
        payload; 

      // jobId가 다른 이름일 수도 있어 대비(백엔드가 job_id이면 매핑)
      const finalJob = jobData && {
        ...jobData,
        jobId: jobData.jobId ?? jobData.job_id ?? jobData.id,
      }

      if (!finalJob || !finalJob.jobId) {
        throw new Error('데이터가 없습니다.')
      }

      setJob(finalJob)
      setSuccessMessage(payload.successMessage ?? '')
      setErrorMessage(payload.errorMessage ?? '')
      setHasApplied(Boolean(payload.hasApplied))
      setIsWriter(Boolean(payload.isWriter))
      setMyApplication(payload.myApplication ?? null)

      // (선택) 지원자 조회도 안전 매핑
      try {
        const aResp = await parttimeApi.getApplicantsByJob(Number(jobId))
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
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    const introduction = e.target.introduction.value.trim();
    if (!introduction) {
      setErrorMessage('자기소개를 입력하세요.');
      return;
    }

    try {
      // 백엔드가 email/phone 채우도록 intro만 보냄
      await parttimeApi.applyApplicants(job.jobId, { introduction });

      setSuccessMessage('신청이 완료되었습니다.');
      e.target.reset();

      // 상세 재조회해서 hasApplied / myApplication 갱신
      await fetchJobDetail();
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || '신청 중 오류가 발생했습니다.';
      setErrorMessage(msg);
    }
  };
  
    const onDelete = async () => {
      if (deleting) return
      if (!window.confirm('정말 삭제하시겠습니까?')) return
      try {
        setDeleting(true)
        await parttimeApi.deleteJob(job.jobId)
        // ✅ 목록 경로로 이동 (프로젝트 라우트에 맞게!)
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

      await parttimeApi.deleteApplication(id) // ← API 시그니처에 맞게
      await fetchJobDetail()
    } catch (err) {
      alert(err?.response?.data?.message || '신청 취소 실패')
    }
  }

const onToggleContact = (id) => {
  const el = document.querySelector(`#contact-${id}`)
  if (el) el.classList.toggle('hidden')  //  ✅ hidden
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