import React, { useEffect, useMemo, useState } from 'react';
import MyPageEdit from '../../components/mypage/MyPageEdit';
import {
  getMyPage,
  updateProfileImage,
  updateProfileInfo,
  updatePet,
  updatePassword,
  deleteAccount,
} from '../../apis/posts/mypage';

// 날짜를 yyyy-MM-dd 로 변환
const toDateInputValue = (d) => {
  if (!d) return '';
  const dt = typeof d === 'string' ? new Date(d) : d;
  if (Number.isNaN(dt.getTime())) return '';
  return dt.toISOString().slice(0, 10);
};

export default function MyPageEditContainer() {
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState('');

  // 사용자/펫 기본 데이터
  const [user, setUser] = useState(null);
  const [pet, setPet] = useState({ name: '', species: '', breed: '', birthDate: '' });

  // 프로필 이미지 업로드
  const [profileFile, setProfileFile] = useState(null);
  const [profileMsg, setProfileMsg] = useState('');
  const [profileErr, setProfileErr] = useState('');

  // 닉네임/소개
  const [nickname, setNickname] = useState('');
  const [intro, setIntro] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [infoErr, setInfoErr] = useState('');

  // 비밀번호
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    newPasswordCheck: '',
  });
  const [pwMsg, setPwMsg] = useState('');
  const [pwErr, setPwErr] = useState('');

  // 프로필 미리보기
  const profilePreview = useMemo(() => {
    if (profileFile) return URL.createObjectURL(profileFile);
    if (user?.profileImg) {
      const src = user.profileImg;
      if (/^https?:\/\//i.test(src)) return src;
      if (src.startsWith('/api/')) return src;
      if (src.startsWith('/')) return `/api${src}`;
      return `/api/${src}`;
    }
    return '';
  }, [profileFile, user]);

  // 최초 로드
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getMyPage();
        const data = res.data?.data || {};
        setUser(data.user || null);

        // 닉/소개 채우기
        setNickname(data.user?.nickname || '');
        setIntro(data.user?.intro || '');

        // 펫(단일 사용 가정: 첫 번째만 바인딩)
        const p = (data.pets && data.pets[0]) || {};
        setPet({
          name: p.name || '',
          species: p.species || '',
          breed: p.breed || '',
          birthDate: toDateInputValue(p.birthDate) || '',
        });
      } catch (err) {
        console.error(err);
        setLoadErr(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            '회원 정보를 불러오지 못했습니다.'
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Handlers
  const onChangeProfileFile = (e) => {
    setProfileErr('');
    setProfileMsg('');
    const file = e.target.files?.[0];
    setProfileFile(file || null);
  };

  const onSubmitProfileImage = async (e) => {
    e.preventDefault();
    setProfileErr('');
    setProfileMsg('');
    if (!profileFile) {
      setProfileErr('업로드할 파일을 선택하세요.');
      return;
    }
    try {
      const fd = new FormData();
      fd.append('profileFile', profileFile);
      const res = await updateProfileImage(fd);
      const newPath = res.data?.data?.profileImg;
      setProfileMsg(res.data?.message || '프로필 이미지가 수정되었습니다.');
      // 화면 즉시 반영
      setUser((prev) => ({ ...(prev || {}), profileImg: newPath }));
      setProfileFile(null);
    } catch (err) {
      console.error(err);
      setProfileErr(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          '프로필 이미지 업로드에 실패했습니다.'
      );
    }
  };

  const onSubmitProfileInfo = async (e) => {
    e.preventDefault();
    setInfoErr('');
    setInfoMsg('');
    try {
      const res = await updateProfileInfo(nickname, intro);
      setInfoMsg(res.data?.message || '닉네임 및 소개글이 수정되었습니다.');
      // 반영
      setUser((prev) => ({ ...(prev || {}), nickname, intro }));
    } catch (err) {
      console.error(err);
      setInfoErr(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          '닉네임/소개 저장에 실패했습니다.'
      );
    }
  };

  const onChangePetField = (key, value) => {
    // date는 yyyy-MM-dd 유지
    setPet((prev) => ({ ...prev, [key]: value }));
    setPetMsg('');
    setPetErr('');
  };

  const [petMsg, setPetMsg] = useState('');
  const [petErr, setPetErr] = useState('');

  const onSubmitPet = async (e) => {
    e.preventDefault();
    setPetErr('');
    setPetMsg('');
    try {
      // 백엔드가 userId는 인증에서 결정하므로 그대로 전송
      const res = await updatePet({
        name: pet.name || null,
        species: pet.species || null,
        breed: pet.breed || null,
        birthDate: pet.birthDate || null,
      });
      setPetMsg(res.data?.message || '반려동물 정보가 저장되었습니다.');
    } catch (err) {
      console.error(err);
      setPetErr(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          '반려동물 정보 저장에 실패했습니다.'
      );
    }
  };

  const onChangePasswordField = (key, value) => {
    setPasswords((prev) => ({ ...prev, [key]: value }));
    setPwMsg('');
    setPwErr('');
  };

  const onSubmitPassword = async (e) => {
    e.preventDefault();
    setPwMsg('');
    setPwErr('');
    try {
      const { currentPassword, newPassword, newPasswordCheck } = passwords;
      const res = await updatePassword(currentPassword, newPassword, newPasswordCheck);
      setPwMsg(res.data?.message || '비밀번호가 변경되었습니다.');
      setPasswords({ currentPassword: '', newPassword: '', newPasswordCheck: '' });
    } catch (err) {
      console.error(err);
      setPwErr(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          '비밀번호 변경에 실패했습니다.'
      );
    }
  };

  const onDeleteAccount = async () => {
    // confirm
    if (!window.confirm('정말 탈퇴하시겠습니까? 탈퇴 후 복구할 수 없습니다.')) return;
    try {
      await deleteAccount();
      alert('회원 탈퇴가 완료되었습니다.');
      // 로그아웃/메인 이동 등 후처리
      window.location.href = '/';
    } catch (err) {
      console.error(err);
      alert(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          '탈퇴 중 오류가 발생했습니다.'
      );
    }
  };

  if (loading) {
    return (
      <div className="tw:max-w-[700px] tw:mx-auto tw:py-10 tw:text-center">
        <div className="tw:animate-spin tw:w-6 tw:h-6 tw:border-2 tw:border-zinc-400 tw:border-t-transparent tw:rounded-full tw:mx-auto" />
        <p className="tw:mt-3">불러오는 중…</p>
      </div>
    );
  }

  if (loadErr) {
    return (
      <div className="tw:max-w-[700px] tw:mx-auto tw:py-10">
        <div className="tw:bg-red-50 tw:text-red-700 tw:px-4 tw:py-3 tw:rounded-md">
          {loadErr}
        </div>
      </div>
    );
  }

  return (
    <MyPageEdit
      // 프로필 이미지
      profilePreview={profilePreview}
      onChangeProfileFile={onChangeProfileFile}
      onSubmitProfileImage={onSubmitProfileImage}
      profileMsg={profileMsg}
      profileErr={profileErr}

      // 닉/소개
      nickname={nickname}
      intro={intro}
      onChangeNickname={setNickname}
      onChangeIntro={setIntro}
      onSubmitProfileInfo={onSubmitProfileInfo}
      infoMsg={infoMsg}
      infoErr={infoErr}

      // 펫
      pet={pet}
      onChangePetField={onChangePetField}
      onSubmitPet={onSubmitPet}
      petMsg={petMsg}
      petErr={petErr}

      // 비밀번호
      passwords={passwords}
      onChangePasswordField={onChangePasswordField}
      onSubmitPassword={onSubmitPassword}
      pwMsg={pwMsg}
      pwErr={pwErr}

      // 탈퇴
      onDeleteAccount={onDeleteAccount}

      // 상단 링크
      toMypageHref="/mypage"
    />
  );
}
