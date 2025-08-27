import React from 'react'

const PetProfiles = ({ pets, onLinkPet }) => {
  if (!pets || pets.length === 0) return <div>펫 정보가 없습니다.</div>

  const toAbsUrl = (url) => url.startsWith('http') ? url : `http://localhost:8080${url}`

  return (
    <div className="tw-mt-4 tw-space-y-4">
      <h4 className="tw-font-bold tw-text-[#F27A7A] tw-text-lg">🐶🐱 펫 프로필</h4>
      {pets.map(pet => (
        <div key={pet.petId} className="tw-flex tw-items-center tw-gap-4 tw-border tw-rounded-xl tw-bg-gray-50 tw-p-3">
          <div>
            <div><strong>이름:</strong> {pet.name}</div>
            <div><strong>종류:</strong> {pet.species ?? '정보 없음'}</div>
            <div><strong>나이:</strong> {pet.age ?? '정보 없음'}</div>
            <div><strong>성별:</strong> {pet.gender ?? '정보 없음'}</div>
          </div>
          {pet.photoUrl && (
            <img src={toAbsUrl(pet.photoUrl)} alt={pet.name} className="tw-w-24 tw-h-24 tw-object-cover tw-rounded-lg" />
          )}
          <button
            className="tw-ml-auto tw-bg-[#F27A7A] tw-text-white tw-px-3 tw-py-1 tw-rounded-md hover:tw-bg-[#e86e6e]"
            onClick={() => onLinkPet(pet)}
          >
            프로필 보기
          </button>
        </div>
      ))}
    </div>
  )
}

export default PetProfiles