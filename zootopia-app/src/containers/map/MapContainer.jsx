import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Map from '../../components/map/Map';
import { useLocation } from 'react-router-dom';

// Kakao SDK 로더 (services + clusterer)
function useKakaoLoader(appKey) {
  const [ready, setReady] = useState(!!window.kakao?.maps);

  useEffect(() => {
    if (window.kakao?.maps) { setReady(true); return; }
    const exist = document.querySelector('script[data-kakao-sdk="true"]');
    if (exist) return;

    const script = document.createElement('script');
    script.setAttribute('data-kakao-sdk', 'true');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services,clusterer`;
    script.async = true;
    script.onload = () => window.kakao.maps.load(() => setReady(true));
    document.head.appendChild(script);
  }, [appKey]);

  return ready;
}



function radiusByLevel(level) {
  if (level <= 3) return 1000;
  if (level === 4) return 2000;
  if (level === 5) return 3000;
  if (level === 6) return 5000;
  if (level === 7) return 8000;
  if (level === 8) return 10000;
  if (level === 9) return 15000;
  return 20000;
}

const CATEGORY_PRESETS = [
  { key: '동물병원', label: '동물병원' },
  { key: '애견카페', label: '애견카페' },
  { key: '애견용품', label: '애견용품' },
  { key: '공원', label: '공원' },
];

function markerImageFor(category) {
  const colorMap = {
    동물병원: '#EF4444', 애견카페: '#8B5CF6', 애견용품: '#10B981', 공원: '#3B82F6', default: '#6B7280',
  };
  const color = colorMap[category] || colorMap.default;
  const svg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><circle cx='16' cy='16' r='10' fill='${color}' /></svg>`
  );
  return new window.kakao.maps.MarkerImage(
    `data:image/svg+xml;charset=utf-8,${svg}`,
    new window.kakao.maps.Size(32, 32),
    { offset: new window.kakao.maps.Point(16, 16) }
  );
}

export default function MapContainer() {
  const appKey = import.meta.env.VITE_KAKAO_MAP_KEY || 'YOUR_KAKAO_APP_KEY';
  const kakaoReady = useKakaoLoader(appKey);

  const mapRef = useRef(null);
  const mapObjRef = useRef(null);
  const placesSvcRef = useRef(null);
  const clustererRef = useRef(null);
  const markersRef = useRef([]);
  const overlayRef = useRef(null);
  const myLocRef = useRef(null);

  const [keyword, setKeyword] = useState('동물병원');
  const [places, setPlaces] = useState([]);
  const [radiusKm, setRadiusKm] = useState(0);
  const [selectedCats, setSelectedCats] = useState(['동물병원']);
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('favPlaces') || '[]'); } catch { return []; }
  });
  const [recent, setRecent] = useState(() => {
    try { return JSON.parse(localStorage.getItem('recentKeywords') || '[]'); } catch { return []; }
  });

  // 컴포넌트 시작부 (export default function MapContainer() { ... ) 안쪽
