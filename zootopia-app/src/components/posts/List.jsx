import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import defaultThumbnail from '../../assets/img/default-thumbnail.png';
import defaultProfile from '../../assets/img/default-profile.png';
import chatIcon from '../../assets/img/chat.png';
import writeIcon from '../../assets/img/write.png';
import catPpl from '../../assets/img/catppl.jpg';
import Ppl from '../../assets/img/ppl2.jpg';

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
    <section className="tw:bg-gray-50 tw:text-gray-800">
      <div className="tw:bg-blue-500 tw:text-white tw:p-4 tw:rounded">
        Tailwind 작동 테스트
      </div>

      {/* 🔥 인기게시물 */}
      <section className="tw:max-w-4xl tw:mx-auto tw:my-8 tw:p-4 tw:bg-yellow-50 tw:rounded-lg tw:border tw:border-gray-200">
        <h2 className="tw:text-red-500 tw:text-lg tw:mb-2 tw:font-semibold">🔥 실시간 인기게시물</h2>
        <div className="tw:flex tw:gap-8">
          <ol className="tw:space-y-2 tw:w-1/2">
            {topList.slice(0, 5).map((post, index) => (
              <li key={post.postId} className="tw:flex tw:items-center tw:gap-2">
                <span className="tw:text-red-400 tw:font-bold tw:w-6 tw:text-center">{index + 1}</span>
                <span className="tw:bg-purple-500 tw:text-white tw:text-xs tw:px-2 tw:py-0.5 tw:rounded">{post.category || '카테고리'}</span>
                <Link className="tw:truncate tw:hover:underline" to={`/posts/read/${post.postId}`}>{post.title || '제목없음'}</Link>
              </li>
            ))}
          </ol>

          <ol className="tw:space-y-2 tw:w-1/2">
            {topList.slice(5, 10).map((post, index) => (
              <li key={post.postId} className="tw:flex tw:items-center tw:gap-2">
                <span className="tw:text-red-400 tw:font-bold tw:w-6 tw:text-center">{index + 6}</span>
                <span className="tw:bg-purple-500 tw:text-white tw:text-xs tw:px-2 tw:py-0.5 tw:rounded">{post.category || '카테고리'}</span>
                <Link className="tw:truncate tw:hover:underline" to={`/posts/read/${post.postId}`}>{post.title || '제목없음'}</Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="tw:max-w-4xl tw:mx-auto tw:my-4">
        <img src={catPpl} alt="광고배너" className="tw:w-full tw:rounded-lg" />
      </div>

      <section className="tw:max-w-4xl tw:mx-auto tw:bg-white tw:p-6 tw:rounded-lg tw:shadow">
        <div className="tw:flex tw:justify-between tw:items-center tw:mb-4">
          <div className="tw:flex tw:items-center tw:gap-2">
            <img src={chatIcon} className="tw:w-6 tw:h-6" alt="채팅 아이콘" />
            <h2 className="tw:text-xl tw:font-semibold">커뮤니티</h2>
          </div>
          <div className="tw:flex tw:items-center tw:gap-2">
            <select
              className="tw:border tw:rounded tw:px-2 tw:py-1 tw:text-sm"
              value={sort}
              onChange={(e) => window.location.href = buildQuery({ sort: e.target.value, page: 1 })}
            >
              <option value="latest">최신순</option>
              <option value="popular">인기순</option>
            </select>
            <Link to="/posts/create" className="tw:flex tw:items-center tw:gap-1 tw:border tw:rounded-full tw:px-3 tw:py-1 tw:text-sm">
              <img src={writeIcon} className="tw:w-4 tw:h-4" alt="글쓰기 아이콘" /> 글쓰기
            </Link>
          </div>
        </div>

        {posts.map((post) => (
          <div key={post.postId} className="tw:flex tw:gap-4 tw:py-4 tw:border-t">
            <div className="tw:flex-shrink-0">
              <img
                src={post.thumbnailUrl ? `http://localhost:8080${post.thumbnailUrl}` : defaultThumbnail}
                alt="썸네일"
                className="tw:w-20 tw:h-20 tw:rounded tw:object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultThumbnail;
                }}
              />
            </div>
            <div className="tw:flex tw:flex-col tw:justify-between tw:flex-grow">
              <div>
                <Link to={`/posts/read/${post.postId}`} className="tw:text-lg tw:font-bold tw:hover:underline tw:block">
                  {post.title || '제목없음'}
                </Link>
                <span className="tw:inline-block tw:bg-blue-100 tw:text-blue-600 tw:text-xs tw:px-2 tw:py-1 tw:rounded tw:mt-1">{post.category || '기타'}</span>
              </div>
              <div className="tw:flex tw:items-center tw:text-sm tw:text-gray-500 tw:mt-1">
                <img
                  src={post.user?.profileImg ? `http://localhost:8080${post.user.profileImg}` : defaultProfile}
                  alt="작성자 프로필"
                  className="tw:w-6 tw:h-6 tw:rounded-full tw:object-cover tw:mr-2"
                />
                <span>{post.user?.nickname || '알 수 없음'}</span>
              </div>
              <div className="tw:flex tw:justify-between tw:items-center tw:text-sm tw:text-gray-500 tw:mt-2">
                <div>
                  {(post.tagList || []).map(tag => (
                    <span key={tag.name} className="tw:inline-block tw:bg-gray-200 tw:text-gray-700 tw:text-xs tw:rounded tw:px-2 tw:mr-1">#{tag.name}</span>
                  ))}
                </div>
                <div className="tw:flex tw:gap-2">
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
          <select name="type" className="tw:border tw:rounded tw:px-2 tw:py-1">
            <option value="title">제목</option>
            <option value="titleContent">제목+내용</option>
            <option value="tag">태그</option>
          </select>
          <input type="text" name="keyword" placeholder="검색어 입력" defaultValue={keyword} className="tw:flex-grow tw:border tw:rounded tw:px-2 tw:py-1" />
          <button type="submit" className="tw:bg-red-500 tw:text-white tw:px-4 tw:py-1 tw:rounded">검색</button>
        </form>

        <div className="tw:my-6">
          <img src={Ppl} alt="광고배너" className="tw:w-full tw:rounded-lg" />
        </div>

        {pagination && (
          <nav className="tw:mt-4">
            <ul className="tw:flex tw:justify-center tw:gap-2">
              {pagination.start > 1 && (
                <li>
                  <Link className="tw:px-3 tw:py-1 tw:border tw:rounded" to={buildQuery({ page: pagination.start - 1 })}>이전</Link>
                </li>
              )}
              {Array.from({ length: pagination.end - pagination.start + 1 }, (_, idx) => {
                const pageNum = pagination.start + idx;
                return (
                  <li key={idx}>
                    <Link
                      className={`tw:px-3 tw:py-1 tw:border tw:rounded ${pagination.page === pageNum ? 'tw:bg-blue-500 tw:text-white' : ''}`}
                      to={buildQuery({ page: pageNum })}
                    >
                      {pageNum}
                    </Link>
                  </li>
                );
              })}
              {pagination.end < pagination.last && (
                <li>
                  <Link className="tw:px-3 tw:py-1 tw:border tw:rounded" to={buildQuery({ page: pagination.end + 1 })}>다음</Link>
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
