import { useEffect, useMemo, useState } from "react";
import { listUsers, getUser, banUser, updateUser, updateUserRoles } from "../../../apis/admin/users";

import UserDetailDrawer from "../../../components/admin/users/UserDetailDrawer";
import ReportsModal from "../../../components/admin/users/ReportsModal";
import { toastSuccess, toastError, confirm } from "../../../apis/posts/alert";

// ✅ 허용 역할(프론트도 2개만)
const ROLE_OPTIONS = ["ROLE_USER", "ROLE_ADMIN"];
const PAGE_SIZE = 20;

// ✅ 라벨 맵
const ROLE_LABELS = {
  ROLE_USER: "일반회원",
  ROLE_ADMIN: "관리자",
};

const STATUS_LABELS = {
  ACTIVE: "활성",
  SUSPENDED: "정지",
};

export default function UsersPage() {
  const [rows, setRows] = useState([]);
  const [pageInfo, setPageInfo] = useState({ number: 0, size: PAGE_SIZE, totalElements: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);

  const [reportsUser, setReportsUser] = useState(null);
  const [qInput, setQInput] = useState("");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [reportedOnly, setReportedOnly] = useState(false); // ✅ 유지(헤더 토글용)
  const [sort, setSort] = useState("createdAt");
  const [dir, setDir] = useState("desc");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState(null);

  const [actingId, setActingId] = useState(null);

  const params = useMemo(
    () => ({ q, status, role, page, size: PAGE_SIZE, sort, dir }),
    [q, status, role, page, sort, dir]
  );

  const fetchList = async () => {
    setLoading(true);
    try {
      const { data } = await listUsers(params);
      setRows(data.data || []);
      setPageInfo(data.page || pageInfo);
    } catch (e) {
      console.error(e);
      toastError("목록 조회에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line
  }, [params]);

  const onOpen = async (userId) => {
    if (userId == null) return;
    try {
      const { data } = await getUser(userId);
      const cleaned = {
        ...data.data,
        roles: (data.data?.roles || []).filter((r) => ROLE_OPTIONS.includes(r)),
      };
      setSelected(cleaned);
    } catch (e) {
      console.error(e);
      toastError("상세 조회에 실패했습니다.");
    }
  };
  const onClose = () => setSelected(null);

  // ✅ 실제 정지/해제 실행
  const runBanToggle = async (userId, nextBan) => {
    if (userId == null) return;
    try {
      setActingId(userId);
      await banUser(userId, nextBan);
      await fetchList();
      if (selected?.userId === userId) await onOpen(userId);
      toastSuccess(nextBan ? "정지 완료" : "정지 해제 완료");
    } catch (e) {
      console.error(e);
      toastError("처리 실패");
    } finally {
      setActingId(null);
    }
  };

  // ✅ SweetAlert confirm
  const askToggleBan = async (u) => {
    if (!u?.userId) return;
    const nextBan = u.status !== "SUSPENDED";
    const title = "정지/해제 확인";
    const text = `${u.email} 사용자를 ${nextBan ? "정지" : "정지 해제"}하시겠어요?`;
    const res = await confirm(title, text, "warning");
    if (res?.isConfirmed) {
      await runBanToggle(u.userId, nextBan);
    }
  };

  const onSaveBasic = async (payload) => {
    const id = selected?.userId;
    if (id == null) return;
    try {
      await updateUser(id, payload);
      await fetchList();
      await onOpen(id);
      toastSuccess("기본 정보가 저장되었습니다.");
    } catch (e) {
      console.error(e);
      toastError("기본 정보 저장 실패");
    }
  };

  const onSaveRoles = async (roles) => {
    const safe = (roles || []).filter((r) => ROLE_OPTIONS.includes(r));
    const id = selected?.userId;
    if (id == null) return;
    try {
      await updateUserRoles(id, safe);
      await fetchList();
      await onOpen(id);
      toastSuccess("역할이 저장되었습니다.");
    } catch (e) {
      console.error(e);
      toastError("역할 저장 실패");
    }
  };

  const handleSearch = () => {
    setQ(qInput);
    setPage(0);
  };

  return (
    <div className="tw:px-4 tw:md:px-6 tw:py-6 tw:space-y-6 tw:max-w-[1400px] tw:mx-auto">
      {/* ===== 헤더 ===== */}
      <div className="tw:flex tw:flex-wrap tw:items-end tw:justify-between tw:gap-4">
        <div className="tw:space-y-1">
          <h1 className="tw:text-2xl tw:md:text-3xl tw:font-bold tw:leading-tight">👤 회원 관리</h1>
          <p className="tw:text-sm tw:text-gray-500">
            총 <b>{pageInfo?.totalElements ?? 0}</b>명
            {reportedOnly && <> • 신고 사용자만 보기</>}
            {" • "}페이지 {page + 1}/{pageInfo?.totalPages || 1}
          </p>
        </div>
      </div>

      {/* ===== 검색/필터 카드 ===== */}
      <div className="tw:bg-white tw:shadow-md tw:rounded-2xl tw:border tw:border-gray-100">
        <div className="tw:p-4 tw:flex tw:flex-col sm:tw:flex-row tw:items-stretch sm:tw:items-center tw:gap-2">
          <div className="tw:relative tw:flex-1">
            <input
              className="tw:input tw:input-bordered tw:w-full tw:pr-24"
              placeholder="이메일/닉네임 검색"
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <div className="tw:absolute tw:top-1/2 -tw:translate-y-1/2 tw:right-1.5 tw:flex tw:gap-1">
              {q && (
                <button
                  type="button"
                  className="tw:btn tw:btn-ghost tw:btn-sm"
                  onClick={() => {
                    setQInput("");
                    setQ("");
                    setPage(0);
                  }}
                >
                  초기화
                </button>
              )}
              <button type="button" onClick={handleSearch} className="tw:btn tw:btn-primary tw:btn-sm">
                검색
              </button>
            </div>
          </div>
        </div>

        {/* ⛔️ 신고자 필터(카드 내) 제거됨 */}
        <div className="tw:p-4 tw:grid tw:grid-cols-2 md:tw:grid-cols-4 lg:tw:grid-cols-6 tw:gap-2">
          {/* 상태 필터 */}
          <select
            className="tw:select tw:select-bordered"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(0);
            }}
          >
            <option value="">상태(전체)</option>
            <option value="ACTIVE">{STATUS_LABELS.ACTIVE}</option>
            <option value="SUSPENDED">{STATUS_LABELS.SUSPENDED}</option>
          </select>

          {/* 역할 필터 */}
          <select
            className="tw:select tw:select-bordered"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(0);
            }}
          >
            <option value="">역할(전체)</option>
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>

          {/* 선택된 필터 요약 배지 */}
          <div className="tw:col-span-2 lg:tw:col-span-4 tw:flex tw:flex-wrap tw:items-center tw:gap-2">
            {q && <span className="tw:badge tw:badge-outline">검색: {q}</span>}
            {status && (
              <span className="tw:badge tw:badge-outline tw:badge-success">상태: {STATUS_LABELS[status] || status}</span>
            )}
            {role && <span className="tw:badge tw:badge-outline tw:badge-info">역할: {ROLE_LABELS[role] || role}</span>}
            {reportedOnly && <span className="tw:badge tw:badge-outline tw:badge-error">신고 있음</span>}
            {!q && !status && !role && !reportedOnly && (
              <span className="tw:text-xs tw:text-gray-400">필터가 선택되지 않았습니다</span>
            )}
          </div>
        </div>
      </div>

      {/* ===== 리스트 카드 (테이블) ===== */}
      <div className="tw:px-3 tw:py-4 tw:flex tw:justify-center">
        <table className="tw:w-full tw:text-md tw:bg-white tw:shadow-md tw:rounded tw:mb-4">
          <thead>
            <tr>
              <th className="tw:text-left tw:p-3 tw:px-5">ID</th>
              <th className="tw:text-left tw:p-3 tw:px-5">이메일</th>
              <th className="tw:text-left tw:p-3 tw:px-5">닉네임</th>
              <th className="tw:text-left tw:p-3 tw:px-5">상태</th>
              <th className="tw:text-left tw:p-3 tw:px-5">역할</th>
              <th className="tw:text-left tw:p-3 tw:px-5">가입일</th>
              <th className="tw:text-left tw:p-3 tw:px-5">액션</th>

              {/* ✅ 신고 헤더 + 체크박스 토글 (여기로 이동) */}
              <th className="tw:text-left tw:p-3 tw:px-5">
                <label className="tw:inline-flex tw:items-center tw:gap-2 tw:text-sm">
                  <input
                    type="checkbox"
                    className="tw:checkbox tw:checkbox-sm"
                    checked={reportedOnly}
                    onChange={(e) => {
                      setReportedOnly(e.target.checked);
                      setPage(0);
                    }}
                    aria-label="신고된 사용자만 보기"
                    title="신고된 사용자만 보기"
                  />
                  신고
                </label>
              </th>
            </tr>
          </thead>

          <tbody>
            {!loading &&
              rows
                .filter((u) => !reportedOnly || u.reportCount > 0) // ✅ 신고 필터 적용
                .map((u, idx) => {
                  const safeRoles = (u.roles || []).filter((r) => ROLE_OPTIONS.includes(r));
                  return (
                    <tr key={u.userId} className={idx % 2 === 0 ? "tw:bg-gray-100" : ""}>
                      <td className="tw:p-3 tw:px-5">{u.userId}</td>
                      <td className="tw:p-3 tw:px-5">
                        <button
                          type="button"
                          className="tw:text-blue-600 hover:tw:underline"
                          onClick={() => onOpen(u.userId)}
                        >
                          {u.email}
                        </button>
                      </td>
                      <td className="tw:p-3 tw:px-5">{u.nickname}</td>
                      <td className="tw:p-3 tw:px-5">
                        <span
                          className={`tw:badge tw:badge-sm ${u.status === "SUSPENDED" ? "tw:badge-error" : "tw:badge-success"
                            }`}
                        >
                          {STATUS_LABELS[u.status] || u.status}
                        </span>
                      </td>
                      <td className="tw:p-3 tw:px-5">
                        <select
                          className="tw:select tw:select-sm tw:select-bordered"
                          value={safeRoles[0] || ""}
                          onChange={async (e) => {
                            const newRole = e.target.value;
                            try {
                              await updateUserRoles(u.userId, [newRole]);
                              toastSuccess("역할이 변경되었습니다.");
                              await fetchList();
                            } catch (err) {
                              console.error(err);
                              toastError("역할 변경 실패");
                            }
                          }}
                        >
                          <option value="">- 선택 -</option>
                          {ROLE_OPTIONS.map((r) => (
                            <option key={r} value={r}>
                              {ROLE_LABELS[r]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="tw:p-3 tw:px-5">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}</td>
                      <td className="tw:p-3 tw:px-5 tw:flex tw:justify-start tw:gap-2">
                        <button
                          className="tw:text-sm tw:bg-blue-500 hover:tw:bg-blue-700 tw:text-white tw:py-1 tw:px-2 tw:rounded"
                          onClick={() => onOpen(u.userId)}
                        >
                          상세
                        </button>
                        <button
                          className={`tw:text-sm ${u.status === "SUSPENDED" ? "tw:bg-green-500 hover:tw:bg-green-700" : "tw:bg-red-500 hover:tw:bg-red-700"
                            } tw:text-white tw:py-1 tw:px-2 tw:rounded`}
                          onClick={() => askToggleBan(u)}
                          disabled={actingId === u.userId || loading}
                        >
                          {actingId === u.userId ? "처리 중..." : u.status === "SUSPENDED" ? "해제" : "정지"}
                        </button>
                      </td>
                      <td className="tw:p-3 tw:px-5">
                        {u.reportCount > 0 ? (
                          <button
                            className="tw:text-sm tw:bg-red-500 hover:tw:bg-red-700 tw:text-white tw:py-1 tw:px-2 tw:rounded"
                            onClick={() => setReportsUser(u)}
                          >
                            {u.reportCount}건
                          </button>
                        ) : (
                          <span className="tw:text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>

      {/* ===== 페이지네이션 ===== */}
      <div className="tw:flex tw:justify-center tw:mt-4">
        <div className="tw:join">
          <button className="tw:join-item tw:btn btn-sm" disabled={page === 0} onClick={() => setPage(0)}>
            « 처음
          </button>
          <button
            className="tw:join-item tw:btn btn-sm"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
          >
            ‹ 이전
          </button>
          <button className="tw:join-item tw:btn btn-sm tw:btn-disabled">
            {page + 1} / {pageInfo?.totalPages || 1}
          </button>
          <button
            className="tw:join-item tw:btn btn-sm"
            disabled={page + 1 >= (pageInfo?.totalPages || 1)}
            onClick={() => setPage((p) => Math.min(p + 1, (pageInfo?.totalPages || 1) - 1))}
          >
            다음 ›
          </button>
          <button
            className="tw:join-item tw:btn btn-sm"
            disabled={page + 1 >= (pageInfo?.totalPages || 1)}
            onClick={() => setPage((pageInfo?.totalPages || 1) - 1)}
          >
            마지막 »
          </button>
        </div>
      </div>

      {/* ===== 상세/신고 모달 ===== */}
      {selected && (
        <UserDetailDrawer
          variant="modal"
          user={selected}
          onClose={onClose}
          onSaveBasic={onSaveBasic}
          onSaveRoles={onSaveRoles}
          onToggleBan={askToggleBan}
        />
      )}
      {reportsUser && <ReportsModal user={reportsUser} onClose={() => setReportsUser(null)} />}
    </div>
  );
}
