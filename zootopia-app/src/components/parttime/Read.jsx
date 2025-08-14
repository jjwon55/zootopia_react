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

  // 버튼 유틸
  const BTN_BASE =
    'tw:inline-flex tw:items-center tw:justify-center tw:h-10 tw:px-4 tw:text-sm tw:font-medium tw:rounded tw:transition-colors focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#F27A7A]/30 disabled:tw:opacity-60 disabled:tw:cursor-not-allowed tw:whitespace-nowrap'
  const BTN_PRIMARY =
    `${BTN_BASE} tw:border tw:bg-[#F27A7A] tw:text-white tw:shadow-sm hover:tw:bg-[#e86e6e] active:tw:bg-[#d86464]`
  const BTN_OUTLINE_PRIMARY =
    `${BTN_BASE} tw:border tw:border-[#F27A7A] tw:text-[#F27A7A] tw:bg-white hover:tw:bg-[#F27A7A]/10 active:tw:bg-[#F27A7A]/20`
  const BTN_NEUTRAL =
    `${BTN_BASE} tw:border tw:bg-gray-200 tw:text-gray-700 hover:tw:bg-gray-300`

  return (
    <div className="tw:mx-auto tw:w-full tw:max-w-[800px] tw:px-4 tw:py-8 tw:min-h-screen">
      <h3 className="tw:text-center tw:mb-10 tw:text-2xl tw:font-bold">상세 내용</h3>

      {/* 본문 카드 */}
      <div className="tw:bg-white tw:rounded tw:shadow tw:p-6 md:tw:p-8 tw:mb-8 tw:mt-10 tw:min-h-[650px]">
        <h5 className="tw:mb-10 tw:text-center tw:text-[#F27A7A] tw:text-2xl tw:font-extrabold">
          {job.title}
        </h5>

        <div className="tw:space-y-3 tw:mb-10 tw:mt-10">
          <div className="tw:flex">
            <div className="tw:w-1/3 tw:font-semibold tw:mb-1">지역 :</div>
            <div className="tw:w-2/3">{job.location}</div>
          </div>
          <div className="tw:flex">
            <div className="tw:w-1/3 tw:font-semibold tw:mb-1">날짜 :</div>
            <div className="tw:w-2/3">{job.startDate} ~ {job.endDate}</div>
          </div>
          <div className="tw:flex">
            <div className="tw:w-1/3 tw:font-semibold tw:mb-1">보수 :</div>
            <div className="tw:w-2/3 tw:font-bold tw:text-[#2563eb]">{job.pay}원</div>
          </div>
          <div className="tw:flex">
            <div className="tw:w-1/3 tw:font-semibold tw:mb-1">보호자 :</div>
            <div className="tw:w-2/3 tw:font-bold tw:text-[#22c55e]">{job.nickname}</div>
          </div>
          <div className="tw:flex">
            <div className="tw:w-1/3 tw:font-semibold tw:mb-10">동물 :</div>
            <div className="tw:w-2/3">{job.petInfo}</div>
          </div>
        </div>

        <div className="tw:bg-[#FFF5F5] tw:p-4 tw:rounded tw:border tw:border-[#F27A7A]/30 tw:mb-10">
          <strong className="tw:text-[#F27A7A]">요청 상세</strong>
          <div className="tw:mt-2 tw:leading-7">{job.memo || '요청사항이 없습니다.'}</div>
        </div>

        {/* 버튼 그룹 */}
        <div className="tw:flex tw:justify-end tw:gap-3 tw:mt-10">
          {(isOwner || isAdmin) && (
            <>
              <Link to={`/parttime/update/${job.jobId}`} className={BTN_PRIMARY}>수정</Link>
              <button onClick={onDelete} className={BTN_PRIMARY} disabled={deleting}>
                {deleting ? '삭제중…' : '삭제'}
              </button>
            </>
          )}
          <Link to="/parttime/list" className={BTN_OUTLINE_PRIMARY}>목록</Link>
        </div>
      </div>

      {(successMessage || errorMessage) && (
        <div className="tw:bg-white tw:rounded tw:shadow tw:p-4 tw:mb-8">
          <div className="tw:text-center tw:mb-3">
            <h6 className="tw:text-gray-500">📝 신청 처리 결과 메시지</h6>
          </div>
          {successMessage && (
            <div className="tw:bg-green-100 tw:text-green-700 tw:text-center tw:rounded tw:p-2 tw:mb-2">{successMessage}</div>
          )}
          {errorMessage && (
            <div className="tw:bg-red-100 tw:text-red-700 tw:text-center tw:rounded tw:p-2 tw:mb-2">{errorMessage}</div>
          )}
        </div>
      )}

      {/* 비로그인 */}
      {!user && (
        <div className="tw:text-center tw:mt-10">
          <Link to="/login" className={BTN_PRIMARY}>🔐 로그인 후 신청하기</Link>
        </div>
      )}

      {/* 신청 폼 */}
      {user && !isOwner && !hasApplied && (
        <div className="tw:bg-white tw:rounded tw:shadow tw:p-6 md:tw:p-8 tw:mb-8">
          <form onSubmit={onApply} className="tw:space-y-4">
            <div>
              <label htmlFor="introduction" className="tw:font-semibold tw:mb-2 tw:block">자기소개</label>
              <textarea id="introduction" name="introduction" className="tw:border tw:rounded tw:w-full tw:p-3 tw:leading-7" rows="4" required />
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
      {user && !isOwner && hasApplied && myApplication && (
        <div className="tw:bg-white tw:rounded tw:shadow tw:p-6 md:tw:p-8 tw:mb-8">
          <h5 className="tw:font-bold tw:mb-4">📋 지원자 목록</h5>
          <div className="tw:border tw:rounded tw:bg-gray-50 tw:p-4 tw:leading-7">
            <div><strong>🧑‍💼 나 :</strong> {myApplication.introduction}</div>
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
        <div className="tw:bg-white tw:rounded tw:shadow tw:p-6 md:tw:p-8">
          <h5 className="tw:font-bold tw:mb-4">📋 지원자 목록</h5>
          {applicants.length === 0 ? (
            <div className="tw:text-gray-400">현재 지원자가 없습니다.</div>
          ) : (
            applicants.map(app => (
              <div key={app.applicantId} className="tw:mb-3 tw:border tw:p-4 tw:rounded tw:bg-gray-50">
                <div className="tw:flex tw:justify-between tw:items-start tw:gap-4">
                  <div className="tw:leading-7">
                    <div>
                      <strong>🧑‍💼 닉네임:</strong>{' '}
                      {app.user?.nickname ?? app.user_nickname ?? app.userNickname ?? app.nickname ?? `(ID: ${app.userId})`}
                    </div>
                    <div><strong>✍</strong> {app.introduction}</div>
                  </div>

                  <div className="tw:text-end">
                    <p className="tw:text-gray-400 tw:mb-1 tw:text-xs">{app.createdAt}</p>

                    <button
                      type="button"
                      className={`${BTN_PRIMARY} tw:gap-2 tw:leading-none tw:whitespace-nowrap tw:h-9 tw:min-w-[140px] tw:px-5 tw:py-2.5 tw:text-base tw:mt-4`}
                      onClick={() => toggleContact(app.applicantId)}
                    >
                      <span className="tw:inline-block tw:align-middle">📞</span>
                      <span className="tw:align-middle">연락처 보기</span>
                    </button>

                    {/* ✅ 상태 기반 표시 (prefix 환경 안전) */}
                    {openContacts.has(app.applicantId) && (
                      <div className="tw:mt-2 tw:leading-7">
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

                    {user.userId === app.userId && (
                      <button
                        type="button"
                        className={`${BTN_OUTLINE_PRIMARY} tw:mt-2`}
                        onClick={() => onCancel(app.applicantId)}
                      >
                        ❌
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
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
  )
}

export default Read