import { useEffect, useState } from "react";
import {
  listReportsByPost,
  updatePostReportStatus,
} from "../../../apis/posts/PostReport";
import { toastSuccess, toastError, confirm } from "../../../apis/posts/alert";

const STATUS_OPTS = ["PENDING", "REVIEWED", "REJECTED", "ACTION_TAKEN"];
const REASON_LABEL = {
  SPAM: "스팸/광고",
  ABUSE: "욕설·혐오",
  SEXUAL: "음란",
  ILLEGAL: "불법",
  OTHER: "기타",
};
const STATUS_LABEL = {
  PENDING: "대기",
  REVIEWED: "검토됨",
  REJECTED: "기각",
  ACTION_TAKEN: "조치 완료",
};


export default function PostReportsModal({ post, onClose }) {
  // post: { postId, title, reportCount }
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(null); // reportId

  const fetch = async () => {
    if (!post?.postId) return;
    setLoading(true);
    try {
      const { data } = await listReportsByPost(post.postId, {
        page: 0,
        size: 50,
        dir: "desc",
      });
      setRows(data?.data || []);
    } catch (e) {
      console.error(e);
      toastError("신고 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
    // eslint-disable-next-line
  }, [post?.postId]);

  const onChangeStatus = async (r, next) => {
    if (!r?.reportId) return;
    const res = await confirm("상태 변경", `이 신고를 ${next} 상태로 변경할까요?`, "warning");
    if (!res?.isConfirmed) return;
    try {
      setSaving(r.reportId);
      await updatePostReportStatus(r.reportId, { status: next, adminNote: r.adminNote || "" });
      await fetch();
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
      {/* 배경 딤 처리 */}
      <div className="tw:absolute tw:inset-0 tw:bg-black/40" onClick={onClose} />

      {/* 모달 컨텐츠 */}
      <div className="tw:relative tw:bg-white tw:rounded-2xl tw:shadow-2xl 
                    tw:w-full tw:max-w-4xl tw:max-h-[80vh] tw:overflow-auto tw:p-5">
        <div className="tw:flex tw:items-center tw:justify-between tw:mb-4">
          <h3 className="tw:text-lg tw:font-semibold">
            게시글 신고 ({post?.postId}) — {post?.title}
          </h3>
          <button className="tw:btn tw:btn-sm" onClick={onClose}>닫기</button>
        </div>

        <div className="tw:mb-3 tw:text-sm tw:text-gray-500">
          총 {rows.length}건 {loading && "…불러오는 중"}
        </div>

        <table className="tw:w-full tw:text-sm tw:bg-white tw:border tw:rounded">
          <thead>
            <tr className="tw:bg-gray-100">
              <th className="tw:text-left tw:p-2">ID</th>
              <th className="tw:text-left tw:p-2">사유</th>
              <th className="tw:text-left tw:p-2">상세</th>
              <th className="tw:text-left tw:p-2">신고자 이메일</th>
              <th className="tw:text-left tw:p-2">상태</th>
              <th className="tw:text-left tw:p-2">메모</th>
              <th className="tw:text-left tw:p-2">작성일</th>
              <th className="tw:text-left tw:p-2">액션</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td className="tw:p-4 tw:text-center" colSpan={8}>
                  신고 내역이 없습니다.
                </td>
              </tr>
            )}
            {rows.map((r, i) => (
              <tr key={r.reportId} className={i % 2 === 0 ? "tw:bg-gray-50" : ""}>
                <td className="tw:p-2">{r.reportId}</td>
                <td className="tw:p-2">{REASON_LABEL[r.reasonCode] || r.reasonCode}</td>
                <td className="tw:p-2">{r.reasonText || "-"}</td>
                <td className="tw:p-2">{r.reporterEmail || "-"}</td>
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
                <td className="tw:p-2">
                  {r.createdAt ? new Date(r.createdAt).toLocaleString() : "-"}
                </td>
                <td className="tw:p-2 tw:flex tw:gap-1">
                  <select
                    className="tw:select tw:select-bordered tw:select-sm"
                    defaultValue=""
                    onChange={(e) =>
                      e.target.value && onChangeStatus(r, e.target.value)
                    }
                    disabled={saving === r.reportId}
                  >
                    <option value="" disabled>상태 변경…</option>
                    {STATUS_OPTS.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABEL[s] || s} {/* 드롭다운에서도 한글 표시 */}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>

            ))}
          </tbody>
        </table>

        <div className="tw:text-xs tw:text-gray-400 tw:mt-2">
          • 상태 변경 시 처리 시간이 기록됩니다. (REVIEWED/REJECTED/ACTION_TAKEN → reviewedAt 업데이트)
        </div>
      </div>
    </div>
  );
}
