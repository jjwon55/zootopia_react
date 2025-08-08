import React from 'react';
import HospListContainer from '../../containers/hospitals/HospListContainer';

const HospListPage = () => {
    return (
        <>
            <div className="hospital-main-container">
                <div className="logo-container">
                    <div className="logo">
                        <img src="/img/hosp_logo.png" alt="병원 아이콘" className="logo-icon" />
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
