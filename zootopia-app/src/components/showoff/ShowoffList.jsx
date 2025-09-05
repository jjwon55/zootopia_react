// src/pages/showoff/List.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import defaultThumbnail from '../../assets/img/default-thumbnail.png';
import defaultProfile from '../../assets/img/default-profile.png';
import chatIcon from '../../assets/img/chat.png';
import writeIcon from '../../assets/img/write.png';
import catPpl from '../../assets/img/catppl.jpg';
import Ppl from '../../assets/img/ppl2.jpg';

// 백엔드 절대 URL (운영에선 https://api.example.com 등)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/** 공통 이미지 경로 보정
 *  - src 없으면 fallback
 *  - 절대 URL(http/https)이면 그대로
 *  - 개발(vite dev)일 땐 프록시(/api) 경유
 *  - 운영 빌드일 땐 API_URL 붙이기
 *  - 이미 /api/로 시작하면 중복 방지
 */
const resolveSrc = (src, fallback) => {
  if (!src) return fallback;
  if (/^https?:\/\//i.test(src)) return src;

  // DB가 'default-profile.png' 같은 "가짜 기본값"을 주는 경우도 방지
  if (/default-profile\.(png|jpe?g|webp|gif)$/i.test(src)) return defaultProfile;

  const ensureSlash = (s) => (s.startsWith('/') ? s : `/${s}`);

  if (import.meta.env.DEV) {
    // Vite dev proxy 사용하는 환경
    if (src.startsWith('/api/')) return src;
    return `/api${ensureSlash(src)}`;
  } else {
    // 운영 빌드: 절대 API URL 사용
    return `${API_URL}${ensureSlash(src)}`;
  }
};

const List = ({ loading, posts = [], topList = [], pagination, keyword }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const sort = query.get('sort') || 'latest';

  const buildQuery = (params) => {
    const newQuery = new URLSearchParams(query);
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') newQuery.delete(key);
      else newQuery.set(key, value);
    });
    return `/showoff?${newQuery.toString()}`;
  };

  return (
    <section className="tw:text-gray-800 tw:my-8">

      {/* 🔥 실시간 인기게시물 */}
      <section className="tw:max-w-[900px] tw:mx-auto tw:my-8 tw:p-4 tw:bg-[#fffefb] tw:rounded-[10px] tw:border tw:border-[#eee]">
        <h2 className="tw:text-[#ff3c3c] tw:text-[18px] tw:mb-2">🔥 실시간 인기게시물</h2>
        <div className="tw:flex tw:gap-8">
          {[topList.slice(0, 5), topList.slice(5, 10)].map((list, i) => (
            <ol key={i} className="tw:space-y-2 tw:w-1/2 tw:pl-[19px] tw:text-[15px]">
              {list.map((post, index) => (
                <li key={post.postId} className="tw:flex tw:items-center tw:gap-2">
                  <span className="tw:text-red-400 tw:font-bold tw:w-6 tw:text-center">{index + 1 + i * 5}</span>
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

      {/* 광고 배너 */}
      <div className="tw:max-w-[900px] tw:mx-auto tw:my-4 tw:text-center">
        <img src={catPpl} alt="광고배너" className="tw:w-full tw:rounded-[10px]" />
      </div>

      {/* 📋 자랑글 그리드 */}
      <section className="tw:max-w-[900px] tw:mx-auto tw:bg-white tw:p-6 tw:rounded-[10px] tw:shadow-[0_2px_5px_rgba(0,0,0,0.05)]">
        {/* 헤더 */}
        <div className="tw:flex tw:justify-between tw:items-center tw:mb-4">
          <div className="tw:flex tw:items-center tw:gap-[8px]">
            <img src={chatIcon} className="tw:w-[24px] tw:h-[24px]" alt="채팅 아이콘" />
            <h2 className="tw:text-xl tw:font-semibold">자랑글</h2>
          </div>
          <div className="tw:flex tw:items-center tw:gap-[10px]">
            <select
              className="tw:border tw:border-[#ccc] tw:rounded tw:px-2 tw:py-1 tw:text-sm"
              value={sort}
              onChange={(e) => navigate(buildQuery({ sort: e.target.value, page: 1 }))}
            >
              <option value="latest">최신순</option>
              <option value="popular">인기순</option>
            </select>
            <Link
              to="/showoff/create"
              className="tw:flex tw:items-center tw:gap-[6px] tw:border tw:border-[#ccc] tw:rounded-[20px] tw:px-[13px] tw:py-[6px] tw:text-[14px] tw:bg-white tw:text-inherit tw:no-underline"
            >
              <img src={writeIcon} className="tw:w-[18px] tw:h-[18px]" alt="글쓰기 아이콘" /> 글쓰기
            </Link>
          </div>
        </div>

        {/* 로딩 & 빈 상태 */}
        {loading && (
          <div className="tw:grid tw:grid-cols-2 md:tw:grid-cols-4 tw:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="tw.animate-pulse tw:bg-gray-100 tw:rounded-2xl tw:h-56" />
            ))}
          </div>
        )}
        {!loading && posts.length === 0 && (
          <div className="tw:text-center tw:text-gray-500 tw:py-16">게시글이 없습니다.</div>
        )}

        {/* 카드 그리드 */}
        {!loading && posts.length > 0 && (
          <div className="tw:grid tw:grid-cols-4 md:tw:grid-cols-4 tw:gap-4">
            {posts.map((post) => {
              const thumbSrc = resolveSrc(post.thumbnailUrl, defaultThumbnail);
              const profileSrc = resolveSrc(post.user?.profileImg, defaultProfile);
              return (
                <Link
                  key={post.postId}
                  to={`/showoff/read/${post.postId}`}
                  className="tw:block tw:no-underline tw:text-inherit"
                >
                  <div className="tw:h-full tw:bg-white tw:shadow-sm tw:border-0 tw:rounded-2xl tw:overflow-hidden tw:hover:shadow-md tw:transition-shadow">
                    <img
                      src={thumbSrc}
                      alt="썸네일"
                      className="tw:w-full"
                      style={{ aspectRatio: '1 / 1', objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = defaultThumbnail; }}
                    />
                    <div className="tw:p-3">
                      <h6 className="tw:text-[15px] tw:font-semibold tw:truncate tw:mb-1">
                        {post.title || '제목'}
                      </h6>
                      <div className="tw:flex tw:items-center tw:gap-2">
                        <Link
                          to={`/mypage/${post.user?.userId ?? ''}`}
                          onClick={(e) => { if (!post.user?.userId) e.preventDefault(); }}
                        >
                          <img
                            src={profileSrc}
                            alt="프로필"
                            className="tw:w-6 tw:h-6 tw:rounded-full tw:object-cover"
                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = defaultProfile; }}
                          />
                        </Link>
                        <span className="tw:text-[13px] tw:text-gray-600">
                          {post.user?.nickname || '알 수 없음'}
                        </span>
                      </div>
                    </div>
                    <div className="tw:flex tw:justify-between tw:px-3 tw:pb-2 tw:text-gray-500 tw:text-[13px]">
                      <div className="tw:flex tw:items-center tw:gap-1">
                        <i className="bi bi-heart-fill tw:text-red-500" /> <span>{post.likeCount ?? 0}</span>
                      </div>
                      <div className="tw:flex tw:items-center tw:gap-2">
                        <span className="tw:flex tw:items-center tw:gap-1">
                          <i className="bi bi-eye" /> {post.viewCount ?? 0}
                        </span>
                        <span>&middot;</span>
                        <span className="tw:flex tw:items-center tw:gap-1">
                          <i className="bi bi-chat-dots" /> {post.commentCount ?? 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* 검색 */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const type = form.type.value;
            const keywordVal = form.keyword.value;
            navigate(buildQuery({ type, keyword: keywordVal, page: 1 }));
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
            className="tw:bg-[#FF5E5E] tw:text-white tw:px-4 tw:py-1 tw:rounded-lg tw:hover:shadow-md tw:transition-shadow"
          >
            검색
          </button>
        </form>

        {/* 광고 배너 */}
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
              {Array.from({ length: pagination.end - pagination.start + 1 }, (_, idx) => {
                const pageNum = pagination.start + idx;
                const active = pagination.page === pageNum;
                return (
                  <li key={pageNum}>
                    <Link
                      className={`tw:px-[13px] tw:py-[6px] tw:border tw:rounded-[6px] tw:text-[14px] tw:text-inherit tw:no-underline ${active ? 'tw:bg-[#5b99f5] tw:text-white tw:border-[#5b99f5]' : ''}`}
                      to={buildQuery({ page: pageNum })}
                    >
                      {pageNum}
                    </Link>
                  </li>
                );
              })}
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
  );
};

export default List;