import React from 'react';
import { Editor } from '@toast-ui/react-editor';
import './css/Create.css';

const Create = ({
  title,
  setTitle,
  category,
  setCategory,
  tagInputRef,
  onSubmit,
  editorRef,
  handleImageUpload,
}) => {
  return (
    <div className="container mt-4 create-wrapper">
      <form onSubmit={onSubmit}>

        {/* 📌 카테고리 선택 */}
        <div className="form-group">
          <label className="form-label d-block">카테고리</label>
          <div className="d-flex gap-3 category-buttons">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                id="cate-free"
                name="category"
                value="자유글"
                checked={category === '자유글'}
                onChange={(e) => setCategory(e.target.value)}
              />
              <label className="form-check-label" htmlFor="cate-free">
                자유게시판
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                id="cate-question"
                name="category"
                value="질문글"
                checked={category === '질문글'}
                onChange={(e) => setCategory(e.target.value)}
              />
              <label className="form-check-label" htmlFor="cate-question">
                질문있어요
              </label>
            </div>
          </div>
        </div>

        {/* 📝 제목 입력 */}
        <div className="form-group mt-3">
          <label htmlFor="title" className="form-label">글 제목</label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            placeholder="제목을 입력해 주세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* ✍️ 본문 작성 */}
        <div className="form-group mt-3">
          <label htmlFor="content" className="form-label">글 작성</label>
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
        <div className="form-group mt-3">
          <label htmlFor="tags" className="form-label">#태그</label>
          <input
            type="text"
            id="tags"
            name="tags"
            className="form-control"
            ref={tagInputRef}
            placeholder="태그를 입력하고 Enter 또는 쉼표(,)로 구분하세요"
          />
        </div>

        {/* ✅ 등록 버튼 */}
        <div className="form-group text-end mt-4">
          <button type="submit" className="btn btn-primary">
            글 등록
          </button>
        </div>
      </form>
    </div>
  );
};

export default Create;
