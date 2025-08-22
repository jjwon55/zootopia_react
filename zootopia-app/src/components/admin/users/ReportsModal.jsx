import { useEffect, useState } from "react";
import { listReportsByUser } from "../../../apis/posts/report";

export default function ReportsModal({ user, onClose }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.userId) return;
    const run = async () => {
      setLoading(true);
      try {
        const { data } = await listReportsByUser(user.userId, { page: 0, size: 20, sort: "created", dir: "desc" });
        setRows(data.data || []);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [user]);

  return (
    <div className="tw:fixed tw:inset-0 tw:z-50 tw:flex tw:items-center tw:justify-center">
      <div className="tw:absolute tw:inset-0 tw:bg-black/40" onClick={onClose} />
      <div className="tw:relative tw:bg-white tw:rounded-2xl tw:shadow-2xl tw:max-w-3xl tw:w-[min(92vw,768px)] tw:max-h-[80vh] tw:overflow-y-auto">
        <header className="tw:flex tw:items-center tw:justify-between tw:px-6 tw:py-4 tw:border-b">
          <h2 className="tw:text-lg tw:font-semibold">🚨 신고 내역 — {user?.email ?? "알 수 없음"}</h2>
          <button className="tw:px-3 tw:py-1.5 tw:rounded-md tw:bg-gray-200 hover:tw:bg-gray-300" onClick={onClose}>닫기</button>
        </header>

        <section className="tw:p-6">
          {loading ? (
            <div className="tw:text-center tw:text-gray-500 tw:py-10">로딩 중…</div>
          ) : rows.length === 0 ? (
            <div className="tw:text-center tw:text-gray-500 tw:py-10">신고 내역이 없습니다</div>
          ) : (
            <table className="tw:table tw:w-full">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>신고자</th>
                  <th>사유</th>
                  <th>상태</th>
                  <th>일시</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.reportId} className="hover">
                    <td>{r.reportId}</td>
                    <td>{r.reporterEmail ?? r.reporterUserId}</td>
                    <td>{r.reasonCode}{r.reasonText ? ` (${r.reasonText})` : ''}</td>
                    <td>{r.status}</td>
                    <td>{new Date(r.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}
