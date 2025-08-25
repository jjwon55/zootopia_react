import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function Map({
  // 지도
  mapRef,
  places = [],
  favorites = [],
  onPlaceClick,

  // 검색/필터
  keyword,
  onChangeKeyword,
  onSearchClick,
  categories = [],
  selectedCats = [],
  onToggleCategory,
  radiusKm = 0,
  onChangeRadiusKm,
  recentKeywords = [],

  // UI
  filtersOpen,
  onToggleFilters,
  listOpen,
  onToggleList,

  // 액션
  onMyLocation,

  // 병원주소 받아오기
  address
}) {
  // 헤더 높이(프로젝트에 맞게 조정: 64 → 72/80 등)
  const headerH = '64px';

  const [internalKeyword, setInternalKeyword] = useState(address || '');

  // address prop이 바뀔 때 internalKeyword 업데이트
  useEffect(() => {
    if (address) {
      setInternalKeyword(address);
      onChangeKeyword(address);  // 부모 함수가 있다면 호출해서 검색어 업데이트
    }
  }, [address, onChangeKeyword]);


  return (
    <div
      className="tw:relative tw:w-full tw:bg-white tw:overflow-hidden"
      style={{ height: `calc(100vh - ${headerH})` }}
    >
      {/* 지도: 맨 아래 레이어 */}
      <div ref={mapRef} className="tw:absolute tw:inset-0 tw:bg-zinc-100 tw:z-0" />

      {/* 상단 검색바: 항상 최상단 레이어 + 클릭 가능 */}
      <div className="tw:absolute tw:top-4 tw:left-1/2 tw:-translate-x-1/2 tw:w-[min(900px,92vw)] tw:z-[60]">
        <div className="tw:flex tw:flex-col tw:gap-2 tw:bg-white tw:border tw:border-zinc-200 tw:rounded-2xl tw:shadow-md tw:px-4 tw:py-3">
          <div className="tw:flex tw:items-center tw:gap-2">
            <button
              type="button"
              onClick={onToggleFilters}
              className="tw:px-3 tw:py-2 tw:rounded-md tw:bg-zinc-100 tw:hover:bg-zinc-200"
              title="필터 열기"
            >
              필터
            </button>
            <input
              type="text"
              value={ keyword || address}
              placeholder="장소, 검색"
              onChange={(e) => onChangeKeyword(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') onSearchClick(); }}
              className="tw:flex-1 tw:outline-none tw:border tw:border-zinc-300 tw:rounded-md tw:px-3 tw:py-2"
            />
            <button
              type="button"
              onClick={onSearchClick}
              className="tw:px-4 tw:py-2 tw:rounded-md tw:bg-zinc-900 tw:text-white tw:hover:bg-zinc-800"
            >
              검색
            </button>
            <button
              type="button"
              onClick={onMyLocation}
              className="tw:px-3 tw:py-2 tw:rounded-md tw:bg-blue-600 tw:text-white tw:hover:bg-blue-500"
              title="내 위치"
            >
              내 위치
            </button>
            <button
              type="button"
              onClick={onToggleList}
              className="tw:hidden lg:tw:inline-flex tw:px-3 tw:py-2 tw:rounded-md tw:bg-zinc-100 tw:hover:bg-zinc-200"
              title="결과 패널 토글"
            >
              목록
            </button>
          </div>

          {/* 최근 검색어 칩 */}
          {recentKeywords?.length > 0 && (
            <div className="tw:flex tw:flex-wrap tw:gap-2">
              {recentKeywords.map((kw) => (
                <button
                  key={kw}
                  onClick={() => onChangeKeyword(kw)}
                  className="tw:text-xs tw:px-2 tw:py-1 tw:rounded-full tw:bg-zinc-100 tw:hover:bg-zinc-200"
                >
                  {kw}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 왼쪽 필터 드로어 */}
      <div
        className={`tw:absolute tw:top-0 tw:left-0 tw:h-full tw:w-[320px] tw:bg-white tw:border-r tw:border-zinc-200 tw:shadow-lg tw:p-4 tw:transition-transform tw:duration-300 tw:z-[60] ${
          filtersOpen ? 'tw:translate-x-0' : '-tw-translate-x-full'
        }`}
      >
        <div className="tw:flex tw:items-center tw:justify-between tw:mb-3">
          <div className="tw:text-base tw:font-semibold">필터</div>
          <button
            onClick={onToggleFilters}
            className="tw:px-2 tw:py-1 tw:rounded-md tw:bg-zinc-100 tw:hover:bg-zinc-200"
          >
            닫기
          </button>
        </div>

        {/* 카테고리 */}
        <div className="tw:mb-4">
          <div className="tw:text-sm tw:text-zinc-600 tw:mb-2">카테고리</div>
          <div className="tw:flex tw:flex-wrap tw:gap-2">
            {categories.map(c => {
              const active = selectedCats.includes(c.key);
              return (
                <button
                  key={c.key}
                  onClick={() => onToggleCategory(c.key)}
                  className={`tw:text-xs tw:px-3 tw:py-1.5 tw:rounded-full ${
                    active ? 'tw:bg-zinc-900 tw:text-white' : 'tw:bg-zinc-100 tw:hover:bg-zinc-200'
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 반경 */}
        <div>
          <div className="tw:flex tw:items-center tw:justify-between tw:mb-2">
            <div className="tw:text-sm tw:text-zinc-600">반경</div>
            <div className="tw:text-sm">{radiusKm === 0 ? '자동' : `${radiusKm}km`}</div>
          </div>
          <input
            type="range"
            min={0}
            max={20}
            step={1}
            value={radiusKm}
            onChange={(e) => onChangeRadiusKm(Number(e.target.value))}
            className="tw:w-full"
            title="0=지도레벨 자동, 1~20km"
          />
        </div>
      </div>

      {/* 오른쪽 결과 패널 (데스크톱) */}
      <div
        className={`tw:hidden lg:tw:flex tw:flex-col tw:gap-2 tw:absolute tw:top-0 tw:right-0 tw:h-full tw:w-[380px] tw:bg-white tw:border-l tw:border-zinc-200 tw:shadow-xl tw:p-3 tw:transition-transform tw:duration-300 tw:z-[60] ${
          listOpen ? 'tw:translate-x-0' : 'tw:translate-x-full'
        }`}
      >
        <div className="tw:flex tw:items-center tw:justify-between tw:mb-1">
          <div className="tw:font-semibold">검색 결과</div>
          <button
            onClick={onToggleList}
            className="tw:text-sm tw:px-2 tw:py-1 tw:rounded-md tw:bg-zinc-100 tw:hover:bg-zinc-200"
          >
            닫기
          </button>
        </div>
        <div className="tw:overflow-y-auto tw:flex-1 tw:space-y-2">
          {places.length === 0 ? (
            <div className="tw:text-center tw:text-zinc-400 tw:py-6">결과가 없습니다.</div>
          ) : (
            places.map((p) => {
              const fav = favorites.includes(p.id);
              return (
                <div
                  key={p.id}
                  className="tw:p-3 tw:bg-zinc-50 tw:border tw:border-zinc-200 tw:rounded-xl tw:hover:bg-zinc-100 tw:cursor-pointer"
                  onClick={() => onPlaceClick(p)}
                >
                  <div className="tw:flex tw:items-center tw:justify-between">
                    <div className="tw:font-semibold tw:truncate">{p.place_name}</div>
                    <span className={`tw:text-[11px] tw:px-2 tw:py-0.5 tw:rounded ${fav ? 'tw:bg-yellow-300' : 'tw:bg-zinc-200'}`}>
                      {p.category_group_name || '장소'}
                    </span>
                  </div>
                  <div className="tw:text-sm tw:text-zinc-600 tw:truncate">
                    {p.road_address_name || p.address_name}
                  </div>
                  {p.phone && <div className="tw:text-sm tw:text-zinc-500">{p.phone}</div>}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 모바일 바텀시트 결과 */}
      <div
        className={`lg:tw:hidden tw:absolute tw:left-0 tw:right-0 tw:bottom-0 tw:bg-white tw:border-t tw:border-zinc-200 tw:shadow-[0_-6px_20px_rgba(0,0,0,0.06)] tw:rounded-t-2xl tw:p-3 tw:max-h-[60vh] tw:transition-transform tw:duration-300 tw:z-[60] ${
          listOpen ? 'tw:translate-y-0' : 'tw:translate-y-[calc(100%_-_44px)]'
        }`}
      >
        <div className="tw:flex tw:items-center tw:justify-between tw:mb-2">
          <div className="tw:font-semibold">검색 결과</div>
          <button
            onClick={onToggleList}
            className="tw:text-sm tw:px-2 tw:py-1 tw:rounded-md tw:bg-zinc-100 tw:hover:bg-zinc-200"
          >
            {listOpen ? '내리기' : '열기'}
          </button>
        </div>
        <div className="tw:overflow-y-auto tw:max-h-[50vh] tw:space-y-2">
          {places.length === 0 ? (
            <div className="tw:text-center tw:text-zinc-400 tw:py-6">결과가 없습니다.</div>
          ) : (
            places.map((p) => {
              const fav = favorites.includes(p.id);
              return (
                <div
                  key={p.id}
                  className="tw:p-3 tw:bg-zinc-50 tw:border tw:border-zinc-200 tw:rounded-xl tw:hover:bg-zinc-100 tw:cursor-pointer"
                  onClick={() => onPlaceClick(p)}
                >
                  <div className="tw:flex tw:items-center tw:justify-between">
                    <div className="tw:font-semibold tw:truncate">{p.place_name}</div>
                    <span className={`tw:text-[11px] tw:px-2 tw:py-0.5 tw:rounded ${fav ? 'tw:bg-yellow-300' : 'tw:bg-zinc-200'}`}>
                      {p.category_group_name || '장소'}
                    </span>
                  </div>
                  <div className="tw:text-sm tw:text-zinc-600 tw:truncate">
                    {p.road_address_name || p.address_name}
                  </div>
                  {p.phone && <div className="tw:text-sm tw:text-zinc-500">{p.phone}</div>}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* FABs */}
      <div className="tw:absolute tw:top-4 tw:right-4 tw:flex tw:items-center tw:gap-2 tw:z-[60]">
        <button
          onClick={onMyLocation}
          className="tw:px-4 tw:py-3 tw:w-[50px] tw:h-[50px]  tw:rounded-full tw:bg-blue-600 tw:text-white tw:shadow-lg tw:hover:bg-blue-500"
          title="내 위치로"
        >
          📍
        </button>
        <button
          onClick={onToggleList}
          className="tw:px-4 tw:py-3 tw:w-[50px] tw:h-[50px] tw:rounded-full tw:bg-zinc-900 tw:text-white tw:shadow-lg tw:hover:bg-zinc-800"
          title="결과 토글"
        >
          📋
        </button>
      </div>
    </div>
  );
}
