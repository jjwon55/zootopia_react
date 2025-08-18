import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import defaultThumbnail from '../../assets/img/default-thumbnail.png';
import defaultProfile from '../../assets/img/default-profile.png';
import chatIcon from '../../assets/img/chat.png';
import writeIcon from '../../assets/img/write.png';
import catPpl from '../../assets/img/catppl.jpg';
import Ppl from '../../assets/img/ppl2.jpg';
// import './global.css'; // Assuming you have a CSS file for styles

const List = ({ posts, topList, pagination, keyword }) => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const sort = query.get('sort') || 'latest';

  const buildQuery = (params) => {
    const newQuery = new URLSearchParams(query);
    Object.entries(params).forEach(([key, value]) => {
      newQuery.set(key, value);
    });
    return `/posts?${newQuery.toString()}`;
  };

  return (
    <section className="tw:text-gray-800">
      <section className="tw:max-w-[900px] tw:mx-auto tw:my-8 tw:p-4 tw:bg-[#fffefb] tw:rounded-[10px] tw:border tw:border-[#eee]">
        <h2 className="tw:text-[#ff3c3c] tw:text-[18px] tw:mb-2">🔥 실시간 인기게시물</h2>
        <div className="tw:flex tw:gap-8">
          {[topList.slice(0, 5), topList.slice(5, 10)].map((list, i) => (
            <ol key={i} className="tw:space-y-2 tw:w-1/2 tw:pl-[19px] tw:text-[15px]">
              {list.map((post, index) => (
                <li key={post.postId} className="tw:flex tw:items-center tw:gap-2">
                  <span className="tw:text-red-400 tw:font-bold tw:w-6 tw:text-center">{index + 1 + i * 5}</span>
                  <span className="tw:bg-[#a06697] tw:text-white tw:text-xs tw:px-2 tw:py-0.5 tw:rounded">{post.category || '카테고리'}</span>
                  <Link className="tw:truncate tw:hover:underline tw:text-inherit tw:no-underline" to={`/posts/read/${post.postId}`}>{post.title || '제목없음'}</Link>
                </li>
              ))}
            </ol>
          ))}
        </div>
      </section>

      <div className="tw:max-w-[900px] tw:mx-auto tw:my-4 tw:text-center">
        <img src={catPpl} alt="광고배너" className="tw:w-full tw:rounded-[10px]" />
      </div>

      <section className="tw:max-w-[900px] tw:mx-auto tw:bg-white tw:p-6 tw:rounded-[10px] tw:shadow-[0_2px_5px_rgba(0,0,0,0.05)]">
        <div className="tw:flex tw:justify-between tw:items-center tw:mb-4">
          <div className="tw:flex tw:items-center tw:gap-[8px]">
            <img src={chatIcon} className="tw:w-[24px] tw:h-[24px]" alt="채팅 아이콘" />
            <h2 className="tw:text-xl tw:font-semibold">커뮤니티</h2>
          </div>
          <div className="tw:flex tw:items-center tw:gap-[10px]">
            <select
              className="tw:border tw:border-[#ccc] tw:rounded tw:px-2 tw:py-1 tw:text-sm"
              value={sort}
              onChange={(e) => window.location.href = buildQuery({ sort: e.target.value, page: 1 })}
            >
              <option value="latest">최신순</option>
              <option value="popular">인기순</option>
            </select>
            <Link to="/posts/create" className="tw:flex tw:items-center tw:gap-[6px] tw:border tw:border-[#ccc] tw:rounded-[20px] tw:px-[13px] tw:py-[6px] tw:text-[14px] tw:bg-white tw:text-inherit tw:no-underline">
              <img src={writeIcon} className="tw:w-[18px] tw:h-[18px]" alt="글쓰기 아이콘" /> 글쓰기
            </Link>
          </div>
        </div>

        {posts.map((post) => (
          <div key={post.postId} className="tw:flex tw:gap-[16px] tw:py-[16px] tw:border-t  tw:border-[#eee] tw:last:border-b">
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
                <Link to={`/posts/read/${post.postId}`} className="tw:text-[17px] tw:font-bold tw:mb-[5px] tw:block tw:hover:underline tw:text-inherit tw:no-underline">
                  {post.title || '제목없음'}
                </Link>
                <span className="tw:inline-block tw:bg-[#e0f2ff] tw:text-[#007acc] tw:px-[8px] tw:py-[3px] tw:rounded-[10px] tw:max-w-[65px] tw:h-[25px] tw:text-sm">
                  {post.category || '기타'}
                </span>
              </div>
              <div className="tw:flex tw:justify-between tw:items-center tw:gap-[6px] tw:text-[14px] tw:text-[#666] tw:mt-1">
                <span className='tw:flex tw:items-center tw:gap-[6px]'>
                  <img
                    src={post.user?.profileImg ? `http://localhost:8080${post.user.profileImg}` : defaultProfile}
                    alt="작성자 프로필"
                    className="tw:w-[24px] tw:h-[24px] tw:rounded-full tw:object-cover"
                    />
                    {post.user?.nickname || '알 수 없음'}
                </span>
                <div className="tw:text-[14px] tw:text-[#888] tw:flex tw:gap-[6px] tw:mt-[8px]">
                  <span><i className="bi bi-eye"></i> {post.viewCount}</span>
                  <span><i className="bi bi-chat-dots"></i> {post.commentCount}</span>
                  <span><i className="bi bi-heart-fill tw:text-red-500"></i> {post.likeCount}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

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

        <div className="tw:my-6">
          <img src={Ppl} alt="광고배너" className="tw:w-full tw:rounded-[10px]" />
        </div>

        {pagination && (
          <nav className="tw:mt-8">
            <ul className="tw:flex tw:justify-center tw:gap-2">
              {pagination.start > 1 && (
                <li>
                  <Link className="tw:px-[13px] tw:py-[6px] tw:border tw:rounded-[6px] tw:text-[14px] tw:text-inherit tw:no-underline" to={buildQuery({ page: pagination.start - 1 })}>
                    이전
                  </Link>
                </li>
              )}
              {Array.from({ length: pagination.end - pagination.start + 1 }, (_, idx) => {
                const pageNum = pagination.start + idx;
                return (
                  <li key={idx}>
                    <Link
                      className={`tw:px-[13px] tw:py-[6px] tw:border tw:rounded-[6px] tw:text-[14px] tw:text-inherit tw:no-underline ${pagination.page === pageNum ? 'tw:bg-[#5b99f5] tw:text-white tw:border-[#5b99f5]' : ''}`}
                      to={buildQuery({ page: pageNum })}
                    >
                      {pageNum}
                    </Link>
                  </li>
                );
              })}
              {pagination.end < pagination.last && (
                <li>
                  <Link className="tw:px-[13px] tw:py-[6px] tw:border tw:rounded-[6px] tw:text-[14px] tw:text-inherit tw:no-underline" to={buildQuery({ page: pagination.end + 1 })}>
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
