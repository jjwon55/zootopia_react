import { useEffect, useState } from "react";
// ✅ SweetAlert helpers
import { toastSuccess, toastError } from "../../../apis/posts/alert";
import { Mail } from "lucide-react";
import SendMessageModal from "../../message/SendMessageModal";

// ✅ 허용 역할(프론트도 백엔드와 맞춰 2개만)
const ROLE_OPTIONS = ["ROLE_USER", "ROLE_ADMIN"];

/**
 * UserDetailDrawer
 * variant: 'drawer' | 'modal'  (기본: drawer)
 */
export default function UserDetailDrawer({ user, onClose, onSaveBasic, onSaveRoles, onToggleBan, variant = 'drawer' }) {
  const [nickname, setNickname] = useState(user.nickname || "");
  const [status, setStatus] = useState(user.status || "ACTIVE");
  const [memo, setMemo] = useState(user.memo || "");
  const [roles, setRoles] = useState(user.roles || []);

  // 로딩/중복 클릭 방지
  const [savingBasic, setSavingBasic] = useState(false);
  const [savingRoles, setSavingRoles] = useState(false);

  // 쪽지 보내기 모달 상태 관리
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageRecipient, setMessageRecipient] = useState(null);

  // 라우팅 핸들러 -> 모달 핸들러로 변경
  const handleSendMessage = (user) => {
    setMessageRecipient(user);
    setMessageModalOpen(true);
  };

  // 🔁 외부 user 변경 시 폼 초기화
  useEffect(() => {
    setNickname(user.nickname || "");
    setStatus(user.status || "ACTIVE");
    setMemo(user.memo || "");
    setRoles(user.roles?.filter(r => ROLE_OPTIONS.includes(r)) || []); // ✅ 불필요 역할 클린업
  }, [user]);

  // ⎋ ESC로 닫기 지원
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const toggleRole = (r) => {
    setRoles(prev => prev.includes(r) ? prev.filter(x=>x!==r) : [...prev, r]);
  };

  const handleSaveBasic = async () => {
    try {
      setSavingBasic(true);
      await onSaveBasic({ nickname, status, memo });
      toastSuccess("저장 완료");
    } catch(e) {
      console.error(e);
      toastError("저장 실패");
    } finally {
      setSavingBasic(false);
    }
  };

  const handleSaveRoles = async () => {
    try {
      setSavingRoles(true);
      const safe = (roles || []).filter(r => ROLE_OPTIONS.includes(r));
      await onSaveRoles(safe);
      toastSuccess("역할 저장 완료");
    } catch(e) {
      console.error(e);
      toastError("역할 저장 실패");
    } finally {
      setSavingRoles(false);
    }
  };

  // ⚠️ 정지/해제는 부모에서 Confirm + 실행을 담당
  const handleToggleBanRequest = () => {
     onToggleBan && onToggleBan(user);
  };

  const StatusBadge = ({ value }) => (
    <span className={`tw:badge tw:badge-sm ${value==='SUSPENDED' ? 'tw:badge-error' : 'tw:badge-success'}`}>{value}</span>
  );

  const isModal = variant === 'modal';

  return (
    <div className="tw:fixed tw:inset-0 tw:z-50 tw:flex tw:items-center tw:justify-center" aria-hidden="false">
      {/* Backdrop */}
      <div className="tw:absolute tw:inset-0 tw:bg-black/30 tw:backdrop-blur-[1px]" onClick={onClose} />

      {/* Panel */}
      <aside
        className={[
          "tw:relative tw:bg-white tw:shadow-2xl tw:border tw:border-gray-100 tw:flex tw:flex-col",
          isModal
            ? "tw:w-[min(92vw,720px)] tw:max-h-[88vh] tw:rounded-2xl"
            : "tw:fixed tw:right-0 tw:top-0 tw:h-full tw:w-full md:tw:max-w-xl tw:border-l"
        ].join(' ')}
        role="dialog"
        aria-modal="true"
        aria-label={`회원 상세 #${user.userId}`}
        onClick={(e)=>e.stopPropagation()}
      >
        {/* Header */}
        <header className="tw:flex tw:items-center tw:justify-between tw:px-6 tw:py-4 tw:border-b tw:border-gray-100">
          <div className="tw:space-y-0.5">
            <h2 className="tw:text-lg tw:font-semibold">회원 상세 #{user.userId}</h2>
            <div className="tw:text-xs tw:text-gray-500 tw:flex tw:flex-wrap tw:items-center tw:gap-2">
              <code className="tw:text-[11px] tw:bg-gray-100 tw:px-1.5 tw:py-0.5 tw:rounded">{user.email}</code>
              <StatusBadge value={status} />
              <div className="tw:flex tw:flex-wrap tw:gap-1">
                {(roles || []).map(r => (
                  <span key={r} className="tw:badge tw:badge-outline tw:badge-xs">{r}</span>
                ))}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="tw:px-3 tw:py-1.5 tw:rounded-md tw:bg-gray-200 hover:tw:bg-gray-300"
            onClick={onClose}
            aria-label="닫기"
          >닫기</button>
        </header>

        {/* Body */}
        <section className={`tw:flex-1 tw:overflow-y-auto tw:px-6 tw:py-6 tw:space-y-6 ${isModal ? 'tw:max-h-[calc(88vh-56px-64px)]' : ''}`}>
          {/* 기본 정보 */}
          <div className="tw:space-y-4">
            <div>
              <label className="tw:text-sm tw:text-gray-600">닉네임</label>
              <input
                className="tw:w-full tw:mt-1 tw:rounded-xl tw:border tw:border-gray-300 tw:px-3 tw:py-2 focus:tw:ring-2 focus:tw:ring-blue-500"
                value={nickname}
                onChange={e=>setNickname(e.target.value)}
                autoFocus
              />
            </div>

            <div className="tw:grid tw:grid-cols-1 sm:tw:grid-cols-2 tw:gap-4">
              <div>
                <label className="tw:text-sm tw:text-gray-600">상태</label>
                <select
                  className="tw:w-full tw:mt-1 tw:rounded-xl tw:border tw:border-gray-300 tw:px-2 tw:py-2"
                  value={status}
                  onChange={e=>setStatus(e.target.value)}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                </select>
              </div>
              <div>
                <label className="tw:text-sm tw:text-gray-600">게시글/댓글</label>
                <div className="tw:mt-1 tw:flex tw:gap-3">
                  <div className="tw:bg-gray-50 tw:rounded-lg tw:px-3 tw:py-2 tw:text-center tw:flex-1">
                    <div className="tw:text-xs tw:text-gray-500">게시글</div>
                    <div className="tw:text-lg tw:font-bold">{user.postCount ?? 0}</div>
                  </div>
                  <div className="tw:bg-gray-50 tw:rounded-lg tw:px-3 tw:py-2 tw:text-center tw:flex-1">
                    <div className="tw:text-xs tw:text-gray-500">댓글</div>
                    <div className="tw:text-lg tw:font-bold">{user.commentCount ?? 0}</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="tw:text-sm tw:text-gray-600">운영 메모</label>
              <textarea
                className="tw:w-full tw:mt-1 tw:rounded-xl tw:border tw:border-gray-300 tw:px-3 tw:py-2"
                rows={4}
                value={memo}
                onChange={e=>setMemo(e.target.value)}
                placeholder="유저 특이사항/관리 메모를 적어두세요"
              />
            </div>
          </div>

          {/* 역할 섹션 */}
          <div>
            <div className="tw:flex tw:items-center tw:justify-between">
              <h3 className="tw:text-sm tw:font-semibold tw:text-gray-700">역할</h3>
            </div>
            <div className="tw:flex tw:flex-wrap tw:gap-2 tw:mt-2">
              {ROLE_OPTIONS.map(r => (
                <button
                  key={r}
                  type="button"   // ✅ 기본 submit 방지
                  className={`tw:px-3 tw:py-1 tw:rounded-full tw:text-sm tw:border tw:transition-colors ${roles.includes(r)
                    ? 'tw:bg-blue-600 tw:text-white tw:border-blue-600'
                    : 'tw:bg-white tw:text-gray-700 tw:border-gray-300 hover:tw:bg-gray-50'}`}
                  onClick={()=>toggleRole(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Footer (sticky) */}
        <footer className="tw:px-6 tw:py-4 tw:border-t tw:border-gray-100 tw:bg-white tw:flex tw:flex-wrap tw:gap-2">
          <button
            type="button"  // ✅ 버튼 타입 명시
            className="tw:px-4 tw:py-2 tw:rounded-md tw:bg-blue-600 tw:text-white hover:tw:bg-blue-700 disabled:tw:opacity-50"
            onClick={handleSaveBasic}
            disabled={savingBasic}
          >
            {savingBasic ? "저장 중..." : "기본정보 저장"}
          </button>
          <button
            type="button"  // ✅ 버튼 타입 명시
            className="tw:px-4 tw:py-2 tw:rounded-md tw:bg-gray-200 hover:tw:bg-gray-300 disabled:tw:opacity-50"
            onClick={handleSaveRoles}
            disabled={savingRoles}
          >
            {savingRoles ? "저장 중..." : "역할 저장"}
          </button>
          <button
            type="button"
            onClick={handleSendMessage.bind(null, user)}
            className="tw:leading-8 tw:w-[125px] tw:flex tw:gap-[5px] tw:text-center tw:px-1 tw:py-1 tw:bg-[#ffdcdc] hover:tw:bg-gray-50 tw:cursor-pointer tw:items-center
                    tw:hover:bg-[#ff9191] tw:hover:text-[#ffffff] tw:rounded-[10px] tw:hover:transition-all tw:duration-200 tw:group "
            role="menuitem"
          >
            <Mail className='tw:text-[#ff9191] tw:group-hover:text-[#ff3535]'/>쪽지 보내기
          </button>
          <div className="tw:flex-1" />
          <button
            type="button"  // ✅ 버튼 타입 명시
            className={`tw:px-4 tw:py-2 tw:rounded-md tw:text-white ${status==='SUSPENDED'?'tw:bg-green-600 hover:tw:bg-green-700':'tw:bg-yellow-500 hover:tw:bg-yellow-600'}`}
            onClick={handleToggleBanRequest}
          >
            {status==='SUSPENDED' ? '정지 해제' : '정지'}
          </button>
        </footer>
      </aside>
      {/* 쪽지 보내기 모달 */}
      <SendMessageModal
        open={messageModalOpen}
        onClose={() => setMessageModalOpen(false)}
        recipient={messageRecipient}/>
    </div>
  );
}