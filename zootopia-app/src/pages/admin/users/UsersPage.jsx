import { useEffect, useMemo, useState } from "react";
import { listUsers, getUser, banUser, updateUser, updateUserRoles } from "../../../apis/admin/users";

import UserDetailDrawer from "../../../components/admin/users/UserDetailDrawer";
import Confirm from "../../../components/admin/common/Confirm";
import { useToast } from "../../../components/admin/common/Toaster";

// ✅ 허용 역할(프론트도 2개만)
const ROLE_OPTIONS = ["ROLE_USER", "ROLE_ADMIN"];
const PAGE_SIZE = 20;

export default function UsersPage() {
  const [rows, setRows] = useState([]);
  const [pageInfo, setPageInfo] = useState({ number: 0, size: PAGE_SIZE, totalElements: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);

  const [qInput, setQInput] = useState("");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [dir, setDir] = useState("desc");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState(null);

  const params = useMemo(() => ({ q, status, role, page, size: PAGE_SIZE, sort, dir }), [q, status, role, page, sort, dir]);

  const fetchList = async () => {
    setLoading(true);
    try {
      const { data } = await listUsers(params);
      setRows(data.data || []);
      setPageInfo(data.page || pageInfo);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); /* eslint-disable-next-line */ }, [params]);

  const onOpen = async (userId) => {
    if (userId == null) return; // ✅ undefined/null 방어
    const { data } = await getUser(userId);
    const cleaned = {
      ...data.data,
      roles: (data.data?.roles || []).filter(r => ROLE_OPTIONS.includes(r)),
    };
    setSelected(cleaned);
  };
  const onClose = () => setSelected(null);

  // ✅ 부모에서 실제 정지/해제 실행
  const runBanToggle = async (userId, nextBan) => {
    if (userId == null) return; // ✅ 방어
    await banUser(userId, nextBan);
    await fetchList();
    if (selected?.userId === userId) await onOpen(userId);
  };

  const onSaveBasic = async (payload) => {
    const id = selected?.userId; // ✅ 방어
    if (id == null) return;
    await updateUser(id, payload);
    await fetchList();
    await onOpen(id); // ✅ 방어
  };

  const onSaveRoles = async (roles) => {
    const safe = (roles || []).filter(r => ROLE_OPTIONS.includes(r));
    const id = selected?.userId; // ✅ 방어
    if (id == null) return;
    await updateUserRoles(id, safe);
    await fetchList();
    await onOpen(id); // ✅ 방어
  };

  const handleSearch = () => {
    setQ(qInput);
    setPage(0);
  };

  const { toast, oops, node: toastNode } = useToast();
  const [confirm, setConfirm] = useState({ open:false, user:null, nextBan:false });
  const [actingId, setActingId] = useState(null);

  const askToggleBan = (u) => {
    setConfirm({
      open: true,
      user: u,
      nextBan: u?.status !== "SUSPENDED"
    });
  };

  const runToggleBan = async () => {
    const u = confirm.user;
    const nextBan = confirm.nextBan;
    setConfirm({ open:false, user:null, nextBan:false });
    if(!u || u?.userId == null) return; // ✅ 방어
    try {
      setActingId(u.userId);
      await runBanToggle(u.userId, nextBan);
      toast(nextBan ? "정지 완료" : "정지 해제 완료");
    } catch (e) {
      oops("처리 실패");
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className="tw:p-6 tw:space-y-6">
      <h1 className="tw:text-2xl tw:font-bold">👤 회원 관리</h1>

      {/* 🔎 검색/필터 카드 */}
      <div className="tw:bg-white tw:shadow-md tw:rounded-xl tw:p-4 tw:space-y-3">
        <div className="tw:flex tw:gap-2">
          <input
            className="tw:input tw:input-bordered tw:flex-1"
            placeholder="이메일/닉네임 검색"
            value={qInput}
            onChange={e => setQInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}  // ✅ 엔터로 검색
          />
          <button type="button" className="tw:btn tw:btn-primary" onClick={handleSearch}>검색</button> {/* ✅ type 명시 */}
        </div>

        <div className="tw:grid tw:grid-cols-2 md:tw:grid-cols-4 lg:tw:grid-cols-6 tw:gap-2">
          <select className="tw:select tw:select-bordered" value={status} onChange={e=>{setStatus(e.target.value); setPage(0);}}>
            <option value="">상태(전체)</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="SUSPENDED">SUSPENDED</option>
          </select>

          {/* ✅ 역할 필터: USER/ADMIN만 */}
          <select className="tw:select tw:select-bordered" value={role} onChange={e=>{setRole(e.target.value); setPage(0);}}>
            <option value="">역할(전체)</option>
            {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>

          <select className="tw:select tw:select-bordered" value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="createdAt">가입일</option>
            <option value="email">이메일</option>
            <option value="nickname">닉네임</option>
          </select>
          <select className="tw:select tw:select-bordered" value={dir} onChange={e=>setDir(e.target.value)}>
            <option value="desc">내림차순</option>
            <option value="asc">오름차순</option>
          </select>
        </div>
      </div>

      {/* 📋 사용자 목록 */}
      <div className="tw:overflow-x-auto tw:border tw:rounded-xl tw:bg-white tw:shadow">
        <table className="tw:table tw:table-zebra tw:w-full">
          <thead className="tw:bg-gray-100">
            <tr>
              <th>ID</th>
              <th>이메일</th>
              <th>닉네임</th>
              <th>상태</th>
              <th>역할</th>
              <th>가입일</th>
              <th>액션</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(u => {
              const safeRoles = (u.roles || []).filter(r => ROLE_OPTIONS.includes(r)); // ✅ 표시도 정리
              return (
                <tr key={u.userId} className="hover">
                  <td>{u.userId}</td>
                  <td>
                    <button
                      type="button"
                      className="tw:link tw:text-blue-600"
                      onClick={() => { if (u?.userId != null) onOpen(u.userId); }} // ✅ 방어
                    >
                      {u.email}
                    </button>
                  </td>
                  <td>{u.nickname}</td>
                  <td>
                    <span className={`tw:badge ${u.status==='SUSPENDED' ? 'tw:badge-error' : 'tw:badge-success'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td>
                    {safeRoles.length
                      ? safeRoles.map(r => <span key={r} className="tw:badge tw:badge-outline tw:mr-1">{r}</span>)
                      : <span className="tw:text-gray-400">-</span>}
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="tw:join">
                      <button
                        type="button"
                        className="tw:join-item tw:btn tw:btn-sm"
                        onClick={() => { if (u?.userId != null) onOpen(u.userId); }} // ✅ 방어
                      >
                        상세
                      </button>
                      <button
                        type="button"
                        className={`tw:join-item tw:btn tw:btn-sm ${u.status==='SUSPENDED'?'tw:btn-success':'tw:btn-warning'}`}
                        onClick={()=>askToggleBan(u)}
                        disabled={actingId===u.userId || loading}
                      >
                        {actingId===u.userId ? '처리 중...' : (u.status==='SUSPENDED' ? '해제' : '정지')}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!rows.length && (
              <tr>
                <td colSpan={7} className="tw:text-center tw:py-6 text-gray-400">데이터가 없습니다</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="tw:flex tw:items-center tw:justify-center tw:gap-2">
        <button type="button" className="tw:btn tw:btn-sm" disabled={page===0} onClick={()=>setPage(p=>p-1)}>이전</button>
        <span>{page+1} / {pageInfo.totalPages}</span>
        <button type="button" className="tw:btn tw:btn-sm" disabled={page+1>=pageInfo.totalPages} onClick={()=>setPage(p=>p+1)}>다음</button>
      </div>

      {/* 드로어 */}
      {selected && (
        <UserDetailDrawer
          user={selected}
          onClose={onClose}
          onSaveBasic={onSaveBasic}
          onSaveRoles={onSaveRoles}
          onToggleBan={(user) => askToggleBan(user)}
        />
      )}

      {/* ✅ Confirm 모달 */}
      <Confirm
        open={confirm.open}
        title="정지/해제 확인"
        message={
          confirm.user
            ? `${confirm.user.email} 사용자를 ${confirm.nextBan ? '정지' : '정지 해제'}하시겠어요?`
            : ''
        }
        onOK={runToggleBan}
        onCancel={()=>setConfirm({ open:false, user:null, nextBan:false })}
      />

      {/* ✅ 토스트 */}
      {toastNode}
    </div>
  );
}
