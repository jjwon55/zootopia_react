import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import UserInfo from '../../components/mypage/UserInfo';
import { getUserPage } from '../../apis/posts/mypage'; // ✅ GET /api/mypage/{userId}

export default function UserInfoContainer() {
  const { userId } = useParams(); // 라우트: /users/:userId (예시)
  const [user, setUser] = useState(null);
  const [pets, setPets] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setErrMsg('');
      const res = await getUserPage(userId);
      const payload = res.data?.data || {};
      setUser(payload.user || null);
      setPets(payload.pets || []);
      setMyPosts(payload.myPosts || []);
    } catch (err) {
      console.error(err);
      setErrMsg(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        '사용자 정보를 불러오지 못했습니다.'
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <div className="tw:max-w-[880px] tw:mx-auto tw:py-10 tw:text-center">
        <div className="tw:animate-spin tw:w-6 tw:h-6 tw:border-2 tw:border-zinc-400 tw:border-t-transparent tw:rounded-full tw:mx-auto" />
        <p className="tw:mt-3">불러오는 중…</p>
      </div>
    );
  }

  if (errMsg) {
    return (
      <div className="tw:max-w-[880px] tw:mx-auto tw:py-10">
        <div className="tw:bg-red-50 tw:text-red-700 tw:px-4 tw:py-3 tw:rounded-md">
          {errMsg}
        </div>
      </div>
    );
  }

  return <UserInfo user={user} pets={pets} myPosts={myPosts} />;
}
