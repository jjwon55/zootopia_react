import React, { useRef, useState, useEffect } from 'react';
import LostCreate from '../../components/lost/LostCreate';
import '@toast-ui/editor/dist/toastui-editor.css';
import Tagify from '@yaireo/tagify';
import '@yaireo/tagify/dist/tagify.css';
import { create } from '../../apis/posts/lost'; // 🆕 lost API

const LostCreateContainer = () => {
  const editorRef = useRef();
  const tagInputRef = useRef();

  const [title, setTitle] = useState('');
  const [lostLocation, setLostLocation] = useState('');
  const [lostTime, setLostTime] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // ✅ Tagify 초기화
  useEffect(() => {
    if (!tagInputRef.current) return;

    const tagify = new Tagify(tagInputRef.current, {
      originalInputValueFormat: (values) =>
        values.map((tag) => tag.value).join(','),
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

  // ✅ 등록 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    const editorIns = editorRef.current.getInstance();
    const htmlContent = editorIns.getHTML();
    const textContent = htmlContent.replace(/<[^>]*>/g, '').trim();

    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (textContent.length < 5) {
      alert('내용은 5자 이상 입력해주세요.');
      return;
    }

    const formData = {
      title,
      lostLocation,
      lostTime,
      contactPhone,
      tags: tagInputRef.current.value, // "tag1,tag2"
      content: htmlContent,
    };

    try {
      await create(formData);
      alert('유실동물 글이 등록되었습니다.');
      window.location.href = '/lost';
    } catch (err) {
      console.error(err);
      alert('등록 실패');
    }
  };

  // ✅ 이미지 업로드 Hook
  const handleImageUpload = async (blob, callback) => {
    const formData = new FormData();
    formData.append('image', blob);

    try {
      const response = await fetch('/api/lost/upload/image', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const result = await response.json();
      const imageUrl = result.imageUrl.startsWith('/')
        ? `http://192.168.30.51:5173${result.imageUrl}`
        : result.imageUrl;

      callback(imageUrl, blob.name);
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
    <LostCreate
      title={title}
      setTitle={setTitle}
      lostLocation={lostLocation}
      setLostLocation={setLostLocation}
      lostTime={lostTime}
      setLostTime={setLostTime}
      contactPhone={contactPhone}
      setContactPhone={setContactPhone}
      tagInputRef={tagInputRef}
      onSubmit={handleSubmit}
      editorRef={editorRef}
      handleImageUpload={handleImageUpload}
    />
  );
};

export default LostCreateContainer;
