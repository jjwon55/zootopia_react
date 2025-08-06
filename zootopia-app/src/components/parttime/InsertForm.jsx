import React from 'react'

const InsertForm = ({ form, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="max-w-xl mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">펫시터 등록</h2>

      <input name="title" value={form.title} onChange={onChange} placeholder="제목" className="w-full p-2 border rounded mb-2" required />

      <input name="location" value={form.location} onChange={onChange} placeholder="지역" className="w-full p-2 border rounded mb-2" required />

      <input name="animalType" value={form.animalType} onChange={onChange} placeholder="동물 종류" className="w-full p-2 border rounded mb-2" required />

      <input name="startDate" type="date" value={form.startDate} onChange={onChange} className="w-full p-2 border rounded mb-2" required />

      <input name="endDate" type="date" value={form.endDate} onChange={onChange} className="w-full p-2 border rounded mb-2" required />

      <input name="pay" type="number" value={form.pay} onChange={onChange} placeholder="보수" className="w-full p-2 border rounded mb-2" required />

      <textarea name="content" value={form.content} onChange={onChange} placeholder="내용" className="w-full p-2 border rounded mb-2" rows="5" required></textarea>

      <div className="text-end">
        <button type="submit" className="bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500">등록</button>
      </div>
    </form>
  )
}

export default InsertForm