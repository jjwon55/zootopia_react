import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getReviews,
  addReview,
  updateReview,
  deleteReview
} from "../../apis/hospitals/hospitalApi";
import defaultHospitalImg from "../../assets/img/default-thumbnail.png";
import defaultHospImg from "../../assets/img/default-hospital.png";
import { MousePointerClick, Star, UserPen } from 'lucide-react';

const HospitalDetail = ({
  hospitalId,
  isAdmin = false,
  isAuthenticated,
  currentUserId,
  hospitalData,
  searchMap
}) => {
  console.log("HospitalDetail - isAuthenticated:", isAuthenticated);
  console.log("HospitalDetail - hospitalData:", hospitalData);
  console.log("HospitalDetail - thumbnailImageUrl:", hospitalData?.thumbnailImageUrl);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [reviewId, setReviewId] = useState(null);
  const [previewUrl, setpreviewUrl] = useState(defaultHospImg)
  const [reviewAvg, setReviewAvg] = useState()
  const navigate = useNavigate();

  const hospital = hospitalData;
  // animal-banner 아이콘 데이터
  const animalIcons = ["🐱", "🐶", "🐸", "병원 소개", "🦜", "🐹"];

  // 리뷰 목록 불러오기
  const loadReviews = async () => {
    try {
      const response = await getReviews(hospitalId);
      setReviews(Array.isArray(response.data) ? response.data : []);
      console.log("리뷰 API 응답 데이터:", response.data);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "데이터 오류",
        text: "리뷰를 불러오는 중 문제가 발생했습니다.",
        confirmButtonColor: "#74b9ff"
      });
    }
  };

  useEffect(() => {
    if (hospitalId) {
      loadReviews();
    }
  }, [hospitalId]);

  const clearForm = () => {
    setRating(0);
    setContent("");
    setReviewId(null);
  };

  // 유효성 검사
  const validateReview = () => {
    if (!rating) {
      Swal.fire({
        icon: "warning",
        title: "별점을 선택하세요.",
        confirmButtonColor: "#74b9ff"
      });
      return false;
    }
    if (!content.trim()) {
      Swal.fire({
        icon: "warning",
        title: "리뷰 내용을 입력하세요.",
        confirmButtonColor: "#74b9ff"
      });
      return false;
    }
    return true;
  };

  // 리뷰 등록/수정
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateReview()) return;

    const reviewData = { hospitalId, rating, content };

    try {
      if (reviewId) {
        await updateReview(hospitalId, reviewId, reviewData);
      } else {
        await addReview(hospitalId, reviewData);
      }
      Swal.fire({
        icon: "success",
        title: reviewId ? "리뷰가 수정되었습니다." : "리뷰가 등록되었습니다.",
        confirmButtonColor: "#74b9ff"
      });
      clearForm();
      loadReviews();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "리뷰 처리 실패",
        text: "요청 처리 중 문제가 발생했습니다.",
        confirmButtonColor: "#74b9ff"
      });
    }
  };

  // 리뷰 평점 평균
  useEffect(() => {
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      setReviewAvg((totalRating / reviews.length).toFixed(1));
    } else {
      setReviewAvg(0);
    }
  }, [reviews]);


  // 리뷰 수정
  const editReview = (id, rate, txt) => {
    setReviewId(id);
    setRating(rate);
    setContent(txt);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  // 리뷰 삭제
  const handleDeleteReview = async (id) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "리뷰를 삭제하시겠습니까?",
      showCancelButton: true,
      confirmButtonColor: "#e63946",
      cancelButtonColor: "#74b9ff",
      confirmButtonText: "삭제",
      cancelButtonText: "취소"
    });
    if (!result.isConfirmed) return;

    try {
      await deleteReview(hospitalId, id);
      Swal.fire({
        icon: "success",
        title: "삭제되었습니다.",
        confirmButtonColor: "#74b9ff"
      });
      loadReviews();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "삭제 실패",
        text: "삭제 중 문제가 발생했습니다.",
        confirmButtonColor: "#74b9ff"
      });
    }
  };

  return (
    <div className="hospital-main-container tw:max-w-[1140px] tw:mx-auto tw:px-4 tw:py-6">
      {/* 상단 로고 */}
      {/* <div className="logo-container tw:flex tw:justify-center tw:mb-6 tw:rounded-4xl tw:bg-[#61dd9910]">
        <img src={previewUrl} alt="병원 아이콘" className="tw:w-[210px] tw:h-[150px] " />
      </div> */}

      {/* 동물 배너 */}
      {/* <div className="animal-banner tw:bg-[#f8f9fa] tw:py-4 tw:rounded tw:mb-8">
        <div className="animal-icons tw:flex tw:justify-center tw:gap-3 tw:text-xl">
          <span className="tw:animate-bounce-twice" style={{ animationDelay: "0s" }}>🐱</span>
          <span className="tw:animate-bounce-twice" style={{ animationDelay: "0.2s" }}>🐶</span>
          <span className="tw:animate-bounce-twice" style={{ animationDelay: "0.4s" }}>🐸</span>
          <span className="tw:animate-bounce-twice tw:font-bold" style={{ animationDelay: "0.6s" }}>병원 소개</span>
          <span className="tw:animate-bounce-twice" style={{ animationDelay: "0.8s" }}>🦜</span>
          <span className="tw:animate-bounce-twice" style={{ animationDelay: "1s" }}>🐹</span>
        </div>
      </div> */}

      {/* 동물 배너 (순차 bounce 애니메이션 적용) */}
      <div className="animal-banner tw:bg-[#00c47934] tw:py-4 tw:rounded-2xl tw:mb-8">
        <div className="animal-icons tw:flex tw:justify-center tw:gap-3 tw:text-xl">
          {animalIcons.map((icon, idx) => (
            <span
              key={idx}
              className={`tw:animate-bounce ${icon === "병원 소개" ? "tw:font-bold" : ""}`}
              style={{
                animationDelay: `${idx * 0.2}s`,
                display: "inline-block"
              }}
            >
              {icon}
            </span>
          ))}
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="main-content">
        <div className="detail-container tw:flex tw:flex-col lg:tw:flex-row tw:gap-6">
          {/* 병원 이미지 */}
          <div className="hospital-image-section tw:flex tw:items-center tw:justify-center tw:w-full lg:tw:w-[300px] tw:overflow-hidden tw:rounded-2xl tw:bg-[#61dd9910]">
            <img
              src={hospital.thumbnailImageUrl || defaultHospitalImg}
              alt={hospital.name}
              className="hospital-image tw:w-[380px] tw:h-[320px] tw:object-fit tw:p-2.5"
            />
          </div>

          <div className="return-list-container">
            <div className="tw:text-[#ffffff]"><button className="tw:rounded-xl tw:w-[150px] tw:py-1.5 tw:cursor-pointer tw:bg-[#ff6b6b] tw:hover:bg-[#ff5151]" onClick={() => navigate("/service/hospitals/hospitallist")}>목록으로 돌아가기</button></div>
          </div>

          {/* 병원 정보 */}
          <div className="hospital-info-section tw:flex-1">
            <table className="info-table tw:w-full tw:border-collapse tw:shadow tw:rounded">
              <tbody>
                <tr>
                  <td className="info-label tw:bg-[#f8f9fa] tw:font-semibold tw:p-2 tw:w-[150px]">병원 이름</td>
                  <td className="info-value tw:p-2 tw:bg-[#ff99992f]">{hospital.name}</td>
                </tr>
                <tr>
                  <td className="info-label tw:bg-[#f8f9fa] tw:font-semibold tw:p-2">진료 과목</td>
                  <td className="info-value tw:p-2 tw:bg-[#f8f9fad5]">
                    {hospital.specialties?.map((s) => s.category).join(", ") || "-"}
                  </td>
                </tr>
                <tr>
                  <td className="info-label tw:bg-[#f8f9fa] tw:font-semibold tw:p-2">진료 가능 동물</td>
                  <td className="info-value tw:p-2 tw:bg-[#ff99992f]">
                    {hospital.animals?.map((a) => a.species).join(", ") || "-"}
                  </td>
                </tr>
                <tr>
                  <td className="info-label tw:bg-[#f8f9fa] tw:font-semibold tw:p-2">병원 주소</td>
                  <td
                    className="info-value tw:p-2 tw:cursor-pointer tw:no-underline tw:flex tw:gap-2 tw:bg-[#f8f9fad5]"
                    onClick={() =>
                      navigate(
                        `/map?address=${encodeURIComponent(hospital.address)}&q=${encodeURIComponent('동물병원')}`
                      )
                    }
                  >
                    {hospital.address || "-"} <MousePointerClick className="tw:text-[#ff6b6b]" />
                  </td>
                </tr>
                <tr>
                  <td className="info-label tw:bg-[#f8f9fa] tw:font-semibold tw:p-2">홈페이지</td>
                  <td className="info-value tw:p-2 tw:bg-[#ff99992f]">
                    {hospital.homepage ? (
                      <a href={hospital.homepage} target="_blank" rel="noopener noreferrer" className="tw:no-underline tw:flex tw:gap-2">
                        {hospital.homepage}<MousePointerClick className="tw:text-[#ff6b6b]" />
                      </a>
                    ) : "-"}
                  </td>
                </tr>
                <tr>
                  <td className="info-label tw:bg-[#f8f9fa] tw:font-semibold tw:p-2">대표번호</td>
                  <td className="info-value tw:p-2 tw:bg-[#f8f9fad5]">{hospital.phone || "-"}</td>
                </tr>
                <tr>
                  <td className="info-label tw:bg-[#f8f9fa] tw:font-semibold tw:p-2">이메일</td>
                  <td className="info-value tw:p-2 tw:bg-[#ff99992f]">{hospital.email || "-"}</td>
                </tr>
                <tr>
                  <td className="info-label tw:bg-[#f8f9fa] tw:font-semibold tw:p-2">병원 소개</td>
                  <td className="info-value tw:p-2 tw:bg-[#f8f9fad5]">{hospital.hospIntroduce || "-"}</td>
                </tr>
              </tbody>
            </table>

            {/* 관리자용 버튼 */}
            {isAdmin && (
              <div className="tw:mt-3 tw:text-right">
                <button
                  onClick={() => navigate(`/service/hospitals/edit/${hospitalId}`)}
                  className="tw:bg-[#74b9ff] tw:text-white tw:px-4 tw:py-2 tw:rounded hover:tw:bg-[#0984e3]"
                >
                  수정하기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 리뷰 섹션 */}
      <div className="review-section tw:mt-10">
        <div className="review-header tw:flex tw:flex-col tw:items-center tw:justify-center tw:gap-3 tw:bg-[#86d8af96] tw:p-3 tw:rounded-xl">
          <h3 className="tw:text-lg tw:font-semibold">이 병원 어때요?</h3>
          <div className="tw:flex tw:justify-center tw:items-center tw:gap-6">
            <span className="tw:text-sm tw:flex tw:text-gray-500"><UserPen className="tw:text-[#ff6b6b]" />&nbsp; ({reviews.length}개의 리뷰가 있습니다.)</span>
            <span className="tw:text-sm tw:flex tw:text-gray-500"><Star className="tw:text-[rgb(255,251,6)]" />&nbsp; ({reviewAvg} / 5)</span>
          </div>
        </div>

        {/* 리뷰 목록 */}
        <div className="review-list tw:mt-4 tw:space-y-3">
          {reviews.map((rev, idx) => (
            <div key={rev.reviewId} className={`review-item tw:shadow-md tw:rounded-xl tw:p-3 ${idx % 2 === 0 ? "tw:bg-[#fcf2f1dc]" : "tw:bg-[#f0f0f0a4]"
              }`}>
              <div className="tw:flex tw:justify-between tw:items-center">
                <div>
                  <strong>{rev.userNickname}</strong>
                  <div className="star-rating tw:text-yellow-400">
                    {"★".repeat(rev.rating) + "☆".repeat(5 - rev.rating)}
                  </div>
                </div>
                {currentUserId === rev.userId && (
                  <div className="review-update-container tw:space-x-2">
                    <button
                      onClick={() => editReview(rev.reviewId, rev.rating, rev.content)}
                      className="tw:text-blue-500 hover:tw:underline"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDeleteReview(rev.reviewId)}
                      className="tw:text-red-500 hover:tw:underline"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
              <div className="review-date-container tw:text-gray-500 tw:text-sm">
                {new Date(rev.createdAt).toLocaleString("ko-KR")}
              </div>
              <p className="review-content tw:mt-2">{rev.content}</p>
            </div>
          ))}
        </div>

        {/* 리뷰 작성 폼 */}
        {isAuthenticated && (
          <div id="review-form-container" className="tw:mt-6 tw:bg-[#f9f8ffe3] tw:p-4 tw:rounded-xl tw:shadow-md">
            <h4 className="tw:mb-2 tw:font-semibold">리뷰 작성</h4>
            <form id="review-form" className="review-form tw:space-y-3" onSubmit={handleSubmit}>
              <div className="rating tw:flex tw:space-x-1 tw:text-2xl">
                {[1, 2, 3, 4, 5].map((v) => (
                  <span
                    key={v}
                    onClick={() => setRating(v)}
                    className={`star tw:cursor-pointer ${v <= rating ? "tw:text-yellow-400" : "tw:text-[#dfdfdfc0]"}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <div className="tw:flex tw:gap-1.5 tw:w-">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows="3"
                  placeholder="리뷰를 작성해주세요."
                  className="review-input tw:w-full tw:border-2 tw:border-[#d6d6d698] tw:focus:outline-none tw:focus:border-[#ff6b6b] tw:rounded tw:p-2"
                />
                <button
                  type="submit"
                  className="review-submit-btn tw:bg-[#ff6b6b] tw:w-20 tw:text-white tw:px-2 tw:py-2 tw:ml-3.5 tw:rounded hover:tw:bg-[#0984e3]"
                >
                  {reviewId ? "수정" : "등록"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalDetail;
