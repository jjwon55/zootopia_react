import React, { useState } from 'react'

const CommentForm = ({ user, onSubmit }) => {
  const [content, setContent] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!content.trim()) {
      alert('댓글 내용을 입력해주세요.')
      return
    }
    onSubmit({
      writer: user?.nickname ?? '익명',
      content: content.trim(),
    })
    setContent('')
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <input type="hidden" name="writer" value={user?.nickname ?? ''} />
      <div className="mb-3">
        <label htmlFor="commentContent" className="font-semibold mb-2 block">
          자유롭게 생각을 남겨주세요
        </label>
        <textarea
          id="commentContent"
          name="content"
          className="border rounded w-full p-2"
          rows="3"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요..."
          required
        />
      </div>
      <div className="text-end">
        <button type="submit" className="bg-[#F27A7A] text-white rounded px-4 py-2 text-sm font-semibold shadow hover:bg-[#f9d2d2] transition">
          남기기
        </button>
      </div>
    </form>
  )
}

export default CommentForm