import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as hospitalApi from '../../apis/hospitals/hospitalApi';
import CreateHospitalContainer from '../../containers/hospitals/CreateHospitalContainer'; // CreateHospitalContainer를 재사용
import { useContext } from 'react';
import { LoginContext } from '../../context/LoginContextProvider';
import defaultHospImg from "../../assets/img/default-hospital.png";

const HospitalEditPage = () => {
  const { hospitalId } = useParams();
  const [hospitalData, setHospitalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo } = useContext(LoginContext);
  const isAdmin = userInfo?.authList.some(auth => auth.auth === "ROLE_ADMIN" || auth.auth === "ROLE_SUPERADMIN");

  useEffect(() => {
    const fetchHospitalData = async () => {
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
  }, [hospitalId]);

  if (loading) {
    return <div className="tw:max-w-[1140px] tw:mx-auto tw:py-8">로딩 중...</div>;
  }
  if (error) {
    return <div className="tw:max-w-[1140px] tw:mx-auto tw:py-8">{error}</div>;
  }
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
              <CreateHospitalContainer hospitalData={hospitalData} isAdmin={isAdmin} />
          </div>
      </div>
    </>
  )
};

export default HospitalEditPage;
