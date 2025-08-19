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
  onToggleContact, // 선택 콜백(로그/추가처리용), 동작은 내부 상태로 함
  onPageChange
}) => {
  // 권한
  const isOwner = loginUserId === writerId
  const roles =
    user?.roles ??
    user?.authorities ??
    (user?.authList ? user.authList.map(a => a.auth || a.role) : []) ?? []
  const flatRoles = Array.isArray(roles) ? roles : [roles]
  const isAdmin =
    flatRoles.includes('ROLE_ADMIN') ||
    flatRoles.includes('ADMIN') ||
    user?.role === 'ADMIN' ||
    user?.role === 'ROLE_ADMIN'

  const isSelfMyApplication =
    !!(user && myApplication && user.userId === (myApplication.userId ?? myApplication.user_id))

  // ✅ 연락처 토글 상태 (열린 applicantId 집합)
  const [openContacts, setOpenContacts] = useState(new Set())
  const toggleContact = (id) => {
    if (onToggleContact) onToggleContact(id) // 선택: 외부 콜백 호출
    setOpenContacts(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // ── ZOOTOPIA THEME ───────────────────────────────────────────────
  const ZOO_BG = 'tw:bg-gradient-to-b tw:from-[#FFF0F0] tw:to-white'
  const ZOO_BORDER = 'tw:border tw:border-rose-100'
  const ZOO_CARD = `tw:bg-white ${ZOO_BORDER} tw:rounded-3xl tw:shadow-sm`

  // 버튼
  const BTN_BASE =
    'tw:inline-flex tw:items-center tw:justify-center tw:h-10 tw:px-4 tw:text-sm tw:font-medium tw:rounded-xl tw:transition tw:duration-150 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#F27A7A]/30 disabled:tw:opacity-60 disabled:tw:cursor-not-allowed tw:whitespace-nowrap'
  const BTN_PRIMARY =
    `${BTN_BASE} tw:bg-[#F27A7A] tw:text-white tw:shadow-sm hover:tw:bg-[#e86e6e] active:tw:bg-[#d86464]`
  const BTN_OUTLINE_PRIMARY =
    `${BTN_BASE} tw:border tw:border-[#F27A7A] tw:text-[#F27A7A] tw:bg-white hover:tw:bg-[#F27A7A]/10 active:tw:bg-[#F27A7A]/20`
  const BTN_NEUTRAL = `${BTN_BASE} tw:bg-gray-200 tw:text-gray-700 hover:tw:bg-gray-300`

  // 칩/배지
  const CHIP = 'tw:inline-flex tw:items-center tw:gap-1 tw:px-3 tw:py-1 tw:text-xs tw:rounded-full tw:bg-rose-50 tw:text-rose-600 tw:border tw:border-rose-100'

  return (
    <div className={`tw:min-h-screen ${ZOO_BG}`}>
      {/* 헤더 */}
      <div className="tw:max-w-5xl tw:mx-auto tw:px-4 tw:pt-10">
        <div className={`${ZOO_CARD} tw:p-6 tw:flex tw:flex-col md:tw:flex-row md:tw:items-center md:tw:justify-between tw:gap-4`}>
          <div>
            <h1 className="tw:text-2xl tw:font-extrabold tw:text-[#333] tw:flex tw:items-center tw:gap-2">
              <span className="tw:inline-block tw:text-3xl">🐾</span>
              <span>상세 내용</span>
            </h1>
            <p className="tw:text-sm tw:text-[#666] tw:mt-1">주토피아 파트타임 · 안심 매칭</p>
          </div>
          <div className="tw:flex tw:flex-wrap tw:gap-2">
            <span className={CHIP}>📍 {job.location}</span>
            <span className={CHIP}>📅 {job.startDate} ~ {job.endDate}</span>
            <span className={CHIP}>💰 {job.pay}원</span>
          </div>
        </div>
      </div>

      {/* 본문 */}
      <div className="tw:max-w-5xl tw:mx-auto tw:px-4 tw:py-8">
        {/* 상단 카드 */}
        <div className={`${ZOO_CARD} tw:p-8 tw:mb-8`}>
          <h2 className="tw:mb-6 tw:text-center tw:text-[#F27A7A] tw:text-2xl tw:font-extrabold">{job.title}</h2>

          {/* 핵심 정보 2단 그리드 */}
          <div className="tw:grid md:tw:grid-cols-2 tw:gap-6 tw:mb-8">
            <InfoRow label="지역" value={job.location} />
            <InfoRow label="날짜" value={`${job.startDate} ~ ${job.endDate}`} />
            <InfoRow label="보수" value={<span className="tw:font-bold tw:text-[#2563eb]">{job.pay}원</span>} />
            <InfoRow label="보호자" value={<span className="tw:font-bold tw:text-[#22c55e]">{job.nickname}</span>} />
            <InfoRow label="동물" value={job.petInfo} full />
          </div>

          {/* 요청 상세 */}
          <div className={`tw:p-5 tw:rounded-2xl ${ZOO_BORDER} tw:bg-[#FFF7F7]`}>
            <div className="tw:flex tw:items-center tw:gap-2 tw:text-[#F27A7A] tw:font-bold">
              <span>📌</span>
              <span>요청 상세</span>
            </div>
            <div className="tw:mt-2 tw:leading-7 tw:text-[#444]">{job.memo || '요청사항이 없습니다.'}</div>
          </div>

          {/* 액션 버튼 그룹 */}
          <div className="tw:flex tw:flex-col md:tw:flex-row tw:items-center tw:justify-between tw:gap-3 tw:mt-8">
            <div className="tw:flex tw:gap-2">
              {(isOwner || isAdmin) && (
                <>
                  <Link to={`/parttime/update/${job.jobId}`} className={BTN_OUTLINE_PRIMARY}>수정</Link>
                  <button onClick={onDelete} className={BTN_PRIMARY} disabled={deleting}>
                    {deleting ? '삭제중…' : '삭제'}
                  </button>
                </>
              )}
            </div>
            <Link to="/parttime/list" className={BTN_OUTLINE_PRIMARY}>목록으로</Link>
          </div>
        </div>

        {/* 알림 메시지 카드 */}
        {(successMessage || errorMessage) && (
          <div className={`${ZOO_CARD} tw:p-5 tw:mb-8`}>
            <div className="tw:text-center tw:mb-3">
              <h6 className="tw:text-gray-500">📝 신청 처리 결과</h6>
            </div>
            {successMessage && (
              <div className="tw:bg-green-100 tw:text-green-700 tw:text-center tw:rounded tw:p-2 tw:mb-2">{successMessage}</div>
            )}
            {errorMessage && (
              <div className="tw:bg-red-100 tw:text-red-700 tw:text-center tw:rounded tw:p-2 tw:mb-2">{errorMessage}</div>
            )}
          </div>
        )}

        {/* 비로그인 상태 */}
        {!user && (
          <div className={`${ZOO_CARD} tw:p-6 tw:text-center tw:mb-8`}>
            <p className="tw:mb-3 tw:text-[#555]">로그인 후 신청할 수 있어요.</p>
            <Link to="/login" className={BTN_PRIMARY}>🔐 로그인 후 신청하기</Link>
          </div>
        )}

        {/* 신청 폼 */}
        {user && !isOwner && !hasApplied && (
          <div className={`${ZOO_CARD} tw:p-6 md:tw:p-8 tw:mb-8`}>
            <form onSubmit={onApply} className="tw:space-y-4">
              <div>
                <label htmlFor="introduction" className="tw:font-semibold tw:mb-2 tw:block">자기소개</label>
                <textarea id="introduction" name="introduction" className="tw:border tw:rounded-xl tw:w-full tw:p-3 tw:leading-7 focus:tw:ring-2 focus:tw:ring-rose-200" rows="4" required />
              </div>
              {/* 취소(왼쪽, 목록과 동일 색상) + 신청하기(오른쪽) */}
              <div className="tw:flex tw:justify-between">
                <Link to="/parttime/list" className={BTN_OUTLINE_PRIMARY}>취소</Link>
                <button type="submit" className={BTN_PRIMARY}>신청하기</button>
              </div>
            </form>
          </div>
        )}

        {/* 내가 신청한 내역 */}
          {user && (isAdmin || !isOwner) && hasApplied && myApplication && (
            <div className={`${ZOO_CARD} tw:p-6 md:tw:p-8 tw:mb-8`}>
              <h5 className="tw:font-bold tw:mb-4">📋 나의 신청</h5>
              <div className="tw:border tw:rounded-xl tw:bg-gray-50 tw:p-4 tw:leading-7">
                <div><strong>🧑‍💼 소개 :</strong> {myApplication.introduction}</div>
                {!isSelfMyApplication && (
                  <div className="tw:mt-2">
                    <strong>📧 이메일:</strong> {myApplication.email ?? myApplication.user_email ?? myApplication.userEmail}<br />
                    <strong>📱 전화번호:</strong> {myApplication.phone ?? myApplication.user_phone ?? myApplication.userPhone}
                  </div>
                )}
                <div className="tw:text-end tw:mt-3">
                  <button onClick={() => onCancel(myApplication.applicantId)} className={BTN_OUTLINE_PRIMARY}>
                    신청 취소
                  </button>
                </div>
              </div>
            </div>
          )}

        {/* 작성자 전용 지원자 목록 */}
          {user && isOwner && (
            <div className={`${ZOO_CARD} tw:p-6 md:tw:p-8`}>
              <h5 className="tw:font-bold tw:mb-4 tw:flex tw:items-center tw:gap-2">
                <span>📋 지원자 목록</span>
                <span className="tw:text-xs tw:text-rose-500 tw:bg-rose-50 tw:border tw:border-rose-100 tw:px-2 tw:py-0.5 tw:rounded-full">
                  {applicants.length}명
                </span>
              </h5>

              {applicants.length === 0 ? (
                <div className="tw:text-gray-400">현재 지원자가 없습니다.</div>
              ) : (
                <div className="tw:space-y-4 md:tw:space-y-5">
                  {applicants.map(app => (
                    <div
                      key={app.applicantId}
                      className="tw:border tw:p-5 md:tw:p-6 tw:rounded-2xl tw:bg-white tw:shadow-sm"
                    >
                      <div className="tw:flex tw:justify-between tw:items-start tw:gap-5 md:tw:gap-8">
                        {/* 왼쪽: 내용 */}
                        <div className="tw:leading-7 tw:space-y-2.5">
                          <div>
                            <strong>🧑‍💼 닉네임:</strong>{' '}
                            {app.user?.nickname ?? app.user_nickname ?? app.userNickname ?? app.nickname ?? `(ID: ${app.userId})`}
                          </div>
                          <div className="tw:text-[#444]"><strong>✍</strong> {app.introduction}</div>

                          {openContacts.has(app.applicantId) && (
                            <div className="tw:mt-2 tw:animate-[fadeIn_200ms_ease-out] tw:space-y-1.5">
                              <div>
                                <strong>📧 이메일:</strong>{' '}
                                {app.email ?? app.user_email ?? app.userEmail ?? app.user?.email ?? '없음'}
                              </div>
                              <div>
                                <strong>📱 전화번호:</strong>{' '}
                                {app.phone ?? app.user_phone ?? app.userPhone ?? app.user?.phone ?? '없음'}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 오른쪽: 액션 */}
                        <div className="tw:text-end tw:min-w-[180px] md:tw:border-l md:tw:border-rose-100 md:tw:pl-6">
                          <p className="tw:text-gray-400 tw:mb-2 tw:text-xs">{app.createdAt}</p>

                          <button
                            type="button"
                            className={`${BTN_PRIMARY} tw:gap-2 tw:leading-none tw:whitespace-nowrap tw:h-9 tw:min-w-[140px] tw:px-5 tw:py-2.5 tw:text-base`}
                            onClick={() => toggleContact(app.applicantId)}
                          >
                            <span className="tw:inline-block tw:align-middle">📞</span>
                            <span className="tw:align-middle">연락처 보기</span>
                          </button>

                          {user.userId === app.userId && (
                            <button
                              type="button"
                              className={`${BTN_OUTLINE_PRIMARY} tw:mt-2`}
                              onClick={() => onCancel(app.applicantId)}
                              title="내 신청 취소"
                            >
                              ❌
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            {/* 페이지네이션 */}
            {totalApplicantPages > 1 && (
              <nav className="tw:mt-6 tw:flex tw:justify-center">
                <ul className="tw:flex tw:gap-1">
                  <li>
                    <button
                      className={`${BTN_OUTLINE_PRIMARY} ${applicantPage === 1 ? 'tw:opacity-50 tw:cursor-not-allowed' : ''}`}
                      onClick={() => onPageChange(applicantPage - 1)}
                      disabled={applicantPage === 1}
                    >
                      이전
                    </button>
                  </li>
                  {[...Array(totalApplicantPages)].map((_, i) => (
                    <li key={i + 1}>
                      <button
                        className={`${BTN_OUTLINE_PRIMARY} ${i + 1 === applicantPage ? '!tw:bg-[#F27A7A] !tw:text-white' : ''}`}
                        onClick={() => onPageChange(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      className={`${BTN_OUTLINE_PRIMARY} ${applicantPage === totalApplicantPages ? 'tw:opacity-50 tw:cursor-not-allowed' : ''}`}
                      onClick={() => onPageChange(applicantPage + 1)}
                      disabled={applicantPage === totalApplicantPages}
                    >
                      다음
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        )}
      </div>

      {/* keyframes: 간단한 페이드인 */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-2px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}

// ── 소형 컴포넌트 ───────────────────────────────────────────────
function InfoRow({ label, value, full }) {
  return (
    <div className={`tw:flex tw:gap-4 ${full ? 'md:tw:col-span-2' : ''}`}>
      <div className="tw:w-24 tw:shrink-0 tw:font-semibold tw:text-[#444]">{label} :</div>
      <div className="tw:flex-1 tw:text-[#333]">{value}</div>
    </div>
  )
}

export default Read
