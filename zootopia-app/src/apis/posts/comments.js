import axios from 'axios';


// ✅ 댓글 등록
export const addComment = (postId, content) =>
  axios.post('/api/comments', { postId, content });

// ✅ 댓글 삭제
export const deleteComment = (commentId) =>
  axios.delete(`/api/comments/${commentId}`);

// ✅ 댓글 수정
export const updateComment = (commentId, postId, content) =>
  axios.put(`/api/comments/${commentId}`, { commentId, postId, content });

// ✅ 대댓글 등록
export const replyToComment = (postId, parentId, content) =>
  axios.post('/api/comments/reply', { postId, parentId, content });



