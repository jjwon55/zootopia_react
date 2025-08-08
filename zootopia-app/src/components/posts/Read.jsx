import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import defaultProfile from '../../assets/img/default-profile.png';
import pinkArrow from '../../assets/img/pinkarrow.png';
import Share from '../../assets/img/share.png';
import axios from 'axios';
import CommentSection from './CommentSection';

const Read = ({ post, loginUserId, editId, setEditId, onDelete }) => {
  const navigate = useNavigate();
  const isOwner = loginUserId === post?.user?.userId;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert('게시글 링크가 복사되었습니다!'))
      .catch(err => alert('복사 실패: ' + err));
  };

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await axios.post(`/posts/delete/${post.postId}`);
      alert('삭제되었습니다.');
      navigate('/posts');
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const API_URL = 'http://localhost:8080';
  const convertImagePaths = (html) => {
    if (!html) return '';
    return html.replace(/src="\/upload\//g, `src="${API_URL}/upload/`);
  };
  const processedContent = convertImagePaths(post.content);

  return (
    <div className="tw:max-w-4xl tw:mx-auto tw:px-4 tw:py-6 tw:bg-white tw:rounded tw:shadow">
      
      {/* 상단 이동/수정/삭제 */}
      <div className="tw:flex tw:justify-between tw:items-center tw:mb-4">
        <Link to="/posts" className="tw:flex tw:items-center tw:text-red-500 tw:text-sm tw:font-semibold hover:tw:underline">
          커뮤니티
          <img src={pinkArrow} alt="back" className="tw:w-4 tw:h-4 tw:ml-1" />
        </Link>

        {isOwner && (
          <div className="tw:flex tw:gap-2">
            <Link to={`/posts/edit/${post.postId}`} className="tw:px-3 tw:py-1 tw:text-sm tw:border tw:rounded hover:tw:bg-gray-100">
              수정
            </Link>
            <button onClick={onDelete} className="tw:px-3 tw:py-1 tw:text-sm tw:text-red-600 tw:border tw:border-red-300 tw:rounded hover:tw:bg-red-100">
              삭제
            </button>
          </div>
        )}
      </div>

      {/* 제목 */}
      <h1 className="tw:text-2xl tw:font-bold tw:text-gray-900 tw:mb-2">{post.title}</h1>

      {/* 작성자 정보 */}
      <div className="tw:flex tw:justify-between tw:items-center tw:text-sm tw:text-gray-600 tw:mb-4">
        <div className="tw:flex tw:items-center">
          <Link to={`/mypage/${post.user?.userId || ''}`}>
            <img
              src={post.user?.profileImg ? `${API_URL}${post.user.profileImg}` : defaultProfile}
              alt="작성자"
              className="tw:w-10 tw:h-10 tw:rounded-full tw:object-cover tw:mr-3"
            />
          </Link>
          <div>
            <Link to={`/mypage/${post.user?.userId || ''}`} className="tw:font-medium tw:text-gray-800 hover:tw:underline">
              {post.user?.nickname || '알 수 없음'}
            </Link>
            <div className="tw:text-xs tw:text-gray-500">{post.createdAt}</div>
          </div>
        </div>
        <div className="tw:flex tw:gap-4 tw:items-center tw:text-gray-500 tw:text-sm">
          <span><i className="bi bi-eye"></i> {post.viewCount}</span>
          <span><i className="bi bi-chat-dots"></i> {post.commentCount}</span>
          <span><i className="bi bi-heart-fill tw:text-red-500"></i> {post.likeCount}</span>
        </div>
      </div>

      <hr className="tw:mb-4" />

      {/* 본문 */}
      <div
        className="tw:prose tw:max-w-none"
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />

      {/* 공유 & 좋아요 */}
      <div className="tw:flex tw:justify-center tw:gap-4 tw:mt-6">
        <button onClick={handleShare} className="tw:flex tw:items-center tw:gap-2 tw:px-4 tw:py-2 tw:bg-gray-100 tw:rounded hover:tw:bg-gray-200">
          <img src={Share} alt="공유" className="tw:w-5 tw:h-5" />
          <span>공유하기</span>
        </button>
        <button className="tw:flex tw:items-center tw:gap-2 tw:px-4 tw:py-2 tw:bg-pink-100 tw:text-pink-600 tw:rounded hover:tw:bg-pink-200">
          <i className="bi bi-heart"></i>
          <span>좋아요</span>
        </button>
      </div>

      {/* 댓글 */}
      <div className="tw:mt-8">
        <CommentSection
          postId={post.postId}
          comments={post.comments}
          loginUserId={loginUserId}
          editId={editId}
          setEditId={setEditId}
        />
      </div>
    </div>
  );
};

export default Read;
