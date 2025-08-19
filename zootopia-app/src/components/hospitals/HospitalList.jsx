import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import defaultHospitalImg from "../../assets/img/default-hospital.png";
import { LoginContext } from "../../context/LoginContextProvider";

const HospitalList = ({
  hospitalList,
  pageInfo,
  animalList,
  specialtyList,
  selectedAnimals,
  selectedSpecialties,
  onAnimalFilterChange,
  onSpecialtyFilterChange,
  onPageChange,
}) => {
  const navigate = useNavigate();
  const { roles, isLogin } = useContext(LoginContext); // Context에서 값 꺼내기
  console.log(roles); 
  // 관리자용 병원 등록 버튼 클릭 → SweetAlert 확인 팝업
  const handleCreateHospitalClick = () => {
    Swal.fire({
      icon: "question",
      title: "병원 등록",
      text: "병원 등록 페이지로 이동하시겠습니까?",
      showCancelButton: true,
      confirmButtonText: "네, 이동합니다",
      cancelButtonText: "취소",
      confirmButtonColor: "#74b9ff",
      cancelButtonColor: "#ccc"
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/service/hospitals/createhospital");
      }
    });
  };

  // 병원 카드 클릭 → 상세 페이지로 이동
  const handleCardClick = (hospitalId) => {
    navigate(`/service/hospitals/hospitaldetail/${hospitalId}`);
  };

  return (
    <div className="tw:max-w-[1140px] tw:mx-auto tw:px-[15px] tw:py-[20px]">
      {/* 상단 영역: 관리자 버튼 + 필터 */}
      <div className="tw:flex tw:flex-wrap tw:items-center tw:justify-between tw:mb-[20px]">
        {/* 필터 */}
        <div className="tw:flex tw:flex-col tw:gap-[22px] tw:justify-center md:tw:justify-start">
          <div className="tw:gap-[55px]">
          {animalList.map((animal) => (
            <label
              key={animal.animalId}
              className={`tw:px-[20px] tw:py-[8px] tw:m-1 tw:rounded-full tw:font-medium tw:cursor-pointer tw:transition-all ${
                selectedAnimals.includes(animal.animalId)
                  ? " tw:bg-[#ff6b6b] tw:text-[#ffffff] tw:-translate-y-[2px]"
                  : "tw:bg-[#faafaf9f] tw:text-white"
              }`}
            >
              <input
                type="checkbox"
                className="tw:hidden"
                value={animal.animalId}
                checked={selectedAnimals.includes(animal.animalId)}
                onChange={() => onAnimalFilterChange(animal.animalId)}
              />
              {animal.species}
            </label>
          ))}
          </div>
          <div>
          {specialtyList.map((specialty) => (
            <label
              key={specialty.specialtyId}
              className={`tw:px-[20px] tw:py-[8px] tw:m-1 tw:rounded-full tw:font-medium tw:cursor-pointer tw:transition-all ${
                selectedSpecialties.includes(specialty.specialtyId)
                  ? "tw:bg-[#ff6b6b] tw:text-[#ffffff] tw:-translate-y-[2px]"
                  : "tw:bg-[#faafaf9f] tw:text-white"
              }`}
            >
              <input
                type="checkbox"
                className="tw:hidden"
                value={specialty.specialtyId}
                checked={selectedSpecialties.includes(specialty.specialtyId)}
                onChange={() => onSpecialtyFilterChange(specialty.specialtyId)}
              />
              {specialty.category}
            </label>
          ))}
          </div>
        </div>
        
        {roles.isAdmin && isLogin && (
          <button
            onClick={handleCreateHospitalClick}
            className="tw:bg-[#74b9ff] tw:text-white tw:px-4 tw:py-2 tw:rounded hover:tw:bg-[#0984e3] tw:mb-3 md:tw:mb-0 tw:cursor-pointer tw:hover:bg-[#389bff]"
          >
            병원 등록
          </button>
        )}
      </div>

      {/* 병원 리스트 */}
      {hospitalList.length === 0 ? (
        <div className="tw:text-center tw:text-gray-500 tw:py-[40px]">
          표시할 병원이 없습니다.
        </div>
      ) : (
        <div className="tw:grid tw:grid-cols-3 lg:tw:grid-cols-2 md:tw:grid-cols-1 tw:gap-[30px]">
          {hospitalList.map((hospital) => (
            <div
              key={hospital.hospitalId}
              onClick={() => handleCardClick(hospital.hospitalId)}
              className="tw:bg-white tw:rounded-[15px] tw:overflow-hidden hover:tw:-translate-y-[5px] tw:shadow tw:hover:shadow-lg tw:transition-all tw:cursor-pointer tw:duration-100 tw:ease-out tw:hover:-translate-y-2"
            >
              {/* 이미지 */}
              <div className="tw:w-full tw:h-[200px] tw:overflow-hidden">
                <img
                  src={`${hospital.thumbnailImageUrl ? `http://localhost:8080${hospital.thumbnailImageUrl}` : defaultHospitalImg}`}
                  alt={hospital.name}
                  className="tw:w-full tw:h-full tw:object-cover tw:transition-transform hover:tw:scale-105"
                />
              </div>

              {/* 내용 */}
              <div className="tw:p-[20px]">
                <h3 className="tw:text-lg tw:font-bold tw:mb-2">{hospital.name}</h3>
                <p className="tw:text-sm tw:text-gray-600 tw:mb-3">{hospital.address}</p>
                <div className="tw:flex tw:flex-wrap tw:gap-[6px]">
                  {hospital.tags?.map((tag, idx) => (
                    <span
                      key={idx}
                      className="tw:bg-[#ffc1c1c5] tw:text-[#9c1f00c5] tw:px-[10px] tw:py-[4px] tw:rounded-[15px] tw:text-xs tw:font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      <div className="tw:flex tw:justify-center tw:mt-8">
        <nav aria-label="Pagination">
          <ul className="tw:inline-flex tw:space-x-2 tw:select-none">
            {pageInfo.pageNum > 1 && (
              <li>
                <button
                  onClick={() => onPageChange(1)}
                  className="tw:px-3 tw:py-1 tw:rounded tw:border tw:border-gray-300 tw:text-gray-600 tw:hover:bg-gray-200 tw:cursor-pointer"
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
                  className="tw:px-3 tw:py-1 tw:rounded tw:border tw:border-gray-300 tw:text-gray-600 tw:hover:bg-gray-200 tw:cursor-pointer"
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
                  className={`tw:px-3 tw:py-1 tw:rounded tw:border tw:cursor-pointer tw:border-gray-300
                    ${i === pageInfo.pageNum
                      ? 'tw:bg-[#ff6b6b] tw:text-white tw:hover:bg-[#ff3131]'
                      : 'tw:text-gray-700 tw:hover:bg-gray-200'}`}
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
                  className="tw:px-3 tw:py-1 tw:rounded tw:border tw:border-gray-300 tw:text-gray-600 tw:hover:bg-gray-200 tw:cursor-pointer"
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
                  className="tw:px-3 tw:py-1 tw:rounded tw:border tw:border-gray-300 tw:text-gray-600 tw:hover:bg-gray-200 tw:cursor-pointer"
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
