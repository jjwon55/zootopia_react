import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toastSuccess, toastError } from '../../apis/alert';
import { read as readLostPost, remove as removeLostPost } from '../../apis/posts/lost'; // lost API import
import LostRead from '../../components/lost/LostRead'; // LostRead 컴포넌트

const LostReadContainer = () => {
  const { postId } = useParams(); // 라우트에서 /lost/read/:postId
  const [post, setPost] = useState(null);
  const [loginUserId, setLoginUserId] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await readLostPost(postId);
        setPost(data.post);
        setLoginUserId(data.loginUserId ?? null);
        setIsOwner(!!data.isOwner);
      } catch (err) {
        toastError('유실동물 게시글을 불러오지 못했어요.');
        navigate('/lost');
      }
    })();
  }, [postId, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await removeLostPost(postId);
      toastSuccess('삭제 완료');
      navigate('/lost');
    } catch (err) {
      toastError('삭제 실패');
    }
  };

  if (!post) return <div className="tw:px-4 tw:py-8">로딩 중...</div>;

  return (
    <LostRead
      post={post}
      isOwner={isOwner}
      loginUserId={loginUserId}
      editId={editId}
      setEditId={setEditId}
      onDelete={handleDelete}
    />
  );
};

export default LostReadContainer;
