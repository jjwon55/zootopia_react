import React from 'react';
import { Link } from 'react-router-dom';
import defaultProfile from '../../assets/img/default-profile.png';
import pinkArrow from '../../assets/img/pinkarrow.png';
import shareIcon from '../../assets/img/share.png';
import lostMain from '../../assets/img/lostmain.png';

const LostRead = ({ post, isOwner, loginUserId, editId, onDelete }) => {
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('링크가 복사되었습니다!');
    });
  };

  return (
    <div className="tw:max-w-[900px] tw:mx-auto tw:my-8 tw:p-4 tw:bg-white tw:rounded-lg tw:shadow">
      {/* 상단 경로 & 버튼 */}
      <div className="tw:flex tw:justify-between tw:items-center tw:mb-4">
        <Link to="/lost" className="tw:flex tw:items-center tw:gap-1 tw:text-[#F35F4C] hover:tw:underline">
          유실동물 게시판
          <img src={pinkArrow} alt="forward" className="tw:w-[15px] tw:h-[15px]" />
        </Link>

        {isOwner && (
          <div className="tw:flex tw:gap-2">
            <Link
              to={`/lost/edit/${post.postId}`}
              className="tw:border tw:border-gray-400 tw:px-3 tw:py-1 tw:rounded hover:tw:bg-gray-100"
            >
              수정
            </Link>
            <button
              onClick={() => {
                if (window.confirm('정말 삭제하시겠습니까?')) onDelete();
              }}
              className="tw:border tw:border-red-400 tw:text-red-500 tw:px-3 tw:py-1 tw:rounded hover:tw:bg-red-50"
            >
              삭제
            </button>
          </div>
        )}
      </div>

      {/* 상단 메인 이미지 */}
      <div className="tw:mb-4">
        <img
          src={lostMain}
          alt="잃어버린 가족을 찾고 있어요"
          className="tw:w-full tw:rounded-[10px] tw:shadow"
        />
      </div>

      {/* 본문 내용 */}
      <div className="tw:mb-6">
        <div
          className="tw:prose tw:max-w-none tw:text-[15px] tw:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        <div className="tw:flex tw:justify-center tw:mt-4">
          <button
            onClick={handleShare}
            className="tw:flex tw:items-center tw:gap-2 tw:bg-gray-100 tw:px-4 tw:py-2 tw:rounded hover:tw:bg-gray-200"
          >
            <img src={shareIcon} alt="공유하기" className="tw:w-[25px] tw:h-[25px]" />
            공유하기
          </button>
        </div>
      </div>

      {/* 정보 박스 */}
      <div className="tw:border tw:border-gray-200 tw:rounded-[10px] tw:p-4 tw:mb-6 tw:bg-[#fffefb]">
        <div className="tw:flex tw:justify-between tw:mb-2 tw:text-sm md:tw:text-base">
          <div>
            <span className="tw-font-bold">잃어버린 장소: </span>
            {post.lostLocation}
          </div>
          <div>
            <span className="tw-font-bold">유실 날짜: </span>
            {post.lostTime?.substring(0, 10)}
          </div>
        </div>
        <div className="tw:flex tw:justify-between tw:text-sm md:tw:text-base">
          <div>
            <span className="tw-font-bold">글 제목: </span>
            {post.title}
          </div>
          <div>
            <span className="tw-font-bold">연락처: </span>
            {post.contactPhone}
          </div>
        </div>

        {post.tagList?.length > 0 && (
          <div className="tw:mt-3 tw:flex tw:flex-wrap tw:gap-2">
            {post.tagList.map((tag) => (
              <span
                key={tag.name}
                className="tw:bg-gray-200 tw:px-2 tw:py-1 tw:rounded tw:text-sm"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 댓글 섹션 */}
      <div className="tw:mt-6">
        <h3 className="tw:font-bold tw:text-lg">💬 댓글 {post.comments?.length || 0}</h3>
        <div className="tw:mt-3">
          {post.comments?.map((comment) => (
            <CommentItem
              key={comment.commentId}
              comment={comment}
              postId={post.postId}
              loginUserId={loginUserId}
              editId={editId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const CommentItem = ({ comment, postId, loginUserId, editId }) => {
  return (
    <div className={`tw:border-b tw:border-gray-200 tw:pb-3 tw:mb-3 ${comment.parentId ? 'tw:ml-10' : ''}`}>
      <div className="tw:flex tw:justify-between">
        <div className="tw:flex tw:items-center tw:gap-2">
          <img
            src={comment.profileImg ? `http://localhost:8080${comment.profileImg}` : defaultProfile}
            alt="프로필"
            className="tw:w-8 tw:h-8 tw:rounded-full tw:object-cover"
          />
          <span className="tw-font-semibold">{comment.nickname}</span>
          <span className="tw:text-gray-500 tw:text-xs md:tw:text-sm">{comment.createdAt?.substring(0, 16)}</span>
          {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
            <span className="tw:text-gray-400 tw:text-xs md:tw:text-sm">(수정됨)</span>
          )}
        </div>

        {loginUserId === comment.userId && (
          <div className="tw:flex tw:gap-2">
            <button className="tw-text-xs tw:text-blue-500 hover:tw:underline">수정</button>
            <button className="tw-text-xs tw:text-red-500 hover:tw:underline">삭제</button>
          </div>
        )}
      </div>

      <div className="tw-mt-2 tw:text-sm">{comment.content}</div>

      {comment.replies?.length > 0 && (
        <div className="tw-mt-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.commentId}
              comment={reply}
              postId={postId}
              loginUserId={loginUserId}
              editId={editId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LostRead;
