import React from 'react'
import { Link, useParams } from 'react-router-dom'

const Update = ({ form, onChange, onSubmit }) => {
  const { jobId: paramJobId } = useParams()
  const id = form?.jobId ?? form?.id ?? form?.job_id ?? paramJobId

  return (
    <form onSubmit={onSubmit}>
      <input type="hidden" name="jobId" value={form?.jobId ?? ''} />

      <div className="tw:w-full tw:px-4 tw:py-10">
        <div className="tw:max-w-3xl tw:mx-auto tw:bg-white tw:rounded-lg tw:shadow-md tw:p-6 md:tw:p-8">
          <h2 className="tw:text-2xl tw:font-bold tw:text-center tw:mb-10">아르바이트 수정</h2>

          {/* 제목 */}
          <div className="tw:mb-5 tw:mt-5">
            <label htmlFor="title" className="tw:block tw:font-semibold tw:mb-2">제목</label>
            <input
              type="text"
              id="title"
              name="title"
              value={form?.title ?? ''}
              onChange={onChange}
              className="tw:w-full tw:border tw:border-gray-300 tw:rounded tw:px-3 tw:py-2 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-rose-300"
              required
            />
          </div>

          {/* 지역 */}
          <div className="tw:mb-5">
            <label htmlFor="location" className="tw:block tw:font-semibold tw:mb-2">지역</label>
            <input
              type="text"
              id="location"
              name="location"
              value={form?.location ?? ''}
              onChange={onChange}
              className="tw:w-full tw:border tw:border-gray-300 tw:rounded tw:px-3 tw:py-2 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-rose-300"
              required
            />
          </div>

          {/* 보수 */}
          <div className="tw:mb-5">
            <label htmlFor="pay" className="tw:block tw:font-semibold tw:mb-2">보수 (원)</label>
            <input
              type="number"
              id="pay"
              name="pay"
              value={form?.pay ?? ''}
              onChange={onChange}
              min="0"
              inputMode="numeric"
              className="tw:w-full tw:border tw:border-gray-300 tw:rounded tw:px-3 tw:py-2 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-rose-300"
              required
            />
          </div>

          {/* 근무일 */}
          <div className="tw:mb-5 tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-4">
            <div>
              <label htmlFor="startDate" className="tw:block tw:font-semibold tw:mb-2">시작일</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={form?.startDate ?? ''}
                onChange={onChange}
                className="tw:w-full tw:border tw:border-gray-300 tw:rounded tw:px-3 tw:py-2 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-rose-300"
                required
              />
            </div>
            <div>
              <label htmlFor="endDate" className="tw:block tw:font-semibold tw:mb-2">종료일</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={form?.endDate ?? ''}
                onChange={onChange}
                className="tw:w-full tw:border tw:border-gray-300 tw:rounded tw:px-3 tw:py-2 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-rose-300"
                required
              />
            </div>
          </div>

          {/* 동물 정보 */}
          <div className="tw:mb-5">
            <label htmlFor="petInfo" className="tw:block tw:font-semibold tw:mb-2">동물 정보</label>
            <input
              type="text"
              id="petInfo"
              name="petInfo"
              value={form?.petInfo ?? ''}
              onChange={onChange}
              className="tw:w-full tw:border tw:border-gray-300 tw:rounded tw:px-3 tw:py-2 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-rose-300"
            />
          </div>

          {/* 메모 */}
          <div className="tw:mb-8">
            <label htmlFor="memo" className="tw:block tw:font-semibold tw:mb-2">요청 메모</label>
            <textarea
              id="memo"
              name="memo"
              rows="6"
              value={form?.memo ?? ''}
              onChange={onChange}
              className="tw:w-full tw:border tw:border-gray-300 tw:rounded tw:px-3 tw:py-2 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-rose-300"
            />
          </div>

          {/* 버튼 */}
          <div className="tw:flex tw:justify-center tw:gap-3">
            <Link
              to={id ? `/parttime/read/${encodeURIComponent(String(id))}` : '/parttime/list'}
              className="
                tw:inline-flex tw:items-center tw:justify-center
                tw:h-10 tw:w-24 md:tw:w-28 tw:text-sm tw:font-medium
                tw:rounded tw:border tw:border-[#F27A7A] tw:text-[#F27A7A] tw:bg-white
                hover:tw:bg-[#F27A7A]/10 active:tw:bg-[#F27A7A]/20
                focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#F27A7A]/30
                tw:transition-colors
              "
            >
              취소
            </Link>

            <button
              type="submit"
              className="
                tw:inline-flex tw:items-center tw:justify-center
                tw:h-10 tw:w-24 md:tw:w-28 tw:text-sm tw:font-medium
                tw:border tw:rounded tw:bg-[#F27A7A] tw:text-white tw:shadow-sm
                hover:tw:bg-[#e86e6e] active:tw:bg-[#d86464]
                focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#F27A7A]/40
                disabled:tw:opacity-60 disabled:tw:cursor-not-allowed
                tw:transition-colors
              "
            >
              수정
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default Update