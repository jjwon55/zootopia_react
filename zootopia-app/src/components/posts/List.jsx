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
    
    <section className="bg-gray-50 text-gray-800">
      <div className="bg-blue-500 text-white p-4 rounded">
  Tailwind 작동 테스트
</div>

      
      
      {/* 🔥 인기게시\uubb3c */}
      <section className="max-w-4xl mx-auto my-8 p-4 bg-yellow-50 rounded-lg border border-gray-200">
        <h2 className="text-red-500 text-lg mb-2 font-semibold">🔥 실시간 인기게시물</h2>
        <div className="flex gap-8">
          <ol className="space-y-2 w-1/2">
            {topList.slice(0, 5).map((post, index) => (
              <li key={post.postId} className="flex items-center gap-2">
                <span className="text-red-400 font-bold w-6 text-center">{index + 1}</span>
                <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded">{post.category || '카테고리'}</span>
                <Link className="truncate hover:underline" to={`/posts/read/${post.postId}`}>{post.title || '제목없음'}</Link>
              </li>
            ))}
          </ol>

          <ol className="space-y-2 w-1/2">
            {topList.slice(5, 10).map((post, index) => (
              <li key={post.postId} className="flex items-center gap-2">
                <span className="text-red-400 font-bold w-6 text-center">{index + 6}</span>
                <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded">{post.category || '카테고리'}</span>
                <Link className="truncate hover:underline" to={`/posts/read/${post.postId}`}>{post.title || '제목없음'}</Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="max-w-4xl mx-auto my-4">
        <img src={catPpl} alt="광고배너" className="w-full rounded-lg" />
      </div>

      <section className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <img src={chatIcon} className="w-6 h-6" alt="채팅 아이콘" />
            <h2 className="text-xl font-semibold">커뮤니티</h2>
          </div>
          <div className="flex items-center gap-2">
            <select
              className="border rounded px-2 py-1 text-sm"
              value={sort}
              onChange={(e) => window.location.href = buildQuery({ sort: e.target.value, page: 1 })}
            >
              <option value="latest">최신순</option>
              <option value="popular">인기순</option>
            </select>
            <Link to="/posts/create" className="flex items-center gap-1 border rounded-full px-3 py-1 text-sm">
              <img src={writeIcon} className="w-4 h-4" alt="글쓰기 아이콘" /> 글쓰기
            </Link>
          </div>
        </div>

        {posts.map((post) => (
          <div key={post.postId} className="flex gap-4 py-4 border-t">
            <div className="flex-shrink-0">
              <img
                src={post.thumbnailUrl ? `http://localhost:8080${post.thumbnailUrl}` : defaultThumbnail}
                alt="썸네일"
                className="w-20 h-20 rounded object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultThumbnail;
                }}
              />
            </div>
            <div className="flex flex-col justify-between flex-grow">
              <div>
                <Link to={`/posts/read/${post.postId}`} className="text-lg font-bold hover:underline block">
                  {post.title || '제목없음'}
                </Link>
                <span className="inline-block bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded mt-1">{post.category || '기타'}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <img
                  src={post.user?.profileImg ? `http://localhost:8080${post.user.profileImg}` : defaultProfile}
                  alt="작성자 프로필"
                  className="w-6 h-6 rounded-full object-cover mr-2"
                />
                <span>{post.user?.nickname || '알 수 없음'}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
                <div>
                  {(post.tagList || []).map(tag => (
                    <span key={tag.name} className="inline-block bg-gray-200 text-gray-700 text-xs rounded px-2 mr-1">#{tag.name}</span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <span><i className="bi bi-eye"></i> {post.viewCount}</span>
                  <span><i className="bi bi-chat-dots"></i> {post.commentCount}</span>
                  <span><i className="bi bi-heart-fill text-red-500"></i> {post.likeCount}</span>
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
          className="flex gap-2 mt-6"
        >
          <select name="type" className="border rounded px-2 py-1">
            <option value="title">제목</option>
            <option value="titleContent">제목+내용</option>
            <option value="tag">태그</option>
          </select>
          <input type="text" name="keyword" placeholder="검색어 입력" defaultValue={keyword} className="flex-grow border rounded px-2 py-1" />
          <button type="submit" className="bg-red-500 text-white px-4 py-1 rounded">검색</button>
        </form>

        <div className="my-6">
          <img src={Ppl} alt="광고배너" className="w-full rounded-lg" />
        </div>

        {pagination && (
          <nav className="mt-4">
            <ul className="flex justify-center gap-2">
              {pagination.start > 1 && (
                <li>
                  <Link className="px-3 py-1 border rounded" to={buildQuery({ page: pagination.start - 1 })}>이전</Link>
                </li>
              )}
              {Array.from({ length: pagination.end - pagination.start + 1 }, (_, idx) => {
                const pageNum = pagination.start + idx;
                return (
                  <li key={idx}>
                    <Link
                      className={`px-3 py-1 border rounded ${pagination.page === pageNum ? 'bg-blue-500 text-white' : ''}`}
                      to={buildQuery({ page: pageNum })}
                    >
                      {pageNum}
                    </Link>
                  </li>
                );
              })}
              {pagination.end < pagination.last && (
                <li>
                  <Link className="px-3 py-1 border rounded" to={buildQuery({ page: pagination.end + 1 })}>다음</Link>
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
