import React from 'react';

export default function Map({
  // 지도
  mapRef,
  places = [],
  favorites = [],
  onPlaceClick,

  // 검색
  keyword,
  onChangeKeyword,
  onSearchClick,
  recentKeywords = [],
  onDeleteRecent,   // 개별 삭제
  onClearRecent,    // 전체 삭제

  // 액션
  onMyLocation,

  // placeholder
  address,
}) {
  const headerH = '64px';
  const sidebarW = 360; // 왼쪽 패널 너비(px)

  return (
    <div
      className="tw:relative tw:w-full tw:bg-white tw:overflow-hidden"
      style={{ height: `calc(100vh - ${headerH})` }}
    >
      {/* 왼쪽 검색 패널 */}
      <aside
        className="tw:absolute tw:top-0 tw:left-0 tw:h-full tw:bg-white tw:border-r tw:border-zinc-200 tw:z-[60] tw:flex tw:flex-col"
        style={{ width: sidebarW }}
      >
        {/* 검색 입력 */}
        <div className="tw:p-3 tw:border-b tw:border-zinc-200">
          <div className="tw:flex tw:items-center tw:gap-2">
            <input
              type="text"
              value={keyword ?? ''}
              placeholder={address ? `예: ${address}` : '장소, 검색'}
              onChange={(e) => onChangeKeyword(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') onSearchClick(); }}
              className="tw:flex-1 tw:outline-none tw:border tw:border-zinc-300 tw:rounded-md tw:px-3 tw:py-2"
              autoComplete="off"
            />
            <button
              type="button"
              onClick={onSearchClick}
              className="tw:px-3 tw:py-2 tw:rounded-md tw:bg-zinc-900 tw:text-white tw:hover:bg-zinc-800"
              title="검색"
            >
              검색
            </button>
          </div>

          {/* 최근 검색어: 개별 ✕ / 전체 삭제 */}
          {recentKeywords?.length > 0 && (
            <div className="tw:mt-3 tw:flex tw:flex-wrap tw:items-center tw:gap-2">
              <button
                type="button"
                onClick={onClearRecent}
                className="tw:text-xs tw:px-2 tw:py-1 tw:rounded-full tw:bg-rose-50 tw:text-rose-600 tw:border tw:border-rose-200 tw:hover:bg-rose-100"
                title="최근 검색어 전체 삭제"
              >
                전체 삭제
              </button>

              {recentKeywords.map((kw) => (
                <div
                  key={kw}
                  className="tw:inline-flex tw:items-center tw:gap-1 tw:pl-3 tw:pr-1 tw:py-1 tw:rounded-full tw:bg-zinc-100 tw:hover:bg-zinc-200"
                >
                  <button
                    type="button"
                    onClick={() => onChangeKeyword(kw)}
                    className="tw:text-xs tw:leading-none"
                    title={`'${kw}'로 검색어 채우기`}
                  >
                    {kw}
                  </button>
                  <button
                    type="button"
                    aria-label={`${kw} 삭제`}
                    onClick={(e) => { e.stopPropagation(); onDeleteRecent?.(kw); }}
                    className="tw:inline-grid tw:place-items-center tw:w-4 tw:h-4 tw:rounded-full tw:bg-zinc-300 tw:hover:bg-zinc-400 tw:text-[10px] tw:leading-none tw:shrink-0"
                    title="이 검색어 삭제"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 결과 리스트 */}
        <div className="tw:flex-1 tw:overflow-y-auto tw:p-3 tw:space-y-2">
          <div className="tw:text-xs tw:text-zinc-500 tw:mb-1">
            {places.length > 0 ? `총 ${places.length}개` : '검색 결과 없음'}
          </div>

          {places.length > 0 && places.map((p) => {
            const fav = favorites.includes(p.id);
            return (
              <div
                key={p.id}
                className="tw:p-3 tw:bg-zinc-50 tw:border tw:border-zinc-200 tw:rounded-xl tw:hover:bg-zinc-100 tw:cursor-pointer"
                onClick={() => onPlaceClick(p)}
              >
                <div className="tw:flex tw:items-center tw:justify-between">
                  <div className="tw:font-medium tw:truncate">{p.place_name}</div>
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
          })}
        </div>
      </aside>

      {/* 지도 (왼쪽 패널 제외 전체) */}
      <div
        ref={mapRef}
        className="tw:absolute tw:top-0 tw:right-0 tw:bottom-0 tw:bg-zinc-100 tw:z-0"
        style={{ left: sidebarW }}
      />

      {/* 지도 FAB */}
      <div className="tw:absolute tw:top-4 tw:right-4 tw:flex tw:flex-col tw:items-end tw:gap-2 tw:z-[60]">
        <button
          onClick={onMyLocation}
          className="tw:px-4 tw:py-3 tw:w-[50px] tw:h-[50px] tw:rounded-full tw:bg-blue-600 tw:text-white tw:shadow-lg tw:hover:bg-blue-500"
          title="내 위치로"
        >
          📍
        </button>
      </div>
    </div>
  );
}
