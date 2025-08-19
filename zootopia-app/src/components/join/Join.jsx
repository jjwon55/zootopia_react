import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// ✅ 네가 준 API 래퍼 그대로 사용
import { join as joinApi } from "../../apis/auth"; // 경로만 프로젝트에 맞춰 조정

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

  const setVal = (k, v) => setForm((s) => ({ ...s, [k]: v }));
  const touch = (k) => setTouched((s) => ({ ...s, [k]: true }));

  // ✅ 간단 유효성 검사 (프론트)
  const errors = useMemo(() => {
    const e = {};
    if (!form.email) e.email = "이메일을 입력하세요.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "이메일 형식이 올바르지 않습니다.";

    if (!form.password) e.password = "비밀번호를 입력하세요.";
    else if (form.password.length < 6) e.password = "비밀번호는 최소 6자 이상입니다.";

    if (!form.passwordCheck) e.passwordCheck = "비밀번호를 다시 입력하세요.";
    else if (form.password !== form.passwordCheck) e.passwordCheck = "비밀번호가 일치하지 않습니다.";

    if (!form.nickname) e.nickname = "닉네임을 입력하세요.";

    if (form.phone && !/^\d{9,13}$/.test(form.phone.replace(/[^0-9]/g, ""))) {
      e.phone = "숫자만 9~13자리로 입력하세요.";
    }
    return e;
  }, [form]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setTouched({ email: true, password: true, passwordCheck: true, nickname: true, phone: true });
    if (!isValid || loading) return;

    try {
      setLoading(true);
      // ✅ 네가 준 join() 래퍼 사용 (POST /api/users → 프록시로 /users)
      const res = await joinApi({
        email: form.email,
        password: form.password,
        nickname: form.nickname,
        phone: form.phone,
      });

      // 백엔드가 "SUCCESS"/"FAIL" 문자열을 내려줄 수 있으므로 방어
      const ok =
        res?.status >= 200 &&
        res?.status < 300 &&
        (typeof res?.data !== "string" || res.data?.toUpperCase?.() !== "FAIL");

      if (ok) {
        navigate("/login", { replace: true });
      } else {
        setServerError(typeof res?.data === "string" ? res.data : "회원가입에 실패했습니다.");
      }
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
            <div className="tw:mb-3">
              <label className="tw:block tw:text-[0.8rem] tw:font-medium tw:text-gray-800 tw:mb-1">
                아이디 <span className="tw:text-rose-400">*</span>
              </label>
              <input
                type="email"
                placeholder="이메일을 입력하세요"
                required
                autoFocus
                className="tw:w-full tw:h-14 tw:rounded-lg tw:bg-gray-100 tw:px-3 tw:text-sm focus:tw:outline-none focus:tw:bg-gray-200"
                value={form.email}
                onChange={(e) => setVal("email", e.target.value)}
                onBlur={() => touch("email")}
              />
              {touched.email && errors.email && (
                <p className="tw:text-[0.7rem] tw:text-gray-500 tw:mt-1">{errors.email}</p>
              )}
              <p className="tw:text-[0.65rem] tw:text-gray-400 tw:mt-1">회사/공용 이메일은 가급적 피해주세요.</p>
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
            <div className="tw:mb-3">
              <label className="tw:block tw:text-[0.8rem] tw:font-medium tw:text-gray-800 tw:mb-1">
                닉네임 <span className="tw:text-rose-400">*</span>
              </label>
              <div className="tw:relative">
                <input
                  type="text"
                  placeholder="닉네임을 입력하세요"
                  required
                  className="tw:w-full tw:h-14 tw:rounded-lg tw:bg-gray-100 tw:px-3 tw:text-sm tw:pr-24 focus:tw:outline-none focus:tw:bg-gray-200"
                  value={form.nickname}
                  onChange={(e) => setVal("nickname", e.target.value)}
                  onBlur={() => touch("nickname")}
                />
                <button
                  type="button"
                  className="tw:absolute tw:right-1 tw:top-1/2 -tw:translate-y-1/2 tw:h-8 tw:px-3 tw:text-xs tw:rounded tw:bg-rose-400 tw:text-white hover:tw:bg-rose-500"
                  onClick={() => {
                    // 닉네임 중복확인 API 연결 시 여기서 호출
                    touch("nickname");
                  }}
                >
                  중복확인
                </button>
              </div>
              {touched.nickname && errors.nickname && (
                <p className="tw:text-[0.7rem] tw:text-gray-500 tw:mt-1">{errors.nickname}</p>
              )}
            </div>

            {/* 전화번호(선택) */}
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

            {/* 제출 */}
            <button
              type="submit"
              disabled={!isValid || loading}
              className={`tw:w-full tw:h-12 tw:rounded-lg tw:text-white tw:font-semibold tw:transition
                ${!isValid || loading ? "tw:bg-rose-300 tw:cursor-not-allowed" : "tw:bg-rose-400 hover:tw:bg-rose-500"}`}
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
