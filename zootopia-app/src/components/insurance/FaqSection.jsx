import React, { useState } from 'react'
import defaultBanner from '../../assets/img/insurancelogo2.png' // ← src/assets 경로

const items = [
  { q: '펫보험이란 무엇인가요?', a: '반려동물의 치료비를 보장해 주는 보험입니다.' },
  { q: '어떤 동물이 가입할 수 있나요?', a: '주로 강아지, 고양이가 해당되며 기타 동물은 약관별로 별도 확인이 필요합니다.' },
  { q: '보험금 청구는 어떻게 하나요?', a: '병원 진료 후 영수증 등 증빙서류를 제출하여 온라인/모바일로 간편 청구할 수 있습니다.' },
  { q: '기존 병력도 보장되나요?', a: '보장 제외되는 기존 병력이 있을 수 있어 가입 전 약관 확인이 필요합니다.' },
]

export default function FaqSection({ bannerSrc }) {
  const [open, setOpen] = useState(null)
  const src = bannerSrc || defaultBanner // props 없으면 기본 배너 사용

  return (
    <div className="mt-10">
      {/* FAQ 카드 */}
      <div className="max-w-3xl mx-auto mb-5">
        <div className="rounded-lg border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-rose-100 px-4 py-3 text-gray-900 font-semibold border-b border-gray-100">
            <span className="mr-2">🐾</span> 펫보험 자주 묻는 질문 (FAQ)
          </div>

        <div className="divide-y divide-gray-100">
            {items.map((it, i) => (
            <div key={i}>
                <button
                type="button"
                className="w-full text-left px-4 py-3 hover:bg-rose-50 flex items-center justify-between"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                >
                <span className="text-sm sm:text-base">Q. {it.q}</span>
                <svg
                    className={`h-4 w-4 transition-transform ${open === i ? 'rotate-180' : ''}`}
                    viewBox="0 0 20 20" fill="currentColor"
                >
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                </svg>
                </button>

                {open === i && (
                <div className="px-4 pb-4 text-sm text-gray-700 bg-white">
                    {it.a}
                </div>
                )}
            </div>
            ))}
        </div>
        </div>
      </div>

      {/* 하단 배너 1개 */}
      <div className="mt-10 flex justify-center">
        <img
          src={src}
          alt="펫보험 배너"
          className="w-[260px] sm:w-[320px] md:w-[380px] rounded-lg shadow"
        />
      </div>
    </div>
  )
}