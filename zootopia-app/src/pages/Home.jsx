import React from 'react'
import './Home.css'
import logo from '../assets/img/homelogo.png'

const Home = () => {
  return (
    <>
      <section className="tw:min-h-screen tw:flex tw:items-center">
        <div className="tw:w-full tw:max-w-7xl tw:mx-auto tw:px-6">
          <div className="tw:flex tw:flex-col tw:md:flex-row tw:items-center tw:justify-center tw:gap-10">
            {/* 로고 */}
            <img
              src={logo}
              alt="로고"
              className="tw:w-[500px] tw:h-auto"
            />
            {/* 소개 문구 */}
            <div className="tw:text-left tw:whitespace-nowrap">
              <p className="tw:font-bold tw:text-3xl tw:md:text-4xl">✏️ 주토피아 Zootopia</p>
              <p className="tw:font-semibold tw:text-2xl tw:md:text-3xl tw:mt-2">반려와 공존, 그리고 사랑의 시작</p>
              <p className="tw:font-semibold tw:text-2xl tw:md:text-3xl tw:mt-2">“세상의 모든 생명에게, 따뜻한 지식이 머무는 곳”</p>
              <p className="tw:font-semibold tw:text-2xl tw:md:text-3xl tw:mt-2">“강아지부터 도마뱀까지, 지구 위 모든 친구들의 공간”</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