useEffect(() => {
  // 팝업 오픈 함수 (전역으로 노출)
  window.openKakaoMapPopup = (url) => {
    if (!url) return;
    window.open(
      url,
      'kakaoMapPopup',
      'width=800,height=700,scrollbars=yes,resizable=yes'
    );
  };
}, []);

  // ▼▼ UI 상태 (신규) ▼▼
  const [filtersOpen, setFiltersOpen] = useState(false);   // 왼쪽 드로어
  const [listOpen, setListOpen] = useState(true);          // 오른쪽 패널/바텀시트
  useEffect(() => { setListOpen(window.innerWidth >= 1024); }, []); // 모바일 초기값: 닫힘

  const debounceTimer = useRef();

  const compositeKeyword = useMemo(() => {
    const cats = selectedCats.join(' ');
    return [cats, keyword].filter(Boolean).join(' ');
  }, [selectedCats, keyword]);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];
    if (clustererRef.current) clustererRef.current.clear();
  }, []);

  const closeOverlay = useCallback(() => {
    if (!overlayRef.current) return;
    overlayRef.current.setMap(null);
    overlayRef.current = null;
  }, []);

  const showOverlay = useCallback((place) => {
    const { kakao } = window;
    closeOverlay();
    const content = document.createElement('div');
    const isFav = favorites.includes(place.id);
    content.innerHTML = `
      <div class="tw:relative tw:bg-white tw:rounded-xl tw:shadow-lg tw:border tw:border-zinc-200 tw:p-3">
        <div class="tw:flex tw:items-center tw:justify-between tw:mb-2">
          <strong class="tw:text-[15px]">${place.place_name}</strong>
          <button class="tw:text-sm tw:text-zinc-500 hover:tw:text-zinc-700" data-close="1">X</button>
        </div>
        <div class="tw:text-sm tw:text-zinc-600">
          <div>${place.road_address_name || place.address_name || ''}</div>
          ${place.phone ? `<div class="tw:mt-1">${place.phone}</div>` : ''}
          <div class="tw:mt-2 tw:flex tw:items-center tw:gap-2">
            <a class="tw:text-blue-600 hover:tw:underline" href="${place.place_url}" target="_blank" rel="noreferrer">길찾기/카카오맵</a>
            <button class="tw:text-xs tw:px-2 tw:py-1 tw:rounded-md ${isFav ? 'tw:bg-yellow-400' : 'tw:bg-zinc-200'}" data-fav="1">
              ${isFav ? '★ 즐겨찾기됨' : '☆ 즐겨찾기'}
            </button>
          </div>
        </div>
        <div class="tw:absolute tw:left-1/2 tw:-translate-x-1/2 tw:-bottom-3 tw:w-0 tw:h-0 tw:border-l-[8px] tw:border-r-[8px] tw:border-t-[12px] tw:border-transparent tw:border-t-white"></div>
      </div>
    `;
    content.querySelector('[data-close="1"]').onclick = () => closeOverlay();
    content.querySelector('[data-fav="1"]').onclick = () => {
      setFavorites(prev => {
        const next = prev.includes(place.id) ? prev.filter(id => id !== place.id) : [...prev, place.id];
        localStorage.setItem('favPlaces', JSON.stringify(next));
        return next;
      });
      setTimeout(() => showOverlay(place), 0);
    };

    const ov = new kakao.maps.CustomOverlay({
      position: new kakao.maps.LatLng(place.y, place.x),
      content, xAnchor: 0.5, yAnchor: 1.1,
    });
    ov.setMap(mapObjRef.current);
    overlayRef.current = ov;
  }, [closeOverlay, favorites]);

  const applyMarkers = useCallback((data) => {
    const { kakao } = window;
    const map = mapObjRef.current;
    clearMarkers();

    const markers = data.map((place) => {
      const coords = new kakao.maps.LatLng(place.y, place.x);
      const marker = new kakao.maps.Marker({
        position: coords,
        image: markerImageFor(place.category_group_name || selectedCats[0] || 'default'),
      });
      kakao.maps.event.addListener(marker, 'click', () => showOverlay(place));
      marker.__pid = place.id;
      return marker;
    });
    markersRef.current = markers;

    if (!clustererRef.current) {
      clustererRef.current = new kakao.maps.MarkerClusterer({
        map, averageCenter: true, minLevel: 6,
      });
    }
    clustererRef.current.addMarkers(markers);
  }, [clearMarkers, selectedCats, showOverlay]);

  const doSearch = useCallback((centerLatLng) => {
    const { kakao } = window;
    const map = mapObjRef.current;
    const svc = placesSvcRef.current;
    if (!map || !svc || !compositeKeyword) return;

    const center = centerLatLng || map.getCenter();
    const radius = radiusKm > 0 ? radiusKm * 1000 : radiusByLevel(map.getLevel());
    map.setCenter(center);

    svc.keywordSearch(
      compositeKeyword,
      (data, status) => {
        if (status !== kakao.maps.services.Status.OK) {
          setPlaces([]); clearMarkers(); return;
        }
        setPlaces(data);
        applyMarkers(data);
      },
      { location: center, radius },
    );
  }, [compositeKeyword, radiusKm, applyMarkers, clearMarkers]);


  // 병원주소 받아오기
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const address = params.get('address') || ''; // 주소값 받아옴
  // 해당 address로 카카오맵 검색 로직 실행
  // 예: geocoding API 호출 → 좌표 얻기 → 지도에 표시
  // setMapCenter, setMarker 등으로 구현


  // 초기화
  useEffect(() => {
    if (!kakaoReady || !mapRef.current) return;
    const { kakao } = window;

    const center = new kakao.maps.LatLng(37.5665, 126.9780);
    const map = new kakao.maps.Map(mapRef.current, { center, level: 4 });
    mapObjRef.current = map;

    placesSvcRef.current = new kakao.maps.services.Places();

    kakao.maps.event.addListener(map, 'idle', () => {
      if (!compositeKeyword) return;
      doSearch();
    });

    if (!window.kakao || !address) return;
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(address, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const { y, x } = result[0];
        const map = mapObjRef.current;
        if (map) {
          const latlng = new window.kakao.maps.LatLng(y, x);
          map.setCenter(latlng);
        }
        // doSearch(latlng); // 필요시 주변 장소도 검색
      }
    });
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const latlng = new kakao.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
          myLocRef.current = latlng;
          map.setCenter(latlng);
          doSearch(latlng);
        },
        () => doSearch(),
      );
    } else doSearch();

    return () => {
      clearMarkers();
      if (overlayRef.current) overlayRef.current.setMap(null);
      if (clustererRef.current) clustererRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, kakaoReady]);

