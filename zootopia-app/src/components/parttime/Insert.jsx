import React from 'react'
import { Link } from 'react-router-dom'

const Insert = ({ form, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
       <div className="tw:w-full tw:px-4 tw:py-12"> {/* 바디 배경 보이게 투명 */}
         <div className="tw:max-w-3xl tw:mx-auto tw:bg-white/85 tw:backdrop-blur-sm tw:border tw:border-pink-100 tw:rounded-2xl tw:shadow-lg tw:p-6 md:tw:p-10">
          <h2 className="tw:text-3xl tw:font-extrabold tw:text-center tw:text-[#F27A7A] tw:mb-12">
            🐾 아르바이트 등록
          </h2>

          {/* 제목 */}
          <div className="tw:mb-6">
            <label htmlFor="title" className="tw:block tw:font-semibold tw:mb-2">
              📌 제목
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={form.title ?? ''}
              onChange={onChange}
              placeholder="예: 강아지 산책 도와주실 분"
              className="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-3 tw:py-3 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#F27A7A]/50"
              required
            />
          </div>

          {/* 지역 */}
          <div className="tw:mb-6">
            <label htmlFor="location" className="tw:block tw:font-semibold tw:mb-2">
              📍 지역
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={form.location ?? ''}
              onChange={onChange}
              placeholder="예: 서울시 강남구"
              className="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-3 tw:py-3 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#F27A7A]/50"
              required
            />
          </div>

          {/* 보수 */}
          <div className="tw:mb-6">
            <label htmlFor="pay" className="tw:block tw:font-semibold tw:mb-2">
              💰 보수 (원)
            </label>
            <input
              type="number"
              id="pay"
              name="pay"
              value={form.pay ?? ''}
              onChange={onChange}
              min="0"
              inputMode="numeric"
              placeholder="예: 30000"
              className="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-3 tw:py-3 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#F27A7A]/50"
              required
            />
          </div>

          {/* 근무일 */}
          <div className="tw:mb-6 tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-6">
            <div>
              <label htmlFor="startDate" className="tw:block tw:font-semibold tw:mb-2">
                ⏰ 시작일
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={form.startDate ?? ''}
                onChange={onChange}
                className="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-3 tw:py-3 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#F27A7A]/50"
                required
              />
            </div>
            <div>
              <label htmlFor="endDate" className="tw:block tw:font-semibold tw:mb-2">
                ⏳ 종료일
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={form.endDate ?? ''}
                onChange={onChange}
                className="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-3 tw:py-3 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#F27A7A]/50"
                required
              />
            </div>
          </div>

          {/* 동물 정보 */}
          <div className="tw:mb-6">
            <label htmlFor="petInfo" className="tw:block tw:font-semibold tw:mb-2">
              🐶 동물 정보
            </label>
            <input
              type="text"
              id="petInfo"
              name="petInfo"
              value={form.petInfo ?? ''}
              onChange={onChange}
              placeholder="예: 소형견 2살, 활발함"
              className="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-3 tw:py-3 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#F27A7A]/50"
            />
          </div>

          {/* 메모 */}
          <div className="tw:mb-10">
            <label htmlFor="memo" className="tw:block tw:font-semibold tw:mb-2">
              📝 요청 메모
            </label>
            <textarea
              id="memo"
              name="memo"
              rows="6"
              value={form.memo ?? ''}
              onChange={onChange}
              placeholder="예: 산책 후 밥 챙겨주세요"
              className="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-3 tw:py-3 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#F27A7A]/50"
            />
          </div>

          {/* 버튼 */}
          <div className="tw:flex tw:justify-center tw:gap-4">
            <Link
              to="/parttime/list"
              className="tw:inline-flex tw:items-center tw:justify-center
                tw:h-11 tw:w-28 md:tw:w-32 tw:text-sm tw:font-medium
                tw:rounded-lg tw:border tw:border-[#F27A7A] tw:text-[#F27A7A] tw:bg-white
                hover:tw:bg-[#F27A7A]/10 active:tw:bg-[#F27A7A]/20
                focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#F27A7A]/30
                tw:transition-colors"
            >
              취소
            </Link>
            <button
              type="submit"
              className="tw:inline-flex tw:items-center tw:justify-center
                tw:h-11 tw:w-28 md:tw:w-32 tw:text-sm tw:font-semibold
                tw:rounded-lg tw:bg-[#F27A7A] tw:text-white tw:shadow-md
                hover:tw:bg-[#e86e6e] active:tw:bg-[#d86464]
                focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#F27A7A]/50
                disabled:tw:opacity-60 disabled:tw:cursor-not-allowed
                tw:transition-colors"
            >
              등록
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default Insert