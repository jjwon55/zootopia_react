// src/components/posts/Read.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/format';
import defaultProfile from '../../assets/img/default-profile.png';
import pinkArrow from '../../assets/img/pinkarrow.png';
import Share from '../../assets/img/share.png';
import CommentSection from './CommentSection';
import { toastSuccess, toastInfo, toastError } from '../../apis/posts/alert';
import { toggleLike } from '../../apis/posts/posts';
import { createPostReport } from '../../apis/posts/PostReport';

// --- 태그 정규화: string / string[] / [{name}] 모두 지원
const normalizeTags = (post) => {
  const raw = post?.tagList ?? post?.tags ?? [];
  if (Array.isArray(raw)) {
    return raw
      .map(t => typeof t === 'string' ? t : (t?.name ?? t?.tag ?? ''))
      .map(s => s.replace(/^#/, '').trim())
      .filter(Boolean);
  }
  if (typeof raw === 'string') {
    return raw
      .split(/[,#\s]+/)
      .map(s => s.trim())
      .filter(Boolean);
  }
  return [];
};

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

const Read = ({
  post,
  isOwner: isOwnerFromApi,
  loginUserId,
  // 로그인 사용자 표시용
  loginNickname,
  loginProfileImg,
  editId,
  setEditId,
  onDelete,
  // 댓글 변경 시 상위에서 재조회
  onCommentsChange,
}) => {

  const navigate = useNavigate();
  const location = useLocation();

  const ownerId = post?.user?.userId ?? post?.userId;
  const isOwner =
    typeof isOwnerFromApi === 'boolean'
      ? isOwnerFromApi
      : String(loginUserId ?? '') === String(ownerId ?? '');

  const [liked, setLiked] = React.useState(!!post?.liked);
  const [likeCount, setLikeCount] = React.useState(post?.likeCount ?? 0);

  React.useEffect(() => {
    setLiked(!!post?.liked);
    setLikeCount(post?.likeCount ?? 0);
  }, [post]);

  const handleShare = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => toastSuccess('링크를 복사했어요 ✨'))
      .catch(() => toastError('복사에 실패했어요'));
  };

  const [liking, setLiking] = React.useState(false);
  const handleLike = async () => {
    if (!loginUserId) {
      // 로그인 후 돌아오도록 현재 위치 전달
      navigate('/login', { state: { from: location }, replace: true });
      return;
    }

    if (liking) return;
    setLiking(true);

    const prevLiked = liked;
    const prevCount = likeCount;
    const nextLiked = !prevLiked;

    setLiked(nextLiked);
    setLikeCount((c) => c + (nextLiked ? 1 : -1));
    nextLiked ? toastSuccess('좋아요 했어요 💗') : toastInfo('좋아요를 취소했어요');

    try {
      const res = await toggleLike(post.postId);
      if (res?.data) {
        if (typeof res.data.liked !== 'undefined') setLiked(!!res.data.liked);
        if (typeof res.data.likeCount === 'number') setLikeCount(res.data.likeCount);
      }
    } catch (e) {
      setLiked(prevLiked);
      setLikeCount(prevCount);
      if (e?.response?.status === 401) toastError('로그인이 필요합니다.');
      else toastError('좋아요 처리 중 오류가 발생했어요.');
    } finally {
      setLiking(false);
    }
  };

  // ===== 신고 모달 상태 =====
  const [reportOpen, setReportOpen] = React.useState(false);
  const [reportReason, setReportReason] = React.useState('스팸/광고'); // 표시용 라벨
  const [reportDetails, setReportDetails] = React.useState('');
  const [reporting, setReporting] = React.useState(false);

  // 라벨 → 코드 매핑 (백엔드 DB reason_code)
  const mapReasonToCode = (label) => {
    switch (label) {
      case '스팸/광고': return 'SPAM';
      case '욕설/혐오표현': return 'ABUSE';
      case '개인정보 노출': return 'PRIVACY';
      case '사기/거짓 정보': return 'FRAUD';
      case '기타': return 'OTHER';
      default: return 'OTHER';
    }
  };

  const openReport = () => {
    if (!loginUserId) {
      navigate('/login', { state: { from: location }, replace: true });
      return;
    }
    setReportOpen(true);
  };

  const closeReport = () => {
    if (reporting) return;
    setReportOpen(false);
    setReportReason('스팸/광고');
    setReportDetails('');
  };

  const submitReport = async (e) => {
    e?.preventDefault?.();
    if (!reportReason) { toastError('신고 사유를 선택해주세요.'); return; }
    // ✅ 상세 사유는 선택 입력(옵션) — 길이 검사 제거

    setReporting(true);
    try {
      await createPostReport({
        postId: post.postId,
        reasonCode: mapReasonToCode(reportReason),
        reasonText: reportDetails.trim() || null, // ✅ 비어있으면 null로 보냄
      });
      toastSuccess('신고가 접수되었습니다. 감사합니다 🙏');
      closeReport();
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || err?.message || '';
      if (status === 401) {
        toastError('로그인이 필요합니다.');
        navigate('/login', { state: { from: location }, replace: true });
      } else if (status === 409 || /이미 신고|duplicate|exists/i.test(msg)) {
        toastInfo('이미 신고 접수된 게시글입니다.');
        closeReport();
      } else {
        toastError('신고 처리 중 오류가 발생했어요.');
      }
    } finally {
      setReporting(false);
    }
  };

  const processedContent = normalizeContentImgSrc(post.content);
  const tags = React.useMemo(() => normalizeTags(post), [post]);

  return (
    <div className="tw:max-w-[720px] tw:mx-auto tw:my-7 tw:bg-white tw:border-2 tw:border-[#ccc] tw:rounded-xl tw:p-6">
      {/* 상단: 목록/수정/삭제 or 신고 */}
      <div className="tw:flex tw:items-center tw:justify-between">
        <Link
          to="/posts"
          className="tw:inline-flex tw:items-center tw:text-[#F35F4C] tw:text-[14px] tw:font-semibold tw:no-underline tw:hover:underline"
        >
          커뮤니티
          <img src={pinkArrow} alt="back" className="tw:w-[15px] tw:h-[15px] tw:ml-1" />
        </Link>

        {isOwner ? (
          <div className="tw:flex tw:items-center tw:gap-2 tw:pb-2">
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

            <button
              onClick={() => {
                if (!loginUserId) {
                  navigate('/login', { state: { from: location }, replace: true });
                  return;
                }
                onDelete?.();
              }}
              className="tw:flex tw:items-center tw:gap-1 tw:px-3 tw:py-1.5 tw:text-sm
             tw:bg-red-50 tw:text-red-600 tw:rounded-lg
             tw:border tw:border-red-200 tw:hover:bg-red-100
             tw:shadow-sm tw:hover:shadow transition tw:cursor-pointer"
            >
              <i className="bi bi-trash-fill" />
              삭제
            </button>
          </div>
        ) : (
          <div className="tw:flex tw:items-center tw:gap-2 tw:pb-2">
            <button
              onClick={openReport}
              className="tw:flex tw:items-center tw:gap-1 tw:px-3 tw:py-1.5 tw:text-sm
              tw:bg-red-50 tw:text-red-600 tw:rounded-lg
              tw:border tw:border-red-200 hover:tw:bg-red-100
              tw:shadow-sm hover:tw:shadow transition tw:cursor-pointer"
            >
              <i className="bi bi-flag-fill" />
              신고하기
            </button>
          </div>
        )}
      </div>

      <h1 className="tw:text-[22px] tw:font-bold tw:mt-2">{post.title}</h1>
      <div className="tw:flex tw:items-start tw:justify-between tw:text-[12px] tw:text-[#777] tw:mt-2 tw:mb-4">
        <div className="tw:flex tw:items-center">
          <Link to={`/mypage/${post.user?.userId || ''}`} className="tw:no-underline">
            <img
              src={resolveImg(post.user?.profileImg) || defaultProfile}
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
        className="toastui-editor-contents tw:text-[16px] tw:leading-[1.6] tw:mb-4 tw:min-h-[220px]"
        dangerouslySetInnerHTML={{ __html: normalizeContentImgSrc(post.content) }}
      />

      {/* ✅ 본문 하단 태그 (작게) */}
      {Array.isArray(tags) && tags.length > 0 && (
        <div className="tw:flex tw:flex-wrap tw:gap-1 tw:mb-6 tw:text-xs">
          {tags.map((tag) => (
            <Link
              key={tag}
              to={`/posts?type=tag&keyword=${encodeURIComponent(tag)}&page=1`}
              className="tw:no-underline"
              title={`태그: ${tag}`}
            >
              <span className="tw:inline-block tw:bg-[#f5f5f5] tw:text-[#666] tw:px-2 tw:py-[2px] tw:rounded hover:tw:bg-[#eee]">
                #{tag}
              </span>
            </Link>
          ))}
        </div>
      )}

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
          disabled={liking}
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
          comments={post.comments || []}
          loginUserId={loginUserId}
          // 첫 작성부터 실제 닉/프로필 사용
          loginNickname={loginNickname}
          loginProfileImg={loginProfileImg}
          // 댓글 생성/수정/삭제 후 상위에서 재조회
          onChange={() => onCommentsChange?.()}
          editId={editId}
          setEditId={setEditId}
        />
      </div>

      {/* ===== 신고 모달 ===== */}
      {reportOpen && (
        <div
          className="tw:fixed tw:inset-0 tw:z-50 tw:flex tw:items-center tw:justify-center"
          role="dialog" aria-modal="true"
          onKeyDown={(e) => e.key === 'Escape' && closeReport()}
        >
          <div className="tw:absolute tw:inset-0 tw:bg-black/40" onClick={closeReport} />
          <div className="tw:relative tw:bg-white tw:rounded-2xl tw:shadow-2xl tw:w-full tw:max-w-md tw:p-5">
            <div className="tw:flex tw:items-center tw:justify-between tw:mb-3">
              <h2 className="tw:text-lg tw:font-bold">게시글 신고</h2>
              <button onClick={closeReport} className="tw:text-gray-500 hover:tw:text-black">
                <i className="bi bi-x-lg" />
              </button>
            </div>

            <form onSubmit={submitReport} className="tw:space-y-3">
              {/* 사유 선택 (필수) */}
              <label className="tw:block">
                <span className="tw:block tw:text-sm tw:text-gray-700 tw:mb-1">신고 사유</span>
                <select
                  className="tw:w-full tw:border tw:rounded tw:px-3 tw:py-2"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  required
                >
                  <option>스팸/광고</option>
                  <option>욕설/혐오표현</option>
                  <option>개인정보 노출</option>
                  <option>사기/거짓 정보</option>
                  <option>기타</option>
                </select>
              </label>

              {/* 상세 내용 (선택) */}
              <label className="tw:block">
                <span className="tw:block tw:text-sm tw:text-gray-700 tw:mb-1">
                  상세 사유 <span className="tw:text-gray-400">(선택)</span>
                </span>
                <textarea
                  className="tw:w-full tw:min-h-[96px] tw:border tw:rounded tw:px-3 tw:py-2"
                  placeholder="추가로 설명이 필요하면 적어주세요. (선택)"
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                />
              </label>

              <div className="tw:flex tw:justify-end tw:gap-2 tw:pt-1">
                <button
                  type="button"
                  onClick={closeReport}
                  className="tw:px-4 tw:py-2 tw:border tw:rounded"
                  disabled={reporting}
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={reporting}
                  className={`tw:px-4 tw:py-2 tw:rounded tw:text-white ${reporting ? 'tw:bg-red-300' : 'tw:bg-red-500 hover:tw:bg-red-600'}`}
                >
                  {reporting ? '접수 중…' : '신고 접수'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Read;
