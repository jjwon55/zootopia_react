import React, { useEffect } from 'react';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

const Update = ({
  title,
  setTitle,
  category,
  setCategory,
  tagInputRef,
  onSubmit,
  editorRef,
  handleImageUpload,
  originalContent,
}) => {
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.getInstance().setHTML(originalContent);
    }
  }, [originalContent, editorRef]);

  return (
    <div className="tw:max-w-4xl tw:mx-auto tw:mt-6 tw:px-4">
      <form onSubmit={onSubmit}>
        
        {/* 📌 카테고리 선택 */}
        <div className="tw:mb-6">
          <label className="tw:block tw:font-semibold tw:mb-2">카테고리</label>
          <div className="tw:flex tw:gap-6">
            {['자유글', '질문글'].map((cate, idx) => (
              <div className="tw:flex tw:items-center" key={idx}>
                <input
                  className="tw:mr-2"
                  type="radio"
                  id={`cate-${cate}`}
                  name="category"
                  value={cate}
                  checked={category === cate}
                  onChange={(e) => setCategory(e.target.value)}
                />
                <label htmlFor={`cate-${cate}`} className="tw:text-gray-700">
                  {cate === '자유글' ? '자유게시판' : '질문있어요'}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* 📝 제목 입력 */}
        <div className="tw:mb-6">
          <label htmlFor="title" className="tw:block tw:font-semibold tw:mb-2">글 제목</label>
          <input
            type="text"
            id="title"
            name="title"
            className="tw:w-full tw:border tw:rounded tw:px-4 tw:py-2 tw:focus:outline-none tw:focus:ring tw:focus:ring-blue-300"
            placeholder="제목을 입력해 주세요"
            value={title || ''}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* ✍️ 본문 작성 */}
        <div className="tw:mb-6">
          <label htmlFor="content" className="tw:block tw:font-semibold tw:mb-2">글 작성</label>
          <Editor
            ref={editorRef}
            height="500px"
            initialEditType="wysiwyg"
            previewStyle="vertical"
            initialValue=""
            hooks={{
              addImageBlobHook: handleImageUpload,
            }}
          />
        </div>

        {/* 🔖 태그 입력 */}
        <div className="tw:mb-6">
          <label htmlFor="tags" className="tw:block tw:font-semibold tw:mb-2">#태그</label>
          <input
            type="text"
            id="tags"
            name="tags"
            ref={tagInputRef}
            className="tw:w-full tw:border tw:rounded tw:px-4 tw:py-2 tw:focus:outline-none tw:focus:ring tw:focus:ring-blue-300"
            placeholder="태그를 입력하고 Enter 또는 쉼표(,)로 구분하세요"
          />
        </div>

        {/* ✅ 등록 버튼 */}
        <div className="tw:text-right tw:mt-6">
          <button type="submit" className="tw:bg-blue-500 tw:text-white tw:px-6 tw:py-2 tw:rounded hover:tw:bg-blue-600">
            수정 완료
          </button>
        </div>
      </form>
    </div>
  );
};

export default Update;
