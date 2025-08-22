import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { LoginContext } from '../../context/LoginContextProvider';
import logo from '../../assets/img/zootopialogo.png';
import logoutIcon from '../../assets/img/logout.png';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { MessageContext } from '../../context/MessageContextProvider';
import MessageBoxModal from '../message/MessageBoxModal';
import SendMessageModal from '../message/SendMessageModal';

const Header = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // --- 모달 상태 관리 ---
  const [isMessageBoxOpen, setMessageBoxOpen] = useState(false);
  const [isSendMessageModalOpen, setSendMessageModalOpen] = useState(false);
  const [sendMessageRecipient, setSendMessageRecipient] = useState(null);
  // --------------------

  // --- 모달 핸들러 ---
  const handleOpenMessageBox = () => setMessageBoxOpen(true);
  const handleCloseMessageBox = () => setMessageBoxOpen(false);

  const handleOpenSendMessage = (recipient) => {
    setSendMessageRecipient(recipient);
    setSendMessageModalOpen(true);
  };

  const handleCloseSendMessage = () => {
    setSendMessageModalOpen(false);
    setSendMessageRecipient(null);
  };

  const handleReplyFromMessageBox = (recipient) => {
    handleCloseMessageBox();
    setTimeout(() => {
      handleOpenSendMessage(recipient);
    }, 300);
  };
  // --------------------

  const { logout, isLogin, userInfo } = useContext(LoginContext);
  const { unreadCount } = useContext(MessageContext);

  const nickname = userInfo?.nickname;
  const profileImage = userInfo?.profileImg || '/assets/img/default-profile.png';

  const Menus = [
  { to: '/', label: '홈' },
  { to: '/products/listp', label: '스토어' },
  { to: '/map', label: '내 주변 찾기' },
  // 서브메뉴 추가 예시
  {
    label: '서비스',
    submenu: [
      { to: '/parttime/list', label: '아르바이트' },
      { to: '/insurance/list', label: '펫 보험' },
      { to: '/service/hospitals/hospitallist', label: '추천 병원' },
      { to: '/service/funeral/procedure', label: 'Cross the Rainbow Bridge' },
    ],
  },
  { to: '/posts', label: '커뮤니티',
    submenu: [
    { to:'/posts', label: '자유게시판'},
    { to:'/showoff', label: '자랑게시판'},
    { to:'/lost', label: '유실동물 게시판'},
    ]
  },
];


  // 뱃지 스타일 (추가)
    const badgeStyle = {
        backgroundColor: 'red',
        color: 'white',
        borderRadius: '50%',
        padding: '2px 6px',
        fontSize: '12px',
        marginLeft: '5px',
        verticalAlign: 'super',
    };


  return (
    <>
      <nav className="tw:bg-white tw:sticky tw:top-0 tw:z-[1000]">
        {/* 컨테이너 */}
        <div className="tw:container tw:mx-auto tw:px-4 tw:h-[100px] tw:flex tw:items-center tw:gap-4">
          {/* 모바일 토글 버튼 */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setIsMobileOpen(true)}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* 로고 */}
          <Link to="/" className="tw:flex tw:items-center tw:no-underline">
            <div className="tw:w-[200px] tw:h-[100px] tw:flex tw:items-center">
              <img
                src={logo}
                alt="Zootopia Logo"
                className="tw:w-[200px] tw:h-[150px] tw:object-contain"
              />
            </div>
          </Link>

          {/* 메인 메뉴 (데스크톱) */}
          <div className="tw:flex-1 tw:hidden tw:lg:flex tw:justify-center tw:relative">
            <ul className="tw:flex tw:items-center tw:gap-6 tw:xl:gap-8">
              {Menus.map((item, idx) => (
                <li
                  key={item.to || item.label}
                  className="tw:relative"
                  onMouseEnter={() => item.submenu && setHoveredIndex(idx)}
                  onMouseLeave={() => item.submenu && setHoveredIndex(null)}
                >
                  {item.submenu ? (
                    <>
                      <span
                        className="tw:text-[18px] tw:text-gray-700 tw:px-2 tw:py-1 tw:rounded-md tw:hover:text-[#ff6b6b] tw:hover:bg-[#ff6b6b1a] tw:cursor-pointer"
                      >
                        {item.label}
                      </span>
                      {/* 서브메뉴 패널 */}
                      {hoveredIndex === idx && (
                        <div
                          className={`tw:absolute tw:top-[110%] tw:left-1/2 tw:-translate-x-1/2 tw:bg-white tw:shadow-lg tw:rounded-3xl tw:py-2 tw:min-w-[160px] tw:z-[100] 
                          tw:transition-all tw:duration-300 tw:ease-in-out
                          tw:opacity-100 tw:translate-y-0 tw:pointer-events-auto`}
                        >
                          {item.submenu.map((sub, subIdx) => (
                            <Link
                              key={sub.to}
                              to={sub.to}
                              className="tw:block tw:text-center tw:justify-center tw:px-4 tw:py-2 tw:text-[gray-700] tw:hover:text-[#ff6b6b] tw:hover:bg-[#ff6b6b1a] tw:rounded-3xl tw:no-underline tw:transition"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.to}
                      className="tw:text-[18px] tw:text-gray-700 tw:hover:text-[#ff6b6b] tw:no-underline tw:px-2 tw:py-1 tw:rounded-md tw:hover:bg-[#ff6b6b1a] tw:transition"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            {/* Fade-in 애니메이션 정의 */}
            {/* <style>{`
              @keyframes fadein {
                from { opacity: 0; transform: translateY(-10px);}
                to { opacity: 1; transform: translateY(0);}
              }
              .tw:animate-fadein {
                animation: fadein 0.25s ease;
                opacity: 1 !important;
              }
            `}</style> */}
          </div>

          {/* 로그인/회원가입 또는 사용자 메뉴 (데스크톱) */}
          <div className="tw:hidden tw:lg:flex tw:items-center tw:gap-3 tw:relative">
            {!isLogin ? (
            
              <div className="tw:flex tw:items-center tw:gap-2">
                <Link
                  to="/login"
                  className="tw:inline-block tw:bg-[#F27A7A] tw:border tw:border-[#F27A7A] tw:text-white tw:px-4 tw:py-2 tw:rounded tw:text-[0.9rem] tw:no-underline tw:hover:brightness-95 tw:transition"
                >
                  로그인
                </Link>
                <Link
                  to="/join"
                  className="tw:inline-block tw:bg-transparent tw:border tw:border-[#F27A7A] tw:text-[#F27A7A] tw:px-4 tw:py-2 tw:rounded tw:text-[0.9rem] tw:no-underline tw:hover:bg-[#F27A7A] tw:hover:text-white tw:transition"
                >
                  회원가입
                </Link>
              </div>
            ) : (
              <div className="tw:flex tw:items-center tw:gap-2">
                <button onClick={handleOpenMessageBox} className="tw:bg-transparent tw:border-none tw:cursor-pointer tw:p-0 tw:text-gray-700 hover:tw:text-[#ff6b6b] tw:font-sans tw:text-base">
                  쪽지함
                  {/* unreadCount가 0보다 클 때만 뱃지를 표시 (추가) */}
                  {unreadCount > 0 && <span style={badgeStyle}>{unreadCount}</span>}
                </button>
                {/* 유저 드롭다운 */}
                <div className="tw:relative">
                  <img
                    src={profileImage}
                    alt="프로필"
                    className="tw:w-10 tw:h-10 tw:rounded-full tw:cursor-pointer"
                    onClick={() => setIsUserMenuOpen((v) => !v)}
                  />
                  {isUserMenuOpen && (
                    <div className="tw:absolute tw:top-[calc(100%+10px)] tw:-left-8 tw:w-80 tw:shadow-[0_8px_16px_-4px_rgba(255,107,107,0.28)] tw:bg-[#fdfdfd] tw:rounded-md tw:p-5">
                      <div className="tw:flex tw:items-center tw:gap-4">
                        <img
                          src={profileImage}
                          alt="프로필"
                          className="tw:w-14 tw:h-14 tw:rounded-full"
                        />
                        <h5 className="tw:m-0 tw:text-[16px] tw:font-medium">{nickname}</h5>
                      </div>
                      <hr className="tw:my-4 tw:border-t tw:border-[#ccc]" />
                      <Link
                        to="/mypage"
                        className="tw:flex tw:items-center tw:gap-4 tw:no-underline tw:text-black tw:py-2 tw:hover:font-semibold"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <img
                          src={profileImage}
                          alt="프로필"
                          className="tw:w-10 tw:h-10 tw:rounded-full tw:bg-[#e5e5e5] tw:p-2"
                        />
                        <p className="tw:m-0">마이 페이지</p>
                      </Link>
                      <button
                        onClick={logout}
                        className="tw:flex tw:items-center tw:gap-4 tw:w-full tw:text-left tw:py-2 tw:hover:font-semibold"
                      >
                        <img
                          src={logoutIcon}
                          alt=""
                          className="tw:w-10 tw:h-10 tw:rounded-full tw:bg-[#e5e5e5] tw:p-2"
                        />
                        <p className="tw:m-0">로그아웃</p>
                      </button>
                    </div>
                  )}
                </div>
                <span className="tw:text-gray-500 tw:text-[0.9rem]">환영합니다, {nickname}님</span>
                <button
                  onClick={logout}
                  className="tw:bg-[#ff6b6b] tw:hover:bg-[#ff5252] tw:text-white tw:text-sm tw:px-3 tw:py-1.5 tw:rounded"
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 오프캔버스 메뉴 (모바일) */}
        <div
          className={`tw:fixed tw:inset-0 tw:z-[1100] ${isMobileOpen ? 'tw:pointer-events-auto' : 'tw:pointer-events-none'}`}
          aria-hidden={!isMobileOpen}
        >
          {/* 배경 */}
          <div
            className={`tw:absolute tw:inset-0 tw:bg-black/40 tw:transition-opacity ${isMobileOpen ? 'tw:opacity-100' : 'tw:opacity-0'}`}
            onClick={() => setIsMobileOpen(false)}
          />
          {/* 패널 */}
          <aside
            className={`tw:absolute tw:right-0 tw:top-0 tw:h-full tw:w-80 tw:bg-white tw:shadow-xl tw:transition-transform ${isMobileOpen ? 'tw:translate-x-0' : 'tw:translate-x-full'}`}
          >
            <div className="tw:flex tw:items-center tw:justify-between tw:px-4 tw:h-14 tw:border-b">
              <h5 className="tw:text-base tw:font-semibold">메뉴</h5>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="tw:w-9 tw:h-9 tw:inline-flex tw:items-center tw:justify-center tw:rounded-md tw:border tw:border-gray-200"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <div className="tw:p-4">
              <ul className="tw:flex tw:flex-col tw:gap-1">
                {[
                  { to: '/', label: '홈' },
                  { to: '/products/listp', label: '스토어' },
                  { to: '/map', label: '내 주변 찾기' },
                  { to: '/insurance/list', label: '서비스' },
                  { to: '/posts/list', label: '커뮤니티' },
                ].map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={() => setIsMobileOpen(false)}
                      className="tw:block tw:px-3 tw:py-3 tw:text-gray-700 tw:hover:bg-gray-50 tw:rounded tw:no-underline"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {!isLogin ? (
                <div className="tw:flex tw:flex-col tw:gap-2 tw:mt-4">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileOpen(false)}
                    className="tw:border tw:border-blue-500 tw:text-blue-600 tw:text-sm tw:px-3 tw:py-2 tw:rounded tw:text-center tw:no-underline"
                  >
                    로그인
                  </Link>
                  <Link
                    to="/join"
                    onClick={() => setIsMobileOpen(false)}
                    className="tw:bg-blue-600 tw:text-white tw:text-sm tw:px-3 tw:py-2 tw:rounded tw:text-center tw:no-underline"
                  >
                    회원가입
                  </Link>
                </div>
              ) : (
                <div className="tw:flex tw:flex-col tw:gap-2 tw:mt-4">
                  <span className="tw:text-gray-500 tw:text-sm">환영합니다, {nickname}님</span>
                  <button
                    onClick={() => {
                      setIsMobileOpen(false);
                      logout();
                    }}
                    className="tw:border tw:border-red-500 tw:text-red-600 tw:text-sm tw:px-3 tw:py-2 tw:rounded"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      </nav>

      {/* ===== MODALS ===== */}
      {isLogin && (
        <>
          <MessageBoxModal open={isMessageBoxOpen} onClose={handleCloseMessageBox} onReply={handleReplyFromMessageBox} />
          <SendMessageModal open={isSendMessageModalOpen} onClose={handleCloseSendMessage} recipient={sendMessageRecipient} />
        </>
      )}
    </>
  );
};

export default Header;
