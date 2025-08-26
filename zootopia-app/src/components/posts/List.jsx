import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import defaultThumbnail from '../../assets/img/default-thumbnail.png';
import defaultProfile from '../../assets/img/default-profile.png';
import chatIcon from '../../assets/img/chat.png';
import writeIcon from '../../assets/img/write.png';
import catPpl from '../../assets/img/catppl.jpg';
import Ppl from '../../assets/img/ppl2.jpg';
import ReportModal from '../../components/admin/users/ReportsUserModal';
import SendMessageModal from '../message/SendMessageModal';

/* =========================
   태그 정규화 유틸
   - post.tagList: [{name}, ...] / ["태그"] / "고양이, 강아지" 모두 대응
   ========================= */
const normalizeTags = (post) => {
  const raw = post?.tagList ?? post?.tags ?? [];
  if (Array.isArray(raw)) {
    return raw
      .map((t) => (typeof t === 'string' ? t : (t?.name ?? t?.tag ?? '')))
      .map((s) => s.replace(/^#/, '').trim())
      .filter(Boolean);
  }
  if (typeof raw === 'string') {
    return raw
      .split(/[,#\s]+/) // 쉼표/공백/# 구분
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
};

/* =========================
   작성자 액션 드롭다운 메뉴
   ========================= */
function AuthorMenu({ user, profileSrc, onMessage }) {
  const [open, setOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return;
      setOpen(false);
    };
    const onEsc = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  // 탈퇴/비공개 사용자 처리
  if (!user) {
    return (
      <span className="tw:flex tw:items-center tw:gap-[6px] tw:text-[#999]">
        <img
          src={profileSrc || defaultProfile}
          alt=""
          className="tw:w-[24px] tw:h-[24px] tw:rounded-full tw:object-cover"
        />
        탈퇴회원
      </span>
    );
  }

  return (
    <div className="tw:relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="tw:flex tw:items-center tw:gap-[6px] tw:hover:opacity-90 tw:focus:outline-none"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <img
          src={profileSrc || defaultProfile}
          alt="작성자 프로필"
          className="tw:w-[24px] tw:h-[24px] tw:rounded-full tw:object-cover"
        />
        {user.nickname || '알 수 없음'}
      </button>

      {open && (
        <div
          role="menu"
          className="tw:absolute tw:right-0 tw:z-50 tw:mt-2 tw:w-[180px] tw:bg-white tw:border tw:border-[#eee] tw:rounded-xl tw:shadow-xl tw:py-1"
        >
          {/* 프로필 보기 → 마이페이지로 이동 */}
          <Link
            to={`/mypage/${user.userId}`}
            className="tw:block tw:w-full tw:text-left tw:px-3 tw:py-2 hover:tw:bg-gray-50 tw:no-underline 
                      tw:hover:bg-[#ff9191] tw:hover:text-[#ffffff] tw:rounded-[10px] tw:hover:transition-all tw:duration-200"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            프로필 보기
          </Link>

          {/* 쪽지 보내기 */}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onMessage?.(user);
            }}
            className="tw:w-full tw:text-left tw:px-3 tw:py-2 hover:tw:bg-gray-50 tw:cursor-pointer 
                    tw:hover:bg-[#ff9191] tw:hover:text-[#ffffff] tw:rounded-[10px] tw:hover:transition-all tw:duration-200"
            role="menuitem"
          >
            쪽지 보내기
          </button>

          {/* 신고하기 → 모달 오픈 */}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setReportOpen(true);
            }}
            className="tw:w-full tw:text-left tw:px-3 tw:py-2 hover:tw:bg-gray-50 tw:text-red-500 tw:cursor-pointer 
                      tw:hover:bg-[#ff4949] tw:hover:text-[#ffffff] tw:rounded-[10px] tw:hover:transition-all tw:duration-200"
            role="menuitem"
          >
            신고하기
          </button>
        </div>
      )}

      {/* 신고 모달 */}
      {reportOpen && (
        <ReportModal targetUser={user} onClose={() => setReportOpen(false)} />
      )}
    </div>
  );
}

/* =========================
   게시글 리스트
   ========================= */
const List = ({ posts, topList, pagination, keyword }) => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const sort = query.get('sort') || 'latest';

  // 쪽지 보내기 모달 상태 관리
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageRecipient, setMessageRecipient] = useState(null);

  const buildQuery = (params) => {
    const newQuery = new URLSearchParams(query);
    Object.entries(params).forEach(([key, value]) => {
      newQuery.set(key, value);
    });
    return `/posts?${newQuery.toString()}`;
  };

  // 라우팅 핸들러 -> 모달 핸들러로 변경
  const handleSendMessage = (user) => {
    setMessageRecipient(user);
    setMessageModalOpen(true);
  };

  // ✅ 화면 렌더링 시 숨김 게시글 제거
  const visibleTopList = Array.isArray(topList) ? topList.filter((p) => !p?.hidden) : [];
  const visiblePosts = Array.isArray(posts) ? posts.filter((p) => !p?.hidden) : [];

  return (
    <>
      <section className="tw:text-gray-800">
        {/* ===== 실시간 인기 게시물 ===== */}
        <section className="tw:max-w-[900px] tw:mx-auto tw:my-8 tw:p-4 tw:bg-[#fffefb] tw:rounded-[10px] tw:border tw:border-[#eee]">
          <h2 className="tw:text-[#ff3c3c] tw:text-[18px] tw:mb-2">🔥 실시간 인기게시물</h2>
          <div className="tw:flex tw:gap-8">
            {[visibleTopList.slice(0, 5), visibleTopList.slice(5, 10)].map((list, i) => (
              <ol key={i} className="tw:space-y-2 tw:w-1/2 tw:pl-[19px] tw:text-[15px]">
                {list.map((post, index) => (
                  <li key={post.postId} className="tw:flex tw:items-center tw:gap-2">
                    <span className="tw:text-red-400 tw:font-bold tw:w-6 tw:text-center">
                      {index + 1 + i * 5}
                    </span>
                    <span className="tw:bg-[#a06697] tw:text-white tw:text-xs tw:px-2 tw:py-0.5 tw:rounded">
                      {post.category || '카테고리'}
                    </span>
                    <Link
                      className="tw:truncate tw:hover:underline tw:text-inherit tw:no-underline"
                      to={`/posts/read/${post.postId}`}
                    >
                      {post.title || '제목없음'}
                    </Link>
                  </li>
                ))}
              </ol>
            ))}
          </div>
        </section>

        {/* ===== 광고 배너 ===== */}
        <div className="tw:max-w-[900px] tw:mx-auto tw:my-4 tw:text-center">
          <img src={catPpl} alt="광고배너" className="tw:w-full tw:rounded-[10px]" />
        </div>

        {/* ===== 커뮤니티 리스트 ===== */}
        <section className="tw:max-w-[900px] tw:mx-auto tw:bg-white tw:p-6 tw:rounded-[10px] tw:shadow-[0_2px_5px_rgba(0,0,0,0.05)]">
          <div className="tw:flex tw:justify-between tw:items-center tw:mb-4">
            <div className="tw:flex tw:items-center tw:gap-[8px]">
              <img src={chatIcon} className="tw:w-[24px] tw:h-[24px]" alt="채팅 아이콘" />
              <h2 className="tw:text-xl tw:font-semibold">커뮤니티</h2>
            </div>
          </div>

          {/* 정렬/글쓰기 */}
          <div className="tw:flex tw:justify-between tw:items-center tw:mb-4">
            <div />
            <div className="tw:flex tw:items-center tw:gap-[10px]">
              <select
                className="tw:border tw:border-[#ccc] tw:rounded tw:px-2 tw:py-1 tw:text-sm"
                value={sort}
                onChange={(e) => (window.location.href = buildQuery({ sort: e.target.value, page: 1 }))}
              >
                <option value="latest">최신순</option>
                <option value="popular">인기순</option>
              </select>
              <Link
                to="/posts/create"
                className="tw:flex tw:items-center tw:gap-[6px] tw:border tw:border-[#ccc] tw:rounded-[20px] tw:px-[13px] tw:py-[6px] tw:text-[14px] tw:bg-white tw:text-inherit tw:no-underline"
              >
                <img src={writeIcon} className="tw:w-[18px] tw:h-[18px]" alt="글쓰기 아이콘" /> 글쓰기
              </Link>
            </div>
          </div>

          {visiblePosts.map((post) => (
            <div
              key={post.postId}
              className="tw:flex tw:gap-[16px] tw:py-[16px] tw:border-t tw:border-[#eee] tw:last:border-b"
            >
              <div className="tw:w-[80px] tw:h-[80px]">
                <img
                  src={post.thumbnailUrl ? `http://localhost:8080${post.thumbnailUrl}` : defaultThumbnail}
                  alt="썸네일"
                  className="tw:w-full tw:h-full tw:rounded-[10px] tw:object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = defaultThumbnail;
                  }}
                />
              </div>

              <div className="tw:flex tw:flex-col tw:justify-between tw:flex-grow">
                <div>
                  <Link
                    to={`/posts/read/${post.postId}`}
                    className="tw:text-[17px] tw:font-bold tw:mb-[5px] tw:block tw:hover:underline tw:text-inherit tw:no-underline"
                  >
                    {post.title || '제목없음'}
                  </Link>

                  {/* 카테고리 */}
                  <span className="tw:inline-block tw:bg-[#e0f2ff] tw:text-[#007acc] tw:px-[8px] tw:py-[3px] tw:rounded-[10px] tw:max-w-[65px] tw:h-[25px] tw:text-sm">
                    {post.category || '기타'}
                  </span>

                  {/* ✅ 태그 칩 */}
                  {(() => {
                    const tags = normalizeTags(post);
                    if (!tags.length) return null;
                    return (
                      <div className="tw:flex tw:flex-wrap tw:gap-1 tw:mt-2">
                        {tags.slice(0, 5).map((tag) => (
                          <Link
                            key={`${post.postId}-${tag}`}
                            to={buildQuery({ type: 'tag', keyword: tag, page: 1 })}
                            className="tw:no-underline"
                            title={`태그: ${tag}`}
                          >
                            <span className="tw:bg-[#f5f5f5] tw:text-[#555] tw:text-xs tw:px-2 tw:py-[2px] tw:rounded hover:tw:bg-[#eee]">
                              #{tag}
                            </span>
                          </Link>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                <div className="tw:flex tw:justify-between tw:items-center tw:gap-[6px] tw:text-[14px] tw:text-[#666] tw:mt-1">
                  {/* 작성자 클릭 시 메뉴 */}
                  <AuthorMenu
                    user={post.user}
                    profileSrc={
                      post.user?.profileImg ? `http://localhost:8080${post.user.profileImg}` : defaultProfile
                    }
                    onMessage={handleSendMessage}
                  />

                  <div className="tw:text-[14px] tw:text-[#888] tw:flex tw:gap-[6px] tw:mt-[8px]">
                    <span>
                      <i className="bi bi-eye"></i> {post.viewCount}
                    </span>
                    <span>
                      <i className="bi bi-chat-dots"></i> {post.commentCount}
                    </span>
                    <span>
                      <i className="bi bi-heart-fill tw:text-red-500"></i> {post.likeCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* 검색 폼 */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const type = form.type.value;
              const keywordVal = form.keyword.value;
              window.location.href = buildQuery({ type, keyword: keywordVal, page: 1 });
            }}
            className="tw:flex tw:gap-2 tw:mt-6"
          >

            <select name="type" className="tw:border tw:border-[#dee2e6] tw:rounded tw:px-2 tw:py-1 tw:w-[140px]">
              <option value="title">제목</option>
              <option value="titleContent">제목+내용</option>
              <option value="tag">태그</option>
            </select>
            <input
              type="text"
              name="keyword"
              placeholder="검색어 입력"
              defaultValue={keyword}
              className="tw:flex-grow tw:border tw:border-[#dee2e6] tw:rounded tw:px-2 tw:py-1 tw:w-[70%]"
            />
            <button
              type="submit"
              className="tw:bg-[#FF5E5E] tw:text-white tw:px-4 tw:py-1 tw:rounded-lg tw:hover:shadow-md transition-shadow"
            >
              검색
            </button>
          </form>


          {/* 광고 */}
          <div className="tw:my-6">
            <img src={Ppl} alt="광고배너" className="tw:w-full tw:rounded-[10px]" />
          </div>

          {/* 페이지네이션 */}
          {pagination && (
            <nav className="tw:mt-8">
              <ul className="tw:flex tw:justify-center tw:gap-2">
                {pagination.start > 1 && (
                  <li>
                    <Link
                      className="tw:px-[13px] tw:py-[6px] tw:border tw:rounded-[6px] tw:text-[14px] tw:text-inherit tw:no-underline"
                      to={buildQuery({ page: pagination.start - 1 })}
                    >
                      이전
                    </Link>
                  </li>
                )}
                {Array.from({ length: pagination.end - pagination.start + 1 }, (_, idx) => pagination.start + idx).map(
                  (pageNum) => (
                    <li key={pageNum}>
                      <Link
                        className={`tw:px-[13px] tw:py-[6px] tw:border tw:rounded-[6px] tw:text-[14px] tw:text-inherit tw:no-underline ${pagination.page === pageNum ? 'tw:bg-[#5b99f5] tw:text-white tw:border-[#5b99f5]' : ''
                          }`}
                        to={buildQuery({ page: pageNum })}
                      >
                        {pageNum}
                      </Link>
                    </li>
                  )
                )}
                {pagination.end < pagination.last && (
                  <li>
                    <Link
                      className="tw:px-[13px] tw:py-[6px] tw:border tw:rounded-[6px] tw:text-[14px] tw:text-inherit tw:no-underline"
                      to={buildQuery({ page: pagination.end + 1 })}
                    >
                      다음
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          )}
        </section>
      </section>
      
      {/* 쪽지 보내기 모달 */}
      <SendMessageModal
        open={messageModalOpen}
        onClose={() => setMessageModalOpen(false)}
        recipient={messageRecipient}
      />
    </>
  );
};

export default List;
