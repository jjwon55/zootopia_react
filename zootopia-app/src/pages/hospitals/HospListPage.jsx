import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HospListContainer from '../../containers/hospitals/HospListContainer';

const HospListPage = () => {
    const [hospitalData, setHospitalData] = useState({
        hospitalList: [],
        pageInfo: {},
        animalList: [],
        selectedAnimals: [],
    });
    const [selectedAnimalIds, setSelectedAnimalIds] = useState([]);
    const [pageNum, setPageNum] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHospitals = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = {
                    pageNum: pageNum,
                };
                if (selectedAnimalIds.length > 0) {
                    params.animal = selectedAnimalIds.join(','); // Backend expects comma-separated string
                }
                const response = await axios.get('/service/hospitals', { params });
                setHospitalData(response.data);
            } catch (err) {
                setError('병원 데이터를 불러오는 데 실패했습니다.');
                console.error('Error fetching hospital data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchHospitals();
    }, [selectedAnimalIds, pageNum]);

    const handleAnimalFilterChange = (animalId) => {
        setSelectedAnimalIds(prevSelected => {
            if (prevSelected.includes(animalId)) {
                return prevSelected.filter(id => id !== animalId);
            } else {
                return [...prevSelected, animalId];
            }
        });
        setPageNum(1); // Reset to first page on filter change
    };

    const handlePageChange = (newPageNum) => {
        setPageNum(newPageNum);
    };

    return (
        <>
            <div className="hospital-main-container">
                <div className="logo-container">
                    <div className="logo">
                        <img src="/img/hosp_logo.png" alt="병원 아이콘" className="logo-icon" />
                    </div>
                </div>
                <div className="main-content">
                    {loading ? (
                        <div>로딩 중...</div>
                    ) : error ? (
                        <div>오류: {error}</div>
                    ) : (
                        <HospListContainer
                            hospitalData={hospitalData}
                            selectedAnimalIds={selectedAnimalIds}
                            onAnimalFilterChange={handleAnimalFilterChange}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default HospListPage;
