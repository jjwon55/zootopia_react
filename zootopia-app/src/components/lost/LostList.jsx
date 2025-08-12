import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import defaultThumbnail from '../../assets/img/default-thumbnail.png';
import defaultProfile from '../../assets/img/default-profile.png';
import writeIcon from '../../assets/img/write.png';

const LostList = ({ posts, pagination, keyword, type }) => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const sort = query.get('sort') || 'latest';

  const buildQuery = (params) => {
    const newQuery = new URLSearchParams(query);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        newQuery.set(key, value);
      }
    });
    return `/lost?${newQuery.toString()}`;
  };

  return (
    <section className="tw:max-w-[900px] tw:mx-auto tw:my-8">
      {/* 상단 헤더 */}
      <div className="tw:flex tw:justify-between tw:items-center tw:mb-4">
        <h2 className="tw:text-xl tw:font-semibold">유실동물 게시판</h2>
        <Link
          to="/lost/create"
          className="tw:flex tw:items-center tw:gap-[6px] tw:border tw:rounded-[20px] tw:px-[13px] tw:py-[6px] tw:text-[14px] tw:bg-white tw:text-inherit tw:no-underline"
        >
          <img src={writeIcon} className="tw:w-[18px] tw:h-[18px]" alt="글쓰기" /> 글쓰기
        </Link>
      </div>

      {/* 게시글 목록 */}
      {posts.length > 0 ? (
        posts.map((post) => (
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
                  e.target.onerror = null;
                  e.target.src = defaultThumbnail;
                }}
              />
            </div>
            <div className="tw:flex tw:flex-col tw:justify-between tw:flex-grow">
              <div>
                <Link
                  to={`/lost/read/${post.postId}`}
                  className="tw:text-[17px] tw:font-bold tw:mb-[5px] tw:block tw:hover:underline tw:text-inherit tw:no-underline"
                >
                  {post.title || '제목없음'}
                </Link>
                {post.tagList && post.tagList.length > 0 && (
                  <div className="tw:mt-[4px]">
                    {post.tagList.map((tag) => (
                      <span
                        key={tag.tagId || tag.name}
                        className="tw:inline-block tw:bg-[#f3f3f3] tw:text-[#555] tw:px-[6px] tw:py-[2px] tw:rounded tw:text-xs tw:mr-[4px]"
                      >
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="tw:flex tw:justify-between tw:items-center tw:gap-[6px] tw:text-[14px] tw:text-[#666] tw:mt-1">
                <span className="tw:flex tw:items-center tw:gap-[6px]">
                  <img
                    src={post.user?.profileImg ? `http://localhost:8080${post.user.profileImg}` : defaultProfile}
                    alt="작성자 프로필"
                    className="tw:w-[24px] tw:h-[24px] tw:rounded-full tw:object-cover"
                  />
                  {post.user?.nickname || '알 수 없음'}
                </span>
                <div className="tw:text-[14px] tw:text-[#888] tw:flex tw:gap-[6px]">
                  <span><i className="bi bi-eye"></i> {post.viewCount || 0}</span>
                  <span><i className="bi bi-chat-dots"></i> {post.commentCount || 0}</span>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="tw:text-center tw:py-10">등록된 게시글이 없습니다.</p>
      )}

      {/* 검색 */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.target;
          const type = form.type.value;
          const keyword = form.keyword.value;
          window.location.href = buildQuery({ type, keyword, page: 1 });
        }}
        className="tw:flex tw:gap-2 tw:mt-6"
      >
        <select
          name="type"
          className="tw:border tw:border-[#dee2e6] tw:rounded tw:px-2 tw:py-1 tw:w-[140px]"
          defaultValue={type || 'title'}
        >
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
              return (
                <li key={idx}>
                  <Link
                    className={`tw:px-[13px] tw:py-[6px] tw:border tw:rounded-[6px] tw:text-[14px] tw:text-inherit tw:no-underline ${
                      pagination.page === pageNum
                        ? 'tw:bg-[#5b99f5] tw:text-white tw:border-[#5b99f5]'
                        : ''
                    }`}
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
  );
};

export default LostList;
