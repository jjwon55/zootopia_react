import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import List from '../pages/posts/List';
import Read from '../pages/posts/Read';
import Create from '../pages/posts/Create';
import Update from '../pages/posts/Update';
import LoginForm from '../components/Login/LoginFrom';

const JjwRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/posts" element={<List />} />
      <Route path="/posts/read/:postId" element={<Read />} />
      <Route path="/posts/create" element={<Create />} />
      <Route path="/posts/edit/:postId" element={<Update />} />
      <Route path="/login" element={<LoginForm />} />
    </Routes>
  );
};

export default JjwRoutes;