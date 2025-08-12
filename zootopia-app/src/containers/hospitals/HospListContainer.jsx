import React, { useState, useEffect } from 'react';
import { list as listHospitals } from '../../apis/hospitals/hospitalApi';
import HospitalList from '../../components/hospitals/HospitalList';

const HospListContainer = () => {
    const [hospitalData, setHospitalData] = useState({
        hospitalList: [],
        pageInfo: {},
        animalList: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAnimalIds, setSelectedAnimalIds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchHospitalData = async (page, animalIds) => {
        setLoading(true);
        try {
            const response = await listHospitals(animalIds, page);
            const data = response.data || {};
            setHospitalData({
                hospitalList: data.hospitalList || [],
                pageInfo: data.pageInfo || {},
                animalList: data.animalList || [],
            });
        } catch (e) {
            setError(e);
            console.error("Failed to fetch hospital data:", e);
            setHospitalData({
                hospitalList: [],
                pageInfo: {},
                animalList: [],
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchHospitalData(currentPage, selectedAnimalIds);
    }, [currentPage, selectedAnimalIds]);

    const handleAnimalFilterChange = (animalId) => {
        const newSelectedAnimalIds = selectedAnimalIds.includes(animalId)
            ? selectedAnimalIds.filter(id => id !== animalId)
            : [...selectedAnimalIds, animalId];

        setSelectedAnimalIds(newSelectedAnimalIds);
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error...</div>;

    return (
        <HospitalList
            hospitalList={hospitalData.hospitalList}
            pageInfo={hospitalData.pageInfo}
            animalList={hospitalData.animalList}
            selectedAnimals={selectedAnimalIds}
            onAnimalFilterChange={handleAnimalFilterChange}
            onPageChange={handlePageChange}
        />
    );
};

export default HospListContainer;
