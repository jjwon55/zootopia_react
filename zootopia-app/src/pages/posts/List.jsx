import React from 'react';
import ListContainer from '../../containers/posts/ListContainer';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js'
// import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap-icons/font/bootstrap-icons.css';

const PostsListPage = () => {
  return (
    <>
    
    <div className="posts-list-page">
      <ListContainer />
    </div>
    
    </>
  );
};

export default PostsListPage;
