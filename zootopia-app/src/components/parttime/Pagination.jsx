import React from 'react'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  const handleClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
    }
  }

  return (
    <nav className="tw:flex tw:justify-center tw:mt-6 tw:w-full">
      <ul className="tw:flex tw:items-center tw:gap-1">
        {/* 이전 */}
        <li>
          <button
            onClick={() => handleClick(currentPage - 1)}
            disabled={currentPage === 1}
            className={`tw:px-3 tw:py-1 tw:rounded tw:border tw:border-[#F27A7A] tw:text-[#F27A7A] tw:text-sm tw:transition-colors
              ${currentPage === 1 
                ? 'tw:opacity-50 tw:cursor-not-allowed' 
                : 'hover:tw:bg-[#f9d2d2] focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#F27A7A]/40'
              }`}
          >
            이전
          </button>
        </li>

        {/* 페이지 번호 */}
        {pageNumbers.map((num) => (
          <li key={num}>
            <button
              onClick={() => handleClick(num)}
              className={`tw:px-3 tw:py-1 tw:rounded tw:border tw:text-sm tw:font-medium tw:transition-colors
                ${num === currentPage
                  ? 'tw:bg-[#F27A7A] tw:border-[#F27A7A] tw:text-white tw:font-bold'
                  : 'tw:border-[#F27A7A] tw:text-[#F27A7A] hover:tw:bg-[#f9d2d2]'
                } focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#F27A7A]/40`}
            >
              {num}
            </button>
          </li>
        ))}

        {/* 다음 */}
        <li>
          <button
            onClick={() => handleClick(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`tw:px-3 tw:py-1 tw:rounded tw:border tw:border-[#F27A7A] tw:text-[#F27A7A] tw:text-sm tw:transition-colors
              ${currentPage === totalPages
                ? 'tw:opacity-50 tw:cursor-not-allowed'
                : 'hover:tw:bg-[#f9d2d2] focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#F27A7A]/40'
              }`}
          >
            다음
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default Pagination