import React, { useEffect, useState } from 'react';
import LostList from '../../components/lost/LostList';
import * as lostApi from '../../apis/posts/lost'; 
import { useLocation } from 'react-router-dom';

const LostListContainer = () => {
  const [pagination, setPagination] = useState({});
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState('');

  const location = useLocation();

  const updatePageInfo = () => {
    const query = new URLSearchParams(location.search);
    const newPage = parseInt(query.get('page')) || 1;
    const newSize = parseInt(query.get('size')) || 10;
    setPage(newPage);
    setSize(newSize);
  };

  const getList = async () => {
    try {
      const query = new URLSearchParams(location.search);
      const type = query.get('type');
      const keyword = query.get('keyword');

      const response = await lostApi.list({
        page,
        size,
        type,
        keyword,
      });

      const data = response.data;
      setList(data.posts || []);
      setPagination(data.pagination || {});
    } catch (error) {
      console.error('❌ 유실동물 게시글 목록 불러오기 실패:', error);
    }
  };

  useEffect(() => {
    updatePageInfo();
  }, [location.search]);

  useEffect(() => {
    getList();
  }, [page, size, location.search]);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    setPage(parseInt(query.get('page')) || 1);
    setSize(parseInt(query.get('size')) || 10);
    setType(query.get('type') || '');
    setKeyword(query.get('keyword') || '');
  }, [location.search]);

  return (
    <LostList
      posts={list}
      pagination={pagination}
      keyword={keyword}
      type={type}
    />
  );
};

export default LostListContainer;
