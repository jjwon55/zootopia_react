import React from 'react'

const Update = ({ form, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="flex justify-center">
      <input type="hidden" name="jobId" value={form.jobId} />

      <div className="w-full max-w-[600px] bg-white rounded shadow p-8 my-8">
        <h2 className="text-center mb-8 text-2xl font-bold text-[#F27A7A]">펫 시터 수정</h2>

        {/* 제목 */}
        <div className="mb-5 flex items-center">
          <label htmlFor="title" className="w-1/3 font-bold">제목 :</label>
          <input
            type="text"
            className="border rounded px-3 py-2 w-2/3"
            id="title"
            name="title"
            value={form.title}
            onChange={onChange}
            required
          />
        </div>

        {/* 지역 */}
        <div className="mb-5 flex items-center">
          <label htmlFor="location" className="w-1/3 font-bold">지역 :</label>
          <input
            type="text"
            className="border rounded px-3 py-2 w-2/3"
            id="location"
            name="location"
            value={form.location}
            onChange={onChange}
            required
          />
        </div>

        {/* 보수 */}
        <div className="mb-5 flex items-center">
          <label htmlFor="pay" className="w-1/3 font-bold">보수 :</label>
          <input
            type="number"
            className="border rounded px-3 py-2 w-2/3"
            id="pay"
            name="pay"
            value={form.pay}
            onChange={onChange}
            required
          />
        </div>

        {/* 근무일 */}
        <div className="mb-5 flex items-center">
          <label className="w-1/3 font-bold">근무일 :</label>
          <input
            type="date"
            className="border rounded px-3 py-2 w-1/3 mr-2"
            id="startDate"
            name="startDate"
            value={form.startDate}
            onChange={onChange}
            required
          />
          <input
            type="date"
            className="border rounded px-3 py-2 w-1/3"
            id="endDate"
            name="endDate"
            value={form.endDate}
            onChange={onChange}
            required
          />
        </div>

        {/* 동물 정보 */}
        <div className="mb-5 flex items-center">
          <label htmlFor="petInfo" className="w-1/3 font-bold">동물 정보 :</label>
          <input
            type="text"
            className="border rounded px-3 py-2 w-2/3"
            id="petInfo"
            name="petInfo"
            value={form.petInfo}
            onChange={onChange}
          />
        </div>

        {/* 요청 메모 */}
        <div className="mb-8">
          <label htmlFor="memo" className="font-bold mb-2 block">요청 메모</label>
          <textarea
            className="border rounded px-3 py-2 w-full"
            id="memo"
            name="memo"
            rows="5"
            value={form.memo}
            onChange={onChange}
          ></textarea>
        </div>

        {/* 버튼 */}
        <div className="text-center mt-4 flex justify-center gap-4">
          <a
            href={`/parttime/read/${form.jobId}`}
            className="border border-gray-400 rounded px-5 py-2 text-sm bg-white text-gray-700 hover:bg-gray-100 transition"
          >
            취소
          </a>
          <button
            type="submit"
            className="bg-[#F27A7A] text-white rounded px-5 py-2 text-sm font-semibold shadow hover:bg-[#f9d2d2] transition"
          >
            수정
          </button>
        </div>
      </div>
    </form>
  )
}

export default Update