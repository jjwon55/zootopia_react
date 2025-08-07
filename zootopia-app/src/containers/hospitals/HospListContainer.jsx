import React from 'react';
import HospitalList from '../../components/hospitals/HospitalList';

const HospListContainer = ({ hospitalData, selectedAnimalIds, onAnimalFilterChange, onPageChange }) => {
    return (
        <HospitalList
            hospitalList={hospitalData.hospitalList}
            pageInfo={hospitalData.pageInfo}
            animalList={hospitalData.animalList}
            selectedAnimals={selectedAnimalIds}
            onAnimalFilterChange={onAnimalFilterChange}
            onPageChange={onPageChange}
        />
    );
};

export default HospListContainer;
