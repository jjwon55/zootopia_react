import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import defaultProfile from '../../assets/img/default-profile.png';
import ReportModal from '../../components/admin/users/ReportsUserModal'; 


/** 서버 경로를 안전한 이미지 URL로 변환 */
const resolveImg = (src) => {
  if (!src) return null;
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith('/api/')) return src;
  if (src.startsWith('/')) return `/api${src}`;
  return `/api/${src}`;
};

export default function UserInfo({ user, pets = [], myPosts = [] }) {
  if (!user) return null;

  const [reportOpen, setReportOpen] = useState(false); // ✅ 추가

  const profileSrc = resolveImg(user.profileImg) || defaultProfile;

  /** 카테고리별 상세 링크 */
  const postLink = (category, postId) => {
    if (category === '자랑글') return `/showoff/read/${postId}`;
    if (category === '자유글' || category === '질문글') return `/posts/read/${postId}`;
    if (category === '유실동물') return `/lost/read/${postId}`;
    return `/posts/read/${postId}`; // fallback
  };

  return (
    <div className="tw:py-6">
      <div className="tw:max-w-[880px] tw:mx-auto tw:px-4">
        {/* 👤 사용자 프로필 */}
        <section className="tw:mt-5 tw:p-5 tw:rounded-xl tw:bg-[#efefef]">
          <h2 className="tw:text-[20px] tw:font-bold tw:mb-4">
            {user.nickname}님의 프로필
          </h2>
          <div className="tw:flex tw:items-center">
            <img
              src={profileSrc}
              alt="프로필 이미지"
              className="tw:w-20 tw:h-20 tw:rounded-full tw:object-cover tw:mr-3"
            />
            <div>
              <div className="tw:font-semibold">{user.nickname}</div>
              {user.intro && <div className="tw:mt-1">{user.intro}</div>}
            </div>

            <button
                type="button"
                className="tw:btn tw:btn-error tw:btn-sm"
                onClick={() => setReportOpen(true)}
                title="이 유저 신고하기"
              >
                🚩 신고하기 
              </button>
          </div>
        </section>

        {/* 🐶 반려동물 정보 */}
        <section className="tw:mt-5 tw:p-5 tw:rounded-xl tw:bg-[#efefef]">
          <h2 className="tw:text-[20px] tw:font-bold tw:mb-4">반려동물 정보</h2>

          {(!pets || pets.length === 0) && (
            <div className="tw:text-center tw:text-zinc-400 tw:italic tw:py-5">
              등록된 반려동물이 없습니다.
            </div>
          )}

          {pets?.map((pet) => (
            <div
              key={pet.userPetId ?? `${pet.name}-${pet.breed}-${pet.birthDate}`}
              className="tw:border tw:border-zinc-200 tw:rounded-xl tw:p-4 tw:mb-3"
            >
              <div className="tw:font-semibold">
                {pet.name}{' '}
                <span className="tw:text-zinc-600">({pet.species})</span>
              </div>
              <div className="tw:mt-1">품종: {pet.breed ?? '-'}</div>
              <div className="tw:mt-0.5">
                생일:{' '}
                {pet.birthDate
                  ? new Date(pet.birthDate).toISOString().slice(0, 10)
                  : '-'}
              </div>
            </div>
          ))}
        </section>

        {/* 📝 작성한 글 */}
        <section className="tw:mt-5 tw:mb-5 tw:p-5 tw:rounded-xl tw:bg-[#efefef]">
          <h2 className="tw:text-[20px] tw:font-bold tw:mb-4">📄 작성한 글</h2>

          {myPosts?.length ? (
            <ul className="tw:max-h-[300px] tw:overflow-y-auto tw:space-y-2">
              {myPosts.map((post) => (
                <li
                  key={post.postId}
                  className="tw:flex tw:items-center tw:gap-2 tw:bg-zinc-50 tw:rounded-lg tw:px-3 tw:py-2 hover:tw:bg-zinc-100"
                >
                  <span className="tw:text-[13px] tw:px-2 tw:py-1 tw:rounded tw:bg-zinc-600 tw:text-white">
                    {post.category}
                  </span>
                  <Link
                    to={postLink(post.category, post.postId)}
                    className="tw:font-semibold tw:text-zinc-800 tw:no-underline tw:truncate hover:tw:text-blue-600"
                    title={post.title}
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="tw:text-center tw:text-zinc-400 tw:italic tw:py-5">
              작성한 게시글이 없습니다.
            </div>
          )}
        </section>
      </div>

      {/* 🚩 신고 모달 */}
      {reportOpen && (
        <ReportModal
          targetUser={user}
          onClose={() => setReportOpen(false)}
          // 글/댓글 화면에서 재사용 시 아래처럼 컨텍스트 넘길 수 있어요:
          // context={{ postId, commentId, lostPostId, lostCommentId }}
        />
      )}
    </div>
  );
}
