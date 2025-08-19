// src/components/common/Confirm.jsx
import { useEffect, useRef } from "react";

export default function Confirm({
  open,
  title = "확인",
  message,
  onOK,
  onCancel,
}) {
  const okRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    // 기본 포커스: 확인 버튼
    okRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel?.();
      }
      if (e.key === "Enter") {
        e.preventDefault();
        onOK?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOK, onCancel]);

  if (!open) return null;

  return (
    <div
      className="tw:fixed tw:inset-0 tw:bg-black/40 tw:z-50"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-desc"
    >
      <div
        className="tw:absolute tw:left-1/2 tw:top-1/2 tw:-translate-x-1/2 tw:-translate-y-1/2 tw:w-[92vw] md:tw:w-[420px] tw:bg-white tw:rounded-xl tw:p-5 tw:shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div id="confirm-title" className="tw:text-lg tw:font-semibold tw:mb-2">
          {title}
        </div>
        <div id="confirm-desc" className="tw:text-gray-600 tw:mb-4">
          {message}
        </div>
        <div className="tw:flex tw:justify-end tw:gap-2">
          <button
            type="button"
            className="tw:px-3 tw:py-1.5 tw:rounded-md tw:bg-gray-200 hover:tw:bg-gray-300"
            onClick={onCancel}
          >
            취소
          </button>
          <button
            type="button"
            ref={okRef}
            className="tw:px-3 tw:py-1.5 tw:rounded-md tw:bg-blue-600 tw:text-white hover:tw:bg-blue-700"
            onClick={onOK}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
