import React from 'react';
import { Link } from 'react-router-dom';
import pinkArrow from '../../assets/img/pinkarrow.png'; // 있으면 사용, 없으면 Link 텍스트만 남깁니다.

function SectionTitle({ children }) {
  return <h5 className="tw:text-lg tw:font-semibold tw:mb-3">{children}</h5>;
}

export default function MyPageEdit({
  // 프로필 이미지
  profilePreview,
  onChangeProfileFile,
  onSubmitProfileImage,
  profileMsg,
  profileErr,

  // 닉네임 & 소개
  nickname,
  intro,
  onChangeNickname,
  onChangeIntro,
  onSubmitProfileInfo,
  infoMsg,
  infoErr,

  // 반려동물
  pet,
  onChangePetField,
  onSubmitPet,
  petMsg,
  petErr,

  // 비밀번호
  passwords,
  onChangePasswordField,
  onSubmitPassword,
  pwMsg,
  pwErr,

  // 탈퇴
  onDeleteAccount,

  // 상단 링크
  toMypageHref = '/mypage',
}) {
  return (
    <div className="tw:max-w-[700px] tw:mx-auto tw:my-8 tw:px-4">
      {/* 상단으로 돌아가기 */}
      <div className="tw:mb-1">
        <Link
          to={toMypageHref}
          className="tw:inline-flex tw:items-center tw:gap-1 tw:text-[#F35F4C] tw:no-underline hover:tw:underline"
        >
          마이페이지
          {pinkArrow && (
            <img src={pinkArrow} alt="forward" width={15} height={15} />
          )}
        </Link>
      </div>

      <h3 className="tw:text-xl tw:font-bold tw:mb-5">🛠️ 회원 정보 수정</h3>

      {/* 프로필 이미지 업로드 */}
      <div className="tw:bg-white tw:border tw:border-zinc-200 tw:rounded-xl tw:p-4 tw:mb-6">
        <SectionTitle>🖼️ 프로필 이미지</SectionTitle>

        {profileMsg && (
          <div className="tw:bg-green-50 tw:text-green-700 tw:px-3 tw:py-2 tw:rounded-md tw:mb-3">
            {profileMsg}
          </div>
        )}
        {profileErr && (
          <div className="tw:bg-red-50 tw:text-red-700 tw:px-3 tw:py-2 tw:rounded-md tw:mb-3">
            {profileErr}
          </div>
        )}

        <form onSubmit={onSubmitProfileImage} className="tw:space-y-3">
          <input
            type="file"
            name="profileFile"
            accept="image/*"
            onChange={onChangeProfileFile}
            className="tw:block tw:w-full tw:border tw:border-zinc-300 tw:rounded-md tw:px-3 tw:py-2"
            required
          />
          {profilePreview && (
            <img
              src={profilePreview}
              alt="미리보기"
              className="tw:w-24 tw:h-24 tw:rounded-full tw:object-cover"
            />
          )}
          <div className="tw:text-right">
            <button
              type="submit"
              className="tw:inline-flex tw:px-4 tw:py-2 tw:rounded-md tw:bg-zinc-600 tw:text-white hover:tw:bg-zinc-700"
            >
              이미지 업로드
            </button>
          </div>
        </form>
      </div>

      {/* 닉네임 & 소개글 */}
      <div className="tw:bg-white tw:border tw:border-zinc-200 tw:rounded-xl tw:p-4 tw:mb-6">
        <SectionTitle>🧑 닉네임 / 소개글</SectionTitle>

        {infoMsg && (
          <div className="tw:bg-green-50 tw:text-green-700 tw:px-3 tw:py-2 tw:rounded-md tw:mb-3">
            {infoMsg}
          </div>
        )}
        {infoErr && (
          <div className="tw:bg-red-50 tw:text-red-700 tw:px-3 tw:py-2 tw:rounded-md tw:mb-3">
            {infoErr}
          </div>
        )}

        <form onSubmit={onSubmitProfileInfo} className="tw:space-y-3">
          <div>
            <label className="tw:block tw:text-sm tw:mb-1">닉네임</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => onChangeNickname(e.target.value)}
              className="tw:w-full tw:border tw:border-zinc-300 tw:rounded-md tw:px-3 tw:py-2"
              required
            />
          </div>
          <div>
            <label className="tw:block tw:text-sm tw:mb-1">소개글</label>
            <textarea
              rows={3}
              value={intro}
              onChange={(e) => onChangeIntro(e.target.value)}
              className="tw:w-full tw:border tw:border-zinc-300 tw:rounded-md tw:px-3 tw:py-2"
            />
          </div>
          <div className="tw:text-right">
            <button
              type="submit"
              className="tw:inline-flex tw:px-4 tw:py-2 tw:rounded-md tw:bg-blue-600 tw:text-white hover:tw:bg-blue-700"
            >
              정보 저장
            </button>
          </div>
        </form>
      </div>

      {/* 반려동물 정보 */}
      <div className="tw:bg-white tw:border tw:border-zinc-200 tw:rounded-xl tw:p-4 tw:mb-6">
        <SectionTitle>🐶 반려동물 정보</SectionTitle>

        {petMsg && (
          <div className="tw:bg-green-50 tw:text-green-700 tw:px-3 tw:py-2 tw:rounded-md tw:mb-3">
            {petMsg}
          </div>
        )}
        {petErr && (
          <div className="tw:bg-red-50 tw:text-red-700 tw:px-3 tw:py-2 tw:rounded-md tw:mb-3">
            {petErr}
          </div>
        )}

        <form onSubmit={onSubmitPet} className="tw:space-y-3">
          <div>
            <label className="tw:block tw:text-sm tw:mb-1">이름</label>
            <input
              type="text"
              value={pet.name || ''}
              onChange={(e) => onChangePetField('name', e.target.value)}
              className="tw:w-full tw:border tw:border-zinc-300 tw:rounded-md tw:px-3 tw:py-2"
            />
          </div>
          <div>
            <label className="tw:block tw:text-sm tw:mb-1">종(species)</label>
            <input
              type="text"
              value={pet.species || ''}
              onChange={(e) => onChangePetField('species', e.target.value)}
              className="tw:w-full tw:border tw:border-zinc-300 tw:rounded-md tw:px-3 tw:py-2"
            />
          </div>
          <div>
            <label className="tw:block tw:text-sm tw:mb-1">품종(breed)</label>
            <input
              type="text"
              value={pet.breed || ''}
              onChange={(e) => onChangePetField('breed', e.target.value)}
              className="tw:w-full tw:border tw:border-zinc-300 tw:rounded-md tw:px-3 tw:py-2"
            />
          </div>
          <div>
            <label className="tw:block tw:text-sm tw:mb-1">생년월일</label>
            <input
              type="date"
              value={pet.birthDate || ''}
              onChange={(e) => onChangePetField('birthDate', e.target.value)}
              className="tw:w-full tw:border tw:border-zinc-300 tw:rounded-md tw:px-3 tw:py-2"
            />
          </div>
          <div className="tw:text-right">
            <button
              type="submit"
              className="tw:inline-flex tw:px-4 tw:py-2 tw:rounded-md tw:bg-blue-600 tw:text-white hover:tw:bg-blue-700"
            >
              반려동물 저장
            </button>
          </div>
        </form>
      </div>

      {/* 비밀번호 변경 */}
      <div className="tw:bg-white tw:border tw:border-zinc-200 tw:rounded-xl tw:p-4 tw:mb-6">
        <SectionTitle>🔒 비밀번호 변경</SectionTitle>

        {pwMsg && (
          <div className="tw:bg-green-50 tw:text-green-700 tw:px-3 tw:py-2 tw:rounded-md tw:mb-3">
            {pwMsg}
          </div>
        )}
        {pwErr && (
          <div className="tw:bg-red-50 tw:text-red-700 tw:px-3 tw:py-2 tw:rounded-md tw:mb-3">
            {pwErr}
          </div>
        )}

        <form onSubmit={onSubmitPassword} className="tw:space-y-3">
          <div>
            <label className="tw:block tw:text-sm tw:mb-1">현재 비밀번호</label>
            <input
              type="password"
              value={passwords.currentPassword}
              onChange={(e) => onChangePasswordField('currentPassword', e.target.value)}
              placeholder="현재 비밀번호를 입력해 주세요"
              className="tw:w-full tw:border tw:border-zinc-300 tw:rounded-md tw:px-3 tw:py-2"
            />
          </div>
          <div>
            <label className="tw:block tw:text-sm tw:mb-1">새 비밀번호</label>
            <input
              type="password"
              value={passwords.newPassword}
              onChange={(e) => onChangePasswordField('newPassword', e.target.value)}
              placeholder="새 비밀번호를 입력해 주세요"
              className="tw:w-full tw:border tw:border-zinc-300 tw:rounded-md tw:px-3 tw:py-2"
            />
          </div>
          <div>
            <label className="tw:block tw:text-sm tw:mb-1">새 비밀번호 확인</label>
            <input
              type="password"
              value={passwords.newPasswordCheck}
              onChange={(e) => onChangePasswordField('newPasswordCheck', e.target.value)}
              placeholder="새 비밀번호를 입력해 주세요"
              className="tw:w-full tw:border tw:border-zinc-300 tw:rounded-md tw:px-3 tw:py-2"
            />
          </div>
          <div className="tw:text-right">
            <button
              type="submit"
              className="tw:inline-flex tw:px-4 tw:py-2 tw:rounded-md tw:bg-blue-600 tw:text-white hover:tw:bg-blue-700"
            >
              비밀번호 변경
            </button>
          </div>
        </form>
      </div>

      {/* 회원 탈퇴 */}
      <div className="tw:bg-white tw:border tw:border-red-200 tw:rounded-xl tw:p-4">
        <h5 className="tw:text-lg tw:font-semibold tw:text-red-600">👋 회원 탈퇴</h5>
        <p className="tw:text-sm tw:text-zinc-500 tw:mt-1">
          탈퇴 시 모든 정보가 삭제되며 복구할 수 없습니다.
        </p>
        <div className="tw:text-right tw:mt-3">
          <button
            type="button"
            onClick={onDeleteAccount}
            className="tw:inline-flex tw:px-4 tw:py-2 tw:rounded-md tw:border tw:border-red-500 tw:text-red-600 hover:tw:bg-red-50"
          >
            회원 탈퇴
          </button>
        </div>
      </div>
    </div>
  );
}
