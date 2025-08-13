import React from 'react'
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
  // 권한
  const isOwner = loginUserId === writerId
  const roles =
    user?.roles ??
    user?.authorities ??
    (user?.authList ? user.authList.map(a => a.auth || a.role) : []) ??
    []
  const flatRoles = Array.isArray(roles) ? roles : [roles]
  const isAdmin =
    flatRoles.includes('ROLE_ADMIN') ||
    flatRoles.includes('ADMIN') ||
    user?.role === 'ADMIN' ||
    user?.role === 'ROLE_ADMIN'

  const isSelfMyApplication =
      !!(user && myApplication &&
      user.userId === (myApplication.userId ?? myApplication.user_id));

  // 🎨 주토피아 톤(Primary)
  const BTN_BASE =
     'inline-flex items-center justify-center h-10 px-4 text-sm font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-[#F27A7A]/30 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap'

  const BTN_PRIMARY =
    `${BTN_BASE} border bg-[#F27A7A] text-white shadow-sm hover:bg-[#e86e6e] active:bg-[#d86464]`

  const BTN_OUTLINE_PRIMARY =
    `${BTN_BASE} border border-[#F27A7A] text-[#F27A7A] bg-white hover:bg-[#F27A7A]/10 active:bg-[#F27A7A]/20`

  const BTN_NEUTRAL =
    `${BTN_BASE} border bg-gray-200 text-gray-700 hover:bg-gray-300`


  return (
    <div className="mx-auto w-full max-w-[800px] px-4 py-8 min-h-screen">
      <h3 className="text-center mb-10 text-2xl font-bold">상세 내용</h3>

      {/* 본문 카드: 세로 여유 크게 */}
      <div className="bg-white rounded shadow p-6 md:p-8 mb-8 mt-10 min-h-[650px]">
        <h5 className="mb-10 text-center text-[#F27A7A] text-2xl font-extrabold">
          {job.title}
        </h5>

        <div className="space-y-3 mb-10 mt-10">
          <div className="flex">
            <div className="w-1/3 font-semibold mb-1">지역 :</div>
            <div className="w-2/3">{job.location}</div>
          </div>
          <div className="flex">
            <div className="w-1/3 font-semibold mb-1">날짜 :</div>
            <div className="w-2/3">{job.startDate} ~ {job.endDate}</div>
          </div>
          <div className="flex">
            <div className="w-1/3 font-semibold mb-1">보수 :</div>
            <div className="w-2/3 font-bold text-[#2563eb]">{job.pay}원</div>
          </div>
          <div className="flex">
            <div className="w-1/3 font-semibold mb-1">보호자 :</div>
            <div className="w-2/3 font-bold text-[#22c55e]">{job.nickname}</div>
          </div>
          <div className="flex">
            <div className="w-1/3 font-semibold mb-10">동물 :</div>
            <div className="w-2/3">{job.petInfo}</div>
          </div>
        </div>

        <div className="bg-[#FFF5F5] p-4 rounded border border-[#F27A7A]/30 mb-10">
          <strong className="text-[#F27A7A]">요청 상세</strong>
          <div className="mt-2 leading-7">{job.memo || '요청사항이 없습니다.'}</div>
        </div>

        {/* 버튼 그룹: 주토피아 컬러로 통일 */}
      <div className="flex justify-end gap-3 mt-10">
        {(isOwner || isAdmin) && (
          <>
            <Link to={`/parttime/update/${job.jobId}`} className={BTN_PRIMARY}>
              수정
            </Link>
            <button onClick={onDelete} className={BTN_PRIMARY} disabled={deleting}>
              {deleting ? '삭제중…' : '삭제'}
            </button>
          </>
        )}
        <Link to="/parttime/list" className={BTN_OUTLINE_PRIMARY}>
          목록
        </Link>
      </div>
      </div>

      {(successMessage || errorMessage) && (
        <div className="bg-white rounded shadow p-4 mb-8">
          <div className="text-center mb-3">
            <h6 className="text-gray-500">📝 신청 처리 결과 메시지</h6>
          </div>
          {successMessage && (
            <div className="bg-green-100 text-green-700 text-center rounded p-2 mb-2">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="bg-red-100 text-red-700 text-center rounded p-2 mb-2">
              {errorMessage}
            </div>
          )}
        </div>
      )}

      {/* 비로그인 */}
      {!user && (
        <div className="text-center mt-10">
          <Link to="/login" className={BTN_PRIMARY}>
            🔐 로그인 후 신청하기
          </Link>
        </div>
      )}

      {/* 신청 폼 */}
      {user && !isOwner && !hasApplied && (
        <div className="bg-white rounded shadow p-6 md:p-8 mb-8">
          <form onSubmit={onApply} className="space-y-4">
            <div>
              <label htmlFor="introduction" className="font-semibold mb-2 block">
                자기소개
              </label>
              <textarea
                id="introduction"
                name="introduction"
                className="border rounded w-full p-3 leading-7"
                rows="4"
                required
              />
            </div>
            <div className="flex justify-between">
              <Link to="/parttime/list" className={BTN_NEUTRAL}>
                취소
              </Link>
              <button type="submit" className={BTN_PRIMARY}>
                신청하기
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 내가 신청한 내역 */}
      {user && !isOwner && hasApplied && myApplication && (
        <div className="bg-white rounded shadow p-6 md:p-8 mb-8">
          <h5 className="font-bold mb-4">📋 지원자 목록</h5>
          <div className="border rounded bg-gray-50 p-4 leading-7">
            <div><strong>🧑‍💼 나 :</strong> {myApplication.introduction}</div>
             {/* 자기 자신이면 연락처 숨김 */}
             {!isSelfMyApplication && (
               <div className="mt-2">
                 <strong>📧 이메일:</strong> {myApplication.email ?? myApplication.user_email ?? myApplication.userEmail}<br />
                 <strong>📱 전화번호:</strong> {myApplication.phone ?? myApplication.user_phone ?? myApplication.userPhone}
               </div>
             )}
            <div className="text-end mt-3">
            <button
              onClick={() => onCancel(myApplication.applicantId)}   // ✅ id 넘기기
              className={BTN_OUTLINE_PRIMARY}
            >
              신청 취소
            </button>
            </div>
          </div>
        </div>
      )}

      {/* 작성자 전용 지원자 목록 */}
      {user && isOwner && (
        <div className="bg-white rounded shadow p-6 md:p-8">
          <h5 className="font-bold mb-4">📋 지원자 목록</h5>
          {applicants.length === 0 ? (
            <div className="text-gray-400">현재 지원자가 없습니다.</div>
          ) : (
            applicants.map(app => (
              <div key={app.applicantId} className="mb-3 border p-4 rounded bg-gray-50">
                <div className="flex justify-between items-start gap-4">
                  <div className="leading-7">
                    <div>
                      <strong>🧑‍💼 닉네임:</strong>{' '}
                      {app.user?.nickname
                        ?? app.user_nickname
                        ?? app.userNickname
                        ?? app.nickname
                        ?? `(ID: ${app.userId})`}
                    </div>
                    <div><strong>✍</strong> {app.introduction}</div>
                  </div>

                  <div className="text-end">
                    <p className="text-gray-400 mb-1 text-xs">{app.createdAt}</p>

                    <button
                      className={`${BTN_PRIMARY} gap-2 leading-none whitespace-nowrap
                                  h-9 min-w-[140px] px-5 py-2.5 text-base mt-4`}
                      onClick={() => onToggleContact(app.applicantId)}
                    >
                      <span className="inline-block align-middle">📞</span>
                      <span className="align-middle">연락처 보기</span>
                    </button>

                    {/* ✅ 처음엔 숨김, 토글 시 표시 */}
                     <div id={`contact-${app.applicantId}`} className="mt-2 leading-7 hidden">
                       <div>
                         <strong>📧 이메일:</strong>{' '}
                         {app.email ?? app.user_email ?? app.userEmail ?? app.user?.email ?? '없음'}
                       </div>
                       <div>
                         <strong>📱 전화번호:</strong>{' '}
                         {app.phone ?? app.user_phone ?? app.userPhone ?? app.user?.phone ?? '없음'}
                       </div>
                     </div>

                    {user.userId === app.userId && (
                      <button
                        className={`${BTN_OUTLINE_PRIMARY} mt-2`}
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
            <nav className="mt-6 flex justify-center">
              <ul className="flex gap-1">
                <li>
                  <button
                    className={`${BTN_OUTLINE_PRIMARY} ${applicantPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => onPageChange(applicantPage - 1)}
                    disabled={applicantPage === 1}
                  >
                    이전
                  </button>
                </li>
                {[...Array(totalApplicantPages)].map((_, i) => (
                  <li key={i + 1}>
                    <button
                      className={`${BTN_OUTLINE_PRIMARY} ${i + 1 === applicantPage ? '!bg-[#F27A7A] !text-white' : ''}`}
                      onClick={() => onPageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    className={`${BTN_OUTLINE_PRIMARY} ${applicantPage === totalApplicantPages ? 'opacity-50 cursor-not-allowed' : ''}`}
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