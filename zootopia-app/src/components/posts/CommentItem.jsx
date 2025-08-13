import React, { useMemo, useState, useCallback } from 'react';
import defaultProfile from '../../assets/img/default-profile.png';
import { updateComment, deleteComment, replyToComment } from '../../apis/posts/comments';
import { Link } from 'react-router-dom';

const RECENT_REPLIES = 2;

const resolveImg = (src) => {
  if (!src) return null;
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith('/api/')) return src;
  if (src.startsWith('/')) return `/api${src}`;
  return `/api/${src}`;
};

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

const fullDate = (iso) => {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const HH = String(d.getHours()).padStart(2, '0');
  const MM = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd} ${HH}:${MM}`;
};

export default function CommentItem({
  node,
  postId, // (삭제 API가 postId 불필요해도 prop은 유지 OK)
  loginUserId,
  loginNickname,
  loginProfileImg,
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

  const ownerId = node.userId ?? node.user?.userId; // 서버가 user.userId로 줄 수도 있음
  const isOwner = ownerId != null && String(loginUserId) === String(ownerId);
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

  /** 삭제 (서버 성공 시 소프트 딜리트로 즉시 표시) */
  const onRemove = useCallback(async () => {
    if (!confirm('댓글을 삭제할까요?')) return;
    setBusy(true);
    try {
      await deleteComment(node.commentId);
      onLocalDelete(node.commentId); // soft delete: 즉시 “삭제된 댓글입니다.”
    } catch (err) {
      console.error('DELETE error:', err?.response?.status, err?.response?.data);
      alert('삭제 중 오류가 발생했어요.');
    } finally {
      setBusy(false);
    }
  }, [node.commentId, onLocalDelete]);

  /** 답글 등록 (낙관적) */
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
      nickname: loginNickname,
      profileImg: loginProfileImg,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
      likeCount: 0,
      replies: [],
    };
    onLocalReply(node.commentId, optimistic);
    setReplyText('');
    setReplyOpen(false);
    setShowReplies(true); // ✅ 방금 단 답글이 바로 보이도록 펼치기

    try {
      const res = await replyToComment(postId, node.commentId, content);
      const saved = res?.data?.comment || res?.data || null;
      if (saved) {
        // ✅ 서버가 다양한 키로 id를 줄 수 있으니 안전 추출
        const savedId =
          saved.commentId ??
          saved.id ??
          saved.comment_id ??
          saved.commentID ??
          saved?.comment?.commentId ??
          saved?.comment?.id;

        const fixed = {
          ...saved,
          // 서버가 user 필드 안에 줄 수도 있으니 안전하게 평탄화
          userId: saved?.userId ?? saved?.user?.userId ?? loginUserId,
          nickname: saved?.nickname ?? saved?.user?.nickname ?? loginNickname,
          profileImg: saved?.profileImg ?? saved?.user?.profileImg ?? loginProfileImg,
          createdAt: saved?.createdAt ?? new Date().toISOString(),
          updatedAt: saved?.updatedAt ?? saved?.createdAt ?? new Date().toISOString(),
        };

        if (savedId) {
          // ✅ 핵심: temp-id → real-id로 교체 (isPending 해제 → 버튼 즉시 표시)
          onLocalUpdate(tempId, { ...fixed, commentId: savedId });
        } else {
          // id가 정말 안 오면 내용만 최신화
          console.warn('reply saved but no id in response:', saved);
          onLocalUpdate(tempId, fixed);
        }
      }
    } catch (err) {
      console.error(err);
      alert('답글 등록 중 오류가 발생했어요.');
    } finally {
      setBusy(false);
    }
  }, [replyText, node.commentId, loginUserId, loginNickname, loginProfileImg, onLocalReply, onLocalUpdate, postId]);

  /** 좋아요(프론트 데모) */
  const toggleLike = () => {
    if (liked) { setLiked(false); setLikeCount((c) => Math.max(0, c - 1)); }
    else { setLiked(true); setLikeCount((c) => c + 1); }
  };

  return (
    <div className="tw:border-b tw:border-[#eee] tw:py-4">
      <div className="tw:flex tw:items-start tw:gap-3">
        {/* 링크는 ownerId 기준으로 */}
        <Link to={`/mypage/${ownerId ?? ''}`}>
          <img
            src={resolveImg(node.profileImg) || defaultProfile}
            alt="프로필"
            className="tw:w-10 tw:h-10 tw:rounded-full tw:object-cover"
          />
        </Link>

        <div className="tw:flex-1">
          {/* 이름 · 시간 */}
          <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-2">
            <Link
              to={`/mypage/${ownerId ?? ''}`}
              className={[
                'tw:text-sm tw:font-semibold',
                isDeleted ? 'tw:text-zinc-400' : 'tw:text-zinc-900 dark:tw:text-zinc-100',
              ].join(' ')}
            >
              {node.nickname}
            </Link>
            <span className="tw:text-xs tw:text-zinc-500" title={fullDate(node.createdAt)}>
              {timeAgo(node.createdAt)} · {fullDate(node.createdAt)}
            </span>
            {isPending && <span className="tw:text-[10px] tw:text-zinc-400">· 전송 중…</span>}
            {!isDeleted && node.updatedAt !== node.createdAt && (
              <span className="tw:text-xs tw:text-zinc-400" title={fullDate(node.updatedAt)}>
                · 수정됨 {timeAgo(node.updatedAt)}
              </span>
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
            <div className="tw:flex tw:justify-between tw:items-center tw:gap-2 tw:mt-1">
              <button
                type="button"
                onClick={() => setReplyOpen((v) => !v)}
                className="tw:ml-1 tw:px-2 tw:py-0.5 tw:text-xs tw:rounded-full tw:bg-zinc-100 tw:text-zinc-700 
                           hover:tw:bg-pink-100 hover:tw:text-pink-600 tw:transition-colors"
                aria-expanded={replyOpen}
                disabled={isPending}
              >
                답글
              </button>

              <div className="tw:flex tw:items-center tw:gap-1">
                {isOwner && !isPending && (
                  <>
                    {!editing && (
                      <button
                        type="button"
                        onClick={() => { setEditing(true); setDraft(node.content || ''); }}
                        className="tw:px-2 tw:py-0.5 tw:text-xs tw:border tw:border-zinc-300 tw:rounded-full 
                                   hover:tw:bg-zinc-100 tw:transition-colors"
                      >
                        수정
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={onRemove}
                      className="tw:flex tw:items-center tw:gap-1 tw:text-xs tw:px-2 tw:py-0.5 tw:rounded-full 
                                 tw:bg-red-50 tw:text-red-600 hover:tw:bg-red-100 tw:transition-colors"
                      disabled={busy}
                    >
                      <i className="bi bi-trash3" />
                      삭제
                    </button>
                  </>
                )}
              </div>
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
                  className="tw:px-3 tw:py-1.5 tw:text-sm tw:rounded-full tw:bg-zinc-200 hover:tw:bg-zinc-300 tw:text-zinc-800"
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
              <img
                src={resolveImg(loginProfileImg) || defaultProfile}
                alt="내 프로필"
                className="tw:w-8 tw:h-8 tw:rounded-full tw:object-cover"
              />
              <div className="tw:flex-1">
                <input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={loginNickname ? `${loginNickname}님, 답글 추가...` : '답글 추가...'}
                  className="tw:w-full tw:bg-transparent tw:border-b tw:border-[#eee] focus:tw:border-zinc-500 focus:tw:outline-none tw:py-2"
                />
                <div className="tw:flex tw:justify-end tw:gap-2 tw:mt-2">
                  <button
                    type="button"
                    onClick={() => { setReplyOpen(false); setReplyText(''); }}
                    className="tw:px-3 tw:py-1.5 tw:text-sm tw:rounded-full tw:bg-zinc-200 hover:tw:bg-zinc-300 tw:text-zinc-800"
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
                        loginNickname={loginNickname}
                        loginProfileImg={loginProfileImg}
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
