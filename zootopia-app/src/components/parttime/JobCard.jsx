import React from "react";
import { Link } from "react-router-dom";

const JobCard = ({ job }) => (
  <div
    className="
      tw:w-full tw:max-w-[280px]
      tw:bg-white tw:border tw:border-rose-100 tw:rounded-2xl
      tw:shadow-sm tw:p-5
      hover:tw:shadow-md hover:tw:-translate-y-0.5 tw:transition
    "
  >
    <h5 className="tw:mb-3 tw:text-lg tw:font-extrabold tw:text-[#F27A7A]">
      🐾 {job.title}
    </h5>

    <ul className="tw:text-sm tw:space-y-1.5 tw:text-[#333]">
      <li>📍 <b>{job.location}</b></li>
      <li>🗓️ {job.startDate} ~ {job.endDate}</li>
      <li>💰 <b>{job.pay}</b>원</li>
      <li>👤 보호자: {job.nickname}</li>
    </ul>

    <div className="tw:text-end tw:mt-4">
      <Link
        to={`/parttime/read/${job.jobId}`}
        className="
          tw:inline-block tw:rounded-xl tw:border tw:border-[#F27A7A]
          tw:bg-white tw:px-3 tw:py-1.5 tw:text-sm tw:text-[#F27A7A]
          hover:tw:bg-rose-50 tw:transition
        "
      >
        상세보기
      </Link>
    </div>
  </div>
);

export default JobCard;