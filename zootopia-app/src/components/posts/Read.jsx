import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/format';
import defaultProfile from '../../assets/img/default-profile.png';
import pinkArrow from '../../assets/img/pinkarrow.png';
import Share from '../../assets/img/share.png';
import CommentSection from './CommentSection';
import { toastSuccess, toastInfo, toastError } from '../../apis/alert';
import { toggleLike } from '../../apis/posts/posts'; // ✅ 추가

const Read = ({
  post,
  isOwner: isOwnerFromApi,
  loginUserId,
  editId,
  setEditId,
  onDelete,
}) => {
  // 작성자 판단 (API 값 우선, 없으면 fallback)
  const ownerId = post?.user?.userId ?? post?.userId;
  const isOwner =
    typeof isOwnerFromApi === 'boolean'
      ? isOwnerFromApi
      : String(loginUserId ?? '') === String(ownerId ?? '');

  // 좋아요 상태/카운트
  const [liked, setLiked] = useState(!!post?.liked);
  const [likeCount, setLikeCount] = useState(post?.likeCount ?? 0);

  useEffect(() => {
    setLiked(!!post?.liked);
    setLikeCount(post?.likeCount ?? 0);
  }, [post]);

  const handleShare = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => toastSuccess('링크를 복사했어요 ✨'))
      .catch(() => toastError('복사에 실패했어요'));
  };

  // 좋아요 토글(낙관적 업데이트 + 서버 동기화 + 롤백)
  const [liking, setLiking] = useState(false);
  const handleLike = async () => {
    if (!loginUserId) {
      toastError('로그인이 필요합니다.');
      return;
    }
    if (liking) return; // 중복 클릭 방지
    setLiking(true);

    const prevLiked = liked;
    const prevCount = likeCount;
    const nextLiked = !prevLiked;

    // 낙관적 업데이트
    setLiked(nextLiked);
    setLikeCount((c) => c + (nextLiked ? 1 : -1));
    nextLiked ? toastSuccess('좋아요 했어요 💗') : toastInfo('좋아요를 취소했어요');

    try {
      const res = await toggleLike(post.postId); // ✅ 서버 반영
      // 서버 응답으로 최종 동기화(컨트롤러가 { liked, likeCount } 반환)
      if (res?.data) {
        if (typeof res.data.liked !== 'undefined') setLiked(!!res.data.liked);
        if (typeof res.data.likeCount === 'number') setLikeCount(res.data.likeCount);
      }
    } catch (e) {
      // 실패 시 롤백
      setLiked(prevLiked);
      setLikeCount(prevCount);
      if (e?.response?.status === 401) {
        toastError('로그인이 필요합니다.');
      } else {
        toastError('좋아요 처리 중 오류가 발생했어요.');
      }
    } finally {
      setLiking(false);
    }
  };

  const API_URL = 'http://localhost:8080';
  const convertImagePaths = (html) => {
    if (!html) return '';
    return html.replace(/src="\/upload\//g, `src="${API_URL}/upload/`);
  };
  const processedContent = convertImagePaths(post.content);

  return (
    <div className="tw:max-w-[720px] tw:mx-auto tw:my-7 tw:bg-white tw:border-2 tw:border-[#ccc] tw:rounded-xl tw:p-6">
      {/* 상단: 목록/수정/삭제 */}
      <div className="tw:flex tw:items-center tw:justify-between">
        <Link
          to="/posts"
          className="tw:inline-flex tw:items-center tw:text-[#F35F4C] tw:text-[14px] tw:font-semibold tw:no-underline tw:hover:underline"
        >
          커뮤니티
          <img src={pinkArrow} alt="back" className="tw:w-[15px] tw:h-[15px] tw:ml-1" />
        </Link>

      {isOwner && (
        <div className="tw:flex tw:items-center tw:gap-2 tw:pb-2">
          {/* 수정 버튼 */}
          <Link
            to={`/posts/edit/${post.postId}`}
            className="tw:flex tw:items-center tw:gap-1 tw:px-3 tw:py-1.5 tw:text-sm
                      tw:bg-blue-50 tw:text-blue-600 tw:rounded-lg
                      tw:border tw:border-blue-200 tw:hover:bg-blue-100
                      tw:shadow-sm tw:hover:shadow transition"
          >
            <i className="bi bi-pencil-fill" />
            수정
          </Link>

          {/* 삭제 버튼 */}
          <button
            onClick={onDelete}
            className="tw:flex tw:items-center tw:gap-1 tw:px-3 tw:py-1.5 tw:text-sm
                      tw:bg-red-50 tw:text-red-600 tw:rounded-lg
                      tw:border tw:border-red-200 tw:hover:bg-red-100
                      tw:shadow-sm tw:hover:shadow transition tw:cursor-pointer"
          >
            <i className="bi bi-trash-fill" />
            삭제
          </button>
        </div>
      )}
      </div>

      {/* 제목 */}
      <h1 className="tw:text-[22px] tw:font-bold tw:mt-2">{post.title}</h1>

      {/* 메타 */}
      <div className="tw:flex tw:items-start tw:justify-between tw:text-[12px] tw:text-[#777] tw:mt-2 tw:mb-4">
        {/* 작성자 */}
        <div className="tw:flex tw:items-center">
          <Link to={`/mypage/${post.user?.userId || ''}`} className="tw:no-underline">
            <img
              src={post.user?.profileImg ? `${API_URL}${post.user.profileImg}` : defaultProfile}
              alt="작성자"
              className="tw:w-[50px] tw:h-[50px] tw:rounded-full tw:object-cover"
            />
          </Link>
          <div className="tw:flex tw:flex-col tw:justify-center tw:ml-2">
            <Link
              to={`/mypage/${post.user?.userId || ''}`}
              className="tw:no-underline tw:text-black tw:font-semibold tw:hover:underline"
            >
              {post.user?.nickname || '알 수 없음'}
            </Link>
            <span className="tw:text-gray-500 tw:text-[12px]">{formatDate(post.createdAt)}</span>
          </div>
        </div>

        {/* 숫자 정보 */}
        <div className="tw:flex tw:items-end tw:gap-2 tw:text-gray-600">
          <span className="tw:inline-flex tw:items-center tw:gap-1">
            <i className="bi bi-eye" /> {post.viewCount}
          </span>
          <span className="tw:inline-flex tw:items-center tw:gap-1">
            <i className="bi bi-chat-dots" /> {post.commentCount}
          </span>
          <span className="tw:inline-flex tw:items-center tw:gap-1">
            <i className={`bi bi-heart-fill ${liked ? 'tw:text-red-600' : 'tw:text-red-500'}`} /> {likeCount}
          </span>
        </div>
      </div>

      <hr className="tw:mb-4 tw:border-t tw:border-[#ccc]" />

      {/* 본문 */}
      <div
        className="toastui-editor-contents tw:text-[16px] tw:leading-[1.6] tw:mb-6 tw:min-h-[220px]"
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />

      {/* 공유 & 좋아요 */}
      <div className="tw:flex tw:justify-center tw:gap-2 tw:mb-6">
        <button
          onClick={handleShare}
          className="tw:inline-flex tw:items-center tw:justify-center tw:min-w-[150px] tw:h-10 tw:rounded tw:border tw:border-[#ccc] tw:hover:bg-gray-200 tw:px-4 tw:transition-colors tw:cursor-pointer"
        >
          <img src={Share} alt="공유" className="tw:w-[20px] tw:h-[20px] tw:mr-2" />
          <span>공유하기</span>
        </button>

        <button
          onClick={handleLike}
          disabled={liking} // ✅ 중복 클릭 방지
          className={`
            tw:inline-flex tw:items-center tw:justify-center
            tw:min-w-[150px] tw:h-10 tw:rounded tw:px-4
            ${liked ? 'tw:bg-[#ff9999]' : 'tw:bg-[#ffbbbb] tw:hover:bg-[#ff9999]'}
            tw:text-white
            tw:transition-transform tw:duration-150 tw:ease-out active:tw:scale-110
            tw:cursor-pointer
            ${liking ? 'tw:opacity-70 tw:pointer-events-none' : ''}
          `}
          aria-pressed={liked}
        >
          <i className={`bi ${liked ? 'bi-heart-fill tw:text-red-600' : 'bi-heart tw:text-white'}`} />
          <span className="tw:ml-2">좋아요</span>
        </button>
      </div>

      {/* 댓글 */}
      <div className="tw:pt-4 tw:border-t tw:border-[#ccc]">
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
