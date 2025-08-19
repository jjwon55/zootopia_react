import React, { useState } from 'react'
import defaultBanner from '../../assets/img/insurancelogo2.png'

const items = [
  { q: '펫보험이란 무엇인가요?', a: '반려동물의 치료비를 보장해 주는 보험입니다.' },
  { q: '어떤 동물이 가입할 수 있나요?', a: '주로 강아지, 고양이가 해당되며 기타 동물은 약관별로 별도 확인이 필요합니다.' },
  { q: '보험금 청구는 어떻게 하나요?', a: '병원 진료 후 영수증 등 증빙서류를 제출하여 온라인/모바일로 간편 청구할 수 있습니다.' },
  { q: '기존 병력도 보장되나요?', a: '보장 제외되는 기존 병력이 있을 수 있어 가입 전 약관 확인이 필요합니다.' },
]

export default function FaqSection({ bannerSrc }) {
  const [open, setOpen] = useState(null)
  const src = bannerSrc || defaultBanner

  // 공통 사이즈/여백
  const SIZE = 'tw:w-full tw:px-5 tw:py-4 tw:text-base tw:min-h-[56px] tw:border tw:transition-colors'

  return (
    <div className="tw:mt-10">
      <div className="tw:max-w-3xl tw:mx-auto tw:mb-5">
        <div className="tw:rounded-lg tw:border tw:border-gray-200 tw:shadow-sm tw:overflow-hidden">
          <div className="tw:bg-rose-100 tw:px-4 tw:py-3 tw:text-gray-900 tw:font-semibold tw:border-b tw:border-gray-200">
            <span className="tw:mr-2">🐾</span> 펫보험 자주 묻는 질문 (FAQ)
          </div>

          <div className="tw:p-3">
            {items.map((it, i) => {
              const isOpen = open === i
              return (
                <div key={i} className="tw:mb-3 last:tw:mb-0">
                  {/* 질문 */}
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    className={`${SIZE} tw:bg-gray-100 tw:border-gray-200 tw:text-gray-900 tw:flex tw:items-center tw:justify-between
                                ${isOpen ? 'tw:rounded-t-lg tw:rounded-b-none' : 'tw:rounded-lg'} hover:tw:bg-gray-200`}
                  >
                    <span>Q. {it.q}</span>
                    <svg
                      className={`tw:h-4 tw:w-4 tw:shrink-0 tw:transition-transform ${isOpen ? 'tw:rotate-180' : ''}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* 답변 */}
                  <div
                    id={`faq-panel-${i}`}
                    hidden={!isOpen}
                    className={`${SIZE} tw:bg-white tw:border-gray-200 tw:text-gray-700 tw:border-t-0 tw:rounded-b-lg`}
                  >
                    A. {it.a}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 하단 배너 */}
      <div className="tw:mt-10 tw:flex tw:justify-center">
        <img
          src={src}
          alt="펫보험 배너"
          className="tw:w-[260px] sm:tw:w-[320px] md:tw:w-[380px] tw:rounded-lg tw:shadow"
        />
      </div>
    </div>
  )
}