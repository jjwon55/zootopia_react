import { useEffect, useState } from "react";
import { useToast } from "../../../components/admin/common/Toaster";

// ✅ 허용 역할(프론트도 백엔드와 맞춰 2개만)
const ROLE_OPTIONS = ["ROLE_USER", "ROLE_ADMIN"];

export default function UserDetailDrawer({ user, onClose, onSaveBasic, onSaveRoles, onToggleBan }) {
  const [nickname, setNickname] = useState(user.nickname || "");
  const [status, setStatus] = useState(user.status || "ACTIVE");
  const [memo, setMemo] = useState(user.memo || "");
  const [roles, setRoles] = useState(user.roles || []);

  // 로딩/중복 클릭 방지
  const [savingBasic, setSavingBasic] = useState(false);
  const [savingRoles, setSavingRoles] = useState(false);

  const { toast, oops, node: toastNode } = useToast();

  useEffect(() => {
    setNickname(user.nickname || "");
    setStatus(user.status || "ACTIVE");
    setMemo(user.memo || "");
    setRoles(user.roles?.filter(r => ROLE_OPTIONS.includes(r)) || []); // ✅ 불필요 역할 클린업
  }, [user]);

  const toggleRole = (r) => {
    setRoles(prev => prev.includes(r) ? prev.filter(x=>x!==r) : [...prev, r]);
  };

  const handleSaveBasic = async () => {
    try {
      setSavingBasic(true);
      await onSaveBasic({ nickname, status, memo });
      toast("저장 완료");
    } catch(e) {
      oops("저장 실패");
    } finally {
      setSavingBasic(false);
    }
  };

  const handleSaveRoles = async () => {
    try {
      setSavingRoles(true);
      const safe = (roles || []).filter(r => ROLE_OPTIONS.includes(r));
      await onSaveRoles(safe);
      toast("역할 저장 완료");
    } catch(e) {
      oops("역할 저장 실패");
    } finally {
      setSavingRoles(false);
    }
  };

  // ⚠️ 정지/해제는 부모에서 Confirm + 실행을 담당
  const handleToggleBanRequest = () => {
     onToggleBan && onToggleBan(user);
  };

  return (
    <div className="tw:fixed tw:inset-0 tw:bg-black/30 tw:z-50" onClick={onClose}>
      <aside
        className="tw:absolute tw:right-0 tw:top-0 tw:h-full tw:w-full md:tw:max-w-xl tw:bg-white tw:shadow-2xl tw:p-6 tw:overflow-y-auto"
        onClick={e=>e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`회원 상세 #${user.userId}`}
      >
        <div className="tw:flex tw:items-center tw:justify-between tw:mb-4">
          <h2 className="tw:text-xl tw:font-semibold">회원 상세 #{user.userId}</h2>
          <button type="button" className="tw:px-3 tw:py-1.5 tw:rounded-md tw:bg-gray-200 hover:tw:bg-gray-300" onClick={onClose}>닫기</button>
        </div>

        <section className="tw:space-y-4">
          <div>
            <span className="tw:text-gray-500">이메일</span>
            <div className="tw:font-mono">{user.email}</div>
          </div>

          <div>
            <label className="tw:text-sm tw:text-gray-600">닉네임</label>
            <input
              className="tw:w-full tw:mt-1 tw:rounded-lg tw:border tw:border-gray-300 tw:px-3 tw:py-2 focus:tw:ring-2 focus:tw:ring-blue-500"
              value={nickname}
              onChange={e=>setNickname(e.target.value)}
            />
          </div>

          <div>
            <label className="tw:text-sm tw:text-gray-600">상태</label>
            <select
              className="tw:w-full tw:mt-1 tw:rounded-lg tw:border tw:border-gray-300 tw:px-2 tw:py-2"
              value={status}
              onChange={e=>setStatus(e.target.value)}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="SUSPENDED">SUSPENDED</option>
            </select>
          </div>

          <div>
            <label className="tw:text-sm tw:text-gray-600">운영 메모</label>
            <textarea
              className="tw:w-full tw:mt-1 tw:rounded-lg tw:border tw:border-gray-300 tw:px-3 tw:py-2"
              rows={4}
              value={memo}
              onChange={e=>setMemo(e.target.value)}
            />
          </div>

          <div>
            <div className="tw:text-gray-700 tw:font-semibold tw:mt-4">역할</div>
            <div className="tw:flex tw:flex-wrap tw:gap-2 tw:mt-2">
              {ROLE_OPTIONS.map(r => (
                <button
                  key={r}
                  type="button"   // ✅ 기본 submit 방지
                  className={`tw:px-3 tw:py-1 tw:rounded-md tw:text-sm tw:border ${roles.includes(r) ? 'tw:bg-blue-600 tw:text-white' : 'tw:bg-gray-100 hover:tw:bg-gray-200'}`}
                  onClick={()=>toggleRole(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="tw:mt-6 tw:grid tw:grid-cols-2 tw:gap-4">
            <div className="tw:bg-gray-50 tw:rounded-lg tw:p-4 tw:text-center">
              <div className="tw:text-gray-500 tw:text-sm">게시글</div>
              <div className="tw:text-2xl tw:font-bold">{user.postCount ?? 0}</div>
            </div>
            <div className="tw:bg-gray-50 tw:rounded-lg tw:p-4 tw:text-center">
              <div className="tw:text-gray-500 tw:text-sm">댓글</div>
              <div className="tw:text-2xl tw:font-bold">{user.commentCount ?? 0}</div>
            </div>
          </div>
        </section>

        <div className="tw:mt-8 tw:flex tw:flex-wrap tw:gap-2">
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
            type="button"  // ✅ 버튼 타입 명시
            className={`tw:px-4 tw:py-2 tw:rounded-md tw:text-white ${status==='SUSPENDED'?'tw:bg-green-600 hover:tw:bg-green-700':'tw:bg-yellow-500 hover:tw:bg-yellow-600'}`}
            onClick={handleToggleBanRequest}
          >
            {status==='SUSPENDED' ? '정지 해제' : '정지'}
          </button>
        </div>

        {toastNode}
      </aside>
    </div>
  );
}
