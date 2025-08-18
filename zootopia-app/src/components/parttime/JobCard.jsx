import React from "react";
import { Link } from "react-router-dom";

const JobCard = ({ job }) => (
  <div className="tw:w-full tw:max-w-[250px] tw:bg-[#f8fbe9] tw:rounded tw:shadow tw:p-4">
    <h5 className="tw:mb-3 tw:text-lg tw:font-bold">🐾 {job.title}</h5>
    <p className="tw:mb-2">📍 {job.location}</p>
    <p className="tw:mb-2">🗓️ {job.startDate} ~ {job.endDate}</p>
    <p className="tw:mb-2">💰 {job.pay}원</p>
    <p className="tw:mb-2">👤 보호자: {job.nickname}</p>
    <div className="tw:text-end">
      <Link
        to={`/parttime/read/${job.jobId}`}
        className="
          tw:inline-block tw:rounded tw:border tw:border-gray-400
          tw:bg-white tw:px-3 tw:py-1 tw:text-sm
          hover:tw:bg-gray-100 tw:transition
        "
      >
        상세보기
      </Link>
    </div>
  </div>
);

export default JobCard;