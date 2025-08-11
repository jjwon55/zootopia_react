import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {remove} from '../../apis/posts/posts'
import Read from '../../components/posts/Read';
import { useParams, useNavigate  } from 'react-router-dom';

const ReadContainer = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loginUserId, setLoginUserId] = useState(12);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/api/posts/${postId}`);
        setPost(res.data.post);
        // setLoginUserId(res.data.loginUserId); 
        console.log('📦 res.data.post.comments:', res.data.post.comments);

      } catch (error) {
        console.error('게시글 불러오기 실패', error);
        navigate('/error');
      }
    };

    fetchPost();
  }, [postId, navigate]);


  // ✅ 삭제 핸들러
  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await remove(postId);
      alert('삭제 완료');
      navigate('/posts'); // 목록으로 이동
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제 실패');
    }
  };


  if (!post) return <div>로딩 중...</div>;

  return (
    <Read
      post={post}
      loginUserId={loginUserId}
      editId={editId}
      setEditId={setEditId}
      onDelete={handleDelete} 
    />
  );
};

export default ReadContainer;
