import React, { useState } from 'react'

const CommentForm = ({ user, jobId, onSubmit }) => {
  const [content, setContent] = useState('')
  const isEmpty = content.trim().length === 0

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!content.trim()) return

    onSubmit({
      writer: user?.nickname ?? '익명',
      content: content.trim(),
      jobId, // 현재 연관된 jobId 전달
    })
    setContent('')
  }

  return (
    <form onSubmit={handleSubmit} className="tw:mt-5">
      <input type="hidden" name="writer" value={user?.nickname ?? ''} />

      <div className="tw:bg-white tw:border tw:border-rose-100 tw:rounded-2xl tw:p-4 tw:shadow-sm">
        <label
          htmlFor="commentContent"
          className="tw:block tw:mb-2 tw:font-semibold tw:text-[#333] tw:flex tw:items-center tw:gap-2"
        >
          <span>💬</span> <span>자유롭게 생각을 남겨주세요</span>
        </label>

        <textarea
          id="commentContent"
          name="content"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요..."
          required
          className="
            tw:w-full tw:rounded-xl tw:border tw:border-rose-100 tw:p-3 tw:bg-white
            placeholder:tw:text-gray-400
            focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-rose-200
            tw:transition
          "
        />

        <div className="tw:flex tw:items-center tw:justify-between tw:mt-3">
          <span className="tw:text-xs tw:text-gray-400">{content.trim().length}자</span>
          <button
            type="submit"
            disabled={isEmpty}
            className={`
              tw:inline-flex tw:items-center tw:justify-center
              tw:rounded-xl tw:px-4 tw:py-2 tw:text-sm tw:font-semibold
              tw:border tw:border-[#F27A7A]
              tw:text-white tw:bg-[#F27A7A]
              tw:shadow-md hover:tw:shadow-lg
              hover:-tw-translate-y-0.5 active:tw-translate-y-0.5
              hover:tw:bg-[#e86e6e]
              disabled:tw:opacity-50 disabled:tw:cursor-not-allowed
              focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#F27A7A]/40
              tw:transition tw:duration-200
            `}
          >
            ✨ 남기기
          </button>
        </div>
      </div>
    </form>
  )
}

export default CommentForm