import { Link } from "react-router-dom";
import PostReportsModal from "../../../components/admin/post/PostReportsModal";

const PAGE_SIZE = 20;
const CATEGORY_OPTIONS = ["자유글", "질문글", "자랑글"];

export default function AdminPostsPage(props) {
  const {
    // 데이터
    rows, pageInfo, loading,

    // 검색/필터
    qInput, setQInput, q, setQ,
    category, setCategory,
    hidden, setHidden,
    reportedOnly, setReportedOnly,

    // 정렬/페이지
    sort, setSort, dir, setDir, page, setPage,

    // 상세/신고
    selected, openDetail, closeDetail,
    reportsPost, setReportsPost,

    // 액션
    actingId, askToggleHide, askDelete,

    // 핸들러
    handleSearch,
  } = props;

  return (
    <div className="tw:px-4 tw:md:px-6 tw:py-6 tw:space-y-6 tw:max-w-[1400px] tw:mx-auto">
      {/* ===== 헤더 ===== */}
      <div className="tw:flex tw:flex-wrap tw:items-end tw:justify-between tw:gap-4">
        <div className="tw:space-y-1">
          <h1 className="tw:text-2xl tw:md:text-3xl tw:font-bold tw:leading-tight">📝 게시글 관리</h1>
          <p className="tw:text-sm tw:text-gray-500">
            총 <b>{pageInfo?.totalElements ?? 0}</b>건 • 페이지 {page + 1}/{pageInfo?.totalPages || 1}
            {reportedOnly && <> • 신고 게시글만 보기</>}
          </p>
        </div>
      </div>

      {/* ===== 검색/필터 카드 ===== */}
      <div className="tw:bg-white tw:shadow-md tw:rounded-2xl tw:border tw:border-gray-100">
        <div className="tw:p-4 tw:flex tw:flex-col sm:tw:flex-row tw:items-stretch sm:tw:items-center tw:gap-2">
          <div className="tw:relative tw:flex-1">
            <input
              className="tw:input tw:input-bordered tw:w-full tw:pr-24"
              placeholder="제목/내용/작성자 이메일 검색"
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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

        <div className="tw:p-4 tw:grid tw:grid-cols-2 md:tw:grid-cols-4 lg:tw:grid-cols-6 tw:gap-2">
          {/* 카테고리 */}
          <select
            className="tw:select tw:select-bordered"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(0);
            }}
          >
            <option value="">카테고리(전체)</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* 숨김/표시 */}
          <select
            className="tw:select tw:select-bordered"
            value={hidden}
            onChange={(e) => {
              setHidden(e.target.value);
              setPage(0);
            }}
          >
            <option value="">상태(전체)</option>
            <option value="false">표시</option>
            <option value="true">숨김</option>
          </select>

          {/* 선택된 필터 요약 */}
          <div className="tw:col-span-2 lg:tw:col-span-4 tw:flex tw:flex-wrap tw:items-center tw:gap-2">
            {q && <span className="tw:badge tw:badge-outline">검색: {q}</span>}
            {category && <span className="tw:badge tw:badge-outline tw:badge-info">카테고리: {category}</span>}
            {hidden !== "" && (
              <span className="tw:badge tw:badge-outline tw:badge-warning">
                상태: {hidden === "true" ? "숨김" : "표시"}
              </span>
            )}
            {reportedOnly && <span className="tw:badge tw:badge-outline tw:badge-error">신고 있음</span>}
            {!q && !category && hidden === "" && !reportedOnly && (
              <span className="tw:text-xs tw:text-gray-400">필터가 선택되지 않았습니다</span>
            )}
          </div>
        </div>
      </div>

      {/* ===== 리스트 (테이블) ===== */}
      <div className="tw:px-3 tw:py-4 tw:flex tw:justify-center">
        <table className="tw:w-full tw:text-md tw:bg-white tw:shadow-md tw:rounded tw:mb-4">
          <thead>
            <tr>
              <th className="tw:text-left tw:p-3 tw:px-5">ID</th>
              <th className="tw:text-left tw:p-3 tw:px-5">제목</th>
              <th className="tw:text-left tw:p-3 tw:px-5">카테고리</th>
              <th className="tw:text-left tw:p-3 tw:px-5">작성자</th>
              <th className="tw:text-left tw:p-3 tw:px-5">상태</th>
              <th className="tw:text-left tw:p-3 tw:px-5">작성일</th>
              <th className="tw:text-left tw:p-3 tw:px-5">액션</th>
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
                    aria-label="신고된 게시글만 보기"
                    title="신고된 게시글만 보기"
                  />
                  신고
                </label>
              </th>
            </tr>
          </thead>

          <tbody>
            {!loading &&
              rows
                .filter((p) => !reportedOnly || (p.reportCount || 0) > 0)
                .map((p, idx) => (
                  <tr key={p.postId} className={idx % 2 === 0 ? "tw:bg-gray-100" : ""}>
                    <td className="tw:p-3 tw:px-5">{p.postId}</td>
                    <td className="tw:p-3 tw:px-5">
                      <Link
                        to={`/posts/read/${p.postId}`}
                        className="tw:text-blue-600 hover:tw:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {p.title}
                      </Link>
                    </td>
                    <td className="tw:p-3 tw:px-5">{p.category}</td>
                    <td className="tw:p-3 tw:px-5">{p.userEmail || "-"}</td>
                    <td className="tw:p-3 tw:px-5">
                      <span
                        className={`tw:badge tw:badge-sm ${p.hidden ? "tw:badge-warning" : "tw:badge-success"}`}
                      >
                        {p.hidden ? "숨김" : "표시"}
                      </span>
                    </td>
                    <td className="tw:p-3 tw:px-5">
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "-"}
                    </td>
                    <td className="tw:p-3 tw:px-5 tw:flex tw:justify-start tw:gap-2">
                      <button
                        className="tw:text-sm tw:bg-blue-500 hover:tw:bg-blue-700 tw:text-white tw:py-1 tw:px-2 tw:rounded"
                        onClick={() => openDetail(p.postId)}
                      >
                        상세
                      </button>
                      <button
                        className={`tw:text-sm ${p.hidden
                          ? "tw:bg-green-500 hover:tw:bg-green-700"
                          : "tw:bg-yellow-500 hover:tw:bg-yellow-700"
                          } tw:text-white tw:py-1 tw:px-2 tw:rounded`}
                        onClick={() => props.askToggleHide(p)}
                        disabled={actingId === p.postId || loading}
                      >
                        {actingId === p.postId ? "처리 중..." : p.hidden ? "표시" : "숨김"}
                      </button>
                      <button
                        className="tw:text-sm tw:bg-red-500 hover:tw:bg-red-700 tw:text-white tw:py-1 tw:px-2 tw:rounded"
                        onClick={() => props.askDelete(p)}
                        disabled={actingId === p.postId || loading}
                      >
                        삭제
                      </button>
                    </td>
                    <td className="tw:p-3 tw:px-5">
                      {(p.reportCount || 0) > 0 ? (
                        <button
                          className="tw:text-sm tw:bg-red-500 hover:tw:bg-red-700 tw:text-white tw:py-1 tw:px-2 tw:rounded"
                          onClick={() => setReportsPost({ postId: p.postId, title: p.title, reportCount: p.reportCount })}
                        >
                          {p.reportCount}건
                        </button>
                      ) : (
                        <span className="tw:text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* ===== 페이지네이션 ===== */}
      {!reportedOnly ? (
        <div className="tw:flex tw:justify-center tw:mt-4">
          <div className="tw:join">
            <button className="tw:join-item tw:btn btn-sm" disabled={page === 0} onClick={() => setPage(0)}>« 처음</button>
            <button className="tw:join-item tw:btn btn-sm" disabled={page === 0} onClick={() => setPage((p) => Math.max(p - 1, 0))}>‹ 이전</button>
            <button className="tw:join-item tw:btn btn-sm tw:btn-disabled">{page + 1} / {pageInfo?.totalPages || 1}</button>
            <button className="tw:join-item tw:btn btn-sm" disabled={page + 1 >= (pageInfo?.totalPages || 1)} onClick={() => setPage((p) => Math.min(p + 1, (pageInfo?.totalPages || 1) - 1))}>다음 ›</button>
            <button className="tw:join-item tw:btn btn-sm" disabled={page + 1 >= (pageInfo?.totalPages || 1)} onClick={() => setPage((pageInfo?.totalPages || 1) - 1)}>마지막 »</button>
          </div>
        </div>
      ) : (
        <div className="tw:flex tw:justify-center tw:mt-4 tw:text-sm tw:text-gray-500">
          신고된 게시글 {pageInfo?.totalElements ?? rows.length}건
        </div>
      )}

      {/* ===== 상세/신고 모달 ===== */}
      {selected && (
        <PostDetailModal
          post={selected}
          onClose={closeDetail}
          onToggleHide={(id, nxt) => props.runToggleHide?.(id, nxt)}
          onDelete={(id) => props.runDelete?.(id)}
        />
      )}
      {reportsPost && (
        <PostReportsModal post={reportsPost} onClose={() => setReportsPost(null)} />
      )}
    </div>
  );
}

/** 간단 상세 모달 (뷰 내부에 둠) */
function PostDetailModal({ post, onClose, onToggleHide, onDelete }) {
  if (!post) return null;
  const { postId, title, category, userEmail, hidden, createdAt, reportCount } = post;

  return (
    <div className="tw:fixed tw:inset-0 tw:z-50 tw:flex tw:items-center tw:justify-center">
      <div className="tw:absolute tw:inset-0 tw:bg-black/40" onClick={onClose} />
      <div className="tw:relative tw:bg-white tw:rounded-2xl tw:shadow-2xl tw:p-6 tw:w-full tw:max-w-2xl tw:space-y-4">
        <div className="tw:flex tw:items-center tw:justify-between">
          <h3 className="tw:text-lg tw:font-semibold">게시글 상세</h3>
          <button className="tw:btn tw:btn-sm" onClick={onClose}>닫기</button>
        </div>

        <div className="tw:space-y-1">
          <div><b>ID:</b> {postId}</div>
          <div><b>제목:</b> {title}</div>
          <div><b>카테고리:</b> {category}</div>
          <div><b>작성자:</b> {userEmail || "-"}</div>
          <div><b>상태:</b> {hidden ? "숨김" : "표시"}</div>
          <div><b>작성일:</b> {createdAt ? new Date(createdAt).toLocaleString() : "-"}</div>
          <div><b>신고 건수:</b> {reportCount || 0}건</div>
        </div>

        <div className="tw:flex tw:gap-2 tw:justify-end">
          <button
            className={`tw:btn tw:btn-sm ${hidden ? "tw:btn-success" : "tw:btn-warning"}`}
            onClick={() => onToggleHide(postId, !hidden)}
          >
            {hidden ? "표시" : "숨김"}
          </button>
          <button className="tw:btn tw:btn-sm tw:btn-error" onClick={() => onDelete(postId)}>
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