//   useEffect(() => {
// }, [address, kakaoReady]);


  // 최근 검색어
  const pushRecent = useCallback((kw) => {
    if (!kw) return;
    setRecent(prev => {
      const exists = prev.filter(v => v !== kw);
      const next = [kw, ...exists].slice(0, 8);
      localStorage.setItem('recentKeywords', JSON.stringify(next));
      return next;
    });
  }, []);

  // 디바운스 제안
  const onChangeKeywordDebounced = useCallback((v) => {
    setKeyword(v);
    if (!placesSvcRef.current) return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      if (!v) return;
      const map = mapObjRef.current;
      const center = map?.getCenter();
      placesSvcRef.current.keywordSearch(
        v,
        (data, status) => {
          if (status !== window.kakao.maps.services.Status.OK) return;
          setPlaces(data);
        },
        { location: center, radius: 2000 },
      );
    }, 250);
  }, []);

  const onSearchClick = useCallback(() => {
    pushRecent(compositeKeyword);
    doSearch();
    setListOpen(true); // 검색하면 리스트 열기
  }, [doSearch, pushRecent, compositeKeyword]);

  const onPlaceClick = useCallback((place) => {
    const { kakao } = window;
    const map = mapObjRef.current;
    if (!map) return;
    const coords = new kakao.maps.LatLng(place.y, place.x);
    map.setCenter(coords);
    showOverlay(place);
    const marker = markersRef.current.find(m => m.__pid === place.id);
    if (marker) { marker.setZIndex(999); setTimeout(() => marker.setZIndex(undefined), 1200); }
  }, [showOverlay]);

  const onMyLocation = useCallback(() => {
    if (myLocRef.current) {
      mapObjRef.current.setCenter(myLocRef.current);
      doSearch(myLocRef.current);
      return;
    }
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latlng = new window.kakao.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        myLocRef.current = latlng;
        mapObjRef.current.setCenter(latlng);
        doSearch(latlng);
      },
      () => doSearch(),
    );
  }, [doSearch]);

  const onChangeRadiusKm = useCallback((km) => {
    setRadiusKm(km); doSearch();
  }, [doSearch]);

  const onToggleCategory = useCallback((key) => {
    setSelectedCats(prev => {
      const has = prev.includes(key);
      const next = has ? prev.filter(k => k !== key) : [...prev, key];
      return next.length === 0 ? prev : next;
    });
    setTimeout(() => doSearch(), 0);
  }, [doSearch]);

  

  return (
    <Map
      // 지도/데이터
      mapRef={mapRef}
      places={places}
      favorites={favorites}
      onPlaceClick={onPlaceClick}
      // 검색/필터
      keyword={keyword}
      onChangeKeyword={onChangeKeywordDebounced}
      onSearchClick={onSearchClick}
      categories={CATEGORY_PRESETS}
      selectedCats={selectedCats}
      onToggleCategory={onToggleCategory}
      radiusKm={radiusKm}
      onChangeRadiusKm={onChangeRadiusKm}
      recentKeywords={recent}
      // UI 상태
      filtersOpen={filtersOpen}
      onToggleFilters={() => setFiltersOpen(v => !v)}
      listOpen={listOpen}
      onToggleList={() => setListOpen(v => !v)}
      // 액션
      onMyLocation={onMyLocation}
      // 병원주소 받아오기
      address={address}
    />
  );
}
