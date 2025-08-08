import React, { useState } from 'react';
import CommentItem from './CommentItem';
import { addComment } from '../../apis/posts/comments';

const CommentSection = ({ postId, comments = [], loginUserId, editId, setEditId }) => {
  const [newComment, setNewComment] = useState('');
  const [replyFormsVisible, setReplyFormsVisible] = useState({});
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addComment(postId, newComment);
      alert('댓글이 등록되었습니다.');
      window.location.reload(); // 또는 fetchPost() 재호출
      setNewComment('');
    } catch (err) {
      console.error('댓글 등록 실패:', err);
      alert('댓글 등록 중 오류 발생');
    }
  };

  const handleReplyToggle = (commentId) => {
    setReplyFormsVisible(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  


//   const parentComments = comments.filter(comment => comment.parentId === null);

  return (
    <div className="comment-box mt-5">
      <span className="fw-bold">💬 댓글 {comments.length}</span>

      <div className="comment-list mt-3">
        {comments.map((comment) => (
        <CommentItem
            key={comment.commentId}
            comment={comment}
            replies={comment.replies} // ✅ 여기서 이미 들어있는 구조 그대로 넘김
            postId={postId}
            loginUserId={loginUserId}
            editId={editId}
            setEditId={setEditId}
            replyFormsVisible={replyFormsVisible}
            onReplyToggle={handleReplyToggle}
        />
        ))}
      </div>

      {loginUserId ? (
        <form onSubmit={handleSubmit} className="mt-4">
          <input type="hidden" name="postId" value={postId} />
          <div className="mb-3">
            <textarea
              className="form-control"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="댓글 내용을 입력해주세요"
              required
              rows="3"
            />
          </div>
          <div className="d-flex justify-content-end align-items-center">
            <button type="submit" className="btn comment-b">댓글쓰기</button>
          </div>
        </form>
      ) : (
        <div className="mt-4">
          <textarea className="form-control" rows="3" placeholder="댓글을 작성하려면 로그인하세요" readOnly />
          <div className="d-flex justify-content-end align-items-center">
            <a href="/login" className="btn comment-b">로그인하기</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
