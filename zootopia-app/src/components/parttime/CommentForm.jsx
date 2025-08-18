import React, { useState } from 'react'

const CommentForm = ({ user, onSubmit }) => {
  const [content, setContent] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!content.trim()) return
    onSubmit({
      writer: user?.nickname ?? '익명',
      content: content.trim(),
    })
    setContent('')
  }

  const isEmpty = content.trim().length === 0

  return (
    <form onSubmit={handleSubmit} className="tw:mt-4">
      <input type="hidden" name="writer" value={user?.nickname ?? ''} />

      <div className="tw:mb-3">
        <label
          htmlFor="commentContent"
          className="tw:block tw:mb-2 tw:font-semibold tw:text-gray-800"
        >
          자유롭게 생각을 남겨주세요
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
            tw:w-full tw:rounded tw:border tw:border-gray-300 tw:p-3
            placeholder:tw:text-gray-400
            focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#F27A7A]/50 focus:tw:border-[#F27A7A]
            tw:transition
          "
        />
      </div>

      <div className="tw:text-right">
        <button
          type="submit"
          disabled={isEmpty}
          className={`
            tw:inline-flex tw:items-center tw:justify-center
            tw:rounded tw:px-4 tw:py-2 tw:text-sm tw:font-semibold
            tw:border tw:border-[#F27A7A]
            tw:text-white tw:bg-[#F27A7A]
            tw:shadow-sm
            hover:tw:bg-[#e86e6e]
            disabled:tw:opacity-50 disabled:tw:cursor-not-allowed
            focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#F27A7A]/40
            tw:transition
          `}
        >
          남기기
        </button>
      </div>
    </form>
  )
}

export default CommentForm