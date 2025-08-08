import React, { useRef, useState, useEffect } from 'react';
import Create from '../../components/posts/Create';
import '@toast-ui/editor/dist/toastui-editor.css';
import Tagify from '@yaireo/tagify';
import '@yaireo/tagify/dist/tagify.css';
import { create } from '../../apis/posts/posts'; 

const CreateContainer = () => {
  const editorRef = useRef();
  const tagInputRef = useRef();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('자유글');

  // ✅ Tagify 초기화
  useEffect(() => {
    if (!tagInputRef.current) return;

    const tagify = new Tagify(tagInputRef.current, {
      originalInputValueFormat: (values) => values.map(tag => tag.value).join(','),
      placeholder: '태그 입력 후 Enter 또는 쉼표로 구분',
      dropdown: {
        enabled: 1,
        maxItems: 10,
      },
    });

    return () => {
      tagify.destroy();
    };
  }, []);

  // ✅ 글 등록 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    const editorIns = editorRef.current.getInstance();
    const htmlContent = editorIns.getHTML();
    const textContent = htmlContent.replace(/<[^>]*>/g, '').trim();

    if (!title.trim()) {
      alert('제목을 1자 이상 입력해주세요.');
      return;
    }

    if (textContent.length < 5) {
      alert('본문을 5자 이상 입력해주세요.');
      return;
    }

    const formData = {
      title,
      category,
      tags: tagInputRef.current.value, // 예: "tag1,tag2"
      content: htmlContent,
    };

    try {
      await create(formData); // ✅ axios API 함수 사용
      alert('게시글이 등록되었습니다.');
      window.location.href = '/posts';
    } catch (err) {
      console.error(err);
      alert('등록 실패');
    }
  };

  // ✅ 이미지 업로드 (Toast UI Hook)
  const handleImageUpload = async (blob, callback) => {
    const formData = new FormData();
    formData.append('image', blob);

    try {
      const response = await fetch('/api/posts/upload/image', {
        method: 'POST',
        body: formData,
        credentials: 'include' // ✅ 쿠키 전송 필수 (로그인 유지용)
      });

      const result = await response.json();

      // ✅ 절대 경로 보정 (백엔드에서 /upload/filename 처럼 줄 경우)
      const imageUrl = result.imageUrl.startsWith('/')
        ? `http://localhost:8080${result.imageUrl}`
        : result.imageUrl;

      callback(imageUrl, blob.name); // ⬅️ 꼭 file name도 함께 전달!
    } catch (err) {
      alert('이미지 업로드 실패');
      console.error(err);
    }
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.getInstance().setHTML('');
    }
  }, []);

  return (
    <Create
      title={title}
      setTitle={setTitle}
      category={category}
      setCategory={setCategory}
      tagInputRef={tagInputRef}
      onSubmit={handleSubmit}
      editorRef={editorRef}
      handleImageUpload={handleImageUpload}
    />
  );
};

export default CreateContainer;