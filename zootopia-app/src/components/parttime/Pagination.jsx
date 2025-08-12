import React from 'react'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  const handleClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
    }
  }

  return (
    <nav className="flex justify-center mt-4 w-full">
      <ul className="flex gap-1">
        {/* 이전 */}
        <li>
          <button
            className={`px-3 py-1 rounded border border-[#F27A7A] text-[#F27A7A] text-sm ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#f9d2d2] transition'}`}
            onClick={() => handleClick(currentPage - 1)}
            disabled={currentPage === 1}
          >
            이전
          </button>
        </li>
        {/* 페이지 번호 */}
        {pageNumbers.map((num) => (
          <li key={num}>
            <button
              className={`px-3 py-1 rounded border border-[#F27A7A] text-sm ${
                num === currentPage
                  ? 'bg-[#F27A7A] text-white font-bold'
                  : 'text-[#F27A7A] hover:bg-[#f9d2d2] transition'
              }`}
              onClick={() => handleClick(num)}
            >
              {num}
            </button>
          </li>
        ))}
        {/* 다음 */}
        <li>
          <button
            className={`px-3 py-1 rounded border border-[#F27A7A] text-[#F27A7A] text-sm ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#f9d2d2] transition'}`}
            onClick={() => handleClick(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default Pagination