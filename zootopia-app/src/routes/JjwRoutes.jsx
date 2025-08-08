import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import List from '../pages/posts/List';
import Read from '../pages/posts/Read';
import Create from '../pages/posts/Create';
import Update from '../pages/posts/Update';
import LoginForm from '../components/Login/LoginFrom';
import ProductListp from '../pages/products/listp';
import ProductDetail from '../pages/products/detail';
import Cart from '../pages/cart/cart';
import Checkout from '../pages/cart/checkout';

const JjwRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/posts" element={<List />} />
      <Route path="/posts/list" element={<List />} />
      <Route path="/posts/read/:postId" element={<Read />} />
      <Route path="/posts/create" element={<Create />} />
      <Route path="/posts/edit/:postId" element={<Update />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/products/listp" element={<ProductListp />} />
      <Route path="/products/detail/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
    </Routes>
  );
};

export default JjwRoutes;