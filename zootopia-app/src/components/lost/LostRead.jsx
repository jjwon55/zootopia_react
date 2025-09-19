import React from 'react';
import { Link } from 'react-router-dom';
import defaultProfile from '../../assets/img/default-profile.png';
import pinkArrow from '../../assets/img/pinkarrow.png';
import shareIcon from '../../assets/img/share.png';
import lostMain from '../../assets/img/lostmain.png';
import CommentSection from '../../components/lost/CommentSection';
import { toastSuccess, toastError } from '../../apis/posts/alert';
import { formatDateOnly } from '../../utils/format';

// /api 프록시 환경에서 이미지 경로 정규화
const resolveImg = (src) => {
  if (!src) return null;
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith('/api/')) return src;
  if (src.startsWith('/')) return `/api${src}`;
  return `/api/${src}`;
};
  
// 본문 HTML 내 이미지 src를 /api 기준으로 변환
const normalizeContentImgSrc = (html) =>
  (html || '').replace(/src="\/(?!api\/)/g, 'src="/api/');

const LostRead = ({
  post,
  isOwner: isOwnerFromApi,
  loginUserId,
  // ✅ 댓글 작성자 정보
  loginNickname,
  loginProfileImg,
  editId,
  setEditId,
  onDelete,
  // ✅ 댓글 변경 시 상위 재조회
  onCommentsChange,
}) => {
  const ownerId = post?.user?.userId ?? post?.userId;
  const isOwner =
    typeof isOwnerFromApi === 'boolean'
      ? isOwnerFromApi
      : String(loginUserId ?? '') === String(ownerId ?? '');

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => toastSuccess('링크가 복사되었습니다!'))
      .catch(() => toastError('복사 실패'));
  };

  const processedContent = normalizeContentImgSrc(post.content);

  return (
    <div className="tw:max-w-[900px] tw:mx-auto tw:my-8 tw:p-4 tw:bg-white tw:rounded-lg tw:shadow">
      {/* 상단 경로 & 버튼 */}
      <div className="tw:flex tw:justify-between tw:items-center tw:mb-4">
        <Link to="/lost" className="tw:flex tw:items-center tw:gap-1 tw:text-[#F35F4C] tw:hover:underline">
          유실동물 게시판
          <img src={pinkArrow} alt="forward" className="tw:w-[15px] tw:h-[15px]" />
        </Link>

        {isOwner && (
          <div className="tw:flex tw:gap-2">
            <Link
              to={`/lost/edit/${post.postId}`}
              className="tw:border tw:border-gray-400 tw:px-3 tw:py-1 tw:rounded tw:hover:bg-gray-100"
            >
              수정
            </Link>
            <button
              onClick={() => {
                if (window.confirm('정말 삭제하시겠습니까?')) onDelete();
              }}
              className="tw:border tw:border-red-400 tw:text-red-500 tw:px-3 tw:py-1 tw:rounded tw:hover:bg-red-50"
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
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
        <div className="tw:flex tw:justify-center tw:mt-4">
          <button
            onClick={handleShare}
            className="tw:flex tw:items-center tw:gap-2 tw:bg-gray-100 tw:px-4 tw:py-2 tw:rounded tw:hover:bg-gray-200"
          >
            <img src={shareIcon} alt="공유하기" className="tw:w-[25px] tw:h-[25px]" />
            공유하기
          </button>
        </div>
      </div>

{/* 정보 박스 (v2) */}
<div className="tw:mb-6">
  <div className="tw:rounded-[12px] tw:border tw:border-zinc-200 tw:bg-[#fffefb] tw:p-4">
    <div className="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-3">
      {post.lostLocation && (
        <div className="tw:flex tw:items-start tw:gap-2">
          <span className="tw-w-24 tw-shrink-0 tw-text-sm tw-font-semibold tw-text-zinc-500">마지막 목격 장소  : </span>
          <span className="tw-text-[15px] tw-text-zinc-800">{post.lostLocation}</span>
        </div>
      )}

      {post.lostTime && (
        <div className="tw:flex tw:items-start tw:gap-2">
          <span className="tw-w-24 tw-shrink-0 tw-text-sm tw-font-semibold tw-text-zinc-500">유실 날짜 : </span>
          <time className="tw-text-[15px] tw-text-zinc-800">{formatDateOnly(post.lostTime)}</time>
        </div>
      )}

      {post.title && (
        <div className="tw:flex tw:items-start tw:gap-2">
          <span className="tw-w-24 tw-shrink-0 tw-text-sm tw-font-semibold tw-text-zinc-500">글 제목 : </span>
          <span className="tw-text-[15px] tw-text-zinc-800">{post.title}</span>
        </div>
      )}

      {post.contactPhone && (
        <div className="tw:flex tw:items-start tw:gap-2">
          <span className="tw-w-24 tw-shrink-0 tw-text-sm tw-font-semibold tw-text-zinc-500">연락처 : </span>
          <a
            href={`tel:${post.contactPhone}`}
            className="tw-text-[15px] tw-text-rose-600 tw-underline hover:tw:no-underline"
          >
            {post.contactPhone}
          </a>
        </div>
      )}
    </div>

    {post.tagList?.length > 0 && (
      <div className="tw:mt-4 tw:flex tw:flex-wrap tw:gap-2">
        {post.tagList.map((tag) => (
          <span
            key={tag.name}
            className="tw-inline-flex tw-items-center tw-gap-1 tw-bg-zinc-100 tw-border tw-border-zinc-200 tw-rounded-full tw-px-3 tw-py-[6px] tw-text-[13px]"
          >
            #{tag.name}
          </span>
        ))}
      </div>
    )}
  </div>
</div>


      {/* 댓글 섹션 */}
      <div className="tw:pt-4 tw:border-t tw:border-gray-200">
        <CommentSection
          postId={post.postId}
          comments={post.comments || []}
          loginUserId={loginUserId}
          loginNickname={loginNickname}
          loginProfileImg={loginProfileImg}
          onChange={() => onCommentsChange?.()} // ✅ 댓글 변경 시 상위 재조회
          editId={editId}
          setEditId={setEditId}
        />
      </div>
    </div>
  );
};

export default LostRead;
