import { useState } from "react";
import { createReport } from "../../../apis/posts/report";

import { toastSuccess, toastError , alert, confirm  } from "../../../apis/posts/alert";

export default function ReportUserModal({ targetUser, onClose }) {
  const [reason, setReason] = useState("SPAM");
  const [reasonText, setReasonText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const presetReasons = [
    { code: "SPAM", label: "스팸/광고" },
    { code: "ABUSE", label: "욕설/비방" },
    { code: "INAPPROPRIATE", label: "부적절한 내용" },
  ];

  const handleSubmit = async () => {
    if (submitting) return;
    if (!targetUser?.userId) {
      toastError("대상 사용자가 없습니다.");
      return;
    }

    try {
      setSubmitting(true);
      await createReport({
        reportedUserId: targetUser.userId,
        reasonCode: reason,
        reasonText: reasonText?.trim() || null,
      });

      // ✅ 성공 토스트
      await toastSuccess("🚩 신고가 접수되었습니다.");

      onClose?.();
    } catch (e) {
      console.error(e);
      // ✅ 실패 토스트 (필요시 e.response?.data?.message 노출)
      toastError("신고 처리 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="tw:fixed tw:inset-0 tw:flex tw:items-center tw:justify-center tw:z-50">
      <div className="tw:absolute tw:inset-0 tw:bg-black/40" onClick={onClose} />
      <div className="tw:relative tw:bg-white tw:rounded-xl tw:p-6 tw:w-[400px] tw:shadow-lg">
        <h2 className="tw:text-lg tw:font-bold tw:mb-4">🚩 신고하기</h2>

        <div className="tw:space-y-3">
          {presetReasons.map((r) => (
            <label key={r.code} className="tw:flex tw:items-center tw:gap-2">
              <input
                type="radio"
                name="reason"
                value={r.code}
                checked={reason === r.code}
                onChange={() => setReason(r.code)}
              />
              {r.label}
            </label>
          ))}

          <textarea
            className="tw:textarea tw:w-full"
            rows={3}
            placeholder="추가 신고 사유를 입력하세요 (선택)"
            value={reasonText}
            onChange={(e) => setReasonText(e.target.value)}
          />
        </div>

        <div className="tw:flex tw:justify-end tw:gap-2 tw:mt-4">
          <button className="tw:btn tw:btn-ghost" onClick={onClose}>
            취소
          </button>
          <button
            className="tw:btn tw:btn-error"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "처리 중..." : "제출"}
          </button>
        </div>
      </div>
    </div>
  );
}
