import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Update from '../../components/posts/Update';
import Tagify from '@yaireo/tagify';
import '@yaireo/tagify/dist/tagify.css';
import { read, update } from '../../apis/posts/posts';

const UpdateContainer = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef();
  const tagInputRef = useRef();
  const tagifyRef = useRef(); // ✅ Tagify 인스턴스

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('자유글');
  const [originalContent, setOriginalContent] = useState('');
  const [loading, setLoading] = useState(true); // ✅ 로딩 상태

  // ✅ 게시글 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await read(postId);
        const post = res.data.post; // ✅ 구조 수정

        console.log('✅ 받아온 post:', post);

        setTitle(post.title || '');
        setCategory(post.category || '자유글');
        setOriginalContent(post.content || '');

        if (tagInputRef.current) {
          if (tagifyRef.current) tagifyRef.current.destroy(); // ✅ 이전 인스턴스 제거

          const tagify = new Tagify(tagInputRef.current, {
            originalInputValueFormat: (values) => values.map(tag => tag.value).join(','),
          });

          tagifyRef.current = tagify;

          if (post.tags) {
            tagify.addTags(post.tags.split(',').map(tag => tag.trim()));
          }
        }
      } catch (error) {
        console.error('게시글 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();

    return () => {
      tagifyRef.current?.destroy();
    };
  }, [postId]);

  // ✅ 수정 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = editorRef.current.getInstance().getHTML();
    const plainText = content.replace(/<[^>]*>/g, '').trim();

    if (!title.trim()) {
      alert('제목을 1자 이상 입력해주세요.');
      return;
    }

    if (plainText.length < 5) {
      alert('본문을 5자 이상 입력해주세요.');
      return;
    }

    const updatedData = {
      title,
      category,
      tags: tagInputRef.current.value,
      content,
    };

    try {
      await update(postId, updatedData);
      alert('게시글이 수정되었습니다.');
      navigate(`/posts/read/${postId}`);
    } catch (error) {
      console.error('수정 실패:', error);
      alert('수정 실패');
    }
  };

  // ✅ 이미지 업로드
  const handleImageUpload = async (blob, callback) => {
    const formData = new FormData();
    formData.append('image', blob);

    try {
      const response = await fetch('/api/posts/upload/image', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const result = await response.json();
      const imageUrl = result.imageUrl.startsWith('/')
        ? `/api${result.imageUrl}`
        : result.imageUrl;

      callback(imageUrl, blob.name);
    } catch (err) {
      alert('이미지 업로드 실패');
      console.error(err);
    }
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <Update
      title={title}
      setTitle={setTitle}
      category={category}
      setCategory={setCategory}
      tagInputRef={tagInputRef}
      onSubmit={handleSubmit}
      editorRef={editorRef}
      handleImageUpload={handleImageUpload}
      originalContent={originalContent}
    />
  );
};

export default UpdateContainer;
