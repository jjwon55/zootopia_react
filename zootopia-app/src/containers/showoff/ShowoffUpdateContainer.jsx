import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ShowoffUpdate from '../../components/showoff/ShowoffUpdate';
import Tagify from '@yaireo/tagify';
import '@yaireo/tagify/dist/tagify.css';

// ✅ 프로젝트 구조에 맞게 API 경로/이름 조정하세요.
import { read as readShowoff, update as updateShowoff } from '../../apis/posts/showoff';

const ShowoffUpdateContainer = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const editorRef = useRef();
  const tagInputRef = useRef();
  const tagifyRef = useRef(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('자랑글'); // ✅ Showoff는 카테고리 고정 노출
  const [originalContent, setOriginalContent] = useState('');
  const [loading, setLoading] = useState(true);

  // ✅ 게시글 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await readShowoff(postId);
        const post = res.data.post;

        setTitle(post?.title || '');
        setCategory(post?.category || '자랑글'); // 서버에 저장된 카테고리가 있다면 반영
        setOriginalContent(post?.content || '');

        // Tagify 초기화
        if (tagInputRef.current) {
          if (tagifyRef.current) tagifyRef.current.destroy();
          const tagify = new Tagify(tagInputRef.current, {
            originalInputValueFormat: (values) => values.map(v => v.value).join(','),
          });
          tagifyRef.current = tagify;

          if (post?.tags) {
            tagify.addTags(post.tags.split(',').map(t => t.trim()));
          }
        }
      } catch (err) {
        console.error('쇼오프 게시글 불러오기 실패:', err);
        alert('게시글을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
    return () => tagifyRef.current?.destroy();
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
      category, // 고정 표시이지만 서버에도 함께 전송
      tags: tagInputRef.current?.value || '',
      content,
    };

    try {
      await updateShowoff(postId, updatedData);
      alert('게시글이 수정되었습니다.');
      navigate(`/showoff/read/${postId}`);
    } catch (err) {
      console.error('쇼오프 수정 실패:', err);
      alert('수정 실패');
    }
  };

  // ✅ 이미지 업로드 훅 (필요 시 업로드 URL 수정)
  const handleImageUpload = async (blob, callback) => {
    const formData = new FormData();
    formData.append('image', blob);

    try {
      const response = await fetch('/api/showoff/upload/image', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const result = await response.json();
      const imageUrl = result.imageUrl?.startsWith('/')
        ? `/api${result.imageUrl}`
        : result.imageUrl;

      if (!imageUrl) throw new Error('imageUrl 누락');
      callback(imageUrl, blob.name);
    } catch (err) {
      console.error('이미지 업로드 실패:', err);
      alert('이미지 업로드 실패');
    }
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <ShowoffUpdate
      title={title}
      setTitle={setTitle}
      category={category}              // ✅ 고정 표시
      tagInputRef={tagInputRef}
      onSubmit={handleSubmit}
      editorRef={editorRef}
      handleImageUpload={handleImageUpload}
      originalContent={originalContent}
    />
  );
};

export default ShowoffUpdateContainer;
