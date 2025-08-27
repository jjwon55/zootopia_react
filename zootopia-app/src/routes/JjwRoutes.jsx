import React from 'react';
import { Routes, Route } from 'react-router-dom';
import List from '../pages/posts/List';
import Read from '../pages/posts/Read';
import Create from '../pages/posts/Create';
import Update from '../pages/posts/Update';
import LoginForm from '../components/Login/LoginForm';
import ShowoffList from '../pages/showoff/ShowoffList';
import ShowoffRead from '../pages/showoff/ShowoffRead';
import ShowoffCreate from '../pages/showoff/ShowoffCreate';
import ShowoffUpdate from '../pages/showoff/ShowoffUpdate';
import LostList from '../pages/lost/LostList';
import LostRead from '../pages/lost/LostRead';
import LostCreate from '../pages/lost/LostCreate';
import MyPage from '../pages/mypage/MyPage';
import MyPageEdit from '../pages/mypage/MyPageEdit';
import UserInfo from '../pages/mypage/UserInfo';
import Map from '../pages/map/Map';
import UsersPage from '../pages/admin/users/UsersPage';
import Join from '../components/join/Join';
import AdminPostContainer from '../containers/admin/AdminPostContainer'; // ✅ 누락 보완

import RequireAdmin from '../pages/Required/RequiredAdmin';
import RequireAuth from '../pages/Required/RequiredAuth';
import LostUpdate from '../pages/lost/LostUpdate';

const JjwRoutes = () => {
  return (
    <>
      <Routes>
        {/* ✅ 인증/가입 페이지 (가드 리다이렉트 대비 필수) */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/join" element={<Join />} />

        {/* posts */}
        <Route path="/posts" element={<List />} />
        <Route path="/posts/read/:postId" element={<Read />} />
        <Route
          path="/posts/create"
          element={
            <RequireAuth><Create /></RequireAuth>
          }
        />
        <Route
          path="/posts/edit/:postId"
          element={
            <RequireAuth><Update /></RequireAuth>
          }
        />

        {/* showoff */}
        <Route path="/showoff" element={<ShowoffList />} />
        <Route path="/showoff/read/:postId" element={<ShowoffRead />} />
        <Route
          path="/showoff/create"
          element={
            <RequireAuth><ShowoffCreate /></RequireAuth>
          }
        />
        <Route
          path="/lost/edit/:postId"
          element={
            <RequireAuth><LostUpdate /></RequireAuth>
          }
        />
        <Route
          path="/lost/edit/:postId"
          element={
            <RequireAuth><Update /></RequireAuth>
          }
        />

        {/* lost */}
        <Route path="/lost" element={<LostList />} />
        <Route path="/lost/read/:postId" element={<LostRead />} />
        <Route
          path="/lost/create"
          element={
            <RequireAuth><LostCreate /></RequireAuth>
          }
        />

        {/* mypage (로그인 필요) */}
        <Route
          path="/mypage"
          element={
            <RequireAuth><MyPage /></RequireAuth>
          }
        />
        <Route
          path="/mypage/edit"
          element={
            <RequireAuth><MyPageEdit /></RequireAuth>
          }
        />
        {/* 공개 프로필 */}
        <Route path="/mypage/:userId" element={<UserInfo />} />

        {/* 기타 페이지 */}
        <Route path="/map" element={<Map />} />

        {/* admin (관리자 전용) */}
        <Route
          path="/admin/users"
          element={
            <RequireAdmin><UsersPage /></RequireAdmin>
          }
        />
        <Route
          path="/admin/post"
          element={
            <RequireAdmin><AdminPostContainer /></RequireAdmin>
          }
        />

        {/* (선택) 403 페이지 라우트가 있다면 여기에 추가 */}
        {/* <Route path="/403" element={<Forbidden />} /> */}
      </Routes>
    </>
  );
};

export default JjwRoutes;
