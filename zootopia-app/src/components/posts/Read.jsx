  import React from 'react';
  import { Link, useNavigate } from 'react-router-dom';
  import defaultProfile from '../../assets/img/default-profile.png';
  import pinkArrow from '../../assets/img/pinkarrow.png';
  import Share from '../../assets/img/share.png';
  import './css/Read.css';
  import axios from 'axios';
  import CommentSection from './CommentSection';

  const Read = ({ post, loginUserId, editId, setEditId, onDelete}) => {
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

    // ✅ 이미지 경로 보정
    const API_URL = 'http://localhost:8080';
    const convertImagePaths = (html) => {
      if (!html) return '';
      return html.replace(/src="\/upload\//g, `src="${API_URL}/upload/`);
    };

    const processedContent = convertImagePaths(post.content);

    return (
      <div className="post-container">

        {/* 상단 이동/수정/삭제 */}
        <div className="d-flex justify-content-between align-items-center">
          <div className="tolist">
            <Link to="/posts" className="d-flex align-items-center mb-1 text-danger text-decoration-none">
              커뮤니티
              <img width="15" height="15" src={pinkArrow} alt="forward" />
            </Link>
          </div>
          {isOwner && (
            <div className="d-flex justify-content-end align-items-center pb-2">
              <Link to={`/posts/edit/${post.postId}`} className="btn btn-sm btn-outline-secondary me-2">수정</Link>
              <button className="btn btn-sm btn-outline-danger" onClick={onDelete}>삭제</button>
            </div>
          )}
        </div>

        {/* 제목 */}
        <div className="post-header">{post.title}</div>

        {/* 작성자 정보 */}
        <div className="post-meta d-flex justify-content-between">
          <div className="d-flex">
            <Link to={`/mypage/${post.user?.userId || ''}`}>
              <img
                src={post.user?.profileImg ? `${API_URL}${post.user.profileImg}` : defaultProfile}
                className="profile-img me-2"
                alt="작성자 프로필"
              />
            </Link>
            <div className="ms-2">
              <Link to={`/mypage/${post.user?.userId || ''}`} className="text-decoration-none text-dark fw-semibold">
                {post.user?.nickname || '알 수 없음'}
              </Link>
              <div>{post.createdAt}</div>
            </div>
          </div>
          <div className="d-flex align-items-end gap-2">
            <i className="bi bi-eye"></i> <span>{post.viewCount}</span>
            <i className="bi bi-chat-dots"></i> <span>{post.commentCount}</span>
            <i className="bi bi-heart-fill text-danger"></i> <span>{post.likeCount}</span>
          </div>
        </div>

        <hr />

        {/* 본문 */}
        <div className="post-container">
          <div
            className="post-content toastui-editor-contents"
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />
        </div>

        {/* 공유 & 좋아요 */}
        <div className="post-actions d-flex justify-content-center mt-4 gap-3">
          <button className="btn btn-share d-flex align-items-center justify-content-center" onClick={handleShare}>
            <img src={Share} width="25" alt="공유" className="me-2" />
            공유하기
          </button>
          <button className="btn btn-like d-flex align-items-center justify-content-center">
            <i className="bi bi-heart me-2"></i>좋아요
          </button>
        </div>

        {/* 댓글 영역 */}
        <CommentSection
          postId={post.postId}
          comments={post.comments}
          loginUserId={loginUserId}
          editId={editId}
          setEditId={setEditId}
        />
      </div>
    );
  };

  export default Read;
