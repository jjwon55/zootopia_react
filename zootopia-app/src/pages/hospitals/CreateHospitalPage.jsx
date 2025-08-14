import React, { useEffect, useContext } from 'react'
import CreateHospitalContainer from '../../containers/hospitals/CreateHospitalContainer'
import defaultHospImg from "../../assets/img/default-hospital.png";
import { LoginContext } from '../../context/LoginContextProvider';
import { useNavigate } from 'react-router-dom';
import * as Swal from '../../apis/alert';

const CreateHospitalPage = () => {
  const { roles, isLoading } = useContext(LoginContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!isLogin) {
        // If not logged in, just redirect without alert (e.g., after logout)
        navigate('/');
      } else if (!roles || !roles.isAdmin) {
        // If logged in but not admin, show alert and redirect
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
  }, [roles, isLoading, navigate, isLogin]);

  if (isLoading || !roles || !roles.isAdmin) {
    return <div>Loading permissions...</div>; // Or a more user-friendly loading/denied message
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
                    <CreateHospitalContainer isAdmin={roles.isAdmin} />
                </div>
            </div>
        </>
  )
}

export default CreateHospitalPage