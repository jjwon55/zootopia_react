import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { LoginContext } from '../../context/LoginContextProvider';

const Header = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { logout, isLogin, userInfo } = useContext(LoginContext); // ✅ context에서 직접 가져오기

  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  const nickname = userInfo?.nickname;
  const profileImage = userInfo?.profileImg || '/assets/img/default-profile.png'; // ✅ 기본 이미지

  return (
    <nav className="zootopia-header-wrapper navbar navbar-expand-lg navbar-light bg-white border-bottom">
      <div className="header-container container-fluid px-4 d-flex justify-content-end" style={{ height: '100px', padding: '10px 0' }}>
        
        {/* 모바일 토글 버튼 */}
        <button className="navbar-toggler d-lg-none ms-auto" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* 로고 */}
        <Link className="navbar-brand" to="/" style={{ textDecoration: 'none' }}>
          <div className="header-logo-container">
            <img src="/assets/dist/img/zootopialogo.png" alt="Zootopia Logo" />
          </div>
        </Link>

        {/* 메인 메뉴 */}
        <div className="main-menu-container">
          <ul className="main-menu navbar-nav mx-auto d-none d-lg-flex">
            <div id="horizontal-underline"></div>
            <li><Link className="nav-link" to="/">홈</Link></li>
            <li><Link className="nav-link" to="/products/listp">스토어</Link></li>
            <li><Link className="nav-link" to="/map/map">내 주변 찾기</Link></li>
            <li><Link className="nav-link" to="/insurance/list">서비스</Link></li>
            <li><Link className="nav-link" to="/posts/list">커뮤니티</Link></li>
          </ul>
        </div>

        {/* 로그인/회원가입 또는 사용자 메뉴 */}
        <div className="d-none d-lg-flex align-items-center" style={{ position: 'relative', zIndex: 1000 }}>
          {!isLogin ? (
            <div className="header-login-btn-container d-flex align-items-center">
              <Link to="/login" className="header-login-btn btn me-2 btn-signup">로그인</Link>
              <Link to="/join" className="header-signup-btn btn btn-outline-danger">회원가입</Link>
            </div>
          ) : (
            <div className="d-flex gap-2 align-items-center">
              {/* 유저 드롭다운 */}
              <div className="user-menu">
                <img
                  src={profileImage}
                  className="user-pic"
                  alt="프로필"
                  onClick={toggleUserMenu}
                />
                {isUserMenuOpen && (
                  <div className="user-sub-menu-wrap" id="userSubMenu">
                    <div className="user-sub-menu">
                      <div className="user-info">
                        <img src={profileImage} alt="프로필" />
                        <h5>{nickname}</h5>
                      </div>
                      <hr />
                      <Link to="/mypage/mypage" className="user-sub-menu-link">
                        <img src={profileImage} alt="프로필" />
                        <p>마이 페이지</p>
                      </Link>
                      <button onClick={logout} className="user-sub-menu-logout">
                        <img src="/assets/dist/img/logout.png" alt="" />
                        <p>로그아웃</p>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <span className="text-muted me-3" style={{ fontSize: '0.9rem' }}>환영합니다, {nickname}님</span>
              <button onClick={logout} className="btn btn-sm btn-danger">로그아웃</button>
            </div>
          )}
        </div>
      </div>

      {/* 오프캔버스 메뉴 (모바일 전용) */}
      <div className="offcanvas offcanvas-end d-lg-none" tabIndex="-1" id="offcanvasNavbar">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasNavbarLabel">메뉴</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
            <li><Link className="nav-link" to="/">홈</Link></li>
            <li><Link className="nav-link" to="/products/listp">스토어</Link></li>
            <li><Link className="nav-link" to="/map/map">내 주변 찾기</Link></li>
            <li><Link className="nav-link" to="/insurance/list">서비스</Link></li>
            <li><Link className="nav-link" to="/posts/list">커뮤니티</Link></li>
          </ul>
          {!isLogin ? (
            <div className="d-flex flex-column gap-2 mt-3">
              <Link to="/login" className="btn btn-outline-primary btn-sm">로그인</Link>
              <Link to="/join" className="btn btn-primary btn-sm">회원가입</Link>
            </div>
          ) : (
            <div className="d-flex flex-column gap-2 mt-3">
              <span className="text-muted small">환영합니다, {nickname}님</span>
              <button onClick={logout} className="btn btn-outline-danger btn-sm w-100">로그아웃</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
