import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Map from '../../components/map/Map';
import { useLocation } from 'react-router-dom';

/* =========================
   Kakao SDK 로더 (보강)
========================= */
function useKakaoLoader(appKey) {
  const [ready, setReady] = useState(!!window.kakao?.maps);

  useEffect(() => {
    if (window.kakao?.maps) { setReady(true); return; }

    let script = document.querySelector('script[data-kakao-sdk="true"]');
    const onScriptLoad = () => {
      if (!window.kakao?.maps) return;
      window.kakao.maps.load(() => setReady(true));
    };

    if (script) {
      script.addEventListener('load', onScriptLoad, { once: true });
      return () => script.removeEventListener('load', onScriptLoad);
    }

    script = document.createElement('script');
    script.setAttribute('data-kakao-sdk', 'true');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services,clusterer`;
    script.async = true;
    script.onload = onScriptLoad;
    script.onerror = () => console.error('[KakaoMaps] SDK load error');
    document.head.appendChild(script);

    return () => { script.onload = null; };
  }, [appKey]);

  return ready;
}

/* =========================
   컴포넌트
========================= */
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
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('favPlaces') || '[]'); } catch { return []; }
  });
  const [recent, setRecent] = useState(() => {
    try { return JSON.parse(localStorage.getItem('recentKeywords') || '[]'); } catch { return []; }
  });

  // 상태/가드
  const selectedIdRef = useRef(null);
  const idleTimerRef = useRef(null);
  const searchSeqRef = useRef(0);
  const searchingRef = useRef(false);

  // URL ?address=
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const address = params.get('address') || '';

  const compositeKeyword = useMemo(() => keyword, [keyword]);

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
      setTimeout(() => { showOverlay(place); }, 0);
    };

    const ov = new kakao.maps.CustomOverlay({
      position: new kakao.maps.LatLng(place.y, place.x),
      content, xAnchor: 0.5, yAnchor: 1.1,
    });
    ov.setMap(mapObjRef.current);
    overlayRef.current = ov;

    selectedIdRef.current = place.id;
  }, [closeOverlay, favorites]);

  // ✅ 기본 마커 사용: image 옵션 제거
  const applyMarkers = useCallback((data) => {
    const { kakao } = window;
    const map = mapObjRef.current;
    clearMarkers();

    const markers = data.map((place) => {
      const coords = new kakao.maps.LatLng(place.y, place.x);
      const marker = new kakao.maps.Marker({ position: coords }); // ← 기본 마커
      kakao.maps.event.addListener(marker, 'click', () => showOverlay(place));
      marker.__pid = place.id;
      marker.__place = place;
      return marker;
    });
    markersRef.current = markers;

    if (!clustererRef.current) {
      // ✅ 기본 클러스터 스타일 사용 (styles 제거)
      clustererRef.current = new window.kakao.maps.MarkerClusterer({
        map,
        averageCenter: true,
        minLevel: 6,
      });
    }
    clustererRef.current.addMarkers(markers);
  }, [clearMarkers, showOverlay]);

  // 검색: 화면영역(bounds) 기반
  const doSearch = useCallback(() => {
    const { kakao } = window;
    const map = mapObjRef.current;
    const svc = placesSvcRef.current;
    if (!map || !svc || !compositeKeyword) return;

    const seq = ++searchSeqRef.current;
    searchingRef.current = true;

    svc.keywordSearch(
      compositeKeyword,
      (data, status) => {
        if (seq !== searchSeqRef.current) return;
        searchingRef.current = false;

        if (status !== kakao.maps.services.Status.OK) {
          setPlaces([]); clearMarkers(); return;
        }
        setPlaces(data);
        applyMarkers(data);
      },
      { bounds: map.getBounds() }
    );
  }, [compositeKeyword, applyMarkers, clearMarkers]);

  // 지도/서비스 초기화
  useEffect(() => {
    if (!kakaoReady || !mapRef.current) return;
    const { kakao } = window;

    const center = new kakao.maps.LatLng(37.5665, 126.9780);
    const map = new kakao.maps.Map(mapRef.current, { center, level: 4 });
    mapObjRef.current = map;

    placesSvcRef.current = new kakao.maps.services.Places();

    // idle 디바운스 (팬/줌 멈춘 뒤 검색)
    kakao.maps.event.addListener(map, 'idle', () => {
      if (!compositeKeyword) return;
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        if (!searchingRef.current) doSearch();
      }, 400);
    });

    // 최초 위치: address 우선 → 없으면 현재위치 → 기본
    if (address) {
      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.addressSearch(address, (result, status) => {
        if (status !== kakao.maps.services.Status.OK) { doSearch(); return; }
        const { y, x } = result[0];
        const latlng = new kakao.maps.LatLng(y, x);
        map.setCenter(latlng);
        doSearch();
      });
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const latlng = new kakao.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
          myLocRef.current = latlng;
          map.setCenter(latlng);
          doSearch();
        },
        () => doSearch()
      );
    } else {
      doSearch();
    }

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      clearMarkers();
      if (overlayRef.current) overlayRef.current.setMap(null);
      if (clustererRef.current) clustererRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kakaoReady, address]);

  // 최근 검색어: 추가/개별삭제/전체삭제
  const pushRecent = useCallback((kw) => {
    if (!kw) return;
    setRecent(prev => {
      const exists = prev.filter(v => v !== kw);
      const next = [kw, ...exists].slice(0, 8);
      localStorage.setItem('recentKeywords', JSON.stringify(next));
      return next;
    });
  }, []);

  const removeRecent = useCallback((kw) => {
    setRecent(prev => {
      const next = prev.filter(v => v !== kw);
      localStorage.setItem('recentKeywords', JSON.stringify(next));
      return next;
    });
  }, []);

  const clearRecent = useCallback(() => {
    localStorage.removeItem('recentKeywords');
    setRecent([]);
  }, []);

  // 입력 디바운스 프리뷰(가벼운 2km) — 결과 미리보기
  const debounceTimer = useRef();
  const onChangeKeywordDebounced = useCallback((v) => {
    setKeyword(v);
    if (!placesSvcRef.current) return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      if (!v) return;
      const map = mapObjRef.current;
      const center = map?.getCenter();
      const svc = placesSvcRef.current;
      const seq = ++searchSeqRef.current;
      svc.keywordSearch(
        v,
        (data, status) => {
          if (seq !== searchSeqRef.current) return;
          if (status !== window.kakao.maps.services.Status.OK) return;
          setPlaces(data);
        },
        { location: center, radius: 2000 }
      );
    }, 250);
  }, []);

  const onSearchClick = useCallback(() => {
    pushRecent(compositeKeyword);
    doSearch();
  }, [doSearch, pushRecent, compositeKeyword]);

  const onPlaceClick = useCallback((place) => {
    const { kakao } = window;
    const map = mapObjRef.current;
    if (!map) return;
    const coords = new kakao.maps.LatLng(place.y, place.x);
    map.setCenter(coords); // 의도된 이동
    const marker = markersRef.current.find(m => m.__pid === place.id);
    if (marker) { marker.setZIndex(999); setTimeout(() => marker.setZIndex(undefined), 1200); }
    showOverlay(place);
  }, [showOverlay]);

  const onMyLocation = useCallback(() => {
    if (myLocRef.current) {
      mapObjRef.current.setCenter(myLocRef.current);
      doSearch();
      return;
    }
    if (!navigator.geolocation) { doSearch(); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latlng = new window.kakao.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        myLocRef.current = latlng;
        mapObjRef.current.setCenter(latlng);
        doSearch();
      },
      () => doSearch(),
    );
  }, [doSearch]);

  return (
    <Map
      // 지도/데이터
      mapRef={mapRef}
      places={places}
      favorites={favorites}
      onPlaceClick={onPlaceClick}

      // 검색
      keyword={keyword}
      onChangeKeyword={onChangeKeywordDebounced}
      onSearchClick={onSearchClick}
      recentKeywords={recent}
      onDeleteRecent={removeRecent}
      onClearRecent={clearRecent}

      // 액션
      onMyLocation={onMyLocation}

      // placeholder
      address={address}
    />
  );
}
