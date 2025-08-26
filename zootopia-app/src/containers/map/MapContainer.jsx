import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Map from '../../components/map/Map';
import { useLocation } from 'react-router-dom';

/* =========================
   Kakao SDK 로더 (services, clusterer)
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

    if (!script) {
      script = document.createElement('script');
      script.setAttribute('data-kakao-sdk', 'true');
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services,clusterer`;
      script.async = true;
      script.onload = onScriptLoad;
      script.onerror = () => console.error('[KakaoMaps] SDK load error');
      document.head.appendChild(script);
    } else {
      script.addEventListener('load', onScriptLoad, { once: true });
    }

    return () => {
      script?.removeEventListener?.('load', onScriptLoad);
    };
  }, [appKey]);

  return ready;
}

/* =========================
   유틸
========================= */
const normalizeQuery = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();

/* =========================
   컴포넌트
========================= */
export default function MapContainer() {
  const appKey = import.meta.env.VITE_KAKAO_MAP_KEY || 'YOUR_KAKAO_APP_KEY';
  const kakaoReady = useKakaoLoader(appKey);

  const mapRef = useRef(null);
  const mapObjRef = useRef(null);
  const placesSvcRef = useRef(null);
  const geocoderRef = useRef(null);
  const clustererRef = useRef(null);
  const markersRef = useRef([]);
  const overlayRef = useRef(null);
  const myLocRef = useRef(null);

  // 마지막 검색어 기억
  const [keyword, setKeyword] = useState(() => {
    try { return localStorage.getItem('map.keyword') || ''; } catch { return ''; }
  });
  const [places, setPlaces] = useState([]);

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

  /* 확실한 이동 로직: setLevel → setCenter → panTo */
  const moveMapTo = useCallback((latlng, level = 3) => {
    const map = mapObjRef.current;
    if (!map || !latlng) return;
    try { map.setLevel(level); } catch {}
    try { map.setCenter(latlng); } catch {}
    // 같은 좌표여도 panTo 한번 더: 애니메이션 + 일부 브라우저에서 이동 보장
    try { map.panTo(latlng); } catch {}
  }, []);

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
          </div>
        </div>
        <div class="tw:absolute tw:left-1/2 tw:-translate-x-1/2 tw:-bottom-3 tw:w-0 tw:h-0 tw:border-l-[8px] tw:border-r-[8px] tw:border-t-[12px] tw:border-transparent tw:border-t-white"></div>
      </div>
    `;

    content.querySelector('[data-close="1"]').onclick = () => closeOverlay();

    const ov = new kakao.maps.CustomOverlay({
      position: new kakao.maps.LatLng(parseFloat(place.y), parseFloat(place.x)),
      content,
      xAnchor: 0.5,
      yAnchor: 1.1,
    });
    ov.setMap(mapObjRef.current);
    overlayRef.current = ov;

    selectedIdRef.current = place.id;
  }, [closeOverlay]);

  // 기본 마커 적용
  const applyMarkers = useCallback((data) => {
    const { kakao } = window;
    const map = mapObjRef.current;
    clearMarkers();

    const markers = data.map((place) => {
      const coords = new kakao.maps.LatLng(parseFloat(place.y), parseFloat(place.x));
      const marker = new kakao.maps.Marker({ position: coords });
      kakao.maps.event.addListener(marker, 'click', () => showOverlay(place));
      marker.__pid = place.id;
      marker.__place = place;
      return marker;
    });
    markersRef.current = markers;

    if (!clustererRef.current) {
      clustererRef.current = new window.kakao.maps.MarkerClusterer({
        map,
        averageCenter: true,
        minLevel: 6,
      });
    }
    clustererRef.current.addMarkers(markers);
  }, [clearMarkers, showOverlay]);

  // 화면영역(bounds) 기반 키워드 검색
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
          console.warn('[KakaoPlaces] keywordSearch (bounds) 실패:', status);
          setPlaces([]); clearMarkers(); return;
        }
        setPlaces(data);
        applyMarkers(data);
      },
      { bounds: map.getBounds() }
    );
  }, [compositeKeyword, applyMarkers, clearMarkers]);

  /* ============================================
     주소/좌표/장소명 → 지도 이동
     - 좌표 문자열이면 즉시 이동
     - 주소 지오코딩: EXACT → SIMILAR (무조건 시도)
     - 실패 시 전국 단위 keywordSearch 1건으로 이동
  ============================================ */
  const goToQuery = useCallback((query) => {
    return new Promise((resolve) => {
      const map = mapObjRef.current;
      const geocoder = geocoderRef.current;
      const svc = placesSvcRef.current;
      if (!map || !query) return resolve(false);

      const q = normalizeQuery(query);
      console.log('[goToQuery] 입력:', q);

      // 1) 좌표 문자열 파싱: "33.4996, 126.5312" / "(33.49 126.53)"
      const m = q.match(/^\(?\s*([+-]?\d+(?:\.\d+)?)\s*[, ]\s*([+-]?\d+(?:\.\d+)?)\s*\)?$/);
      if (m) {
        const lat = parseFloat(m[1]);
        const lng = parseFloat(m[2]);
        if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
          const latlng = new window.kakao.maps.LatLng(lat, lng);
          console.log('[goToQuery] 좌표 인식 → 이동');
          moveMapTo(latlng, 3);
          return resolve(true);
        }
      }

      // 2) 주소 지오코딩 (EXACT → SIMILAR 순서로 두 번 시도) — 주소 여부와 상관없이 시도
      const tryGeocode = (analyzeType) => {
        if (!geocoder) return Promise.resolve(false);
        return new Promise((ok) => {
          const ANALYZE = window.kakao?.maps?.services?.AnalyzeType;
          const type = ANALYZE
            ? (analyzeType === 'EXACT' ? ANALYZE.EXACT : ANALYZE.SIMILAR)
            : (analyzeType === 'EXACT' ? 'exact' : 'similar'); // 폴백(소문자)

          geocoder.addressSearch(
            q,
            (result, status) => {
              console.log(`[goToQuery] addressSearch ${analyzeType} →`, status, result?.[0]);
              if (status === window.kakao.maps.services.Status.OK && result?.length) {
                const { y, x } = result[0];
                const latlng = new window.kakao.maps.LatLng(parseFloat(y), parseFloat(x));
                moveMapTo(latlng, 3);
                ok(true);
              } else {
                ok(false);
              }
            },
            { analyze_type: type }
          );
        });
      };

      const run = async () => {
        if (await tryGeocode('EXACT')) return resolve(true);
        if (await tryGeocode('SIMILAR')) return resolve(true);

        // 3) 전국 단위 키워드 검색으로 보정
        if (svc) {
          svc.keywordSearch(q, (data, st) => {
            console.log('[goToQuery] keywordSearch 보정 →', st, data?.[0]);
            if (st === window.kakao.maps.services.Status.OK && data?.length) {
              const first = data[0];
              const latlng = new window.kakao.maps.LatLng(parseFloat(first.y), parseFloat(first.x));
              moveMapTo(latlng, 3);
              return resolve(true);
            }
            resolve(false);
          }, { size: 5, page: 1 }); // bounds/location 없이 전국
        } else {
          resolve(false);
        }
      };
      run();
    });
  }, [moveMapTo]);

  // 지도/서비스 초기화
  useEffect(() => {
    if (!kakaoReady || !mapRef.current) return;
    const { kakao } = window;

    const center = new kakao.maps.LatLng(37.5665, 126.9780); // 서울 시청 기준
    const map = new kakao.maps.Map(mapRef.current, { center, level: 4 });
    mapObjRef.current = map;

    placesSvcRef.current = new kakao.maps.services.Places();
    geocoderRef.current = new kakao.maps.services.Geocoder();

    // idle 디바운스 (팬/줌 멈춘 뒤 검색)
    kakao.maps.event.addListener(map, 'idle', () => {
      if (!compositeKeyword) return;
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        if (!searchingRef.current) doSearch();
      }, 400);
    });

    // 최초 위치: ?address= 우선 → 현재위치 → 기본
    const runInitial = async () => {
      if (address) {
        const ok = await goToQuery(address);
        console.log('[init] address param 이동 결과:', ok);
        doSearch(); // 이동 성공/실패와 관계없이 현 중심 기준 검색
        return;
      }
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const latlng = new kakao.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            myLocRef.current = latlng;
            moveMapTo(latlng, 4);
            doSearch();
          },
          () => doSearch()
        );
      } else {
        doSearch();
      }
    };
    runInitial();

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
      try { localStorage.setItem('recentKeywords', JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const removeRecent = useCallback((kw) => {
    setRecent(prev => {
      const next = prev.filter(v => v !== kw);
      try { localStorage.setItem('recentKeywords', JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const clearRecent = useCallback(() => {
    try { localStorage.removeItem('recentKeywords'); } catch {}
    setRecent([]);
  }, []);

  // 입력 디바운스 프리뷰(가벼운 2km) — 결과 미리보기
  const debounceTimer = useRef();
  const onChangeKeywordDebounced = useCallback((v) => {
    setKeyword(v);
    try { localStorage.setItem('map.keyword', v); } catch {}
    if (!placesSvcRef.current) return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (!v) { setPlaces([]); return; }

    debounceTimer.current = setTimeout(() => {
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

  // 검색 버튼: 주소/좌표/장소명 모두 커버
  const onSearchClick = useCallback(async () => {
    const kw = normalizeQuery(compositeKeyword ?? '');
    try { localStorage.setItem('map.keyword', kw || ''); } catch {}
    pushRecent(kw);

    const ok = await goToQuery(kw); // 주소/좌표/장소명 중 무엇이든 이동 시도
    console.log('[search] goToQuery 결과:', ok);
    doSearch();                      // 이동여부와 관계없이 현 중심 기준으로 주변 검색
  }, [doSearch, pushRecent, compositeKeyword, goToQuery]);

  const onPlaceClick = useCallback((place) => {
    const { kakao } = window;
    const map = mapObjRef.current;
    if (!map) return;
    const coords = new kakao.maps.LatLng(parseFloat(place.y), parseFloat(place.x));
    moveMapTo(coords, 3);
    const marker = markersRef.current.find(m => m.__pid === place.id);
    if (marker) { marker.setZIndex(999); setTimeout(() => marker.setZIndex(undefined), 1200); }
    showOverlay(place);
  }, [moveMapTo, showOverlay]);

  const onMyLocation = useCallback(() => {
    if (myLocRef.current) {
      moveMapTo(myLocRef.current, 4);
      doSearch();
      return;
    }
    if (!navigator.geolocation) { doSearch(); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latlng = new window.kakao.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        myLocRef.current = latlng;
        moveMapTo(latlng, 4);
        doSearch();
      },
      () => doSearch(),
    );
  }, [doSearch, moveMapTo]);

  return (
    <Map
      // 지도/데이터
      mapRef={mapRef}
      places={places}
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
