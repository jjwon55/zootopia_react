// src/pages/mypage/MyPageContainer.jsx
import React, { useEffect, useState, useContext, useCallback } from 'react';
import MyPage from '../../components/mypage/MyPage';
import { LoginContext } from '../../context/LoginContextProvider';
import { getMyPage } from '../../apis/posts/mypage';  // ✅ api 모듈 사용

export default function MyPageContainer() {
  const { userInfo } = useContext(LoginContext);
  const loginUserId = userInfo?.userId ?? userInfo?.id ?? null;

  const [me, setMe] = useState(null);
  const [pets, setPets] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [myComments, setMyComments] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState('');

  const fetchData = useCallback(async () => {
    let alive = true;
    try {
      setLoading(true);
      setErrMsg('');

      // GET /api/mypage → { success, data: { user, pets, myPosts, myComments, likedPosts } }
      const res = await getMyPage();
      const payload = res.data?.data || {};

      if (!alive) return;
      setMe(payload.user || null);
      setPets(payload.pets || []);
      setMyPosts(payload.myPosts || []);
      setMyComments(payload.myComments || []);
      setLikedPosts(payload.likedPosts || []);
    } catch (err) {
      if (!alive) return;
      console.error(err);
      const status = err.response?.status;
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        (status === 401
          ? '로그인이 필요합니다. 로그인 후 다시 시도해 주세요.'
          : '마이페이지 정보를 불러오지 못했습니다.');

      setErrMsg(message);
    } finally {
      if (!alive) return;
      setLoading(false);
    }
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        await fetchData();
      } finally {
        // no-op
      }
    })();
    return () => { alive = false; };
  }, [fetchData]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status" />
        <p className="mt-3 mb-0">불러오는 중…</p>
      </div>
    );
  }

  if (errMsg) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {errMsg}
        </div>
      </div>
    );
  }

  return (
    <MyPage
      me={me}
      pets={pets}
      myPosts={myPosts}
      myComments={myComments}
      likedPosts={likedPosts}
      loginUserId={loginUserId}
    />
  );
}
