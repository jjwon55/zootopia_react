import { useEffect, useState } from "react";
import { listReportsByUser, updateReportStatus } from "../../../apis/posts/report";
import { toastSuccess, toastError, confirm } from "../../../apis/posts/alert";

const STATUS_LABEL = {
  PENDING: "대기",
  REVIEWED: "검토완료",
  REJECTED: "기각",
  ACTION_TAKEN: "조치완료",
};

const REASON_LABEL = {
  SPAM: "스팸/광고",
  ABUSE: "욕설·혐오",
  SEXUAL: "음란",
  ILLEGAL: "불법",
  OTHER: "기타",
};

export default function ReportsModal({ user, onClose }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(null); // reportId

  const fetch = async () => {
    if (!user?.userId) return;
    setLoading(true);
    try {
      const { data } = await listReportsByUser(user.userId, {
        page: 0,
        size: 50,
        dir: "desc",
      });
      setRows(data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
    // eslint-disable-next-line
  }, [user?.userId]);

  const onChangeStatus = async (r, next) => {
    if (!r?.reportId) return;

    // ✅ SweetAlert confirm 적용
    const res = await confirm(
      "상태 변경",
      `이 신고를 '${STATUS_LABEL[next] ?? next}' 상태로 변경할까요?`,
      "warning"
    );
    if (!res?.isConfirmed) return;

    try {
      setSaving(r.reportId);
      await updateReportStatus(r.reportId, { status: next, adminNote: r.adminNote || "" });
      await fetch();
      // ✅ SweetAlert toast 적용
      toastSuccess("상태가 변경되었습니다.");
    } catch (e) {
      console.error(e);
      toastError("상태 변경 실패");
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="tw:fixed tw:inset-0 tw:z-50 tw:flex tw:items-center tw:justify-center">
      <div className="tw:absolute tw:inset-0 tw:bg-black/40" onClick={onClose} />
      <div className="tw:relative tw:bg-white tw:rounded-2xl tw:p-5 tw:w-full tw:max-w-4xl tw:max-h-[80vh] tw:overflow-auto tw:shadow-2xl">
        <div className="tw:flex tw:items-center tw:justify-between tw:mb-4">
          <h2 className="tw:text-lg tw:font-semibold">
            🚨 신고 내역 — {user?.email ?? "알 수 없음"}
          </h2>
          <button className="tw:btn tw:btn-sm" onClick={onClose}>닫기</button>
        </div>

        {loading ? (
          <div className="tw:text-center tw:text-gray-500 tw:py-10">로딩 중…</div>
        ) : rows.length === 0 ? (
          <div className="tw:text-center tw:text-gray-500 tw:py-10">신고 내역이 없습니다</div>
        ) : (
          <table className="tw:w-full tw:text-sm tw:bg-white tw:border tw:rounded">
            <thead>
              <tr className="tw:bg-gray-100">
                <th className="tw:text-left tw:p-2">ID</th>
                <th className="tw:text-left tw:p-2">사유</th>
                <th className="tw:text-left tw:p-2">상세</th>
                <th className="tw:text-left tw:p-2">신고자</th>
                <th className="tw:text-left tw:p-2">상태</th>
                <th className="tw:text-left tw:p-2">메모</th>
                <th className="tw:text-left tw:p-2">일시</th>
                <th className="tw:text-left tw:p-2">액션</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.reportId} className={i % 2 === 0 ? "tw:bg-gray-50" : ""}>
                  <td className="tw:p-2">{r.reportId}</td>
                  <td className="tw:p-2">{REASON_LABEL[r.reasonCode] || r.reasonCode}</td>
                  <td className="tw:p-2">{r.reasonText || "-"}</td>
                  <td className="tw:p-2">{r.reporterEmail ?? r.reporterUserId ?? "-"}</td>
                  <td className="tw:p-2">
                    <span className="tw:badge tw:badge-outline">
                      {STATUS_LABEL[r.status] || r.status}
                    </span>
                  </td>
                  <td className="tw:p-2">
                    <input
                      className="tw:input tw:input-bordered tw:input-sm tw:w-full"
                      value={r.adminNote || ""}
                      onChange={(e) => {
                        const v = e.target.value;
                        setRows((prev) =>
                          prev.map((x) =>
                            x.reportId === r.reportId ? { ...x, adminNote: v } : x
                          )
                        );
                      }}
                      placeholder="관리자 메모"
                    />
                  </td>
                  <td className="tw:p-2">{r.createdAt ? new Date(r.createdAt).toLocaleString() : "-"}</td>
                  <td className="tw:p-2 tw:flex tw:gap-1">
                    <select
                      className="tw:select tw:select-bordered tw:select-sm"
                      defaultValue=""
                      onChange={(e) => e.target.value && onChangeStatus(r, e.target.value)}
                      disabled={saving === r.reportId}
                    >
                      <option value="" disabled>상태 변경…</option>
                      {Object.entries(STATUS_LABEL).map(([code, label]) => (
                        <option key={code} value={code}>{label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
    </div>
  );
}
