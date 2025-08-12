import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { create, update, remove, getAllAnimals, getAllSpecialties } from "../../apis/hospitals/hospitalApi";
import defaultHospitalImg from "../../assets/img/default-hospital.png";

const HospitalForm = ({ hospitalData, isAdmin }) => {
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
  const [specialtyList, setSpecialtyList] = useState([]);
  const [animalList, setAnimalList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(defaultHospitalImg);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const animalsResponse = await getAllAnimals();
        const specialtiesResponse = await getAllSpecialties();
        setAnimalList(animalsResponse.data);
        setSpecialtyList(specialtiesResponse.data);

        if (hospitalData) {
          setHospitalForm({
            hospitalId: hospitalData.hospitalId,
            name: hospitalData.name || "",
            address: hospitalData.address || "",
            homepage: hospitalData.homepage || "",
            phone: hospitalData.phone || "",
            email: hospitalData.email || "",
            hospIntroduce: hospitalData.hospIntroduce || "",
            specialtyIds: hospitalData.specialties?.map(s => s.specialtyId) || [],
            animalIds: hospitalData.animals?.map(a => a.animalId) || [],
          });
          setPreviewUrl(hospitalData.thumbnailImageUrl || defaultHospitalImg);
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "데이터 로드 실패",
          text: "초기 데이터를 불러오는데 실패했습니다.",
          confirmButtonColor: "#74b9ff"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [hospitalData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHospitalForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e, type) => {
    const { value, checked } = e.target;
    const numericValue = Number(value);
    setHospitalForm((prev) => ({
      ...prev,
      [type]: checked
        ? [...prev[type], numericValue]
        : prev[type].filter((id) => id !== numericValue),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const warnAlert = (msg) => {
    Swal.fire({
      icon: "warning",
      title: "확인해주세요",
      text: msg,
      confirmButtonColor: "#74b9ff"
    });
  };

  const validateForm = () => {
    if (!hospitalForm.name.trim()) { warnAlert("병원 이름을 입력하세요."); return false; }
    if (!hospitalForm.address.trim()) { warnAlert("주소를 입력하세요."); return false; }
    if (!hospitalForm.phone.trim()) { warnAlert("대표번호를 입력하세요."); return false; }
    const phoneRegex = /^[0-9\-]+$/;
    if (!phoneRegex.test(hospitalForm.phone)) { warnAlert("전화번호 형식이 올바르지 않습니다."); return false; }
    if (hospitalForm.email && !/\S+@\S+\.\S+/.test(hospitalForm.email)) { warnAlert("이메일 형식이 올바르지 않습니다."); return false; }
    if (!hospitalForm.hospIntroduce.trim()) { warnAlert("간단한 병원 소개를 적어주세요."); return false; }
    if (hospitalForm.specialtyIds.length === 0) { warnAlert("진료 과목을 하나 이상 선택하세요."); return false; }
    if (hospitalForm.animalIds.length === 0) { warnAlert("진료 가능 동물을 하나 이상 선택하세요."); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      if (hospitalForm.hospitalId) {
        await update(hospitalForm.hospitalId, hospitalForm, thumbnailFile);
        Swal.fire({ icon: "success", title: "수정 완료", text: "병원 정보가 성공적으로 수정되었습니다.", confirmButtonColor: "#74b9ff" })
          .then(() => navigate(`/service/hospitals/hospitaldetail/${hospitalForm.hospitalId}`));
      } else {
        await create(hospitalForm, thumbnailFile);
        Swal.fire({ icon: "success", title: "등록 완료", text: "병원 정보가 성공적으로 등록되었습니다.", confirmButtonColor: "#74b9ff" })
          .then(() => navigate("/service/hospitals/hospitallist"));
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: hospitalForm.hospitalId ? "수정 실패" : "등록 실패",
        text: hospitalForm.hospitalId ? "병원 정보 수정에 실패했습니다." : "병원 정보 등록에 실패했습니다.",
        confirmButtonColor: "#74b9ff"
      });
    }
  };

  // 🔹 삭제 기능 추가
  const handleDelete = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: "병원 정보를 삭제하시겠습니까?",
      text: "삭제 후에는 되돌릴 수 없습니다.",
      showCancelButton: true,
      confirmButtonColor: "#e63946",
      cancelButtonColor: "#74b9ff",
      confirmButtonText: "삭제",
      cancelButtonText: "취소"
    });
    if (!result.isConfirmed) return;

    try {
      await remove(hospitalForm.hospitalId);
      Swal.fire({
        icon: "success",
        title: "삭제 완료",
        text: "병원 정보가 삭제되었습니다.",
        confirmButtonColor: "#74b9ff"
      }).then(() => navigate("/service/hospitals/hospitallist"));
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "삭제 실패",
        text: "병원 정보 삭제에 실패했습니다.",
        confirmButtonColor: "#74b9ff"
      });
    }
  };

  if (loading) return <div className="tw:text-center tw:mt-6">로딩중...</div>;

  const inputFields = [
    { label: "병원 이름", name: "name", type: "text", placeholder: "병원 이름을 입력하세요" },
    { label: "주소", name: "address", type: "text", placeholder: "병원 주소를 입력하세요" },
    { label: "홈페이지", name: "homepage", type: "url", placeholder: "https://" },
    { label: "대표번호", name: "phone", type: "tel", placeholder: "전화번호를 입력하세요" },
    { label: "이메일", name: "email", type: "email", placeholder: "이메일을 입력하세요" },
  ];

  return (
    <div className="tw:max-w-[1200px] tw:mx-auto tw:p-5">
      <form onSubmit={handleSubmit} className="tw:bg-white tw:rounded-[20px] tw:p-[30px] tw:shadow tw:flex tw:flex-col md:tw:flex-row tw:gap-[40px]">
        {/* 이미지 업로드 */}
        <div className="tw:flex tw:flex-col tw:items-center">
          <div
            className="tw:w-[250px] tw:h-[200px] tw:border-2 tw:border-dashed tw:border-gray-300 tw:rounded-lg tw:flex tw:items-center tw:justify-center tw:bg-[#f9f9f9] hover:tw:border-[#74b9ff] hover:tw:bg-blue-50 tw:cursor-pointer tw:transition-all"
            onClick={() => fileInputRef.current.click()}
          >
            <img src={previewUrl} alt="Hospital" className="tw:w-full tw:h-full tw:object-cover tw:rounded" />
            <input type="file" ref={fileInputRef} onChange={handleImageChange} className="tw:hidden" accept="image/*" />
          </div>
        </div>

        {/* 입력 폼 */}
        <div className="tw:flex-1 tw:flex tw:flex-col">
          {inputFields.map((f) => (
            <div key={f.name} className="tw:mb-5">
              <label className="tw:block tw:mb-2 tw:font-semibold">{f.label}</label>
              <input
                type={f.type}
                name={f.name}
                value={hospitalForm[f.name]}
                onChange={handleChange}
                placeholder={f.placeholder}
                className="tw:w-full tw:px-3 tw:py-2 tw:border tw:border-gray-300 tw:rounded focus:tw:border-[#74b9ff] focus:tw:shadow-md focus:tw:outline-none"
              />
            </div>
          ))}

          {/* 병원 소개 */}
          <div className="tw:mb-5">
            <label className="tw:block tw:mb-2 tw:font-semibold">병원 소개</label>
            <textarea
              name="hospIntroduce"
              value={hospitalForm.hospIntroduce}
              onChange={handleChange}
              rows="3"
              className="tw:w-full tw:px-3 tw:py-2 tw:border tw:border-gray-300 tw:rounded focus:tw:border-[#74b9ff]"
            />
          </div>

          {/* 진료 과목 */}
          <div className="tw:mb-5">
            <label className="tw:block tw:mb-2 tw:font-semibold">진료 과목</label>
            <div className="tw:grid tw:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] tw:gap-2">
              {specialtyList.map((s) => (
                <label key={s.specialtyId} className="tw:flex tw:items-center tw:gap-2 tw:p-2 tw:bg-gray-100 tw:rounded-full tw:cursor-pointer hover:tw:bg-blue-50">
                  <input
                    type="checkbox"
                    value={s.specialtyId}
                    checked={hospitalForm.specialtyIds.includes(s.specialtyId)}
                    onChange={(e) => handleCheckbox(e, "specialtyIds")}
                  />
                  {s.category}
                </label>
              ))}
            </div>
          </div>

          {/* 진료 가능 동물 */}
          <div className="tw:mb-5">
            <label className="tw:block tw:mb-2 tw:font-semibold">진료 가능 동물</label>
            <div className="tw:grid tw:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] tw:gap-2">
              {animalList.map((a) => (
                <label key={a.animalId} className="tw:flex tw:items-center tw:gap-2 tw:p-2 tw:bg-gray-100 tw:rounded-full tw:cursor-pointer hover:tw:bg-blue-50">
                  <input
                    type="checkbox"
                    value={a.animalId}
                    checked={hospitalForm.animalIds.includes(a.animalId)}
                    onChange={(e) => handleCheckbox(e, "animalIds")}
                  />
                  {a.species}
                </label>
              ))}
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="tw:flex tw:justify-center tw:gap-4 tw:mt-6">
            <button type="button" onClick={() => navigate(-1)} className="tw:px-6 tw:py-2 tw:bg-gray-200 tw:rounded-full hover:tw:bg-gray-300">취소</button>
            <button type="submit" className="tw:px-6 tw:py-2 tw:bg-[#74b9ff] tw:text-white tw:rounded-full hover:tw:bg-[#0984e3]">
              {hospitalForm.hospitalId ? "수정" : "등록"}
            </button>
            {isAdmin && hospitalForm.hospitalId && (
              <button
                type="button"
                onClick={handleDelete}
                className="tw:px-6 tw:py-2 tw:bg-red-500 tw:text-white tw:rounded-full hover:tw:bg-red-600">
                삭제
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default HospitalForm;
