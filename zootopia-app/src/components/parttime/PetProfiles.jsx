import React, { useState } from 'react'

const PetProfiles = ({ pets }) => {
  const [selectedPet, setSelectedPet] = useState(null)

  const toAbsUrl = (url) => url.startsWith('http') ? url : `http://192.168.30.51:8080${url}`

  if (!pets || pets.length === 0) return <div className='tw:mt-4 tw:mb-4'>펫 정보가 없습니다.</div>

  return (
    <div className="tw:mt-4 tw:space-y-4">
      <h4 className="tw:font-bold tw:text-[#F27A7A] tw:text-lg">🐶🐱 펫 프로필</h4>

      {/* 버튼만 출력 */}
      {pets.map(pet => (
        <button
          key={pet.petId}
          className="tw:min-w-[120px] tw:px-4 tw:mb-5 tw:py-2 tw:bg-[#F27A7A] tw:text-white tw:rounded-lg tw:text-sm tw:font-medium hover:tw:bg-[#e86e6e] active:tw:bg-[#d86464] tw:transition-colors tw:duration-200"
          onClick={() => setSelectedPet(pet)}
        >
          {pet.name} 프로필 보기
        </button>
      ))}

      {/* 모달 */}
      {selectedPet && (
        <div className="tw:fixed tw:inset-0 tw:bg-black/50 tw:flex tw:items-center tw:justify-center tw:z-50">
          <div className="tw:bg-white tw:rounded-xl tw:p-6 tw:w-80 tw:max-w-full tw:relative">
            <button
              className="tw:absolute tw:top-2 tw:right-2 tw:text-gray-500 hover:tw:text-gray-700"
              onClick={() => setSelectedPet(null)}
            >
              ✕
            </button>
            <h3 className="tw:font-bold tw:text-xl tw:mb-4">{selectedPet.name}</h3>
            {selectedPet.photoUrl && (
              <img src={toAbsUrl(selectedPet.photoUrl)} alt={selectedPet.name} className="tw:w-full tw:h-48 tw:object-cover tw:rounded-lg tw:mb-4" />
            )}
            <div><strong>종류:</strong> {selectedPet.species ?? '정보 없음'}</div>
            <div><strong>나이:</strong> {selectedPet.age ?? '정보 없음'}</div>
            <div><strong>성별:</strong> {selectedPet.gender ?? '정보 없음'}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PetProfiles