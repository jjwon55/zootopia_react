import React, { useEffect } from 'react'
import styles from './css/ProcedureComponent.module.css'

const ProcedureComponent = () => {
  return (
    <>
      <div className={`${styles.procedureContainer} tw:w-full tw:bg-gray-50 tw:py-8`}>
        <div className={`${styles.mainContent} tw:max-w-3xl sm:tw:max-w-4xl md:tw:max-w-5xl tw:mx-auto tw:px-4`}>
          
          {/* 사이드 메뉴: 작은 화면에선 가로, 큰 화면에선 세로 배치 */}
          <div className={`${styles.side} tw:flex tw:flex-row tw:sm:flex-col tw:space-x-4 tw:sm:space-x-0 tw:mb-6`}>
            <span className={`s1 ${styles.s1} tw:text-lg tw:sm:text-2xl tw:font-bold tw:text-gray-800`}>
              Cross the<br />Rainbow Bridge
            </span>
            <span className={`s2 ${styles.s2} tw:text-sm tw:sm:text-base tw:text-blue-700`}>
              <a href="/procedure" className="tw:link tw:link-hover">장례 절차</a>
            </span>
            <span className={`s3 ${styles.s3} tw:text-sm sm:tw:text-base tw:text-blue-700`}>
              <a href="/cost" className="tw:link tw:link-hover">장례 및 기타비용</a>
            </span>
          </div>

          {/* 헤드라인 */}
          <span className={`${styles.headline} tw:block tw:mb-6`}>
            <h1 className="tw:text-2xl sm:tw:text-3xl tw:font-bold tw:text-gray-900">장례 절차</h1>
          </span>

          {/* 콘텐츠 본문: 공간과 글자 크기 반응형 */}
          <div className={`${styles.innerContent} tw:space-y-6 sm:tw:space-y-8 tw:text-sm sm:tw:text-base`}>
            
            {/* 준비 */}
            <div className="c1">
              <h3 className="tw:text-lg sm:tw:text-xl tw:font-semibold tw:text-gray-800">준비</h3>
              <ul className="tw:list-disc tw:pl-5 tw:text-gray-700 tw:mt-1">
                <li>매장 장소를 선택하고, 해당 지역이 합법적인지 확인합니다.</li>
                <li>위치 선정, 무덤 파기 등의 준비가 포함됩니다.</li>
              </ul>
            </div>

            {/* 운송 */}
            <div className="c2">
              <h3 className="tw:text-lg sm:tw:text-xl tw:font-semibold tw:text-gray-800">운송</h3>
              <ul className="tw:list-disc tw:pl-5 tw:text-gray-700 tw:mt-1">
                <li>애완동물을 다른 장소에 매장할 경우, 적절한 운송 수단과 컨테이너를 준비합니다.</li>
                <li>애완용 영구차 사용이 가능합니다.</li>
              </ul>
            </div>

            {/* 의식 */}
            <div className="c3">
              <h3 className="tw:text-lg sm:tw:text-xl tw:font-semibold tw:text-gray-800">의식</h3>
              <ul className="tw:list-disc tw:pl-5 tw:text-gray-700 tw:mt-1">
                <li>반려동물 장례식에는 삶을 기념하는 의식이 포함되며, 독서, 연설, 기도 등을 맞춤화할 수 있습니다.</li>
              </ul>
            </div>

            {/* 추모 */}
            <div className="c4">
              <h3 className="tw:text-lg sm:tw:text-xl tw:font-semibold tw:text-gray-800">추모</h3>
              <ul className="tw:list-disc tw:pl-5 tw:text-gray-700 tw:mt-1">
                <li>장례식 동안 추도문을 전달하거나, 반려동물의 추억을 공유하는 시간을 가집니다.</li>
              </ul>
            </div>

            {/* 모임 및 지원 */}
            <div className="c5">
              <h3 className="tw:text-lg sm:tw:text-xl tw:font-semibold tw:text-gray-800">모임 및 지원</h3>
              <ul className="tw:list-disc tw:pl-5 tw:text-gray-700 tw:mt-1">
                <li>
                  장례식 후 친구와 가족이 모여 지원을 제공합니다.
                  <br />
                  이는 슬픔을 이해하고 치유하는 데 도움이 됩니다.
                </li>
              </ul>
            </div>
          </div>

          {/* 마무리 영역 */}
          <div className={`${styles.c6} tw:mt-6 sm:tw:mt-8 tw:text-gray-700 tw:leading-relaxed tw:text-sm sm:tw:text-base`}>
            <span>
              각 단계는 반려동물의 생명을 존중하고 보호자의 마음가짐을 반영하며,
              지역 규정과 문화적 관행에 따라 달라질 수 있습니다. 따라서, 현지 당국이나
              관련 기관에 문의하여 정확한 절차를 확인하는 것이 중요합니다.
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProcedureComponent
