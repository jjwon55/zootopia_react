import React, { useMemo, useState, useCallback } from 'react';
import defaultProfile from '../../assets/img/default-profile.png';
import { updateComment, deleteComment, replyToComment } from '../../apis/posts/comments';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:8080';
const RECENT_REPLIES = 2;

const timeAgo = (iso) => {
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000; 
  if (diff < 60) return '방금 전';
  const m = Math.floor(diff / 60);
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  const day = Math.floor(h / 24);
  if (day < 7) return `${day}일 전`;
  if (day < 30) return `${Math.floor(day / 7)}주 전`;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
};

export default function CommentItem({
  node,
  postId,
  loginUserId,
  onLocalUpdate,
  onLocalDelete,
  onLocalReply,
  depth = 0,
}) {
  const [showAll, setShowAll] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(node.content || '');
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [busy, setBusy] = useState(false);
  const [likeCount, setLikeCount] = useState(node.likeCount || 0);
  const [liked, setLiked] = useState(false);

  const isOwner = loginUserId === node.userId;
  const isDeleted = !!node.isDeleted;
  const isPending = String(node.commentId).startsWith('temp-');
  const contentTooLong = (node.content || '').length > 180;

  const totalReplies = node.replies?.length || 0;
  const hiddenCount = useMemo(() => Math.max(0, totalReplies - RECENT_REPLIES), [totalReplies]);
  const [showReplies, setShowReplies] = useState(false);
  const visibleReplies = useMemo(() => {
    const arr = node.replies || [];
    return showReplies ? arr : arr.slice(-RECENT_REPLIES);
  }, [node.replies, showReplies]);

  /** 수정 저장 */
  const onSave = useCallback(async (e) => {
    e.preventDefault();
    const content = draft.trim();
    if (!content) return;
    setBusy(true);
    const before = node.content;
    onLocalUpdate(node.commentId, { content, updatedAt: new Date().toISOString() });
    setEditing(false);
    try {
      await updateComment(node.commentId, postId, content);
    } catch (err) {
      console.error(err);
      onLocalUpdate(node.commentId, { content: before });
      alert('수정 중 오류가 발생했어요.');
    } finally {
      setBusy(false);
    }
  }, [draft, node.commentId, node.content, onLocalUpdate, postId]);

  /** 삭제 */
  const onRemove = useCallback(async () => {
    if (!confirm('댓글을 삭제할까요?')) return;
    setBusy(true);
    try {
      await deleteComment(node.commentId, postId);
      onLocalDelete(node.commentId);
    } catch (err) {
      console.error(err);
      alert('삭제 중 오류가 발생했어요.');
    } finally {
      setBusy(false);
    }
  }, [node.commentId, onLocalDelete, postId]);

  /** 답글 등록 (서버가 ID 안 주어도 임시 유지) */
  const onReply = useCallback(async (e) => {
    e.preventDefault();
    const content = replyText.trim();
    if (!content) return;
    setBusy(true);

    const tempId = `temp-reply-${Date.now()}`;
    const optimistic = {
      commentId: tempId,
      parentId: node.commentId,
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
    onLocalReply(node.commentId, optimistic);
    setReplyText('');
    setReplyOpen(false);

    try {
      const res = await replyToComment(postId, node.commentId, content);
      const saved = res?.data?.comment || res?.data || null;
      if (saved?.commentId) {
        onLocalUpdate(tempId, saved);
      }
      // 부모가 재조회하면 최신 반영
      // (부모에서 onChange를 받아 연결했다면 여기서 호출 가능)
    } catch (err) {
      console.error(err);
      alert('답글 등록 중 오류가 발생했어요.');
      // 실패해도 UX를 위해 임시 답글을 잠시 유지 — 원하면 제거
      // onLocalDelete(tempId);
    } finally {
      setBusy(false);
    }
  }, [replyText, node.commentId, loginUserId, onLocalReply, onLocalUpdate, postId]);

  /** 좋아요(프론트 데모) */
  const toggleLike = () => {
    if (liked) { setLiked(false); setLikeCount((c) => Math.max(0, c - 1)); }
    else { setLiked(true); setLikeCount((c) => c + 1); }
  };

  return (
    <div className="tw:border-b tw:border-[#eee] tw:py-4">
      <div className="tw:flex tw:items-start tw:gap-3">
        <Link to={`/mypage/${node.userId}`}>
          <img
            src={node.profileImg ? `${API_URL}${node.profileImg}` : defaultProfile}
            alt="프로필"
            className="tw:w-10 tw:h-10 tw:rounded-full tw:object-cover"
          />
        </Link>

        <div className="tw:flex-1">
          {/* 이름 · 시간 */}
          <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-2">
            <Link
              to={`/mypage/${node.userId}`}
              className={[
                'tw:text-sm tw:font-semibold',
                isDeleted ? 'tw:text-zinc-400' : 'tw:text-zinc-900 dark:tw:text-zinc-100',
              ].join(' ')}
            >
              {node.nickname}
            </Link>
            <span className="tw:text-xs tw:text-zinc-500">{timeAgo(node.createdAt)}</span>
            {isPending && <span className="tw:text-[10px] tw:text-zinc-400">· 전송 중…</span>}
            {!isDeleted && node.updatedAt !== node.createdAt && (
              <span className="tw:text-xs tw:text-zinc-400">· 수정됨</span>
            )}
          </div>

          {/* 본문 */}
          <div className="tw:mt-1 tw:text-[15px] tw:leading-7 tw:text-zinc-800 dark:tw:text-zinc-100">
            {isDeleted ? (
              <i className="tw:text-zinc-400">삭제된 댓글입니다.</i>
            ) : (
              <>
                <span className={!showAll && contentTooLong ? 'tw:block tw:max-h-28 tw:overflow-hidden tw:pr-4' : ''}>
                  {node.content}
                </span>
                {contentTooLong && (
                  <button
                    type="button"
                    onClick={() => setShowAll((v) => !v)}
                    className="tw:block tw:mt-1 tw:text-xs tw:font-medium tw:text-zinc-600 tw:hover:underline"
                  >
                    {showAll ? '간략히' : '더보기'}
                  </button>
                )}
              </>
            )}
          </div>

          {/* 액션 */}
          {!isDeleted && (
            <div className="tw:flex tw:items-center tw:gap-2 tw:mt-1">
              <button
                type="button"
                onClick={toggleLike}
                className={[
                  'tw:inline-flex tw:items-center tw:gap-1 tw:px-2 tw:py-1 tw:rounded-full tw:hover:bg-zinc-100',
                  liked ? 'tw:text-zinc-900' : 'tw:text-zinc-600',
                ].join(' ')}
              >
                <span className="tw:text-base">👍</span>
                <span className="tw:text-sm">{likeCount || 0}</span>
              </button>

              <button
                type="button"
                onClick={() => setReplyOpen((v) => !v)}
                className="tw:ml-1 tw:text-sm tw:text-zinc-700 tw:hover:underline"
                aria-expanded={replyOpen}
                disabled={isPending}
              >
                답글
              </button>

              {isOwner && !isPending && (
                <>
                  {!editing && (
                    <button
                      type="button"
                      onClick={() => { setEditing(true); setDraft(node.content || ''); }}
                      className="tw:text-sm tw:text-zinc-500 tw:hover:underline"
                    >
                      수정
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onRemove}
                    className="tw:text-sm tw:text-zinc-500 tw:hover:underline"
                    disabled={busy}
                  >
                    삭제
                  </button>
                </>
              )}
            </div>
          )}

          {/* 수정 폼 */}
          {editing && !isDeleted && (
            <form onSubmit={onSave} className="tw:mt-2">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={3}
                className="tw:w-full tw:bg-transparent tw:border tw:border-[#eee] tw:rounded-xl tw:p-3 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-300"
              />
              <div className="tw:flex tw:justify-end tw:gap-2 tw:mt-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="tw:px-3 tw:py-1.5 tw:text-sm tw:rounded-full tw:bg-zinc-200 tw:hover:bg-zinc-300 tw:text-zinc-800"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={busy || !draft.trim()}
                  className="tw:px-4 tw:py-1.5 tw:text-sm tw:rounded-full tw:bg-zinc-900 tw:text-white disabled:tw:opacity-40"
                >
                  저장
                </button>
              </div>
            </form>
          )}

          {/* 답글 입력 */}
          {replyOpen && !isDeleted && (
            <form onSubmit={onReply} className="tw:flex tw:items-start tw:gap-3 tw:mt-3">
              <div className="tw:w-8 tw:h-8 tw:rounded-full tw:bg-zinc-200" />
              <div className="tw:flex-1">
                <input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="답글 추가..."
                  className="tw:w-full tw:bg-transparent tw:border-b tw:border-[#eee] focus:tw:border-zinc-500 focus:tw:outline-none tw:py-2"
                />
                <div className="tw:flex tw:justify-end tw:gap-2 tw:mt-2">
                  <button
                    type="button"
                    onClick={() => { setReplyOpen(false); setReplyText(''); }}
                    className="tw:px-3 tw:py-1.5 tw:text-sm tw:rounded-full tw:bg-zinc-200 tw:hover:bg-zinc-300 tw:text-zinc-800"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={busy || !replyText.trim()}
                    className="tw:px-4 tw:py-1.5 tw:text-sm tw:rounded-full tw:bg-zinc-900 tw:text-white disabled:tw:opacity-40"
                  >
                    답글
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* 답글 목록 */}
          {totalReplies > 0 && (
            <div className="tw:mt-3">
              {!showReplies ? (
                <button
                  type="button"
                  onClick={() => setShowReplies(true)}
                  className="tw:inline-flex tw:items-center tw:gap-2 tw:text-sm tw:text-blue-600 tw:hover:underline"
                >
                  ▼ 답글 {totalReplies}개
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowReplies(false)}
                  className="tw:inline-flex tw:items-center tw:gap-2 tw:text-sm tw:text-blue-600 tw:hover:underline"
                >
                  ▲ 답글 숨기기
                </button>
              )}

              {showReplies && (
                <div className="tw:mt-3 tw:ml-12 tw:relative">
                  <div className="tw:absolute tw:left-[-24px] tw:top-0 tw:bottom-0 tw:w-px tw:bg-[#eee]" />
                  <div className="tw:space-y-4">
                    {visibleReplies.map((child) => (
                      <CommentItem
                        key={child.commentId}
                        node={child}
                        postId={postId}
                        loginUserId={loginUserId}
                        onLocalUpdate={onLocalUpdate}
                        onLocalDelete={onLocalDelete}
                        onLocalReply={onLocalReply}
                        depth={depth + 1}
                      />
                    ))}
                    {!showReplies && hiddenCount > 0 && (
                      <div className="tw:text-xs tw:text-zinc-500">이전 답글 {hiddenCount}개가 더 있어요.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}