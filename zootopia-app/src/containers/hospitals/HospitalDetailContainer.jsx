import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import HospitalDetail from "../../components/hospitals/HospitalDetail";
import * as hospitalApi from "../../apis/hospitals/hospitalApi"; 
import { LoginContext } from "../../context/LoginContextProvider";
import Swal from "sweetalert2";

const HospitalDetailContainer = () => {
  const { hospitalId } = useParams();
  const { userInfo, isLogin } = useContext(LoginContext);
  console.log("HospitalDetailContainer - isLogin:", isLogin);
  const [hospitalData, setHospitalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
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

  const isAdmin = userInfo?.authList.some(auth => auth.auth === "ROLE_ADMIN" || auth.auth === "ROLE_SUPERADMIN");
  const currentUserId = userInfo?.userId;

  return (
    <HospitalDetail
      hospitalId={hospitalId}
      hospitalData={hospitalData}
      isAdmin={isAdmin}
      isAuthenticated={isLogin}
      currentUserId={currentUserId}
    />
  );
};

export default HospitalDetailContainer;