import React from 'react';
import ListContainer from '../../containers/posts/ListContainer';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap-icons/font/bootstrap-icons.css';
import Header from '../../components/header/Header';

const PostsListPage = () => {
  return (
    <>
    <Header />
    <div className="posts-list-page">
      <ListContainer />
    </div>
    
    </>
  );
};

export default PostsListPage;