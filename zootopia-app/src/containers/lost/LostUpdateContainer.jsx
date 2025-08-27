import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '@toast-ui/editor/dist/toastui-editor.css';
import Tagify from '@yaireo/tagify';
import '@yaireo/tagify/dist/tagify.css';

import LostUpdate from '../../components/lost/LostUpdate';
import { read as readLost, update as updateLost } from '../../apis/posts/lost';

/* 날짜 문자열을 yyyy-MM-dd 로 정규화 */
function toDateInputValue(v) {
  if (!v) return '';
  // 이미 yyyy-MM-dd 형태면 그대로 사용
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return '';
  // 로컬 기준으로 잘릴 수 있어 UTC 맞춤이 필요하면 여기서 보정
  const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
  return iso;
}

const LostUpdateContainer = () => {
  const params = useParams();
  // 라우트 파라미터 이름이 다를 가능성 대비
  const itemId = params.lostId || params.postId || params.id;

  const navigate = useNavigate();

  const editorRef = useRef();
  const tagInputRef = useRef();
  const tagifyRef = useRef(); // Tagify 인스턴스

  const [title, setTitle] = useState('');
  const [lostLocation, setLostLocation] = useState('');
  const [lostTime, setLostTime] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [loading, setLoading] = useState(true);

  // 기존 글 불러오기
  useEffect(() => {
    let mounted = true;

    const fetchItem = async () => {
      try {
        const res = await readLost(itemId);
        // 백엔드 응답 키 방어적 처리
        const post =
          res?.data?.post ||
          res?.data?.lost ||
          res?.data?.data ||
          res?.data ||
          {};

        if (!mounted) return;

        setTitle(post.title || '');
        setLostLocation(post.lostLocation || post.lost_location || '');
        setLostTime(toDateInputValue(post.lostTime || post.lostDate || post.lost_date || ''));
        setContactPhone(post.contactPhone || post.contact_phone || '');
        setOriginalContent(post.content || '');

        // Tagify 초기화 & 기존 태그 주입
        if (tagInputRef.current) {
          // 기존 인스턴스 제거
          if (tagifyRef.current) tagifyRef.current.destroy();

          const tagify = new Tagify(tagInputRef.current, {
            originalInputValueFormat: (values) =>
              values.map((tag) => tag.value).join(','),
            dropdown: { enabled: 0, maxItems: 10 },
          });
          tagifyRef.current = tagify;

          const tagsCsv =
            post.tags ||
            (Array.isArray(post.tagList)
              ? post.tagList
                  .map((t) => (typeof t === 'string' ? t : (t?.name ?? t?.tag ?? '')))
                  .filter(Boolean)
                  .join(',')
              : '');

          if (tagsCsv) {
            tagify.addTags(
              tagsCsv
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean)
            );
          }
        }
      } catch (err) {
        console.error('유실동물 글 불러오기 실패:', err);
        alert('글을 불러오지 못했습니다.');
        navigate('/lost');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchItem();

    return () => {
      mounted = false;
      tagifyRef.current?.destroy();
    };
  }, [itemId, navigate]);

  // 수정 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    const html = editorRef.current.getInstance().getHTML();
    const plain = html.replace(/<[^>]*>/g, '').trim();

    if (!title.trim()) {
      alert('제목을 1자 이상 입력해주세요.');
      return;
    }
    if (plain.length < 5) {
      alert('본문을 5자 이상 입력해주세요.');
      return;
    }

    const payload = {
      title,
      lostLocation,
      lostTime,
      contactPhone,
      tags: tagInputRef.current?.value || '',
      content: html,
    };

    try {
      await updateLost(itemId, payload);
      alert('유실동물 글이 수정되었습니다.');
      navigate(`/lost/read/${itemId}`);
    } catch (err) {
      console.error('수정 실패:', err);
      alert('수정에 실패했습니다.');
    }
  };

  // 이미지 업로드 (LostCreate와 동일 패턴)
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
      const imageUrl = result.imageUrl?.startsWith('/')
        ? `http://192.168.30.3:5173${result.imageUrl}`
        : result.imageUrl;

      if (!imageUrl) throw new Error('Invalid imageUrl');
      callback(imageUrl, blob.name);
    } catch (err) {
      alert('이미지 업로드 실패');
      console.error(err);
    }
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <LostUpdate
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
      originalContent={originalContent}
    />
  );
};

export default LostUpdateContainer;
