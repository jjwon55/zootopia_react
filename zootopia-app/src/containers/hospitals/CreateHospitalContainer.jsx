import React from 'react'
import CreateHospitalComponent from '../../components/hospitals/CreateHospitalComponent'


const CreateHospitalContainer = ({ hospitalData, isAdmin }) => {
  return (
    <CreateHospitalComponent hospitalData={hospitalData} isAdmin={isAdmin} />
  );
}

export default CreateHospitalContainer