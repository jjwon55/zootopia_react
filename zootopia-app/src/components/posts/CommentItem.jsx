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

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const content = form.content.value;

    try {
      await updateComment(comment.commentId, postId, content);
      alert('댓글이 수정되었습니다.');
      setEditId(null);
      window.location.reload(); // 또는 댓글 목록만 갱신
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
  console.log('🧵 comment:', comment.commentId, 'replies:', replies);

  const API_URL = 'http://localhost:8080';

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return `${date.getFullYear().toString().slice(2)}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  


  return (
    <div className={`card-body comment-line ${comment.parentId ? 'comment-reply ms-2' : ''}`}>
      {/* 작성자 정보 */}
      <div className="d-flex justify-content-between">
        <div className="d-flex align-items-center mb-1">
          <Link to={`/mypage/${comment.userId}`}>
            <img
              src={comment.profileImg ? `${API_URL}${comment.profileImg}` : defaultProfile}
              className="profile-img me-2"
              alt="작성자 프로필"
            />
          </Link>
          <div className="ms-2">
            <Link to={`/mypage/${comment.userId}`} className="text-decoration-none text-dark fw-semibold">
              {comment.nickname}
            </Link>
            <div className="text-muted small">
              {formatDate(comment.createdAt)}
              {comment.updatedAt !== comment.createdAt && <span className="ms-1">(수정됨)</span>}
            </div>
          </div>
        </div>

        {isOwner && (
          <div className="d-flex gap-2 mt-2">
            <button onClick={() => setEditId(comment.commentId)} className="btn btn-sm btn-outline-secondary">
              수정
            </button>
            <button className="btn btn-sm btn-outline-danger" onClick={handleDelete}>
              삭제
            </button>
          </div>
        )}
      </div>

      {/* 댓글 내용 or 수정폼 */}
      {editId === comment.commentId ? (
        <form onSubmit={handleUpdateSubmit}>
          <textarea className="form-control" name="content" defaultValue={comment.content}></textarea>
          <div className="d-flex gap-2 mt-2">
            <button type="submit" className="btn btn-sm comment-update">수정 완료</button>
            <button onClick={() => setEditId(null)} className="btn btn-sm btn-secondary">취소</button>
          </div>
        </form>
      ) : (
        <div className="comment-content mt-2">{comment.content}</div>
      )}

      {/* ✅ 답글 버튼 및 답글 입력창 */}
      {loginUserId && (
        <div className="mt-2 ms-2">
          <button
            onClick={() => onReplyToggle(comment.commentId)}
            className="btn btn-reply"
          >
            답글
          </button>

          {replyFormsVisible[comment.commentId] && (
            <form onSubmit={handleReplySubmit} className="mt-2">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="form-control"
                rows="2"
                placeholder="답글을 입력해주세요"
              />
              <button type="submit" className="btn btn-sm btn-outline-secondary mt-2">등록</button>
            </form>
          )}
        </div>
      )}

      {/* 자식 댓글 */}
      {replies?.length > 0 && (
        <div className="comment-children mt-3 ms-2">
          {replies.map(child => (
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
