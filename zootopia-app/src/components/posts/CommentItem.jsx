import React, { useState } from 'react';
import defaultProfile from '../../assets/img/default-profile.png';
import { updateComment, deleteComment, replyToComment } from '../../apis/posts/comments';
import { Link } from 'react-router-dom';

const CommentItem = ({
  comment,
  replies,
  postId,
  loginUserId,
  editId,
  setEditId,
  replyFormsVisible,
  onReplyToggle,
}) => {
  const [replyContent, setReplyContent] = useState('');
  const isOwner = loginUserId === comment.userId;
  const API_URL = 'http://localhost:8080';

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const content = form.content.value;
    try {
      await updateComment(comment.commentId, postId, content);
      alert('댓글이 수정되었습니다.');
      setEditId(null);
      window.location.reload();
    } catch (err) {
      console.error('댓글 수정 실패:', err);
      alert('수정 중 오류 발생');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;
    try {
      await deleteComment(comment.commentId, postId);
      alert('댓글이 삭제되었습니다.');
      window.location.reload();
    } catch (err) {
      console.error('댓글 삭제 실패:', err);
      alert('삭제 중 오류 발생');
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    try {
      await replyToComment(postId, comment.commentId, replyContent);
      alert('답글이 등록되었습니다.');
      setReplyContent('');
      onReplyToggle(comment.commentId);
      window.location.reload();
    } catch (err) {
      console.error('답글 등록 실패:', err);
      alert('답글 등록 중 오류 발생');
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return `${date.getFullYear().toString().slice(2)}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date
      .getHours()
      .toString()
      .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className={`tw:border-b tw:pb-4 tw:mb-4 ${comment.parentId ? 'tw:ml-4' : ''}`}>
      {/* 작성자 정보 */}
      <div className="tw:flex tw:justify-between">
        <div className="tw:flex tw:items-center tw:mb-2">
          <Link to={`/mypage/${comment.userId}`}>
            <img
              src={comment.profileImg ? `${API_URL}${comment.profileImg}` : defaultProfile}
              alt="작성자 프로필"
              className="tw:w-8 tw:h-8 tw:rounded-full tw:object-cover"
            />
          </Link>
          <div className="tw:ml-3">
            <Link to={`/mypage/${comment.userId}`} className="tw:font-semibold tw:text-gray-800 hover:tw:underline">
              {comment.nickname}
            </Link>
            <div className="tw:text-xs tw:text-gray-500">
              {formatDate(comment.createdAt)}
              {comment.updatedAt !== comment.createdAt && (
                <span className="tw:ml-1">(수정됨)</span>
              )}
            </div>
          </div>
        </div>

        {isOwner && (
          <div className="tw:flex tw:gap-2">
            <button
              onClick={() => setEditId(comment.commentId)}
              className="tw:text-sm tw:border tw:rounded tw:px-2 tw:py-1 hover:tw:bg-gray-100"
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              className="tw:text-sm tw:border tw:border-red-300 tw:text-red-600 tw:rounded tw:px-2 tw:py-1 hover:tw:bg-red-100"
            >
              삭제
            </button>
          </div>
        )}
      </div>

      {/* 댓글 내용 or 수정폼 */}
      {editId === comment.commentId ? (
        <form onSubmit={handleUpdateSubmit}>
          <textarea
            className="tw:w-full tw:border tw:rounded tw:px-3 tw:py-2 tw:mt-2"
            name="content"
            defaultValue={comment.content}
          />
          <div className="tw:flex tw:gap-2 tw:mt-2">
            <button type="submit" className="tw:px-3 tw:py-1 tw:text-sm tw:bg-blue-500 tw:text-white tw:rounded hover:tw:bg-blue-600">
              수정 완료
            </button>
            <button
              onClick={() => setEditId(null)}
              className="tw:px-3 tw:py-1 tw:text-sm tw:bg-gray-200 tw:rounded hover:tw:bg-gray-300"
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <div className="tw:mt-2">{comment.content}</div>
      )}

      {/* ✅ 답글 버튼 및 입력창 */}
      {loginUserId && (
        <div className="tw:mt-3 tw:ml-3">
          <button
            onClick={() => onReplyToggle(comment.commentId)}
            className="tw:text-sm tw:text-blue-500 hover:tw:underline"
          >
            답글
          </button>

          {replyFormsVisible[comment.commentId] && (
            <form onSubmit={handleReplySubmit} className="tw:mt-2">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="tw:w-full tw:border tw:rounded tw:px-3 tw:py-2"
                rows="2"
                placeholder="답글을 입력해주세요"
              />
              <button
                type="submit"
                className="tw:mt-2 tw:px-3 tw:py-1 tw:text-sm tw:border tw:rounded hover:tw:bg-gray-100"
              >
                등록
              </button>
            </form>
          )}
        </div>
      )}

      {/* 자식 댓글 재귀 렌더링 */}
      {replies?.length > 0 && (
        <div className="tw:mt-4 tw:ml-4">
          {replies.map((child) => (
            <CommentItem
              key={child.commentId}
              comment={child}
              replies={child.replies}
              postId={postId}
              loginUserId={loginUserId}
              editId={editId}
              setEditId={setEditId}
              replyFormsVisible={replyFormsVisible}
              onReplyToggle={onReplyToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
