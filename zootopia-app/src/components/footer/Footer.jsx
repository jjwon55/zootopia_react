import React from "react";
import fbIcon from '../../assets/img/icon_bt_fb.png'
import istaIcon from '../../assets/img/icon_bt_ista.png'
import ytIcon from '../../assets/img/icon_bt_yt.png'

const Footer = () => {
  return (
    <footer className="tw:bg-[#292929] tw:py-10 tw:text-white tw:text-sm">
      <div className="tw:mx-auto tw:max-w-[1200px] tw:px-4">
        {/* Main Grid: 4 columns at large, stacked on mobile */}
        <div className="tw:flex tw:flex-wrap md:tw:flex-nowrap tw:gap-12">
          {/* LEFT: Zootopia + mission + social */}
          <div className="tw:flex-1 tw:min-w-[200px]">
            <h6 className="tw:text-[#F27A7A] tw:font-bold tw:text-base tw:mb-2">Zootopia</h6>
            <p className="tw:text-[#ccc] tw:mb-2">
              반려동물과 함께하는 행복한 일상을 만들어갑니다.
            </p>
            <div className="tw:mt-6">
              <span className="tw:text-[#F27A7A] tw:font-semibold tw:text-base">소셜미디어</span>
              <div className="tw:flex tw:gap-3 tw:mt-3">
                {/* 실제 아이콘은 React-icons 권장, 여기선 기본 예제 */}
                <a href="#" aria-label="facebook" className="tw:w-9 tw:h-9 tw:rounded-full tw:flex tw:items-center tw:justify-center hover:tw:bg-[#F27A7A]">
                  <img src={fbIcon} alt="facebook" />
                </a>
                <a href="#" aria-label="instagram" className="tw:w-9 tw:h-9 tw:rounded-full tw:flex tw:items-center tw:justify-center hover:tw:bg-[#F27A7A]">
                  <img src={istaIcon} alt="insta" />
                </a>
                <a href="#" aria-label="youtube" className="tw:w-9 tw:h-9 tw:rounded-full tw:flex tw:items-center tw:justify-center hover:tw:bg-[#F27A7A]">
                  <img src={ytIcon} alt="youtube" />
                </a>
              </div>
            </div>
          </div>
          {/* CENTER-LEFT: 서비스 */}
          <div className="tw:flex-1 tw:min-w-[180px] tw:mt-7 md:tw:mt-0">
            <div className="tw:text-[#F27A7A] tw:font-semibold tw:mb-2">서비스</div>
            <ul>
              <li className="tw:mb-1"><a href="#" className="hover:tw:text-[#F27A7A]">서비스 가이드</a></li>
              <li className="tw:mb-1"><a href="#" className="hover:tw:text-[#F27A7A]">스토어</a></li>
              <li className="tw:mb-1"><a href="#" className="hover:tw:text-[#F27A7A]">내 주변 찾기</a></li>
              <li className="tw:mb-1"><a href="#" className="hover:tw:text-[#F27A7A]">커뮤니티</a></li>
            </ul>
          </div>
          {/* CENTER-RIGHT: Information */}
          <div className="tw:flex-1 tw:min-w-[180px] tw:mt-7 md:tw:mt-0">
            <div className="tw:text-[#F27A7A] tw:font-semibold tw:mb-2">INFORMATION</div>
            <ul>
              <li className="tw:mb-1"><a href="#" className="hover:tw:text-[#F27A7A]">자주 묻는 질문</a></li>
              <li className="tw:mb-1"><a href="#" className="hover:tw:text-[#F27A7A]">고객센터</a></li>
              <li className="tw:mb-1"><a href="#" className="hover:tw:text-[#F27A7A]">배송 정보</a></li>
            </ul>
          </div>
          {/* RIGHT: 뉴스레터 */}
          <div className="tw:flex-1 tw:min-w-[220px] tw:mt-7 md:tw:mt-0">
            <div className="tw:text-[#F27A7A] tw:font-semibold tw:mb-2">뉴스레터</div>
            <p className="tw:text-[#ccc] tw:text-sm tw:mb-3">
              반려동물 케어 정보와 특가 소식을 받아보세요
            </p>
            <form className="tw:flex">
              <input
                type="email"
                placeholder="이메일 주소"
                className="tw:flex-1 tw:rounded-l-md tw:bg-[#444] tw:text-[#ececec] tw:border-0 tw:px-3 tw:py-2 tw:text-sm placeholder:tw:text-[#aaa] focus:tw:outline-none"
              />
              <button
                type="submit"
                className="tw:rounded-r-md tw:bg-[#F27A7A] tw:text-white tw:w-14 tw:text-sm tw:font-semibold hover:tw:bg-[#ce5252]"
              >
                구독
              </button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
