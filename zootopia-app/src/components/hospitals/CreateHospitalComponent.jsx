import React, { useRef, useState } from "react";
import defaultHospitalImg from "../../assets/img/default-hospital.png";

const dummySpecialtyList = [
  { specialtyId: 1, category: "내과" },
  { specialtyId: 2, category: "외과" },
  { specialtyId: 3, category: "치과" },
];
const dummyAnimalList = [
  { animalId: 101, species: "강아지" },
  { animalId: 102, species: "고양이" },
  { animalId: 103, species: "토끼" },
];

const IS_ADMIN = true;

const HospitalForm = () => {
  const [hospitalForm, setHospitalForm] = useState({
    hospitalId: null,
    name: "",
    address: "",
    homepage: "",
    phone: "",
    email: "",
    hospIntroduce: "",
    specialtyIds: [],
    animalIds: [],
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("/img/default-thumbnail.png");
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHospitalForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSpecialtyChange = (specId) => {
    setHospitalForm((prev) => {
      const list = prev.specialtyIds.includes(specId)
        ? prev.specialtyIds.filter((id) => id !== specId)
        : [...prev.specialtyIds, specId];
      return { ...prev, specialtyIds: list };
    });
  };

  const handleAnimalChange = (animalId) => {
    setHospitalForm((prev) => {
      const list = prev.animalIds.includes(animalId)
        ? prev.animalIds.filter((id) => id !== animalId)
        : [...prev.animalIds, animalId];
      return { ...prev, animalIds: list };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {
      ...hospitalForm,
      thumbnailImageFile: thumbnailFile ? thumbnailFile.name : null,
    };
    alert(JSON.stringify(dataToSend, null, 2));
  };

  const handleDelete = () => {
    if (window.confirm("정말로 이 병원을 삭제하시겠습니까?")) {
      alert("병원 삭제 처리(실제 환경에서는 서버로 요청 필요)");
    }
  };

  return (
    <div
      className="tw:min-h-screen tw:flex tw:flex-col tw:items-center tw:bg-cover tw:bg-center tw:relative tw:px-4 sm:tw:px-6 lg:tw:px-8">
      <div className="tw:absolute tw:inset-0 tw:bg-[rgba(255,213,204,0)] tw:-z-10"></div>

      {/* 상단 로고 */}
      <div className="tw:mt-6 tw:mb-4 tw:w-full tw:max-w-2xl ">
        <div className="tw:flex tw:justify-center tw:items-center tw:w-full tw:h-20 sm:tw:h-28 md:tw:h-32 tw:rounded-md tw:overflow-hidden tw:shadow-lg tw:bg-[rgba(89,197,125,0.42)]">
          <img
            src={defaultHospitalImg}
            alt="병원 아이콘"
            className="tw:w-[130px] tw:h-[100px] tw:object-fit"
          />
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="tw:flex tw:flex-col lg:tw:flex-row tw:items-center tw:w-full tw:max-w-3xl tw:gap-5">
        {/* 이미지 업로드 */}
        <form
          id="imageForm"
          encType="multipart/form-data"
          className="tw:bg-gray-50 tw:p-4 sm:tw:p-6 tw:rounded-xl tw:shadow tw:w-full sm:tw:w-[150px] tw:lg:w-[400px] tw:flex-shrink-0"
          onSubmit={(e) => e.preventDefault()}
        >
          <div
            className="tw:rounded tw:overflow-hidden tw:cursor-pointer tw:border tw:border-gray-200"
            onClick={handleImageClick}
          >
            <img
              id="preview"
              src={previewUrl}
              alt="미리보기"
              className="lg:tw:w-64 tw:h-40 sm:tw:h-48 tw:object-cover"
            />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            name="thumbnailImageFile"
            accept="image/*"
            className="tw:hidden"
            onChange={handleImageChange}
          />
        </form>

        {/* 병원 기본 정보 */}
        <form
          id="generalDataForm"
          onSubmit={handleSubmit}
          className="tw:flex-1 tw:bg-[#ffa1a1] tw:p-4 sm:tw:p-6 tw:rounded-xl tw:shadow tw:w-full"
        >
          <div className="tw:flex tw:flex-col tw:gap-4">
            {[
              { id: "name", label: "병원 이름", type: "text", placeholder: "병원 이름을 작성하세요", required: true },
              { id: "address", label: "병원 주소", type: "text", placeholder: "주소를 입력해 주세요", required: true },
              { id: "homepage", label: "홈페이지", type: "url", placeholder: "홈페이지 주소를 입력해 주세요" },
              { id: "phone", label: "대표번호", type: "tel", placeholder: "병원 전화번호를 입력하세요", required: true },
              { id: "email", label: "이메일", type: "email", placeholder: "이메일 주소를 입력하세요" },
            ].map((field) => (
              <div key={field.id} className="tw:flex tw:flex-col tw:gap-1">
                <label htmlFor={field.id} className="tw:font-semibold tw:text-sm">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  id={field.id}
                  name={field.id}
                  value={hospitalForm[field.id]}
                  onChange={handleInputChange}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="tw:border tw:border-gray-300 tw:rounded tw:px-3 tw:py-2 tw:w-full"
                />
              </div>
            ))}

            {/* 소개 */}
            <div className="tw:flex tw:flex-col tw:gap-1">
              <input type="checkbox" className="ds-checkbox ds-checkbox-warning" />
              <label htmlFor="hospIntroduce" className="tw:font-semibold tw:text-sm">
                병원 소개
              </label>
              <textarea
                id="hospIntroduce"
                name="hospIntroduce"
                value={hospitalForm.hospIntroduce}
                onChange={handleInputChange}
                placeholder="간단한 소개글을 작성해 주세요"
                required
                rows={4}
                className="tw:border tw:border-gray-300 tw:rounded tw:px-3 tw:py-2 tw:w-full tw:resize-none"
              />
            </div>
          </div>
        </form>
      </div>

      {/* 진료 과목 & 동물 */}
      <div className="tw:mt-5 tw:w-full tw:max-w-3xl tw:bg-[#feb0b06b] tw:p-4 sm:tw:p-6 tw:rounded-xl tw:shadow">
        <div className="tw:flex tw:flex-col sm:tw:flex-row tw:gap-6">
          {/* 진료과목 */}
          <div className="tw:flex-1">
            <label className="tw:font-semibold tw:text-sm">진료 과목</label>
            <div className="tw:flex tw:flex-wrap tw:gap-3 mt-2">
              {dummySpecialtyList.map((spec) => (
                <label key={spec.specialtyId} className="tw:flex tw:items-center tw:gap-1">
                  <input
                    type="checkbox" className="ds-checkbox ds-checkbox-error"
                    checked={hospitalForm.specialtyIds.includes(spec.specialtyId)}
                    onChange={() => handleSpecialtyChange(spec.specialtyId)}
                  />
                  <span>{spec.category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 진료동물 */}
          <div className="tw:flex-1">
            <label className="tw:font-semibold tw:text-sm">진료 가능 동물</label>
            <div className="tw:flex tw:flex-wrap tw:gap-3 mt-2">
              {dummyAnimalList.map((animal) => (
                <label key={animal.animalId} className="tw:flex tw:items-center tw:gap-1">
                  
                  <input
                    type="checkbox"
                    checked={hospitalForm.animalIds.includes(animal.animalId)}
                    onChange={() => handleAnimalChange(animal.animalId)}
                    className="tw:bg-[#ffa1a1]"
                  />
                  <span>{animal.species}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="tw:flex tw:flex-row sm:tw:flex-row tw:gap-16 tw:mt-4 tw:w-full tw:max-w-lg">
        <button
          type="button"
          className="tw:flex-1 sm:tw:flex-none tw:px-4 tw:py-2 tw:rounded tw:bg-gray-400 tw:text-white hover:tw:bg-gray-500"
          onClick={() => window.history.back()}
        >
          취소
        </button>
        <button
          type="button"
          id="submitAllBtn"
          className="tw:flex-1 sm:tw:flex-none tw:px-4 tw:py-2 tw:rounded tw:bg-[#ffa1a1] tw:text-white hover:tw:bg-pink-600"
          onClick={handleSubmit}
        >
          {hospitalForm.hospitalId ? "수정" : "등록"}
        </button>
        {IS_ADMIN && hospitalForm.hospitalId && (
          <button
            type="button"
            id="deleteBtn"
            className="tw:flex-1 sm:tw:flex-none tw:px-4 tw:py-2 tw:rounded tw:bg-[#ffa1a1] tw:text-white hover:tw:bg-red-600"
            onClick={handleDelete}
          >
            삭제
          </button>
        )}
      </div>
    </div>
  );
};

export default HospitalForm;
