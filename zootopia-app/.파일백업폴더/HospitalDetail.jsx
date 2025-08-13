import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { getReviews, addReview, updateReview, deleteReview } from "../../apis/hospitals/hospitalApi";

const HospitalDetail = ({
  hospitalId,
  isAdmin = false,
  isAuthenticated = false,
  currentUserId = null,
  hospitalData,
}) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [reviewId, setReviewId] = useState(null);

  const hospital = hospitalData;

  // 리뷰 목록 불러오기
  const loadReviews = async () => {
    try {
      const response = await getReviews(hospitalId);
      setReviews(Array.isArray(response.data) ? response.data : []);
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

  // 리뷰 수정하기
  const editReview = (id, rate, txt) => {
    setReviewId(id);
    setRating(rate);
    setContent(txt);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  // 리뷰 삭제
  const deleteReview = async (id) => {
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
    <div className="tw:max-w-[1140px] tw:mx-auto tw:px-4 tw:py-6">
      {/* 병원 기본 정보 */}
      <div className="tw:flex tw:flex-col lg:tw:flex-row tw:gap-6 tw:mb-8">
        <div className="tw:flex-shrink-0 tw:w-full lg:tw:w-[300px]">
          <img
            src={hospital.thumbnailImageUrl || "/img/default-hospital.png"}
            alt={hospital.name}
            className="tw:w-full tw:h-[200px] tw:object-cover tw:rounded"
          />
        </div>
        <div className="tw:flex-1 tw:bg-white tw:shadow tw:rounded tw:p-4">
          <h2 className="tw:text-xl tw:font-bold tw:mb-4">{hospital.name}</h2>
          <p className="tw:mb-1"><strong>주소:</strong> {hospital.address || "-"}</p>
          <p className="tw:mb-1"><strong>대표번호:</strong> {hospital.phone || "-"}</p>
          <p className="tw:mb-1"><strong>이메일:</strong> {hospital.email || "-"}</p>
          <p className="tw:mb-1"><strong>홈페이지:</strong> 
            {hospital.homepage 
              ? <a href={hospital.homepage} target="_blank" rel="noopener noreferrer" className="tw:text-blue-500"> {hospital.homepage}</a>
              : " -"}
          </p>
          <p><strong>소개:</strong> {hospital.hospIntroduce || "-"}</p>
          {isAdmin && (
            <div className="tw:mt-3 tw:text-right">
              <a
                href={`/service/hospitals/edit/${hospitalId}`}
                className="tw:bg-[#74b9ff] tw:text-white tw:px-4 tw:py-2 tw:rounded hover:tw:bg-[#0984e3]"
              >
                수정하기
              </a>
            </div>
          )}
        </div>
      </div>

      {/* 리뷰 섹션 */}
      <div className="tw:mt-6">
        <h3 className="tw:text-lg tw:font-semibold">이 병원 어때요? ({reviews.length}개)</h3>
        
        {/* 리뷰 리스트 */}
        <div className="tw:mt-4 tw:space-y-3">
          {reviews.map((rev) => (
            <div key={rev.reviewId} className="tw:bg-white tw:shadow tw:rounded tw:p-3">
              <div className="tw:flex tw:justify-between tw:items-center">
                <div>
                  <strong>{rev.userNickname}</strong>
                  <div className="tw:text-yellow-400">
                    {"★".repeat(rev.rating) + "☆".repeat(5 - rev.rating)}
                  </div>
                </div>
                {currentUserId === rev.userId && (
                  <div className="tw:space-x-2">
                    <button
                      onClick={() => editReview(rev.reviewId, rev.rating, rev.content)}
                      className="tw:text-blue-500 hover:tw:underline"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => deleteReview(rev.reviewId)}
                      className="tw:text-red-500 hover:tw:underline"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
              <p className="tw:mt-2 tw:text-gray-700">{rev.content}</p>
              <span className="tw:text-gray-400 tw:text-sm">{new Date(rev.createdAt).toLocaleString("ko-KR")}</span>
            </div>
          ))}
        </div>

        {/* 리뷰 작성 폼 */}
        {isAuthenticated && (
          <form onSubmit={handleSubmit} className="tw:mt-6 tw:space-y-3">
            <div className="tw:flex tw:space-x-1 tw:text-2xl">
              {[1,2,3,4,5].map((v) => (
                <span
                  key={v}
                  onClick={() => setRating(v)}
                  className={`tw:cursor-pointer ${v <= rating ? "tw:text-yellow-400" : "tw:text-gray-300"}`}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="3"
              placeholder="리뷰를 작성해주세요"
              className="tw:w-full tw:border tw:rounded tw:p-2"
            />
            <button
              type="submit"
              className="tw:bg-[#74b9ff] tw:text-white tw:px-4 tw:py-2 tw:rounded hover:tw:bg-[#0984e3]"
            >
              {reviewId ? "수정" : "등록"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default HospitalDetail;
