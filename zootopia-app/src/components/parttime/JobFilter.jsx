import React from 'react'
import { MapPin, PawPrint, Calendar, Coins } from 'lucide-react'

const JobFilter = ({
  region = '',
  location = '',
  cityOptions = [],
  animalGroup = '',
  animalType = '',
  speciesOptions = [],
  payRange = '',
  startDate = '',
  endDate = '',
  keywordDraft = '',
  onFilterChange,
  onKeywordChange,
  onSearch,
  onReset,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch?.()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        tw:flex tw:flex-wrap tw:justify-center tw:items-center tw:gap-3
        tw:p-4 tw:rounded-2xl tw:shadow-sm tw:mx-auto
        tw:bg-[#FFF4F1] tw:border tw:border-[#FFD8CF] tw:max-w-5xl
      "
    >
      {/* 시/도 */}
      <div className="tw:flex tw:items-center tw:gap-2">
        <MapPin className="tw:w-4 tw:h-4 tw:text-[#FF7C6E]" aria-hidden />
        <select
          name="region"
          value={region}
          onChange={onFilterChange}
          className="
            tw:border tw:border-[#FFD8CF] tw:rounded-xl
            tw:text-sm tw:px-3 tw:py-2 tw:w-[160px] tw:bg-white
            focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#FFCABF]
          "
        >
          <option value="">시/도 선택</option>
          {['서울','경기','인천','부산','대구','광주','대전','울산','세종','강원','충북','충남','전북','전남','경북','경남','제주'].map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* 시/군/구 */}
      <div className="tw:flex tw:items-center tw:gap-2">
        <select
          name="location"
          value={location}
          onChange={onFilterChange}
          disabled={!region}
          title={!region ? '시/도를 먼저 선택하세요' : ''}
          className={`
            tw:border tw:border-[#FFD8CF] tw:rounded-xl
            tw:text-sm tw:px-3 tw:py-2 tw:w-[180px] tw:bg-white
            focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#FFCABF]
            ${!region ? 'tw:opacity-60 tw:cursor-not-allowed' : ''}
          `}
        >
          <option value="">{region ? '시/군/구 선택' : '시/도를 먼저 선택'}</option>
          {cityOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>

      {/* 동물 대분류 */}
      <div className="tw:flex tw:items-center tw:gap-2">
        <PawPrint className="tw:w-4 tw:h-4 tw:text-[#FF7C6E]" aria-hidden />
        <select
          name="animalGroup"
          value={animalGroup}
          onChange={onFilterChange}
          className="
            tw:border tw:border-[#FFD8CF] tw:rounded-xl
            tw:text-sm tw:px-3 tw:py-2 tw:w-[160px] tw:bg-white
            focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#FFCABF]
          "
        >
          <option value="">동물 분류</option>
          {['포유류','파충류','절지류','어류','양서류','조류'].map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* 동물 세부 종 */}
      <div className="tw:flex tw:items-center tw:gap-2">
        <select
          name="animalType"
          value={animalType}
          onChange={onFilterChange}
          disabled={!animalGroup}
          title={!animalGroup ? '동물 분류를 먼저 선택하세요' : ''}
          className={`
            tw:border tw:border-[#FFD8CF] tw:rounded-xl
            tw:text-sm tw:px-3 tw:py-2 tw:w-[180px] tw:bg-white
            focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#FFCABF]
            ${!animalGroup ? 'tw:opacity-60 tw:cursor-not-allowed' : ''}
          `}
        >
          <option value="">{animalGroup ? '세부 종 선택' : '분류 먼저 선택'}</option>
          {speciesOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>

      {/* 보수 */}
      <div className="tw:flex tw:items-center tw:gap-2">
        <Coins className="tw:w-4 tw:h-4 tw:text-[#FF7C6E]" aria-hidden />
        <select
          name="payRange"
          value={payRange}
          onChange={onFilterChange}
          className="
            tw:border tw:border-[#FFD8CF] tw:rounded-xl
            tw:text-sm tw:px-3 tw:py-2 tw:w-[140px] tw:bg-white
            focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#FFCABF]
          "
        >
          <option value="">보수</option>
          <option value="low">1만원 미만</option>
          <option value="mid">1~2만원 사이</option>
          <option value="high">2만원 이상</option>
        </select>
      </div>

      {/* 날짜 */}
      <div className="tw:flex tw:items-center tw:gap-2">
        <Calendar className="tw:w-4 tw:h-4 tw:text-[#FF7C6E]" aria-hidden />
        <input
          type="date"
          name="startDate"
          value={startDate || ''}
          onChange={onFilterChange}
          className="
            tw:border tw:border-[#FFD8CF] tw:rounded-xl
            tw:text-sm tw:px-3 tw:py-2 tw:w-[150px] tw:bg-white
            focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#FFCABF]
          "
        />
        <span>~</span>
        <Calendar className="tw:w-4 tw:h-4 tw:text-[#FF7C6E]" aria-hidden />
        <input
          type="date"
          name="endDate"
          value={endDate || ''}
          onChange={onFilterChange}
          className="
            tw:border tw:border-[#FFD8CF] tw:rounded-xl
            tw:text-sm tw:px-3 tw:py-2 tw:w-[150px] tw:bg-white
            focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#FFCABF]
          "
        />
      </div>

      {/* 키워드 + 버튼 */}
      <div className="tw:flex tw:items-center tw:gap-2 tw:w-full md:tw:w-auto">
        <input
          type="text"
          name="keyword"
          value={keywordDraft}
          onChange={onKeywordChange}
          placeholder="검색어 입력"
          className="
            tw:flex-1 md:tw:flex-none tw:border tw:border-[#FFD8CF]
            tw:rounded-xl tw:text-sm tw:px-3 tw:py-2 tw:min-w-[220px] tw:bg-white
            focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#FFCABF]
          "
        />
        <button
          type="submit"
          className="
            tw:border tw:border-[#F27A7A] tw:bg-[#F27A7A] tw:text-white
            tw:rounded-xl tw:px-4 tw:py-2 tw:text-sm
            hover:tw:bg-[#e86e6e] focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#FFCABF]
          "
        >
          검색
        </button>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="
              tw:border tw:border-[#F27A7A] tw:text-[#F27A7A] tw:bg-white
              tw:rounded-xl tw:px-4 tw:py-2 tw:text-sm
              hover:tw:bg-[#FFECEA] focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#FFCABF]
            "
          >
            초기화
          </button>
        )}
      </div>
    </form>
  )
}

export default JobFilter