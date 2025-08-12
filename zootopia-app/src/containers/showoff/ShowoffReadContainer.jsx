import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toastSuccess, toastError } from '../../apis/alert';
import { read as readShowoff, remove as removeShowoff } from '../../apis/posts/showoff'; // showoff 전용 API 모듈
import ShowoffRead from '../../components/showoff/ShowoffRead';

const ShowoffReadContainer = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loginUserId, setLoginUserId] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await readShowoff(postId); // ✅ 공통 axios 인스턴스 사용
        setPost({ ...data.post, liked: data.liked });
        setLoginUserId(data.loginUserId ?? null);
        setIsOwner(!!data.isOwner);
      } catch (err) {
        toastError('자랑글을 불러오지 못했어요.');
        navigate('/showoff');
      }
    })();
  }, [postId, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await removeShowoff(postId); // ✅ 공통 인스턴스 사용
      toastSuccess('삭제 완료');
      navigate('/showoff');
    } catch (err) {
      toastError('삭제 실패');
    }
  };

  if (!post) return <div className="tw:px-4 tw:py-8">로딩 중...</div>;

  return (
    <ShowoffRead
      post={post}
      isOwner={isOwner}
      loginUserId={loginUserId}
      editId={editId}
      setEditId={setEditId}
      onDelete={handleDelete}
    />
  );
};

export default ShowoffReadContainer;
