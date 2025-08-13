import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toastSuccess, toastError } from '../../apis/alert';
import { read as readShowoff, remove as removeShowoff } from '../../apis/posts/showoff'; // ✅ showoff 전용 API
import ShowoffRead from '../../components/showoff/ShowoffRead';
import { LoginContext } from '../../context/LoginContextProvider'; // ✅ 로그인 컨텍스트

const ShowoffReadContainer = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loginUserId, setLoginUserId] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [editId, setEditId] = useState(null);

  // ✅ 로그인 유저 표시용 정보 (댓글 입력창 placeholder/프로필에 사용)
  const { userInfo } = useContext(LoginContext);
  const loginNickname = userInfo?.nickname ?? null;
  const loginProfileImg = userInfo?.profileImg ?? null;

  // ✅ 다시 읽기 (댓글 변경 후 재조회 포함)
  const refetch = useCallback(async () => {
    try {
      const { data } = await readShowoff(postId);
      setPost({ ...data.post, liked: data.liked });
      setLoginUserId(data.loginUserId ?? null);
      setIsOwner(!!data.isOwner);
    } catch (err) {
      toastError('자랑글을 불러오지 못했어요.');
      navigate('/showoff');
    }
  }, [postId, navigate]);

  useEffect(() => { refetch(); }, [refetch]);

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await removeShowoff(postId);
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
      // ✅ 댓글 작성에 사용할 로그인 정보 전달
      loginNickname={loginNickname}
      loginProfileImg={loginProfileImg}
      editId={editId}
      setEditId={setEditId}
      onDelete={handleDelete}
      // ✅ 댓글 생성/수정/삭제 후 재조회
      onCommentsChange={refetch}
    />
  );
};

export default ShowoffReadContainer;
