import React from 'react';
import { Editor } from '@toast-ui/react-editor';

const LostCreate = ({
  title,
  setTitle,
  lostLocation,
  setLostLocation,
  lostTime,
  setLostTime,
  contactPhone,
  setContactPhone,
  tagInputRef,
  onSubmit,
  editorRef,
  handleImageUpload,
}) => {
  return (
    <div className="tw:min-h-screen tw:bg-[#fffdf9] tw:py-10 tw:px-4">
      <div className="tw:max-w-3xl tw:mx-auto tw:bg-white tw:rounded-2xl tw:p-6 md:tw:p-8 tw:shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
        <form onSubmit={onSubmit}>

          {/* 📝 제목 */}
          <div className="tw:mb-6">
            <label className="tw:block tw:font-semibold tw:mb-2">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력해 주세요"
              className="
                tw:w-full tw:px-4 tw:py-3
                tw:border tw:border-[#ccc] tw:rounded-lg
                tw:text-base
                focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-300
              "
            />
          </div>

          {/* 📍 잃어버린 장소 */}
          <div className="tw:mb-6">
            <label className="tw:block tw:font-semibold tw:mb-2">잃어버린 장소</label>
            <input
              type="text"
              value={lostLocation}
              onChange={(e) => setLostLocation(e.target.value)}
              placeholder="예: 서울시 강남구 OO공원"
              className="
                tw:w-full tw:px-4 tw:py-3
                tw:border tw:border-[#ccc] tw:rounded-lg
                tw:text-base
                focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-300
              "
            />
          </div>

          {/* 📅 유실 날짜 */}
          <div className="tw:mb-6">
            <label className="tw:block tw:font-semibold tw:mb-2">유실 날짜</label>
            <input
              type="date"
              value={lostTime}
              onChange={(e) => setLostTime(e.target.value)}
              className="
                tw:w-full tw:px-4 tw:py-3
                tw:border tw:border-[#ccc] tw:rounded-lg
                tw:text-base
                focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-300
              "
            />
          </div>

          {/* 📞 연락처 */}
          <div className="tw:mb-6">
            <label className="tw:block tw:font-semibold tw:mb-2">연락처</label>
            <input
              type="text"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="예: 010-1234-5678"
              className="
                tw:w-full tw:px-4 tw:py-3
                tw:border tw:border-[#ccc] tw:rounded-lg
                tw:text-base
                focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-300
              "
            />
          </div>

          {/* 🖋️ 본문 */}
          <div className="tw:mb-6">
            <label className="tw:block tw:font-semibold tw:mb-2">내용</label>
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

          {/* 🔖 태그 */}
          <div className="tw:mb-6">
            <label className="tw:block tw:font-semibold tw:mb-2">#태그</label>
            <input
              type="text"
              ref={tagInputRef}
              placeholder="예) 강아지, 말티즈, 분홍목줄, 서울 강남"
              className="
                tw:w-full tw:px-4 tw:py-3
                tw:border tw:border-[#ccc] tw:rounded-lg
                tw:text-base
                placeholder:tw:text-gray-400
                focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-300
              "
            />
          </div>

          {/* ✅ 등록 버튼 */}
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
              등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LostCreate;
