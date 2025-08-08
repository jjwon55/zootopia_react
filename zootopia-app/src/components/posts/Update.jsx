import React, { useEffect } from 'react';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import './css/Create.css';

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
    <div className="container mt-4 create-wrapper">
      <form onSubmit={onSubmit}>
        
        {/* 카테고리 */}
        <div className="form-group">
          <label className="form-label">카테고리</label>
          <div className="d-flex gap-3 category-buttons">
            {['자유글', '질문글'].map((cate, idx) => (
              <div className="form-check" key={idx}>
                <input
                  className="form-check-input"
                  type="radio"
                  id={`cate-${cate}`}
                  name="category"
                  value={cate}
                  checked={category === cate}
                  onChange={(e) => setCategory(e.target.value)}
                />
                <label className="form-check-label" htmlFor={`cate-${cate}`}>
                  {cate === '자유글' ? '자유게시판' : '질문있어요'}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* 제목 */}
        <div className="form-group mt-3">
          <label htmlFor="title">글 제목</label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            placeholder="제목을 입력해 주세요"
            value={title || ''}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* 본문 */}
        <div className="form-group mt-3">
          <label htmlFor="content">글 작성</label>
          <Editor
            ref={editorRef}
            height="500px"
            initialEditType="wysiwyg"
            previewStyle="vertical"
            initialValue="" // content는 useEffect에서 setHTML로 설정
            hooks={{
              addImageBlobHook: handleImageUpload,
            }}
          />
        </div>

        {/* 태그 */}
        <div className="form-group mt-3">
          <label htmlFor="tags">#태그</label>
          <input
            type="text"
            id="tags"
            name="tags"
            className="form-control"
            ref={tagInputRef}
            placeholder="태그를 입력하고 Enter 또는 쉼표(,)로 구분하세요"
          />
        </div>

        {/* 등록 버튼 */}
        <div className="form-group text-end mt-4">
          <button type="submit" className="btn btn-primary">
            수정 완료
          </button>
        </div>
      </form>
    </div>
  );
};

export default Update;
