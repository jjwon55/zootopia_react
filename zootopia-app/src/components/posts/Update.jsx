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
    if (editorRef?.current) {
      editorRef.current.getInstance().setHTML(originalContent || '');
    }
  }, [originalContent, editorRef]);

  return (
    <div className="tw:min-h-screen tw:bg-[#fffdf9] tw:py-10 tw:px-4">
      <div className="tw:max-w-3xl tw:mx-auto tw:bg-white tw:rounded-2xl tw:p-6 md:tw:p-8 tw:shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
        <form onSubmit={onSubmit}>
          {/* 📌 카테고리 선택 */}
          <div className="tw:mb-6">
            <label className="tw:block tw:font-semibold tw:mb-2">카테고리</label>
            <div className="tw:flex tw:gap-3 tw:flex-wrap">
              {/* 자유게시판 */}
              <div className="tw:flex tw:items-center">
                <input
                  className="tw:sr-only"
                  type="radio"
                  id="cate-free"
                  name="category"
                  value="자유글"
                  checked={category === '자유글'}
                  onChange={(e) => setCategory(e.target.value)}
                />
                <label
                  htmlFor="cate-free"
                  className={`tw:select-none tw:cursor-pointer tw:text-sm tw:px-4 tw:py-2 tw:rounded-full tw:inline-flex tw:items-center tw:justify-center
                    ${category === '자유글' ? 'tw:bg-[#fef0bd] tw:font-bold' : 'tw:bg-[#eee]'}
                  `}
                >
                  자유게시판
                </label>
              </div>

              {/* 질문있어요 */}
              <div className="tw:flex tw:items-center">
                <input
                  className="tw:sr-only"
                  type="radio"
                  id="cate-question"
                  name="category"
                  value="질문글"
                  checked={category === '질문글'}
                  onChange={(e) => setCategory(e.target.value)}
                />
                <label
                  htmlFor="cate-question"
                  className={`tw:select-none tw:cursor-pointer tw:text-sm tw:px-4 tw:py-2 tw:rounded-full tw:inline-flex tw:items-center tw:justify-center
                    ${category === '질문글' ? 'tw:bg-[#fef0bd] tw:font-bold' : 'tw:bg-[#eee]'}
                  `}
                >
                  질문있어요
                </label>
              </div>
            </div>
          </div>

          {/* 📝 제목 입력 */}
          <div className="tw:mb-6">
            <label htmlFor="title" className="tw:block tw:font-semibold tw:mb-2">글 제목</label>
            <input
              type="text"
              id="title"
              name="title"
              className="
                tw:w-full tw:px-4 tw:py-3
                tw:border tw:border-[#ccc] tw:rounded-lg
                tw:text-base
                focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-300
              "
              placeholder="제목을 입력해 주세요"
              value={title || ''}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* ✍️ 본문 작성 */}
          <div className="tw:mb-6">
            <label className="tw:block tw:font-semibold tw:mb-2">글 작성</label>
            <div className="tw:border tw:border-[#ccc] tw:rounded-lg tw:overflow-hidden">
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
          </div>

          {/* 🔖 태그 입력 */}
          <div className="tw:mb-6">
            <label htmlFor="tags" className="tw:block tw:font-semibold tw:mb-2">#태그</label>
            <input
              type="text"
              id="tags"
              name="tags"
              ref={tagInputRef}
              placeholder="태그를 입력하고 Enter 또는 쉼표(,)로 구분하세요"
              className="
                tw:w-full tw:px-4 tw:py-3
                tw:border tw:border-[#ccc] tw:rounded-lg
                tw:text-base
                placeholder:tw:text-gray-400
                focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-300
              "
            />
          </div>

          {/* ✅ 수정 버튼 */}
          <div className="tw:text-right tw:mt-6">
            <button
              type="submit"
              className="
                tw:inline-flex tw:items-center tw:justify-center
                tw:bg-[#fef0bd] tw:hover:bg-[#fbdc3b]
                tw:text-black tw:font-bold
                tw:px-6 tw:py-2.5 tw:rounded-lg
                tw:transition-colors
              "
            >
              수정 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Update;
