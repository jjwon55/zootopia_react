import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Read = ({
  job,
  user,
  writerId,
  loginUserId,
  successMessage,
  errorMessage,
  hasApplied,
  myApplication,
  applicants = [],
  totalApplicantPages,
  applicantPage,
  onApply,
  onDelete,
  deleting,
  onCancel,
  onToggleContact,
  onPageChange
}) => {
  const isOwner = loginUserId === writerId
  const roles =
    user?.roles ?? user?.authorities ?? (user?.authList ? user.authList.map(a => a.auth || a.role) : []) ?? []
  const flatRoles = Array.isArray(roles) ? roles : [roles]
  const isAdmin =
    flatRoles.includes('ROLE_ADMIN') ||
    flatRoles.includes('ADMIN') ||
    user?.role === 'ADMIN' ||
    user?.role === 'ROLE_ADMIN'
  const isSelfMyApplication =
    !!(user && myApplication && user.userId === (myApplication.userId ?? myApplication.user_id))

  const [openContacts, setOpenContacts] = useState(new Set())

  const toggleContact = id => {
    if (onToggleContact) onToggleContact(id)
    setOpenContacts(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const ZOO_CARD = "tw:bg-white tw:border tw:border-rose-100 tw:rounded-3xl tw:shadow-md"
  const BTN_BASE = "tw:inline-flex tw:items-center tw:justify-center tw:h-10 tw:px-4 tw:text-sm tw:font-medium tw:rounded-xl tw:transition tw:duration-150 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#F27A7A]/30 disabled:tw:opacity-60 disabled:tw:cursor-not-allowed tw:whitespace-nowrap"
  const BTN_PRIMARY = `${BTN_BASE} tw:bg-[#F27A7A] tw:text-white hover:tw:bg-[#e86e6e] active:tw:bg-[#d86464]`
  const BTN_OUTLINE_PRIMARY = `${BTN_BASE} tw:border tw:border-[#F27A7A] tw:text-[#F27A7A] tw:bg-white hover:tw:bg-[#F27A7A]/10 active:tw:bg-[#F27A7A]/20`
  const CHIP = "tw:inline-flex tw:items-center tw:gap-1 tw:px-3 tw:py-1 tw:text-xs tw:rounded-full tw:bg-rose-50 tw:text-rose-600 tw:border tw:border-rose-100"

  return (
    <div className="tw:min-h-screen tw:bg-transparent">
      {/* 헤더 */}
      <div className="tw:max-w-5xl tw:mx-auto tw:px-4 tw:pt-10">
        <div className={`${ZOO_CARD} tw:p-6 tw:flex tw:flex-col md:tw:flex-row md:tw:items-center md:tw:justify-between tw:gap-4`}>
          <div>
            <h1 className="tw:text-2xl tw:font-extrabold tw:text-[#333] tw:flex tw:items-center tw:gap-2">
              <span className="tw:text-3xl">🐾</span>
              <span>상세 내용</span>
            </h1>
            <p className="tw:text-sm tw:text-[#666] tw:mt-1">주토피아 파트타임 · 안심 매칭</p>
          </div>
          <div className="tw:flex tw:flex-wrap tw:gap-2 tw:mt-2 md:tw:mt-0">
            <span className={CHIP}>📍 {job.location}</span>
            <span className={CHIP}>📅 {job.startDate} ~ {job.endDate}</span>
            <span className={CHIP}>💰 {job.pay}원</span>
          </div>
        </div>
      </div>

      {/* 본문 */}
      <div className="tw:max-w-5xl tw:mx-auto tw:px-4 tw:py-8 tw:space-y-8">
        <div className={`${ZOO_CARD} tw:p-8`}>
          <h2 className="tw-mb-6 tw:text-center tw:text-[#F27A7A] tw:text-2xl tw:font-extrabold">{job.title}</h2>
          <div className="tw:grid md:tw:grid-cols-2 tw:gap-6 tw-mb-8">
            <InfoRow label="지역" value={job.location} />
            <InfoRow label="날짜" value={`${job.startDate} ~ ${job.endDate}`} />
            <InfoRow label="보수" value={<span className="tw-font-bold tw:text-[#2563eb]">{job.pay}원</span>} />
            <InfoRow label="보호자" value={<span className="tw-font-bold tw:text-[#22c55e]">{job.nickname}</span>} />
            <InfoRow label="동물" value={job.petInfo} full />
          </div>

          <div className="tw:p-5 tw:mt-10 tw:mb-10 tw:rounded-2xl tw:border tw:border-rose-100 tw:bg-[#FFF7F7] tw-mb-6">
            <div className="tw:flex tw:items-center tw:gap-3 tw:text-[#F27A7A] tw:font-bold">
              <span>📌</span>
              <span>요청 상세</span>
            </div>
            <div className="tw:mt-2 tw:leading-7 tw:text-[#444]">{job.memo || '요청사항이 없습니다.'}</div>
          </div>

          {job.pets && job.pets.length > 0 ? <PetProfiles pets={job.pets} /> : <div>펫 정보가 없습니다.</div>}

          {/* 액션 버튼 */}
          <div className="tw:flex tw:items-center tw:justify-between tw:mt-4">
            <Link to="/parttime/list" className={BTN_OUTLINE_PRIMARY}>목록으로</Link>
            {(isOwner || isAdmin) && (
              <div className="tw:flex tw:gap-2">
                <Link to={`/parttime/update/${job.jobId}`} className={BTN_OUTLINE_PRIMARY}>수정</Link>
                <button onClick={onDelete} className={BTN_PRIMARY} disabled={deleting}>
                  {deleting ? '삭제중…' : '삭제'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 알림 */}
        {(successMessage || errorMessage) && (
          <div className={`${ZOO_CARD} tw:p-5`}>
            {successMessage && <div className="tw:bg-green-100 tw:text-green-700 tw-text-center tw-rounded tw-p-2 tw-mb-2">{successMessage}</div>}
            {errorMessage && <div className="tw:bg-red-100 tw:text-red-700 tw-text-center tw-rounded tw-p-2">{errorMessage}</div>}
          </div>
        )}

        {/* 로그인 안내 */}
        {!user && (
          <div className={`${ZOO_CARD} tw:p-6 tw:text-center tw-mb-8`}>
            <p className="tw:mb-3 tw:text-[#555]">로그인 후 신청할 수 있어요.</p>
            <Link to="/login" className={BTN_PRIMARY}>🔐 로그인 후 신청하기</Link>
          </div>
        )}

        {/* 신청폼 */}
        {user && !isOwner && !hasApplied && (
          <div className={`${ZOO_CARD} tw:p-6 md:tw:p-8 tw-mb-8`}>
            <form onSubmit={onApply} className="tw:space-y-4">
              <div>
                <label htmlFor="introduction" className="tw-font-semibold tw-mb-2 tw:block">자기소개</label>
                <textarea id="introduction" name="introduction" className="tw:border tw:rounded-xl tw:w-full tw:p-3 tw:leading-7 focus:tw:ring-2 focus:tw:ring-rose-200" rows="4" required />
              </div>
              <div className="tw:flex tw:justify-between">
                <Link to="/parttime/list" className={BTN_OUTLINE_PRIMARY}>취소</Link>
                <button type="submit" className={BTN_PRIMARY}>신청하기</button>
              </div>
            </form>
          </div>
        )}

        {/* 내 신청 */}
        {user && hasApplied && myApplication && (
          <div className={`${ZOO_CARD} tw:p-6 md:tw:p-8 tw-mb-8`}>
            <h5 className="tw-font-bold tw-mb-4">📋 나의 신청</h5>
            <div className="tw:border tw:rounded-xl tw:bg-gray-50 tw:p-4 tw:leading-7">
              <div><strong>🧑‍💼 소개 :</strong> {myApplication.introduction}</div>
              {!isSelfMyApplication && (
                <div className="tw:mt-2">
                  <strong>📧 이메일:</strong> {myApplication.email ?? myApplication.user_email ?? myApplication.userEmail}<br />
                  <strong>📱 전화번호:</strong> {myApplication.phone ?? myApplication.user_phone ?? myApplication.userPhone}
                </div>
              )}
              <div className="tw:text-end tw:mt-3">
                <button onClick={() => onCancel(myApplication.applicantId)} className={BTN_OUTLINE_PRIMARY}>신청 취소</button>
              </div>
            </div>
          </div>
        )}

        {/* 지원자 목록 */}
        {user && isOwner && (
          <ApplicantList 
            applicants={applicants} 
            openContacts={openContacts} 
            toggleContact={toggleContact} 
            user={user} 
            onCancel={onCancel} 
            totalApplicantPages={totalApplicantPages} 
            applicantPage={applicantPage} 
            onPageChange={onPageChange}
            BTN_PRIMARY={BTN_PRIMARY}
            BTN_OUTLINE_PRIMARY={BTN_OUTLINE_PRIMARY}
          />
        )}
      </div>
    </div>
  )
}

/* ---------- InfoRow ---------- */
const InfoRow = ({ label, value, full }) => (
  <div className={`tw:flex tw:gap-4 ${full ? 'md:tw:col-span-2' : ''}`}>
    <div className="tw:w-24 tw:shrink-0 tw:font-semibold tw:text-[#444]">{label} :</div>
    <div className="tw:flex-1 tw:text-[#333]">{value}</div>
  </div>
)

/* ---------- PetProfiles ---------- */
const PetProfiles = ({ pets }) => {
  if (!pets || pets.length === 0) return null

  const toAbsUrl = (u) => {
    if (!u) return ''
    if (/^https?:\/\//i.test(u)) return u
    return `http://localhost:8080${u.startsWith('/') ? u : '/' + u}`
  }

  return (
    <div className="tw:space-y-4">
      <h4 className="tw-font-bold tw:text-[#F27A7A] tw:text-lg">🐶🐱 펫 프로필</h4>
      {pets.map((pet, index) => {
        const id = pet.petId ?? pet.id ?? pet.pet_id ?? index
        return (
          <div key={id} className="tw-border tw-border-rose-100 tw:rounded-xl tw-bg-gray-50 tw-p-4">
            <div className="tw:leading-7 tw:space-y-2 tw:text-sm tw:text-gray-700">
              <div><strong>이름:</strong> {pet.name}</div>
              <div><strong>종류:</strong> {pet.species ?? '정보 없음'}</div>
              <div><strong>나이:</strong> {pet.age ?? '정보 없음'}</div>
              <div><strong>성별:</strong> {pet.gender ?? '정보 없음'}</div>
              <div><strong>특징:</strong> {pet.description ?? '정보 없음'}</div>
              {pet.photoUrl
                ? <img src={toAbsUrl(pet.photoUrl)} alt={pet.name} className="tw:w-32 tw:h-32 tw:object-cover tw:rounded-xl" />
                : <div className="tw:text-gray-400">사진 없음</div>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ---------- ApplicantList ---------- */
const ApplicantList = ({ applicants, openContacts, toggleContact, user, onCancel, totalApplicantPages, applicantPage, onPageChange, BTN_PRIMARY, BTN_OUTLINE_PRIMARY }) => (
  <div className="tw:border tw:rounded-2xl tw:bg-white tw:shadow-md tw:p-6 md:tw:p-8">
    <h5 className="tw-font-bold tw:mb-4 tw:flex tw:items-center tw:gap-2">
      <span>📋 지원자 목록</span>
      <span className="tw:text-xs tw:text-rose-500 tw:bg-rose-50 tw:border tw:border-rose-100 tw:px-2 tw:py-0.5 tw:rounded-full">{applicants.length}명</span>
    </h5>
    {applicants.length === 0 ? <div className="tw:text-gray-400">현재 지원자가 없습니다.</div> : (
      <div className="tw:space-y-4 md:tw:space-y-5">
        {applicants.map(app => (
          <div key={app.applicantId} className="tw:border tw:p-5 md:tw:p-6 tw:rounded-2xl tw:bg-white tw:shadow-sm">
            <div className="tw:flex tw:justify-between tw:items-start tw:gap-5 md:tw:gap-8">
              <div className="tw:leading-7 tw:space-y-2.5">
                <div><strong>🧑‍💼 닉네임:</strong> {app.user?.nickname ?? app.user_nickname ?? app.userNickname ?? app.nickname ?? `(ID: ${app.userId})`}</div>
                <div className="tw:text-[#444]"><strong>✍</strong> {app.introduction}</div>
                {openContacts.has(app.applicantId) && (
                  <div className="tw:mt-2">
                    <div><strong>📧 이메일:</strong> {app.email ?? app.user_email ?? app.userEmail ?? app.user?.email ?? '없음'}</div>
                    <div><strong>📱 전화번호:</strong> {app.phone ?? app.user_phone ?? app.userPhone ?? app.user?.phone ?? '없음'}</div>
                  </div>
                )}
              </div>
              <div className="tw:text-end tw:min-w-[180px] md:tw:border-l md:tw:border-rose-100 md:tw:pl-6">
                <p className="tw:text-gray-400 tw-mb-2 tw:text-xs">{app.createdAt}</p>
                <button type="button" className={`${BTN_PRIMARY} tw-gap-2 tw:mt-4 tw-leading-none tw-whitespace-nowrap tw:h-9 tw:min-w-[140px] tw:px-5 tw:py-2.5 tw:text-base`} onClick={() => toggleContact(app.applicantId)}>📞 연락처 보기</button>
                {user.userId === app.userId && <button type="button" className={`${BTN_OUTLINE_PRIMARY} tw-mt-2`} onClick={() => onCancel(app.applicantId)} title="내 신청 취소">❌</button>}
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
    {totalApplicantPages > 1 && (
      <nav className="tw:mt-6 tw:flex tw:justify-center">
        <ul className="tw:flex tw:gap-1">
          <li><button className={`${BTN_OUTLINE_PRIMARY} ${applicantPage === 1 ? 'tw:opacity-50 tw:cursor-not-allowed' : ''}`} onClick={() => onPageChange(applicantPage - 1)} disabled={applicantPage === 1}>이전</button></li>
          {[...Array(totalApplicantPages)].map((_, i) => (
            <li key={i + 1}><button className={`${BTN_OUTLINE_PRIMARY} ${i + 1 === applicantPage ? '!tw:bg-[#F27A7A] !tw:text-white' : ''}`} onClick={() => onPageChange(i + 1)}>{i + 1}</button></li>
          ))}
          <li><button className={`${BTN_OUTLINE_PRIMARY} ${applicantPage === totalApplicantPages ? 'tw:opacity-50 tw:cursor-not-allowed' : ''}`} onClick={() => onPageChange(applicantPage + 1)} disabled={applicantPage === totalApplicantPages}>다음</button></li>
        </ul>
      </nav>
    )}
  </div>
)

export default Read