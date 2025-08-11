import React from 'react'

const Insert = ({ form, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="w-full px-4 py-10">
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
          <h2 className="text-2xl font-bold text-center mb-8">아르바이트 등록</h2>

          {/* 제목 */}
          <div className="mb-5">
            <label htmlFor="title" className="block font-semibold mb-2">제목</label>
            <input
              type="text"
              id="title"
              name="title"
              value={form.title}
              onChange={onChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
            />
          </div>

          {/* 지역 */}
          <div className="mb-5">
            <label htmlFor="location" className="block font-semibold mb-2">지역</label>
            <input
              type="text"
              id="location"
              name="location"
              value={form.location}
              onChange={onChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
            />
          </div>

          {/* 보수 */}
          <div className="mb-5">
            <label htmlFor="pay" className="block font-semibold mb-2">보수 (원)</label>
            <input
              type="number"
              id="pay"
              name="pay"
              value={form.pay}
              onChange={onChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
            />
          </div>

          {/* 근무일 */}
          <div className="mb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block font-semibold mb-2">시작일</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={form.startDate}
                onChange={onChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                required
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block font-semibold mb-2">종료일</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={form.endDate}
                onChange={onChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                required
              />
            </div>
          </div>

          {/* 동물 정보 */}
          <div className="mb-5">
            <label htmlFor="petInfo" className="block font-semibold mb-2">동물 정보</label>
            <input
              type="text"
              id="petInfo"
              name="petInfo"
              value={form.petInfo}
              onChange={onChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          {/* 메모 */}
          <div className="mb-8">
            <label htmlFor="memo" className="block font-semibold mb-2">요청 메모</label>
            <textarea
              id="memo"
              name="memo"
              rows="6"
              value={form.memo}
              onChange={onChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          {/* 버튼 */}
          <div className="flex justify-center gap-4">
            <a href="/parttime/list" className={`${styles.btn2} px-6 py-2 text-sm`}>취소</a>
            <button type="submit" className={`${styles.btn1} px-6 py-2 text-sm`}>등록</button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default Insert