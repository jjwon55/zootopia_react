import React from "react";
import { Link } from "react-router-dom";

const JobCard = ({ job }) => (
  <div className="bg-[#f8fbe9] rounded shadow p-4 w-full max-w-[250px]">
    <h5 className="font-bold mb-3 text-lg">🐾 {job.title}</h5>
    <p className="mb-2">📍 {job.location}</p>
    <p className="mb-2">🗓️ {job.startDate} ~ {job.endDate}</p>
    <p className="mb-2">💰 {job.pay}원</p>
    <p className="mb-2">👤 보호자: {job.nickname}</p>
    <div className="text-end">
      <Link
        to={`/parttime/read/${job.jobId}`}
        className="border border-gray-400 rounded px-3 py-1 text-sm bg-white hover:bg-gray-100 transition"
      >
        상세보기
      </Link>
    </div>
  </div>
);

export default JobCard;