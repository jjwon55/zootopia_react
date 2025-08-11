import React from 'react'

const Read = ({
  job,
  user,
  writerId,
  loginUserId,
  successMessage,
  errorMessage,
  hasApplied,
  isWriter,
  myApplication,
  applicants = [],
  totalApplicantPages,
  applicantPage,
  onApply,
  onDelete,
  onCancel,
  onToggleContact,
  onPageChange
}) => {
  return (
    <div className="mx-auto my-8 w-full max-w-[600px]">
      <h3 className="text-center mb-8 text-2xl font-bold">펫 시터 상세 내용</h3>

      <div className="bg-white rounded shadow p-6 mb-6">
        <h5 className="mb-6 text-center text-[#F27A7A] text-xl font-bold">{job.title}</h5>
        <div className="mb-6 text-center">
          <div className="flex mb-2">
            <div className="w-1/3 font-semibold">지역 :</div>
            <div className="w-2/3">{job.location}</div>
          </div>
          <div className="flex mb-2">
            <div className="w-1/3 font-semibold">날짜 :</div>
            <div className="w-2/3 flex flex-col items-center">
              <div>{job.startDate}</div>
              <div>~</div>
              <div>{job.endDate}</div>
            </div>
          </div>
          <div className="flex mb-2">
            <div className="w-1/3 font-semibold">보수 :</div>
            <div className="w-2/3 text-[#2563eb] font-bold">{job.pay}원</div>
          </div>
          <div className="flex mb-2">
            <div className="w-1/3 font-semibold">보호자 :</div>
            <div className="w-2/3 font-bold text-[#22c55e]">{job.nickname}</div>
          </div>
          <div className="flex">
            <div className="w-1/3 font-semibold">동물 :</div>
            <div className="w-2/3">{job.petInfo}</div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded border mb-4">
          <strong>요청 상세</strong>
          <div className="mt-2">{job.memo || '요청사항이 없습니다.'}</div>
        </div>

        {/* 버튼 그룹 */}
        {user && (
          <div className="text-end mt-4">
            {loginUserId === writerId ? (
              <div className="flex justify-end gap-2">
                <a href={`/parttime/update/${job.jobId}`} className="bg-blue-500 text-white rounded px-4 py-2 text-sm font-semibold hover:bg-blue-600 transition">수정</a>
                <button onClick={onDelete} className="bg-red-500 text-white rounded px-4 py-2 text-sm font-semibold hover:bg-red-600 transition">삭제</button>
                <a href="/parttime/list" className="bg-gray-300 text-gray-700 rounded px-4 py-2 text-sm font-semibold hover:bg-gray-400 transition">목록</a>
              </div>
            ) : (
              <a href="/parttime/list" className="bg-gray-300 text-gray-700 rounded px-4 py-2 text-sm font-semibold hover:bg-gray-400 transition">목록</a>
            )}
          </div>
        )}
      </div>

      {/* 신청 처리 메시지 */}
      {(successMessage || errorMessage) && (
        <div className="bg-white rounded shadow p-4 mb-6">
          <div className="text-center mb-3">
            <h6 className="text-gray-500">📝 신청 처리 결과 메시지</h6>
          </div>
          {successMessage && <div className="bg-green-100 text-green-700 text-center rounded p-2 mb-2">{successMessage}</div>}
          {errorMessage && <div className="bg-red-100 text-red-700 text-center rounded p-2 mb-2">{errorMessage}</div>}
        </div>
      )}

      {/* 로그인 안한 사용자 */}
      {!user && (
        <div className="text-center mt-6">
          <a href="/login" className="bg-blue-500 text-white rounded px-4 py-2 text-sm font-semibold hover:bg-blue-600 transition">🔐 로그인 후 신청하기</a>
        </div>
      )}

      {/* 신청 폼 */}
      {user && !isWriter && !hasApplied && (
        <div className="bg-white rounded shadow p-4 mb-6">
          <form onSubmit={onApply}>
            <div className="mb-4">
              <label htmlFor="introduction" className="font-semibold mb-2 block">자기소개</label>
              <textarea id="introduction" name="introduction" className="border rounded w-full p-2" rows="3" required></textarea>
            </div>
            <div className="flex justify-between">
              <a href="/parttime/list" className="border border-gray-400 rounded px-4 py-2 text-sm bg-white text-gray-700 hover:bg-gray-100 transition">취소</a>
              <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 text-sm font-semibold hover:bg-blue-600 transition">신청하기</button>
            </div>
          </form>
        </div>
      )}

      {/* 내가 신청한 내역 */}
      {user && !isWriter && hasApplied && myApplication && (
        <div className="mt-8">
          <h5 className="font-bold mb-3">📋 지원자 목록</h5>
          <div className="border p-4 rounded bg-gray-50">
            <div>
              <strong>🧑‍💼 나 :</strong> {myApplication.introduction}
            </div>
            <div className="mt-2">
              <strong>📧 이메일:</strong> {myApplication.email}<br />
              <strong>📱 전화번호:</strong> {myApplication.phone}
            </div>
            <div className="text-end mt-2">
              <button onClick={onCancel} className="border border-red-400 text-red-500 rounded px-3 py-1 text-sm hover:bg-red-100 transition">신청 취소</button>
            </div>
          </div>
        </div>
      )}

      {/* 전체 지원자 목록 - 작성자 전용 */}
      {user && loginUserId === writerId && (
        <div className="mt-8">
          <h5 className="font-bold mb-3">📋 지원자 목록</h5>
          {applicants.length === 0 ? (
            <div className="text-gray-400">현재 지원자가 없습니다.</div>
          ) : applicants.map(app => (
            <div key={app.applicantId} className="mb-3 border p-4 rounded bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <div><strong>🧑‍💼 ID:</strong> {app.userId}</div>
                  <div><strong>✍</strong> {app.introduction}</div>
                </div>
                <div className="text-end ml-4">
                  <p className="text-gray-400 mb-1 text-xs">{app.createdAt}</p>
                  <button className="bg-[#F27A7A] text-white rounded px-3 py-1 text-sm mt-1 hover:bg-[#f9d2d2] transition" onClick={() => onToggleContact(app.applicantId)}>
                    📞 연락처 보기
                  </button>
                  <div className="mt-2">
                    <div><strong>📧 이메일:</strong> {app.email}</div>
                    <div><strong>📱 전화번호:</strong> {app.phone}</div>
                  </div>
                  {user.userId === app.userId && (
                    <button className="border border-red-400 text-red-500 rounded px-3 py-1 text-sm mt-2 hover:bg-red-100 transition" onClick={() => onCancel(app.applicantId)}>
                      ❌
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* 페이지네이션 */}
          {totalApplicantPages > 1 && (
            <nav className="mt-4 flex justify-center">
              <ul className="flex gap-1">
                <li>
                  <button
                    className={`px-3 py-1 rounded border border-[#F27A7A] text-[#F27A7A] text-xs ${applicantPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#f9d2d2] transition'}`}
                    onClick={() => onPageChange(applicantPage - 1)}
                    disabled={applicantPage === 1}
                  >
                    이전
                  </button>
                </li>
                {[...Array(totalApplicantPages)].map((_, i) => (
                  <li key={i + 1}>
                    <button
                      className={`px-3 py-1 rounded border border-[#F27A7A] text-xs ${
                        i + 1 === applicantPage
                          ? 'bg-[#F27A7A] text-white font-bold'
                          : 'text-[#F27A7A] hover:bg-[#f9d2d2] transition'
                      }`}
                      onClick={() => onPageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    className={`px-3 py-1 rounded border border-[#F27A7A] text-[#F27A7A] text-xs ${applicantPage === totalApplicantPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#f9d2d2] transition'}`}
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