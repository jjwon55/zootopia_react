import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import defaultThumbnail from '../../assets/img/default-thumbnail.png';
import defaultProfile from '../../assets/img/default-profile.png';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import chatIcon from '../../assets/img/chat.png';
import writeIcon from '../../assets/img/write.png';
import catPpl from '../../assets/img/catppl.jpg';
import Ppl from '../../assets/img/ppl2.jpg';
import './css/List.css';

const List = ({ posts, topList, pagination, keyword, type }) => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const sort = query.get('sort') || 'latest';

  // 🔧 URL 쿼리 문자열 builder
  const buildQuery = (params) => {
    const newQuery = new URLSearchParams(query);
    Object.entries(params).forEach(([key, value]) => {
      newQuery.set(key, value);
    });
    return `/posts?${newQuery.toString()}`;
  };

  return (
    <section className="community-wrapper">
      {/* 🔥 실시간 인기게시물 */}
      <section className="hot-posts">
        <h2>🔥 실시간 인기게시물</h2>
        <div className="hot-posts-columns d-flex flex-row gap-5">
          {/* 왼쪽 5개 */}
          <ol className="list-unstyled">
            {topList.slice(0, 5).map((post, index) => (
              <li key={post.postId} className="mb-1">
                <div className="d-flex align-items-center">
                  <span className="bd-no fw-bold">{index + 1}</span>
                  <span className="bd-ca badge mx-2">{post.category || '카테고리'}</span>
                  <Link className="hot-title" to={`/posts/read/${post.postId}`}>
                    {post.title || '제목없음'}
                  </Link>
                </div>
              </li>
            ))}
          </ol>

          {/* 오른쪽 5개 */}
          <ol className="list-unstyled">
            {topList.slice(5, 10).map((post, index) => (
              <li key={post.postId} className="mb-1">
                <div className="d-flex align-items-center">
                  <span className="bd-no fw-bold">{index + 6}</span>
                  <span className="bd-ca badge mx-2">{post.category || '카테고리'}</span>
                  <Link className="hot-title" to={`/posts/read/${post.postId}`}>
                    {post.title || '제목없음'}
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div class="banner">
        <img src={catPpl} alt="광고배너" />
      </div>


      {/* 📋 게시글 목록 */}
      <section className="community-list">
        <div className="community-header d-flex justify-content-between align-items-center">
          <div className="title-with-icon">
            <img src={chatIcon} className="icon" alt="채팅 아이콘" />
            <h2 className="fs-3 mb-0">커뮤니티</h2>
          </div>
          <div className=" community-controls d-flex align-items-center gap-2">
            <select
              className="form-select w-auto me-2"
              value={sort}
              onChange={(e) => {
                window.location.href = buildQuery({ sort: e.target.value, page: 1 });
              }}
            >
              <option value="latest">최신순</option>
              <option value="popular">인기순</option>
            </select>
            <Link to="/posts/create" className="btn-write">
              <img src={writeIcon} className="icon" alt="글쓰기 아이콘" />
              글쓰기</Link>
          </div>
        </div>

        {/* 게시글 카드 */}
        {posts.map((post) => (
          <div className="post-card d-flex mb-0" key={post.postId}>
            <div className="post-thumbnail">
              <img
                src={post.thumbnailUrl ? `http://localhost:8080${post.thumbnailUrl}` : defaultThumbnail}
                alt="썸네일"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultThumbnail;
                }}
              />
            </div>

            <div className="post-info">
              <div className="d-flex align-items-center title-category">
                <Link to={`/posts/read/${post.postId}`} className="post-title">
                  {post.title || '제목없음'}
                </Link>
                <span className="category ms-2">{post.category || '기타'}</span>
              </div>
              <div className="author d-flex align-items-center">
                <img
                  src={post.user?.profileImg ? `http://localhost:8080${post.user.profileImg}` : defaultProfile}
                  className="profile-img me-2"
                  alt="작성자 프로필"
                />
                <span>{post.user?.nickname || '알 수 없음'}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-2">
                <div>
                  {(post.tagList || []).map((tag) => (
                    <span key={tag.name} className="badge bg-secondary me-1">
                      #{tag.name}
                    </span>
                  ))}
                </div>
                <div className="post-stats d-flex gap-2">
                  <span><i className="bi bi-eye"></i> {post.viewCount}</span>
                  <span><i className="bi bi-chat-dots"></i> {post.commentCount}</span>
                  <span><i className="bi bi-heart-fill text-danger"></i> {post.likeCount}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="search-bar mt-5 mb-4">
          <form onSubmit={(e) => {
            e.preventDefault();
            const form = e.target;
            const type = form.type.value;
            const keyword = form.keyword.value;
            window.location.href = buildQuery({ type, keyword, page: 1 });
          }} className="d-flex gap-2 align-items-center">
            <select name="type" className="form-select w-auto">
              <option value="title">제목</option>
              <option value="titleContent">제목+내용</option>
              <option value="tag">태그</option>
            </select>

            <input type="text" name="keyword" className="form-control search" placeholder="검색어 입력" defaultValue={keyword} />
            <button type="submit" className="btn btn-search">검색</button>
          </form>
        </div>

        <div class="banner">
          <img src={Ppl} alt="광고배너" />
        </div>

        {/* 페이지네이션 */}
        {pagination && (
          <nav className="mt-4">
            <ul className="pagination justify-content-center">
              {pagination.start > 1 && (
                <li className="page-item">
                  <Link className="page-link" to={buildQuery({ page: pagination.start - 1 })}>이전</Link>
                </li>
              )}
              {Array.from({ length: pagination.end - pagination.start + 1 }, (_, idx) => {
                const pageNum = pagination.start + idx;
                return (
                  <li
                    key={idx}
                    className={`page-item ${pagination.page === pageNum ? 'active' : ''}`}
                  >
                    <Link className="page-link" to={buildQuery({ page: pageNum })}>{pageNum}</Link>
                  </li>
                );
              })}
              {pagination.end < pagination.last && (
                <li className="page-item">
                  <Link className="page-link" to={buildQuery({ page: pagination.end + 1 })}>다음</Link>
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
