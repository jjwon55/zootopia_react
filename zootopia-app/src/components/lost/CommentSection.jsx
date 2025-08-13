import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import CommentItem from './CommentItem';
import { addComment } from '../../apis/posts/lostcomments';
import defaultProfile from '../../assets/img/default-profile.png';

/** 서버에서 온 경로를 안전하게 이미지 URL로 변환 */
const resolveImg = (src) => {
  if (!src) return null;
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith('/api/')) return src;
  if (src.startsWith('/')) return `/api${src}`;
  return `/api/${src}`;
};

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
    if (String(n.commentId) === String(tempId)) return { ...real, replies: n.replies || [] };
    return { ...n, replies: replaceIdLocal(n.replies || [], tempId, real) };
  });

// 완전 제거 유틸(현재는 사용 안 함)
const removeLocal = (nodes, id) =>
  nodes
    .filter((n) => String(n.commentId) !== String(id))
    .map((n) => ({ ...n, replies: removeLocal(n.replies || [], id) }));

// ✅ 소프트 딜리트: 노드는 유지하고 표시만 바꾼다
const softDeleteLocal = (nodes, id) =>
  nodes.map((n) =>
    String(n.commentId) === String(id)
      ? { ...n, isDeleted: true, content: '', likeCount: 0 }
      : { ...n, replies: softDeleteLocal(n.replies || [], id) }
  );

const hashComments = (comments = []) =>
  JSON.stringify(
    comments.map((c) => ({ id: c.commentId, p: c.parentId ?? null, u: c.updatedAt ?? c.createdAt }))
  );

export default function CommentSection({
  postId,
  comments = [],
  loginUserId,
  loginNickname,
  loginProfileImg,
  onChange
}) {
  const [tree, setTree] = useState(() => buildTreeFromProps(comments));
  const [sort, setSort] = useState('top'); // 'top' | 'new'
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);

  // props 변경 시에만 재빌드
  const lastPropsHash = useRef(hashComments(comments));
  useEffect(() => {
    const nextHash = hashComments(comments);
    if (nextHash !== lastPropsHash.current) {
      setTree(buildTreeFromProps(comments));
      lastPropsHash.current = nextHash;
    }
  }, [comments]);

  /** 정렬 */
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

  const mergeSavedWithAuthor = (saved) => ({
    ...saved,
    userId: saved?.userId ?? saved?.user?.userId ?? loginUserId,
    nickname: saved?.nickname ?? saved?.user?.nickname ?? loginNickname ?? '',
    profileImg: saved?.profileImg ?? saved?.user?.profileImg ?? loginProfileImg ?? null,
  });

  /** 루트 댓글 등록 (낙관적 업데이트) */
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
      nickname: loginNickname,
      profileImg: loginProfileImg,
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
      const next = saved?.commentId ? mergeSavedWithAuthor(saved) : null;
      if (next?.commentId) {
        setTree((prev) => replaceIdLocal(prev, tempId, next));
      }
      onChange?.('created', next || optimistic);
    } catch (err) {
      console.error(err);
      alert('댓글 등록 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setBusy(false);
    }
  }, [draft, loginUserId, loginNickname, loginProfileImg, postId, onChange]);

  return (
    <section className="tw:mt-10">
      {/* 헤더 */}
      <div className="tw:flex tw:items-center tw:justify-between tw:mb-4">
        <div className="tw:flex tw:items-center tw:gap-2">
          <span className="tw:text-lg tw:font-bold tw:text-zinc-900 dark:tw:text-zinc-100">댓글</span>
          <span className="tw:text-sm tw:text-zinc-500">{tree.length}개</span>
        </div>
      </div>

      {/* 작성 인풋 */}
      {loginUserId && (
        <form onSubmit={onSubmit} className="tw:flex tw:items-start tw:gap-3 tw:py-3 tw:border-b tw:border-[#eee]">
          <img
            src={resolveImg(loginProfileImg) || defaultProfile}
            alt="내 프로필"
            className="tw:w-10 tw:h-10 tw:rounded-full tw:object-cover"
          />
          <div className="tw:flex-1">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={loginNickname ? `${loginNickname}님, 댓글 추가...` : '댓글 추가...'}
              className="tw:w-full tw:bg-transparent tw:border-b tw:border-[#eee] focus:tw:border-zinc-500 focus:tw:outline-none tw:py-2"
            />
            <div className="tw:flex tw:justify-end tw:gap-2 tw:mt-2">
              <button
                type="button"
                onClick={() => setDraft('')}
                className="tw:px-3 tw:py-1.5 tw:text-sm tw:rounded-full tw:bg-zinc-200 hover:tw:bg-zinc-300 tw:text-zinc-800 tw:cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={busy || !draft.trim()}
                className="tw:px-4 tw:py-1.5 tw:text-sm tw:rounded-full tw:text-white disabled:tw:opacity-40 tw:bg-[#ff9999] hover:tw:bg-[#ff7f7f] tw:cursor-pointer"
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
              loginNickname={loginNickname}
              loginProfileImg={loginProfileImg}
              onLocalUpdate={(id, patch) => setTree((prev) => updateLocal(prev, id, patch))}
              // ✅ 소프트 딜리트로 즉시 “삭제된 댓글입니다.” 표시
              onLocalDelete={(id) => setTree((prev) => softDeleteLocal(prev, id))}
              onLocalReply={(parentId, newReply) => setTree((prev) => addReplyLocal(prev, parentId, newReply))}
            />
          ))
        )}
      </div>
    </section>
  );
}
