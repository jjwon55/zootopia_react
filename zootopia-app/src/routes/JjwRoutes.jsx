import React from 'react';
import { Routes, Route } from 'react-router-dom';
import List from '../pages/posts/List';
import Read from '../pages/posts/Read';
import Create from '../pages/posts/Create';
import Update from '../pages/posts/Update';
import LoginForm from '../components/Login/LoginFrom';
import Header from '../components/header/Header';
import ShowoffList from '../pages/showoff/ShowoffList';
import ShowoffRead from '../pages/showoff/ShowoffRead';
import ShowoffCreate from '../pages/showoff/ShowoffCreate';
import ShowoffUpdate from '../pages/showoff/ShowoffUpdate';
import LostList from '../pages/lost/LostList';
import LostRead from '../pages/lost/LostRead';
import LostCreate from '../pages/lost/LostCreate';

const JjwRoutes = () => {
  return (
  <>
  {/* <Header /> */}
    <Routes>
      <Route path="/posts" element={<List />} />
      <Route path="/posts/read/:postId" element={<Read />} />
      <Route path="/posts/create" element={<Create />} />
      <Route path="/posts/edit/:postId" element={<Update />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/showoff" element={<ShowoffList />} />
      <Route path="/showoff/read/:postId" element={<ShowoffRead />} />
      <Route path="/showoff/create" element={<ShowoffCreate />} />
      <Route path="/showoff/edit/:postId" element={<ShowoffUpdate />} />
      <Route path="/lost" element={<LostList />} />
      <Route path="/lost/read/:postId" element={<LostRead />} />
      <Route path="/lost/create" element={<LostCreate />} />
    </Routes>
  </>
  );
};

export default JjwRoutes;