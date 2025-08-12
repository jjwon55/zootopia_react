import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import List from '../../components/showoff/ShowoffList'; 

const ListContainer = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [topList, setTopList] = useState([]);
  const [pagination, setPagination] = useState(null);

  // 쿼리 파라미터
  const page = Number(query.get('page') || 1);
  const size = Number(query.get('size') || 12);
  const sort = query.get('sort') || 'latest';           // latest | popular
  const type = query.get('type') || 'title';            // title | titleContent | tag
  const keyword = query.get('keyword') || '';

  useEffect(() => {
    let cancelled = false;
    const fetchList = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/showoff', {
          params: { page, size, sort, type, keyword }
        });

        // 백엔드 응답 호환 처리
        const data = res.data || {};
        const _posts = data.list || data.posts || [];
        const _topList = data.topList || [];
        const _pagination = data.pageInfo || data.pagination || null;

        if (!cancelled) {
          setPosts(_posts);
          setTopList(_topList);
          setPagination(_pagination);
        }
      } catch (err) {
        console.error('자랑글 목록 불러오기 실패:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchList();
    return () => { cancelled = true; };
  }, [page, size, sort, type, keyword]); // location.search 변화에 반응

  return (
    <List
      loading={loading}
      posts={posts}
      topList={topList}
      pagination={pagination}
      keyword={keyword}
    />
  );
};

export default ListContainer;
