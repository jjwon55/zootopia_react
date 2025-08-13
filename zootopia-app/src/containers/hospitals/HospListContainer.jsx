import React, { useState, useEffect } from 'react';
import { list as listHospitals } from '../../apis/hospitals/hospitalApi';
import HospitalList from '../../components/hospitals/HospitalList';

const HospListContainer = () => {
    const [hospitalData, setHospitalData] = useState({
        hospitalList: [],
        pageInfo: {},
        animalList: [],
        specialtyList: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAnimalIds, setSelectedAnimalIds] = useState([]);
    const [selectedSpecialtyIds, setSelectedSpecialtyIds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchHospitalData = async (page, animalIds, specialtyIds) => {
        setLoading(true);
        try {
            const response = await listHospitals(animalIds, specialtyIds, page);
            const data = response.data || {};
            setHospitalData({
                hospitalList: data.hospitalList || [],
                pageInfo: data.pageInfo || {},
                animalList: data.animalList || [],
                specialtyList: data.specialtyList || [],
            });
        } catch (e) {
            setError(e);
            console.error("Failed to fetch hospital data:", e);
            setHospitalData({
                hospitalList: [],
                pageInfo: {},
                animalList: [],
                specialtyList: [],
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchHospitalData(currentPage, selectedAnimalIds, selectedSpecialtyIds);
    }, [currentPage, selectedAnimalIds, selectedSpecialtyIds]);

    const handleAnimalFilterChange = (animalId) => {
        const newSelectedAnimalIds = selectedAnimalIds.includes(animalId)
            ? selectedAnimalIds.filter(id => id !== animalId)
            : [...selectedAnimalIds, animalId];

        setSelectedAnimalIds(newSelectedAnimalIds);
        setCurrentPage(1);
    };

    const handleSpecialtyFilterChange = (specialtyId) => {
        const newSelectedSpecialtyIds = selectedSpecialtyIds.includes(specialtyId)
            ? selectedSpecialtyIds.filter(id => id !== specialtyId)
            : [...selectedSpecialtyIds, specialtyId];

        setSelectedSpecialtyIds(newSelectedSpecialtyIds);
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
            specialtyList={hospitalData.specialtyList}
            selectedAnimals={selectedAnimalIds}
            selectedSpecialties={selectedSpecialtyIds}
            onAnimalFilterChange={handleAnimalFilterChange}
            onSpecialtyFilterChange={handleSpecialtyFilterChange}
            onPageChange={handlePageChange}
        />
    );
};

export default HospListContainer;
