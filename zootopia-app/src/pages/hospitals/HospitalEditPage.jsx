import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as hospitalApi from '../../apis/hospitals/hospitalApi';
import CreateHospitalContainer from '../../containers/hospitals/CreateHospitalContainer'; // CreateHospitalContainer를 재사용
import { LoginContext } from '../../context/LoginContextProvider';
import defaultHospImg from "../../assets/img/default-hospital.png";

const HospitalEditPage = () => {
  const { hospitalId } = useParams();
  const [hospitalData, setHospitalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { roles, isLoading } = useContext(LoginContext); // roles와 isLoading을 가져옵니다.
  const navigate = useNavigate();

  console.log("HospitalEditPage - roles:", roles, "isLoading:", isLoading);

  // 권한 확인 useEffect
  useEffect(() => {
    if (!isLoading) {
      if (!roles?.isAdmin) {
        Swal.fire({
          icon: "error",
          title: "권한 없음",
          text: "관리자만 접근할 수 있습니다.",
          confirmButtonColor: "#74b9ff"
        }).then(() => {
          navigate('/');
        });
      }
    }
  }, [roles, isLoading, navigate]);

  useEffect(() => {
    const fetchHospitalData = async () => {
      console.log("HospitalEditPage - hospitalId:", hospitalId);
      // 관리자 권한이 없으면 데이터를 불러오지 않음
      if (!roles?.isAdmin) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await hospitalApi.read(hospitalId);
        setHospitalData(response.data);
        setError(null);
      } catch (err) {
        setError("병원 정보를 불러오는 데 실패했습니다.");
        Swal.fire({
          icon: "error",
          title: "데이터 로드 실패",
          text: "병원 정보를 불러오는 중 문제가 발생했습니다.",
          confirmButtonColor: "#74b9ff",
        });
      } finally {
        setLoading(false);
      }
    };

    if (hospitalId) {
      fetchHospitalData();
    }
  }, [hospitalId, roles]); // roles를 의존성 배열에 추가

  // 로딩 중이거나 권한이 없는 경우
  if (isLoading) {
    return <div className="tw:max-w-[1140px] tw:mx-auto tw:py-8">권한 확인 중...</div>;
  }

  if (!roles?.isAdmin) {
    return null; // The useEffect will handle the alert and redirect
  }

  console.log("HospitalEditPage - error:", error);
  if (error) {
    return <div className="tw:max-w-[1140px] tw:mx-auto tw:py-8">{error}</div>;
  }
  console.log("HospitalEditPage - hospitalData:", hospitalData);
  if (!hospitalData) {
    return <div className="tw:max-w-[1140px] tw:mx-auto tw:py-8">병원 정보가 없습니다.</div>;
  }

  return (
    <>
      <div className="hospital-main-container">
          <div className="logo-container tw:flex tw:items-center tw:justify-center ">
              <div className="logo tw:w-full tw:h-full tw:bg-[#61dd9910] tw:flex tw:items-center tw:justify-center">
                  <img src={defaultHospImg} alt="병원 아이콘" className="logo-icon tw:w-[150px] tw:h-[120px] " />
              </div>
          </div>
          <div className="hosplist-main-content">
              <CreateHospitalContainer hospitalData={hospitalData} isAdmin={roles.isAdmin} />
          </div>
      </div>
    </>
  )
};

export default HospitalEditPage;
