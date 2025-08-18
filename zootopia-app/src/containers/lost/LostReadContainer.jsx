import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LostRead from '../../components/lost/LostRead';
import { toastSuccess, toastError } from '../../apis/posts/alert';
import { read as readLostPost, remove as removeLostPost } from '../../apis/posts/lost';
import { LoginContext } from '../../context/LoginContextProvider';

const LostReadContainer = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loginUserId, setLoginUserId] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [editId, setEditId] = useState(null);

  // 로그인 유저 정보
  const { userInfo } = useContext(LoginContext);
  const loginNickname = userInfo?.nickname ?? null;
  const loginProfileImg = userInfo?.profileImg ?? null;

  // 다시 읽기 (댓글 변경 후 재조회 포함)
  const refetchPost = useCallback(async () => {
    try {
      const { data } = await readLostPost(postId);
      setPost(data.post);
      setLoginUserId(data.loginUserId ?? null);
      setIsOwner(!!data.isOwner);
    } catch (err) {
      toastError('유실동물 게시글을 불러오지 못했어요.');
      navigate('/lost');
    }
  }, [postId, navigate]);

  useEffect(() => { refetchPost(); }, [refetchPost]);

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
      loginNickname={loginNickname}
      loginProfileImg={loginProfileImg}
      editId={editId}
      setEditId={setEditId}
      onDelete={handleDelete}
      onCommentsChange={refetchPost} // ✅ 댓글 변경 시 재조회
    />
  );
};

export default LostReadContainer;
