import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as hospitalApi from '../../apis/hospitals/hospitalApi';
import CreateHospitalContainer from '../../containers/hospitals/CreateHospitalContainer'; // CreateHospitalContainer를 재사용
import { useContext } from 'react';
import { LoginContext } from '../../context/LoginContextProvider';

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
    <CreateHospitalContainer hospitalData={hospitalData} isAdmin={isAdmin} />
  );
};

export default HospitalEditPage;
