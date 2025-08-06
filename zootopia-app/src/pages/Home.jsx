import React from 'react'
import './Home.css'
import logo from '../assets/img/homelogo.png'
const Home = () => {
  return (
    <>
      {/* <Header /> */}

      <section className="main">
        <div className="container">
        {/* 로고 */}
        <img src={logo} alt="로고" className="main-logo" />

        {/* 소개 문구 */}
        <div className="text">
          <p className="main-title">✏️ 주토피아 Zootopia</p>
          <p className="main-title">반려와 공존, 그리고 사랑의 시작</p>
          <p className="main-title">“세상의 모든 생명에게, 따뜻한 지식이 머무는 곳”</p>
          <p className="main-title">“강아지부터 도마뱀까지, 지구 위 모든 친구들의 공간”</p>
        </div>
        </div>

      </section>
      {/* <Footer /> */}
    </>
  )
}

export default Home