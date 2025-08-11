import React from 'react'

const JobFilter = ({
  location,
  animalType,
  payRange,
  startDate,
  endDate,
  keyword,
  onChange
}) => {
  return (
    <form
      className="flex flex-nowrap items-center gap-3 p-4 rounded shadow bg-[#ffecec] overflow-x-auto"
    >
      {/* 지역 */}
      <div className="flex items-center gap-1">
        <span className="text-[#F27A7A]">📍</span>
        <select
          name="location"
          value={location}
          onChange={onChange}
          className="border rounded px-2 py-1 text-sm min-w-[120px] focus:outline-[#F27A7A]"
        >
          <option value="">지역 선택</option>
          <option value="서울">서울</option>
          <option value="경기">경기</option>
          <option value="인천">인천</option>
          <option value="부산">부산</option>
          <option value="대전">대전</option>
          <option value="대구">대구</option>
          <option value="목포">목포</option>
        </select>
      </div>

      {/* 동물 종류 */}
      <div className="flex items-center gap-1">
        <span>🐾</span>
        <select
          name="animalType"
          value={animalType}
          onChange={onChange}
          className="border rounded px-2 py-1 text-sm min-w-[120px] focus:outline-[#F27A7A]"
        >
          <option value="">동물 종류</option>
          <option value="포유류">포유류</option>
          <option value="파충류">파충류</option>
          <option value="절지류">절지류</option>
          <option value="양서류">양서류</option>
          <option value="어류">어류</option>
          <option value="조류">조류</option>
        </select>
      </div>

      {/* 보수 */}
      <div className="flex items-center gap-1">
        <span className="text-green-600">💰</span>
        <select
          name="payRange"
          value={payRange}
          onChange={onChange}
          className="border rounded px-2 py-1 text-sm min-w-[100px] focus:outline-[#F27A7A]"
        >
          <option value="">보수</option>
          <option value="low">1만원 미만</option>
          <option value="mid">1~2만원 사이</option>
          <option value="high">2만원 이상</option>
        </select>
      </div>

      {/* 날짜 */}
      <div className="flex items-center gap-1">
        <span className="text-blue-600">📅</span>
        <input
          type="date"
          name="startDate"
          value={startDate}
          onChange={onChange}
          className="border rounded px-2 py-1 text-sm min-w-[130px]"
        />
        <span>~</span>
        <input
          type="date"
          name="endDate"
          value={endDate}
          onChange={onChange}
          className="border rounded px-2 py-1 text-sm min-w-[130px]"
        />
      </div>

      {/* 검색 */}
      <div className="flex items-center gap-1">
        <input
          type="text"
          name="keyword"
          value={keyword}
          onChange={onChange}
          className="border rounded px-2 py-1 text-sm min-w-[160px]"
          placeholder="검색어 입력"
        />
        <button
          className="border border-gray-400 rounded px-3 py-1 text-sm bg-white hover:bg-gray-100 transition"
          type="submit"
        >
          🔍
        </button>
      </div>
    </form>
  )
}

export default JobFilter