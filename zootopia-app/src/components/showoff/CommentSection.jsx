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
      setNewComment('');
      window.location.reload();
    } catch (err) {
      console.error('댓글 등록 실패:', err);
      alert('댓글 등록 중 오류 발생');
    }
  };

  const handleReplyToggle = (commentId) => {
    setReplyFormsVisible((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  return (
    <div className="tw:mt-10 tw:pt-6 tw:border-t tw:border-[#ccc]">
      <span className="tw:font-bold tw:text-lg">💬 댓글 {comments.length}</span>

      <div className="tw:mt-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.commentId}
            comment={comment}
            replies={comment.replies}
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
        <form onSubmit={handleSubmit} className="tw:mt-6">
          <input type="hidden" name="postId" value={postId} />
          <div className="tw:mb-4">
            <textarea
              className="tw:w-full tw:border tw:border-[#ccc] tw:rounded tw:px-4 tw:py-3 tw:resize-none tw:focus:outline-none tw:focus:ring tw:focus:ring-blue-300"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글 내용을 입력해주세요"
              required
              rows="3"
            />
          </div>
          <div className="tw:flex tw:justify-end">
            <button
              type="submit"
              className="
                tw:bg-[#ff9999]
                tw:hover:bg-[#ff7f7f] tw:active:bg-black
                tw:text-white tw:px-5 tw:py-2 tw:rounded
                tw:cursor-pointer tw:transition-colors tw:duration-200
              "
            >
              댓글쓰기
            </button>
          </div>
        </form>
      ) : (
        <div className="tw:mt-6">
          <textarea
            className="tw:w-full tw:border tw:border-[#ccc] tw:rounded tw:px-4 tw:py-3 tw:resize-none tw:bg-gray-100"
            rows="3"
            placeholder="댓글을 작성하려면 로그인하세요"
            readOnly
          />
          <div className="tw:flex tw:justify-end tw:mt-2">
            <a
              href="/login"
              className="tw:bg-gray-500 tw:text-white tw:px-5 tw:py-2 tw:rounded tw:hover:bg-gray-600"
            >
              로그인하기
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
