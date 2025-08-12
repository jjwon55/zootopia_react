import React from 'react';
import HospListContainer from '../../containers/hospitals/HospListContainer';
import defaultHospImg from "../../assets/img/default-hospital.png";

const HospListPage = () => {
    return (
        <>
            <div className="hospital-main-container">
                <div className="logo-container tw:flex tw:items-center tw:justify-center ">
                    <div className="logo tw:w-full tw:h-full tw:bg-[#61dd9910] tw:flex tw:items-center tw:justify-center">
                        <img src={defaultHospImg} alt="병원 아이콘" className="logo-icon tw:w-[150px] tw:h-[120px] " />
                    </div>
                </div>
                <div className="main-content">
                    <HospListContainer />
                </div>
            </div>
        </>
    );
};

export default HospListPage;
