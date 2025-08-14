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
      className="tw:flex tw:flex-nowrap tw:items-center tw:gap-3 tw:p-4 tw:rounded tw:shadow tw:bg-[#ffecec] tw:overflow-x-auto"
    >
      {/* 지역 */}
      <div className="tw:flex tw:items-center tw:gap-1">
        <span className="tw:text-[#F27A7A]">📍</span>
        <select
          name="location"
          value={location}
          onChange={onChange}
          className="tw:border tw:rounded tw:px-2 tw:py-1 tw:text-sm tw:min-w-[120px] focus:tw:outline-[#F27A7A]"
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
      <div className="tw:flex tw:items-center tw:gap-1">
        <span>🐾</span>
        <select
          name="animalType"
          value={animalType}
          onChange={onChange}
          className="tw:border tw:rounded tw:px-2 tw:py-1 tw:text-sm tw:min-w-[120px] focus:tw:outline-[#F27A7A]"
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
      <div className="tw:flex tw:items-center tw:gap-1">
        <span className="tw:text-green-600">💰</span>
        <select
          name="payRange"
          value={payRange}
          onChange={onChange}
          className="tw:border tw:rounded tw:px-2 tw:py-1 tw:text-sm tw:min-w-[100px] focus:tw:outline-[#F27A7A]"
        >
          <option value="">보수</option>
          <option value="low">1만원 미만</option>
          <option value="mid">1~2만원 사이</option>
          <option value="high">2만원 이상</option>
        </select>
      </div>

      {/* 날짜 */}
      <div className="tw:flex tw:items-center tw:gap-1">
        <span className="tw:text-blue-600">📅</span>
        <input
          type="date"
          name="startDate"
          value={startDate}
          onChange={onChange}
          className="tw:border tw:rounded tw:px-2 tw:py-1 tw:text-sm tw:min-w-[130px]"
        />
        <span>~</span>
        <input
          type="date"
          name="endDate"
          value={endDate}
          onChange={onChange}
          className="tw:border tw:rounded tw:px-2 tw:py-1 tw:text-sm tw:min-w-[130px]"
        />
      </div>

      {/* 검색 */}
      <div className="tw:flex tw:items-center tw:gap-1">
        <input
          type="text"
          name="keyword"
          value={keyword}
          onChange={onChange}
          className="tw:border tw:rounded tw:px-2 tw:py-1 tw:text-sm tw:min-w-[160px]"
          placeholder="검색어 입력"
        />
        <button
          type="submit"
          className="tw:border tw:border-gray-400 tw:rounded tw:px-3 tw:py-1 tw:text-sm tw:bg-white hover:tw:bg-gray-100 tw:transition"
        >
          🔍
        </button>
      </div>
    </form>
  )
}

export default JobFilter