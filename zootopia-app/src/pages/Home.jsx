import React from 'react'
import './Home.css'
import logo from '../assets/img/homelogo.png'
const Home = () => {
  return (
    <>
    <section className="bg-[#FFEFEF] min-h-screen flex items-center">
      <div className="w-full max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-10">
          {/* 로고 */}
          <img
            src={logo}
            alt="로고"
            className="w-[500px] h-auto"
          />
          {/* 소개 문구 */}
          <div className="text-left whitespace-nowrap">
            <p className="font-bold text-3xl md:text-4xl">✏️ 주토피아 Zootopia</p>
            <p className="font-semibold text-2xl md:text-3xl mt-2">반려와 공존, 그리고 사랑의 시작</p>
            <p className="font-semibold text-2xl md:text-3xl mt-2">“세상의 모든 생명에게, 따뜻한 지식이 머무는 곳”</p>
            <p className="font-semibold text-2xl md:text-3xl mt-2">“강아지부터 도마뱀까지, 지구 위 모든 친구들의 공간”</p>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}

export default Home