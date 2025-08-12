import React from 'react';

const HospitalList = ({
  hospitalList,
  pageInfo,
  animalList,
  selectedAnimals,
  onAnimalFilterChange,
  onPageChange
}) => {
  return (
    <div className="tw:px-4 tw-py-6 tw-max-w-[1200px] tw-mx-auto tw-min-h-screen">
      
      {/* 상단 필터 및 버튼 영역 */}
      <div className="tw-flex tw-justify-center tw-items-center tw-gap-6 tw-mb-5 tw-flex-wrap">
        <form className="tw-flex tw-flex-wrap tw-gap-3 tw-justify-center tw-grow">
          {animalList && animalList.map(animal => (
            <div key={animal.animalId} className="tw-flex tw-items-center tw-gap-1" >
              <input
                type="checkbox"
                id={`animal-${animal.animalId}`}
                name="animal"
                value={animal.animalId}
                checked={selectedAnimals.includes(animal.animalId)}
                className="tw-form-checkbox tw-h-5 tw-w-5 tw-cursor-pointer"
                onChange={() => onAnimalFilterChange(animal.animalId)}
              />
              <label
                htmlFor={`animal-${animal.animalId}`}
                className="tw-cursor-pointer tw-text-gray-800 tw-select-none tw-text-sm sm:tw-text-base"
              >
                {animal.species}
              </label>
            </div>
          ))}
          {/* <button type="submit" className="tw-hidden">검색</button> */}
        </form>
        {/* TODO: Admin 권한에 따른 병원 등록 버튼 표시 */}
        {/* <div sec:authorize="hasAuthority('ROLE_ADMIN')" className="tw-ml-auto">
          <a href="/service/hospitals/create" className="tw-btn tw-btn-primary tw-whitespace-nowrap">병원 등록</a>
        </div> */}
      </div>

      {/* 병원 카드 그리드 */}
      <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-6">
        {hospitalList.length === 0 ? (
          <div className="tw-col-span-full tw-text-center tw-text-gray-500 tw-py-10">
            <p>표시할 병원이 없습니다.</p>
          </div>
        ) : (
          hospitalList.map(hospital => (
            <div
              key={hospital.hospitalId}
              className="tw-cursor-pointer tw-rounded tw-shadow-md tw-border tw-border-gray-200 tw-bg-white tw-overflow-hidden tw-flex tw-flex-col"
              onClick={() => window.location.href = `/service/hospitals/detail/${hospital.hospitalId}`}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter') window.location.href = `/service/hospitals/detail/${hospital.hospitalId}`; }}
            >
              <div className="tw-h-48 tw-overflow-hidden tw-flex-shrink-0">
                <img
                  src={hospital.thumbnailImageUrl && hospital.thumbnailImageUrl !== '' ? hospital.thumbnailImageUrl : '/img/default-hospital.png'}
                  alt="병원 이미지"
                  className="tw-w-full tw-h-full tw-object-cover tw-group-tw:hover-scale-105 tw-transition-transform tw-duration-300"
                />
              </div>
              <div className="tw-p-4 tw-flex-1 tw-flex tw-flex-col">
                <h3 className="hospital-name tw-text-lg tw-font-semibold tw-text-gray-900 tw-mb-1">{hospital.name}</h3>
                <p className="hospital-location tw-text-gray-600 tw-text-sm tw-mb-3">{hospital.address}</p>
                <div className="hospital-tags tw-flex tw-flex-wrap tw-gap-2 tw-mt-auto">
                  {hospital.animals && hospital.animals.map(animal => (
                    <span
                      key={animal.animalId}
                      className="tw-bg-blue-100 tw-text-blue-800 tw-text-xs sm:tw-text-sm tw-px-2 tw-py-1 tw-rounded-full"
                    >
                      #{animal.species}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      <div className="tw-flex tw-justify-center tw-mt-8">
        <nav aria-label="Pagination">
          <ul className="tw-inline-flex tw-space-x-2 tw-select-none">
            {pageInfo.pageNum > 1 && (
              <li>
                <button
                  onClick={() => onPageChange(1)}
                  className="tw-px-3 tw-py-1 tw-rounded tw-border tw-border-gray-300 tw-text-gray-600 tw:hover-bg-gray-200"
                  aria-label="첫 페이지"
                >
                  &laquo;
                </button>
              </li>
            )}
            {pageInfo.hasPreviousPage && (
              <li>
                <button
                  onClick={() => onPageChange(pageInfo.pageNum - 1)}
                  className="tw-px-3 tw-py-1 tw-rounded tw-border tw-border-gray-300 tw-text-gray-600 tw:hover-bg-gray-200"
                  aria-label="이전 페이지"
                >
                  &lt;
                </button>
              </li>
            )}
            {Array.from({ length: pageInfo.endPage - pageInfo.startPage + 1 }, (_, i) => pageInfo.startPage + i).map(i => (
              <li key={i}>
                <button
                  onClick={() => onPageChange(i)}
                  className={`tw-px-3 tw-py-1 tw-rounded tw-border tw-border-gray-300 
                    ${i === pageInfo.pageNum 
                      ? 'tw-bg-blue-600 tw-text-white' 
                      : 'tw-text-gray-700 tw:hover-bg-gray-200'}`}
                  aria-current={i === pageInfo.pageNum ? 'page' : undefined}
                >
                  {i}
                </button>
              </li>
            ))}
            {pageInfo.hasNextPage && (
              <li>
                <button
                  onClick={() => onPageChange(pageInfo.pageNum + 1)}
                  className="tw-px-3 tw-py-1 tw-rounded tw-border tw-border-gray-300 tw-text-gray-600 tw:hover-bg-gray-200"
                  aria-label="다음 페이지"
                >
                  &gt;
                </button>
              </li>
            )}
            {pageInfo.hasLastPage && (
              <li>
                <button
                  onClick={() => onPageChange(pageInfo.pages)}
                  className="tw-px-3 tw-py-1 tw-rounded tw-border tw-border-gray-300 tw-text-gray-600 tw:hover-bg-gray-200"
                  aria-label="마지막 페이지"
                >
                  &raquo;
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default HospitalList;
