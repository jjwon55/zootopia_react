import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { join as joinApi, checkEmail, checkNickname } from "../../apis/auth";

export default function Join() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    passwordCheck: "",
    nickname: "",
    phone: "",
  });

  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const [checkResult, setCheckResult] = useState({
    email: null,    // true: 사용 가능, false: 사용 불가
    nickname: null, // true: 사용 가능, false: 사용 불가
  });

  const [checking, setChecking] = useState({ email: false, nickname: false });

  const setVal = (k, v) => {
    setForm((s) => ({ ...s, [k]: v }));
    // 입력이 바뀌면 다시 확인해야 하므로 결과 초기화
    if (k === "email") setCheckResult((s) => ({ ...s, email: null }));
    if (k === "nickname") setCheckResult((s) => ({ ...s, nickname: null }));
  };

  const touch = (k) => setTouched((s) => ({ ...s, [k]: true }));

  // 이메일 중복 확인
  const handleCheckEmail = async () => {
    if (!form.email) return touch("email");
    try {
      setChecking((s) => ({ ...s, email: true }));
      const res = await checkEmail(form.email);
      setCheckResult((s) => ({ ...s, email: res.data.available }));
      if (!res.data.available) touch("email");
    } catch (err) {
      setCheckResult((s) => ({ ...s, email: false }));
    } finally {
      setChecking((s) => ({ ...s, email: false }));
    }
  };

  // 닉네임 중복 확인
  const handleCheckNickname = async () => {
    if (!form.nickname) return touch("nickname");
    try {
      setChecking((s) => ({ ...s, nickname: true }));
      const res = await checkNickname(form.nickname);
      setCheckResult((s) => ({ ...s, nickname: res.data.available }));
      if (!res.data.available) touch("nickname");
    } catch (err) {
      setCheckResult((s) => ({ ...s, nickname: false }));
    } finally {
      setChecking((s) => ({ ...s, nickname: false }));
    }
  };

  // 유효성 검사
  const errors = useMemo(() => {
    const e = {};
    if (!form.email) e.email = "이메일을 입력하세요.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "이메일 형식이 올바르지 않습니다.";
    else if (checkResult.email === false) e.email = "이미 사용 중인 이메일입니다.";

    if (!form.password) e.password = "비밀번호를 입력하세요.";
    else if (form.password.length < 6) e.password = "비밀번호는 최소 6자 이상입니다.";

    if (!form.passwordCheck) e.passwordCheck = "비밀번호를 다시 입력하세요.";
    else if (form.password !== form.passwordCheck) e.passwordCheck = "비밀번호가 일치하지 않습니다.";

    if (!form.nickname) e.nickname = "닉네임을 입력하세요.";
    else if (checkResult.nickname === false) e.nickname = "이미 사용 중인 닉네임입니다.";

    if (form.phone && !/^\d{9,13}$/.test(form.phone.replace(/[^0-9]/g, ""))) {
      e.phone = "숫자만 9~13자리로 입력하세요.";
    }
    return e;
  }, [form, checkResult]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setTouched({ email: true, password: true, passwordCheck: true, nickname: true, phone: true });

    if (!isValid || loading) return;

    try {
      setLoading(true);
      const res = await joinApi({
        email: form.email,
        password: form.password,
        nickname: form.nickname,
        phone: form.phone,
      });

      const ok =
        res?.status >= 200 &&
        res?.status < 300 &&
        (typeof res?.data !== "string" || res.data?.toUpperCase?.() !== "FAIL");

      if (ok) navigate("/login", { replace: true });
      else setServerError(typeof res?.data === "string" ? res.data : "회원가입에 실패했습니다.");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "회원가입에 실패했습니다. 입력값을 확인해 주세요.";
      setServerError(typeof msg === "string" ? msg : "회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tw:min-h-screen tw:bg-[#f5f5f5] tw:flex tw:flex-col">
      <div className="tw:flex-1 tw:flex tw:items-center tw:justify-center tw:px-4">
        <div className="tw:bg-white tw:w-full tw:max-w-[500px] tw:rounded-2xl tw:shadow-md tw:px-8 tw:py-7">
          <div className="tw:text-center">
            <h2 className="tw:text-[1.6rem] tw:font-bold tw:text-gray-800">회원가입</h2>
            <p className="tw:text-sm tw:text-gray-500 tw:mt-1">Zootopia 가족이 되어주세요</p>
          </div>

          <form className="tw:mt-6" onSubmit={onSubmit} noValidate>
            {/* 이메일 */}
            <div className="tw:mb-3 tw:flex tw:items-center">
              <input
                type="email"
                placeholder="이메일을 입력하세요"
                required
                autoFocus
                className="tw:flex-1 tw:h-14 tw:rounded-l-lg tw:bg-gray-100 tw:px-3 tw:text-sm focus:tw:outline-none focus:tw:bg-gray-200"
                value={form.email}
                onChange={(e) => setVal("email", e.target.value)}
                onBlur={() => touch("email")}
              />
              <button
                type="button"
                className="tw:h-14 tw:px-4 tw:text-sm tw:rounded-r-lg tw:bg-rose-400 tw:text-white hover:tw:bg-rose-500"
                onClick={handleCheckEmail}
              >
                {checking.email ? "확인 중..." : "중복확인"}
              </button>
            </div>
            <div className="tw-flex tw-items-center tw-gap-2">
              {checkResult.email === true && <span className="tw-text-green-500 tw-text-[0.7rem]">사용 가능</span>}
              {/* {checkResult.email === false && <span className="tw-text-red-500 tw-text-[0.7rem]">사용 불가</span>} */}
              {touched.email && errors.email && (
                <span className="tw-text-[0.7rem] tw-text-gray-500">{errors.email}</span>
              )}
            </div>

            {/* 비밀번호 */}
            <div className="tw:mb-3">
              <label className="tw:block tw:text-[0.8rem] tw:font-medium tw:text-gray-800 tw:mb-1">
                비밀번호 <span className="tw:text-rose-400">*</span>
              </label>
              <input
                type="password"
                placeholder="비밀번호를 입력하세요"
                required
                className="tw:w-full tw:h-14 tw:rounded-lg tw:bg-gray-100 tw:px-3 tw:text-sm focus:tw:outline-none focus:tw:bg-gray-200"
                value={form.password}
                onChange={(e) => setVal("password", e.target.value)}
                onBlur={() => touch("password")}
              />
              {touched.password && errors.password && (
                <p className="tw:text-[0.7rem] tw:text-gray-500 tw:mt-1">{errors.password}</p>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div className="tw:mb-3">
              <label className="tw:block tw:text-[0.8rem] tw:font-medium tw:text-gray-800 tw:mb-1">
                비밀번호 확인 <span className="tw:text-rose-400">*</span>
              </label>
              <input
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                required
                className="tw:w-full tw:h-14 tw:rounded-lg tw:bg-gray-100 tw:px-3 tw:text-sm focus:tw:outline-none focus:tw:bg-gray-200"
                value={form.passwordCheck}
                onChange={(e) => setVal("passwordCheck", e.target.value)}
                onBlur={() => touch("passwordCheck")}
              />
              {touched.passwordCheck && errors.passwordCheck && (
                <p className="tw:text-[0.7rem] tw:text-gray-500 tw:mt-1">{errors.passwordCheck}</p>
              )}
            </div>

            {/* 닉네임 */}
            <div className="tw:mb-3 tw:flex tw:items-center">
              <input
                type="text"
                placeholder="닉네임을 입력하세요"
                required
                className="tw:flex-1 tw:h-14 tw:rounded-l-lg tw:bg-gray-100 tw:px-3 tw:text-sm focus:tw:outline-none focus:tw:bg-gray-200"
                value={form.nickname}
                onChange={(e) => setVal("nickname", e.target.value)}
                onBlur={() => touch("nickname")}
              />
              <button
                type="button"
                className="tw:h-14 tw:px-4 tw:text-sm tw:rounded-r-lg tw:bg-rose-400 tw:text-white hover:tw:bg-rose-500"
                onClick={handleCheckNickname}
              >
                {checking.nickname ? "확인 중..." : "중복확인"}
              </button>
            </div>
            <div className="tw-flex tw-items-center tw-gap-2">
              {checkResult.nickname === true && <span className="tw-text-green-500 tw-text-[0.7rem]">사용 가능</span>}
              {/* {checkResult.nickname === false && <span className="tw-text-red-500 tw-text-[0.7rem]">사용 불가</span>} */}
              {touched.nickname && errors.nickname && (
                <span className="tw-text-[0.7rem] tw:text-gray-500">{errors.nickname}</span>
              )}
            </div>

            {/* 전화번호 */}
            <div className="tw:mb-4">
              <label className="tw:block tw:text-[0.8rem] tw:font-medium tw:text-gray-800 tw:mb-1">
                전화번호 <span className="tw:text-gray-400">(선택)</span>
              </label>
              <input
                type="tel"
                placeholder="전화번호를 입력하세요"
                className="tw:w-full tw:h-14 tw:rounded-lg tw:bg-gray-100 tw:px-3 tw:text-sm focus:tw:outline-none focus:tw:bg-gray-200"
                value={form.phone}
                onChange={(e) => setVal("phone", e.target.value)}
                onBlur={() => touch("phone")}
              />
              {touched.phone && errors.phone && (
                <p className="tw:text-[0.7rem] tw:text-gray-500 tw:mt-1">{errors.phone}</p>
              )}
            </div>

            {/* 서버 에러 */}
            {serverError && <div className="tw:mb-3 tw:text-sm tw:text-rose-500">{serverError}</div>}

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={
                !isValid ||
                loading ||
                checkResult.email !== true ||
                checkResult.nickname !== true
              }
              className={`tw:w-full tw:h-12 tw:rounded-lg tw:text-white tw:font-semibold tw:transition
                ${
                  !isValid || loading || checkResult.email !== true || checkResult.nickname !== true
                    ? "tw:bg-rose-300 tw:cursor-not-allowed"
                    : "tw:bg-rose-400 hover:tw:bg-rose-500"
                }`}
            >
              {loading ? "가입 중..." : "회원 가입"}
            </button>

            <div className="tw:text-center tw:mt-3 tw:text-[0.8rem] tw:text-gray-600">
              이미 계정이 있으신가요?{" "}
              <Link to="/login" className="tw:text-rose-500 tw:font-semibold hover:tw:underline">
                로그인
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}