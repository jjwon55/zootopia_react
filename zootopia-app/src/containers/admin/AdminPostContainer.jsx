import { useEffect, useMemo, useState, useCallback } from "react";
import { deletePost, getPost, hidePost, listPosts } from "../../apis/posts/PostReport";
import { confirm, toastError, toastSuccess } from "../../apis/posts/alert";
import AdminPostsPage from "../../pages/admin/post/AdminPostsPage"; // 프리젠테이션 컴포넌트

const PAGE_SIZE = 20;

export default function AdminPostContainer() {
  // 목록/페이지
  const [rows, setRows] = useState([]);
  const [pageInfo, setPageInfo] = useState({ number: 0, size: PAGE_SIZE, totalElements: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);

  // 검색/필터
  const [qInput, setQInput] = useState("");
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [hidden, setHidden] = useState(""); // "", "true", "false"
  const [reportedOnly, setReportedOnly] = useState(false);

  // 정렬/페이지
  const [sort, setSort] = useState("createdAt");
  const [dir, setDir] = useState("desc");
  const [page, setPage] = useState(0);

  // 상세/신고 모달
  const [selected, setSelected] = useState(null);
  const [reportsPost, setReportsPost] = useState(null);   // { postId, title, reportCount }

  // 액션 진행 표시
  const [actingId, setActingId] = useState(null);

  const params = useMemo(
    () => ({ q, category, hidden, page, size: PAGE_SIZE, sort, dir }),
    [q, category, hidden, page, sort, dir]
  );

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await listPosts(params);
      setRows(data?.data || []);
      setPageInfo(data?.page || pageInfo);
    } catch (e) {
      console.error(e);
      toastError("목록 조회에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [params]);

  // ✅ “신고만 보기”일 때: 모든 페이지를 순회해서 신고글만 모으기 (프론트 집계 A안)
  const fetchAllReportedPosts = useCallback(async () => {
    setLoading(true);
    try {
      const acc = [];
      let p = 0;
      let totalPages = 1;
      while (p < totalPages) {
        const { data } = await listPosts({ ...params, page: p });
        const pageRows = data?.data || [];
        const meta = data?.page || {};
        totalPages = meta.totalPages ?? 1;
        acc.push(...pageRows.filter(r => (r.reportCount || 0) > 0));
        p += 1;
      }
      setRows(acc);
      setPageInfo({
        number: 0,
        size: acc.length,
        totalElements: acc.length,
        totalPages: 1, // 한 페이지로 표기
      });
    } catch (e) {
      console.error(e);
      toastError("신고 게시글 집계에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    if (reportedOnly) fetchAllReportedPosts();
    else fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, category, hidden, sort, dir, reportedOnly, page]);

  const handleSearch = () => {
    setQ(qInput);
    setPage(0);
  };

  const openDetail = async (postId) => {
    if (postId == null) return;
    try {
      const { data } = await getPost(postId);
      setSelected(data?.data || null);
    } catch (e) {
      console.error(e);
      toastError("게시글 상세 조회에 실패했습니다.");
    }
  };
  const closeDetail = () => setSelected(null);

  const askToggleHide = async (row) => {
    const id = row?.postId;
    if (!id) return;
    const nextHidden = !row.hidden;
    const title = nextHidden ? "게시글 숨김" : "게시글 표시";
    const text = nextHidden
      ? `"${row.title}" 게시글을 숨기시겠어요?`
      : `"${row.title}" 게시글을 다시 표시하시겠어요?`;
    const res = await confirm(title, text, "warning");
    if (res?.isConfirmed) await runToggleHide(id, nextHidden);
  };

  const runToggleHide = async (postId, nextHidden) => {
    try {
      setActingId(postId);
      await hidePost(postId, nextHidden);
      // 집계 모드/일반 모드 각각 갱신
      if (reportedOnly) await fetchAllReportedPosts();
      else await fetchList();

      if (selected?.postId === postId) await openDetail(postId);
      toastSuccess(nextHidden ? "숨김 처리되었습니다." : "표시 처리되었습니다.");
    } catch (e) {
      console.error(e);
      toastError("처리 실패");
    } finally {
      setActingId(null);
    }
  };

  const askDelete = async (row) => {
    const id = row?.postId;
    if (!id) return;
    const res = await confirm("게시글 삭제", `"${row.title}" 게시글을 삭제하시겠어요? 되돌릴 수 없습니다.`, "warning");
    if (res?.isConfirmed) await runDelete(id);
  };

  const runDelete = async (postId) => {
    try {
      setActingId(postId);
      await deletePost(postId);
      if (reportedOnly) await fetchAllReportedPosts();
      else await fetchList();

      if (selected?.postId === postId) closeDetail();
      toastSuccess("삭제되었습니다.");
    } catch (e) {
      console.error(e);
      toastError("삭제 실패");
    } finally {
      setActingId(null);
    }
  };

  return (
    <AdminPostsPage
      // 데이터
      rows={rows}
      pageInfo={pageInfo}
      loading={loading}

      // 검색/필터
      qInput={qInput}
      setQInput={setQInput}
      q={q}
      setQ={setQ}
      category={category}
      setCategory={setCategory}
      hidden={hidden}
      setHidden={setHidden}
      reportedOnly={reportedOnly}
      setReportedOnly={setReportedOnly}

      // 정렬/페이지
      sort={sort}
      setSort={setSort}
      dir={dir}
      setDir={setDir}
      page={page}
      setPage={setPage}

      // 상세/신고 모달
      selected={selected}
      openDetail={openDetail}
      closeDetail={closeDetail}
      reportsPost={reportsPost}
      setReportsPost={setReportsPost}

      // 액션
      actingId={actingId}
      askToggleHide={askToggleHide}
      runToggleHide={runToggleHide}
      askDelete={askDelete}
      runDelete={runDelete}

      // 핸들러
      handleSearch={handleSearch}
    />
  );
}
