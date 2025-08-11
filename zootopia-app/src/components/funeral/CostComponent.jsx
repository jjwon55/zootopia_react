import React from 'react'

const CostComponent = () => {
  return (
    <>
      <div className="cost-container tw-flex tw-flex-col tw-items-center tw-bg-gray-50 tw-min-h-screen tw-py-10">
        <div className="main-content tw-w-full tw-max-w-4xl tw-bg-white tw-p-8 tw-rounded tw-shadow">
          <div className="side tw-flex tw-flex-col tw-gap-4 tw-mb-8">
            <span className="s1 tw-text-2xl tw-font-bold tw-text-gray-800 tw-mb-2">
              Cross the<br />Rainbow Bridge
            </span>
            <span className="s2 tw-text-base tw-text-blue-700 hover:tw-underline">
              <a href="/procedure" className="tw-link tw-link-hover">장례 절차</a>
            </span>
            <span className="s3 tw-text-base tw-text-blue-700 hover:tw-underline">
              <a href="/" className="tw-link tw-link-hover">장례 및 기타비용</a>
            </span>
          </div>
          <h1 className="headline tw-text-3xl tw-font-bold tw-mb-6 tw-text-gray-900">
            장례 및 기타비용
          </h1>
          <div className="inner-content tw-space-y-10">
            <div>
              <h5 className="tw-text-lg tw-font-semibold tw-text-gray-700">
                – 이별을 준비하는 마음으로, 장례비용과 절차를 정리합니다 –
              </h5>
              <br />
              <p className="tw-text-gray-600 tw-leading-relaxed">
                사랑하던 반려동물과의 이별은 많은 분들께 깊은 슬픔을 안깁니다. 짧지 않은 시간을 함께하며 가족처럼 지낸 존재이기에, 마지막을 잘 보내주고 싶은 마음은 모두 같을 것입니다. <br />
                이 글은 그런 분들을 위해, 반려동물 장례 비용과 용품별 가격, 지역별 평균 비용, 그리고 예산 계획에 도움이 될 수 있는 정보를 정리한 안내서입니다.
              </p>
            </div>
            <div className="c1 tw-p-4 tw-bg-gray-100 tw-rounded">
              <h5 className="tw-text-base tw-font-semibold tw-mb-2">장례 기본 비용 : 평균 약 30만 원 내외</h5>
              <p className="tw-text-gray-700">
                5kg 이하의 소형 반려동물을 기준으로 한 기본 화장 비용은 다음과 같습니다. <br />
                예상 비용 최저가 약 ₩200,000 <br />
                일반적인 경우 약 ₩250,000 <br />
                고급 옵션 포함 약 ₩300,000 이상
              </p>
            </div>
            <div className="c2 tw-p-4 tw-bg-gray-100 tw-rounded">
              <h5 className="tw-text-base tw-font-semibold tw-mb-2">장례용품별 가격 정리</h5>
              <p className="tw-text-gray-700">
                장례에는 화장 외에도 다양한 용품과 서비스가 포함될 수 있습니다. <br />
                다음은 주요 장례용품의 대략적인 가격대입니다.
              </p>
            </div>
            <div className="c3 tw-p-4 tw-bg-gray-100 tw-rounded">
              <h5 className="tw-text-base tw-font-semibold tw-mb-4">의식</h5>
              <table className="item-price-table tw-w-full tw-border-collapse tw-text-left tw-text-sm tw-table tw-table-zebra">
                <thead>
                  <tr>
                    <th className="tw-border-b tw-border-gray-300 tw-p-2 tw-bg-gray-50">항목</th>
                    <th className="tw-border-b tw-border-gray-300 tw-p-2 tw-bg-gray-50">금액</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="tw-p-2">유골함 (납골함)</td>
                    <td className="tw-p-2">₩20,000 ~ ₩150,000</td>
                  </tr>
                  <tr>
                    <td className="tw-p-2">수의 / 관</td>
                    <td className="tw-p-2">₩50,000 ~ ₩210,000</td>
                  </tr>
                  <tr>
                    <td className="tw-p-2">메모리얼 스톤</td>
                    <td className="tw-p-2">₩200,000 ~ ₩400,000</td>
                  </tr>
                  <tr>
                    <td className="tw-p-2">수목장 · 봉안당 보관료 (1년)</td>
                    <td className="tw-p-2">₩100,000 ~ ₩500,000</td>
                  </tr>
                  <tr>
                    <td className="tw-p-2">운구 서비스</td>
                    <td className="tw-p-2">₩50,000 ~ ₩100,000</td>
                  </tr>
                </tbody>
              </table>
              <p className="tw-text-gray-700 tw-mt-2">
                이 외에도 생화 추모장식, 납골당 장기 보관, 추모영상 제작 등 여러 선택 옵션이 있으며, 선택에 따라 총 비용은 크게 달라질 수 있습니다.
              </p>
            </div>
            <div className="c4 tw-p-4 tw-bg-gray-100 tw-rounded">
              <h5 className="tw-text-base tw-font-semibold tw-mb-2">추모</h5>
              <p className="tw-text-gray-700">장례식 동안 추도문을 전달하거나, 반려동물의 추억을 공유하는 시간을 가집니다.</p>
            </div>
            <div className="c5 tw-p-4 tw-bg-gray-100 tw-rounded">
              <h5 className="tw-text-base tw-font-semibold tw-mb-4">예산 – 장례비용 합산 예시</h5>
              <table className="price-table tw-w-full tw-border-collapse tw-text-left tw-text-sm tw-table tw-table-zebra">
                <thead>
                  <tr>
                    <th className="tw-border-b tw-border-gray-300 tw-p-2 tw-bg-gray-50">항목</th>
                    <th className="tw-border-b tw-border-gray-300 tw-p-2 tw-bg-gray-50">금액 (원)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="tw-p-2">기본 화장비</td>
                    <td className="tw-p-2">₩250,000</td>
                  </tr>
                  <tr>
                    <td className="tw-p-2">유골함</td>
                    <td className="tw-p-2">₩50,000</td>
                  </tr>
                  <tr>
                    <td className="tw-p-2">수의 + 관</td>
                    <td className="tw-p-2">₩100,000</td>
                  </tr>
                  <tr>
                    <td className="tw-p-2">운구 서비스</td>
                    <td className="tw-p-2">₩50,000</td>
                  </tr>
                  <tr>
                    <td className="tw-p-2">봉안당 보관료 (1년)</td>
                    <td className="tw-p-2">₩200,000</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td className="tw-p-2 tw-font-bold">총합</td>
                    <td className="tw-p-2 tw-font-bold">₩650,000</td>
                  </tr>
                </tfoot>
              </table>
              <p className="tw-text-gray-700 tw-mt-2">
                옵션이 많아질수록 100만 원 이상이 드는 경우도 적지 않으며, 특히 수도권의 경우 평균적으로 더 높은 비용이 발생합니다.
              </p>
            </div>
          </div>
          <div className="c6 tw-mt-10 tw-text-center">
            <p className="tw-text-gray-600 tw-font-medium">
              마무리하며 <br />
              이별은 준비되지 않은 채 다가오곤 합니다. <br />
              그러나 마지막까지 따뜻하게 보내주기 위한 마음을 담아, 조용히 정리해두는 것도 한 가지 방법일 것입니다.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default CostComponent;
