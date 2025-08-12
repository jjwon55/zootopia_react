import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import CommentItem from './CommentItem';
import { addComment } from '../../apis/posts/comments';

/** 평면 → 트리 */
function buildTreeFromProps(comments = []) {
  const flat = [];
  const walk = (arr) => arr?.forEach((c) => {
    const { replies, ...rest } = c;
    flat.push(rest);
    if (replies?.length) walk(replies);
  });
  walk(comments);

  const list = flat.length ? flat : comments;
  const map = new Map();
  list.forEach((c) => map.set(c.commentId, { ...c, replies: [] }));

  const roots = [];
  map.forEach((node) => {
    if (node.parentId) {
      const p = map.get(node.parentId);
      p ? p.replies.push(node) : roots.push(node);
    } else roots.push(node);
  });

  const sortFn = (a, b) => new Date(a.createdAt) - new Date(b.createdAt);
  const sortDeep = (nodes) => nodes.sort(sortFn).map((n) => ({ ...n, replies: sortDeep(n.replies || []) }));
  return sortDeep(roots);
}

/** 불변 유틸 */
const addReplyLocal = (nodes, parentId, newReply) =>
  nodes.map((n) =>
    n.commentId === parentId
      ? { ...n, replies: [...(n.replies || []), newReply] }
      : { ...n, replies: addReplyLocal(n.replies || [], parentId, newReply) }
  );

const updateLocal = (nodes, id, patch) =>
  nodes.map((n) =>
    n.commentId === id
      ? { ...n, ...patch }
      : { ...n, replies: updateLocal(n.replies || [], id, patch) }
  );

const replaceIdLocal = (nodes, tempId, real) =>
  nodes.map((n) => {
    if (n.commentId === tempId) return { ...real, replies: n.replies || [] }; // 기존 replies 유지
    return { ...n, replies: replaceIdLocal(n.replies || [], tempId, real) };
  });

const removeLocal = (nodes, id) =>
  nodes
    .filter((n) => n.commentId !== id)
    .map((n) => ({ ...n, replies: removeLocal(n.replies || [], id) }));

const hashComments = (comments = []) =>
  JSON.stringify(
    comments.map((c) => ({ id: c.commentId, p: c.parentId ?? null, u: c.updatedAt ?? c.createdAt }))
  );

export default function CommentSection({ postId, comments = [], loginUserId, onChange }) {
  const [tree, setTree] = useState(() => buildTreeFromProps(comments));
  const [sort, setSort] = useState('top'); // 'top' | 'new'
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);

  // ✅ props 변경 감지 해시: 실제 데이터가 바뀌었을 때만 재빌드
  const lastPropsHash = useRef(hashComments(comments));
  useEffect(() => {
    const nextHash = hashComments(comments);
    if (nextHash !== lastPropsHash.current) {
      setTree(buildTreeFromProps(comments));
      lastPropsHash.current = nextHash;
    }
  }, [comments]);

  /** 정렬 (유튜브 느낌: 인기/최신) */
  const sortedRoots = useMemo(() => {
    const likeScore = (n) => Number(n.likeCount || 0);
    let arr = [...tree];
    if (sort === 'new') {
      arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      arr.sort((a, b) => likeScore(b) - likeScore(a) || (new Date(b.createdAt) - new Date(a.createdAt)));
    }
    return arr.map((n) => ({ ...n, replies: n.replies || [] }));
  }, [tree, sort]);

  /** 루트 댓글 등록 (Optimistic)
   * 서버가 ID를 안 돌려줘도 임시 아이디로 화면에 유지 → 부모가 refetch하면 useEffect가 교체
   */
  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    const content = draft.trim();
    if (!content) return;

    setBusy(true);
    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      commentId: tempId,
      parentId: null,
      content,
      userId: loginUserId,
      nickname: '나',
      profileImg: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
      likeCount: 0,
      replies: [],
    };
    setTree((prev) => [...prev, optimistic]);
    setDraft('');

    try {
      const res = await addComment(postId, content);
      const saved = res?.data?.comment || res?.data || null;
      if (saved?.commentId) {
        setTree((prev) => replaceIdLocal(prev, tempId, saved));
      }
      // 어쨌든 부모에 알림 → 부모가 재조회하면 useEffect로 최신 반영
      onChange?.('created', saved || optimistic);
    } catch (err) {
      console.error(err);
      // 실패해도 임시댓글을 잠시 유지 → 사용자 경험 보존
      // 원하면 여기서 setTree(prev => removeLocal(prev, tempId))로 롤백 가능
      alert('댓글 등록 중 오류가 발생했어요. 잠시 후 갱신될 수 있습니다.');
    } finally {
      setBusy(false);
    }
  }, [draft, loginUserId, postId, onChange]);

  return (
    <section className="tw:mt-10">
      {/* 상단: 총 개수 + 정렬 */}
      <div className="tw:flex tw:items-center tw:justify-between tw:mb-4">
        <div className="tw:flex tw:items-center tw:gap-2">
          <span className="tw:text-lg tw:font-bold tw:text-zinc-900 dark:tw:text-zinc-100">댓글</span>
          <span className="tw:text-sm tw:text-zinc-500">{tree.length}개</span>
        </div>
        <div className="tw:flex tw:items-center tw:gap-2">
          <svg className="tw:w-4 tw:h-4 tw:text-zinc-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M3 7h14M5 12h10M7 16h6" />
          </svg>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="tw:text-sm tw:bg-transparent tw:text-zinc-700 dark:tw:text-zinc-200 focus:tw:outline-none"
          >
            <option value="top">인기 댓글</option>
            <option value="new">최신순</option>
          </select>
        </div>
      </div>

      {/* 작성 인풋 */}
      {loginUserId && (
        <form onSubmit={onSubmit} className="tw:flex tw:items-start tw:gap-3 tw:py-3 tw:border-b tw:border-[#eee]">
          <div className="tw:w-10 tw:h-10 tw:rounded-full tw:bg-zinc-200" />
          <div className="tw:flex-1">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="댓글 추가..."
              className="tw:w-full tw:bg-transparent tw:border-b tw:border-[#eee] focus:tw:border-zinc-500 focus:tw:outline-none tw:py-2"
            />
            <div className="tw:flex tw:justify-end tw:gap-2 tw:mt-2">
              <button
                type="button"
                onClick={() => setDraft('')}
                className="tw:px-3 tw:py-1.5 tw:text-sm tw:rounded-full tw:bg-zinc-200 tw:hover:bg-zinc-300 tw:text-zinc-800"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={busy || !draft.trim()}
                className="tw:px-4 tw:py-1.5 tw:text-sm tw:rounded-full tw:bg-zinc-900 tw:text-white disabled:tw:opacity-40"
              >
                댓글
              </button>
            </div>
          </div>
        </form>
      )}

      {/* 리스트 */}
      <div>
        {sortedRoots.length === 0 ? (
          <div className="tw:text-sm tw:text-zinc-500 tw:py-6">아직 댓글이 없어요.</div>
        ) : (
          sortedRoots.map((node) => (
            <CommentItem
              key={node.commentId}
              node={node}
              postId={postId}
              loginUserId={loginUserId}
              onLocalUpdate={(id, patch) => setTree((prev) => updateLocal(prev, id, patch))}
              onLocalDelete={(id) => setTree((prev) => removeLocal(prev, id))}
              onLocalReply={(parentId, newReply) => setTree((prev) => addReplyLocal(prev, parentId, newReply))}
            />
          ))
        )}
      </div>
    </section>
  );
}