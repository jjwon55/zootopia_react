import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getMyPets, uploadPetPhoto, createPet, deletePet as deletePetApi } from '../../apis/parttime/parttime.js'

const Update = ({ form, onChange, onSubmit, onCancel }) => {
  const { jobId: paramJobId } = useParams()
  const id = form?.jobId ?? form?.id ?? paramJobId

  const [petsList, setPetsList] = useState([])
  const [selectedPets, setSelectedPets] = useState(form?.petIds ?? [])
  const [newPet, setNewPet] = useState({ name: '', species: '', age: '', photo: null, preview: null })
  const [loadingPet, setLoadingPet] = useState(false)

  // 마운트 시 펫 리스트 가져오기
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await getMyPets()
        setPetsList(res?.data?.pets ?? [])
      } catch (err) {
        console.error('펫 리스트 가져오기 실패', err)
      }
    }
    fetchPets()
  }, [])

  // 파일 업로드 처리
  const handleFileChange = e => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setNewPet(prev => ({ ...prev, photo: file, preview: reader.result }))
    reader.readAsDataURL(file)
  }

  // 새 펫 등록
  const handleAddPet = async () => {
    if (!newPet.name || !newPet.species) {
      alert('펫 이름과 종은 필수입니다.')
      return
    }
    try {
      setLoadingPet(true)
      let photoUrl = ''
      if (newPet.photo) {
        const uploadRes = await uploadPetPhoto(newPet.photo)
        photoUrl = uploadRes?.data?.url ?? ''
      }
      const res = await createPet({ ...newPet, photoUrl })
      if (res?.data?.ok) {
        const addedPet = { petId: res.data.petId, ...newPet, photoUrl }
        setPetsList(prev => [...prev, addedPet])
        setSelectedPets(prev => [...prev, res.data.petId])
        setNewPet({ name: '', species: '', age: '', photo: null, preview: null })
      } else {
        alert('펫 등록 실패')
      }
    } catch (err) {
      console.error(err)
      alert('펫 등록 중 오류 발생')
    } finally {
      setLoadingPet(false)
    }
  }

  // 펫 선택/해제
  const toggleSelectPet = petId => {
    setSelectedPets(prev => prev.includes(petId) ? prev.filter(id => id !== petId) : [...prev, petId])
  }

  // 펫 삭제
  const handleRemovePet = async petId => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return
    try {
      await deletePetApi(petId)
      setPetsList(prev => prev.filter(p => p.petId !== petId))
      setSelectedPets(prev => prev.filter(id => id !== petId))
    } catch (err) {
      console.error(err)
      alert('펫 삭제 실패')
    }
  }

  // 상대경로 -> 절대경로
  const toAbsUrl = u => {
    if (!u) return ''
    if (/^https?:\/\//i.test(u)) return u
    return `http://localhost:8080${u.startsWith('/') ? u : '/' + u}`
  }

  const handleSubmit = e => {
    e.preventDefault()
    onSubmit({ ...form, jobId: id, petIds: selectedPets })
  }

  return (
    <form onSubmit={handleSubmit} className="tw:bg-gray-50 tw:min-h-screen tw:py-12">
      <div className="tw:max-w-3xl tw:mx-auto tw:bg-white tw:border tw:border-pink-100 tw:rounded-2xl tw:shadow-xl tw:p-6 md:tw:p-10 tw:backdrop-blur-sm">
        <h2 className="tw:text-3xl tw:font-extrabold tw:text-center tw:text-[#F27A7A] tw:mb-12">🐾 아르바이트 수정</h2>

        <input type="hidden" name="jobId" value={id ?? ''} />

        {/* 기본 폼 */}
        <FormInput label="📌 제목" name="title" value={form?.title ?? ''} onChange={onChange} required />
        <FormInput label="📍 지역" name="location" value={form?.location ?? ''} onChange={onChange} required />
        <FormInput label="💰 보수 (원)" name="pay" type="number" value={form?.pay ?? ''} onChange={onChange} min="0" required />

        {/* 근무일 */}
        <div className="tw:mb-6 tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-6">
          <FormInput label="⏰ 시작일" name="startDate" type="date" value={form?.startDate ?? ''} onChange={onChange} required />
          <FormInput label="⏳ 종료일" name="endDate" type="date" value={form?.endDate ?? ''} onChange={onChange} required />
        </div>

        {/* 등록된 펫 리스트 */}
        {petsList.length > 0 && (
          <div className="tw:mb-6 tw:p-4 tw:border tw:border-pink-200 tw:rounded-xl tw:bg-pink-50">
            <h3 className="tw:font-semibold tw:mb-3">🐾 등록된 펫 (클릭으로 선택/해제)</h3>
            <div className="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-3">
              {petsList.map(pet => {
                const selected = selectedPets.includes(pet.petId)
                return (
                  <div
                    key={pet.petId}
                    className={`tw:flex tw:items-center tw:gap-3 tw:border tw:rounded-lg tw:p-2 tw:bg-white tw:cursor-pointer tw:transition tw:duration-200 ${selected ? 'tw:border-[#F27A7A] tw:bg-[#FFF0F0]' : 'tw:border-gray-300'}`}
                    onClick={() => toggleSelectPet(pet.petId)}
                  >
                    {pet.preview || pet.photoUrl ? (
                      <img src={pet.preview ?? toAbsUrl(pet.photoUrl)} alt={pet.name} className="tw:w-16 tw:h-16 tw:object-cover tw:rounded-lg" />
                    ) : (
                      <div className="tw:w-16 tw:h-16 tw:bg-gray-200 tw:rounded-lg tw:flex tw:items-center tw:justify-center tw:text-gray-500">No Img</div>
                    )}
                    <div className="tw:flex-1">
                      <div className="tw:font-semibold">{pet.name}</div>
                      <div className="tw:text-sm tw:text-gray-600">{pet.species} {pet.age && `· ${pet.age}세`}</div>
                    </div>
                    <button type="button" onClick={e => { e.stopPropagation(); handleRemovePet(pet.petId) }} className="tw:bg-red-500 tw:text-white tw:rounded-lg tw:px-2 tw:py-1 hover:tw:bg-red-600">
                      삭제
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 새 펫 등록 */}
        <div className="tw:mb-6 tw:p-4 tw:border tw:border-pink-200 tw:rounded-xl tw:bg-pink-50">
          <h3 className="tw:font-semibold tw:mb-3">🐶 새 펫 등록</h3>
          <div className="tw:flex tw:flex-wrap tw:gap-2 tw:items-center">
            <input placeholder="이름" value={newPet.name} onChange={e => setNewPet(prev => ({ ...prev, name: e.target.value }))} className="tw:border tw:border-gray-300 tw:rounded-lg tw:px-2 tw:py-1" />
            <input placeholder="종" value={newPet.species} onChange={e => setNewPet(prev => ({ ...prev, species: e.target.value }))} className="tw:border tw:border-gray-300 tw:rounded-lg tw:px-2 tw:py-1" />
            <input placeholder="나이" type="number" value={newPet.age} onChange={e => setNewPet(prev => ({ ...prev, age: e.target.value }))} className="tw:border tw:border-gray-300 tw:rounded-lg tw:px-2 tw:py-1 tw:w-20" />
            <input type="file" accept="image/*" onChange={handleFileChange} className="tw:border tw:border-gray-300 tw:rounded-lg tw:px-2 tw:py-1" />
            <button type="button" onClick={handleAddPet} disabled={loadingPet} className="tw:bg-[#F27A7A] tw:text-white tw:rounded-lg tw:px-3 tw:py-1 hover:tw:bg-[#e86e6e] tw:transition tw:duration-200">
              {loadingPet ? '등록 중...' : '등록'}
            </button>
          </div>
          {newPet.preview && (
            <div className="tw:mt-3 tw:w-32 tw:h-32 tw:border tw:border-gray-300 tw:rounded-lg tw:overflow-hidden tw:shadow-sm">
              <img src={newPet.preview} alt="미리보기" className="tw:w-full tw:h-full tw:object-cover" />
            </div>
          )}
        </div>

        {/* 메모 */}
        <div className="tw:mb-10">
          <label htmlFor="memo" className="tw:block tw:font-semibold tw:mb-2">📝 요청 메모</label>
          <textarea id="memo" name="memo" rows="6" value={form?.memo ?? ''} onChange={onChange} className="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-3 tw:py-3 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#F27A7A]/50" />
        </div>

        {/* 버튼 */}
        <div className="tw:flex tw:justify-center tw:gap-4 tw:flex-wrap">
          <button type="button" onClick={onCancel} className="tw:inline-flex tw:items-center tw:justify-center tw:h-11 tw:w-28 md:tw:w-32 tw:text-sm tw:font-medium tw:rounded-lg tw:border tw:border-[#F27A7A] tw:text-[#F27A7A] tw:bg-white hover:tw:bg-[#F27A7A]/10">
            취소
          </button>
          <button type="submit" className="tw:inline-flex tw:items-center tw:justify-center tw:h-11 tw:w-28 md:tw:w-32 tw:text-sm tw:font-semibold tw:rounded-lg tw:bg-[#F27A7A] tw:text-white hover:tw:bg-[#e86e6e]">
            수정
          </button>
        </div>
      </div>
    </form>
  )
}

const FormInput = ({ label, name, type = 'text', value, onChange, required, min }) => (
  <div className="tw:mb-6">
    <label htmlFor={name} className="tw:block tw:font-semibold tw:mb-2">{label}</label>
    <input
      type={type}
      id={name}
      name={name}
      value={value ?? ''}
      onChange={onChange}
      min={min}
      required={required}
      className="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-3 tw:py-3 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-[#F27A7A]/50"
    />
  </div>
)

export default Update