import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Read from '../../components/posts/Read';
import { useParams, useNavigate } from 'react-router-dom';
import { toastSuccess, toastError } from '../../apis/alert';
import { read as readPost, remove as removePost } from '../../apis/posts/posts';

const ReadContainer = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loginUserId, setLoginUserId] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await readPost(postId);
        setPost({ ...data.post, liked: data.liked });
        setLoginUserId(data.loginUserId ?? null);
        setIsOwner(!!data.isOwner);
      } catch (err) {
        toastError('게시글을 불러오지 못했어요.');
        navigate('/posts');
      }
    })();
  }, [postId, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await removePost(postId);
      toastSuccess('삭제 완료');
      navigate('/posts');
    } catch (err) {
      toastError('삭제 실패');
    }
  };

  if (!post) return <div className="tw:px-4 tw:py-8">로딩 중...</div>;

  return (
    <Read
      post={post}
      isOwner={isOwner}
      loginUserId={loginUserId}
      editId={editId}
      setEditId={setEditId}
      onDelete={handleDelete}
    />
  );
};

export default ReadContainer;
