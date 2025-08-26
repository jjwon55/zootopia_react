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

const isCoordString = (s) =>
  /^\(?\s*([+-]?\d+(?:\.\d+)?)\s*[, ]\s*([+-]?\d+(?:\.\d+)?)\s*\)?$/.test(s);

// 주소일 가능성 판정
const isProbablyAddress = (raw) => {
  const s = normalizeQuery(raw);
  if (/(도|시|군|구|읍|면|동|리|로|길|대로|번길)(?:\s|$)/.test(s)) return true;
  if (/\d/.test(s) && /(로|길|번길|동|리)/.test(s)) return true;
  return false;
};

// "제주특별자치도 서귀포시 일주동로 56" → { region: "제주특별자치도 서귀포시", rest: "일주동로 56" }
const splitRegionAndRest = (s) => {
  const m = s.match(/^(.*?(?:도|시|군|구))\s+(.*)$/);
  return m ? { region: m[1], rest: m[2] } : { region: '', rest: s };
};

// "일주동로 56" / "일주동로6307번길 56-1" → "일주동로" 또는 "일주동로6307번길"
const extractRoad = (s) => {
  const m = s.match(/(.+?(?:로|길|번길))/);
  return m ? m[1] : '';
};

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
  const debounceTimer = useRef(null);

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

  // ✅ 오버레이가 선택 마커의 실제 좌표(posLatLng)에 뜰 수 있게 수정
  const showOverlay = useCallback((place, posLatLng) => {
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
      position: posLatLng || new kakao.maps.LatLng(parseFloat(place.y), parseFloat(place.x)),
      content,
      xAnchor: 0.5,
      yAnchor: 1.1,
    });
    ov.setMap(mapObjRef.current);
    overlayRef.current = ov;

    selectedIdRef.current = place.id;
  }, [closeOverlay]);

  // ✅ 겹치는 좌표 원형 분산(스파이더링) 적용
  const applyMarkers = useCallback((data) => {
    const { kakao } = window;
    const map = mapObjRef.current;
    clearMarkers();

    // ① 같은 좌표로 그룹화
    const groups = data.reduce((acc, p) => {
      const key = `${p.x},${p.y}`; // 경도,위도 문자열
      (acc[key] ||= []).push(p);
      return acc;
    }, {});

    const markers = [];
    const proj = map.getProjection();

    // ② 그룹별 분산 마커 생성
    Object.values(groups).forEach((group) => {
      const n = group.length;
      const base = group[0];
      const baseLatLng = new kakao.maps.LatLng(parseFloat(base.y), parseFloat(base.x));
      const centerPt = proj.containerPointFromCoords
        ? proj.containerPointFromCoords(baseLatLng)
        : proj.pointFromCoords(baseLatLng); // 환경에 따라 대응

      if (n === 1) {
        const p = group[0];
        const latlng = baseLatLng;
        const marker = new kakao.maps.Marker({ position: latlng });
        kakao.maps.event.addListener(marker, 'click', () => showOverlay(p, marker.getPosition()));
        marker.__pid = p.id; marker.__place = p;
        markers.push(marker);
        return;
      }

      // 확대 레벨에 따라 반경 가변 (px)
      const level = map.getLevel();
      const R = Math.max(18, 28 - (level - 3) * 2); // 레벨이 커질수록 조금 줄임

      group.forEach((p, i) => {
        const theta = (2 * Math.PI * i) / n;
        const dx = R * Math.cos(theta);
        const dy = R * Math.sin(theta);
        const basePoint = new kakao.maps.Point(centerPt.x + dx, centerPt.y + dy);
        const latlng = proj.coordsFromContainerPoint
          ? proj.coordsFromContainerPoint(basePoint)
          : proj.coordsFromPoint(basePoint);

        const marker = new kakao.maps.Marker({ position: latlng });
        kakao.maps.event.addListener(marker, 'click', () => showOverlay(p, marker.getPosition()));
        marker.__pid = p.id; marker.__place = p;
        markers.push(marker);
      });
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

  // 화면영역(bounds) 기반 키워드 검색 (본검색)
  const doSearch = useCallback(() => {
    const { kakao } = window;
    const map = mapObjRef.current;
    const svc = placesSvcRef.current;
    if (!map || !svc || !compositeKeyword) return;

    const seq = ++searchSeqRef.current; // 최신 토큰
    searchingRef.current = true;

    svc.keywordSearch(
      compositeKeyword,
      (data, status) => {
        if (seq !== searchSeqRef.current) return; // 오래된 응답 무시
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
     주소/좌표 → 지도 이동
     - 좌표 문자열이면 즉시 이동
     - 주소 지오코딩: EXACT → SIMILAR
     - 실패 시 느슨 폴백(도로명 중심 이동)
     - (전국 키워드 보정은 "주소일 때만")
  ============================================ */
  const goToQuery = useCallback((query) => {
    return new Promise((resolve) => {
      const map = mapObjRef.current;
      const geocoder = geocoderRef.current;
      const svc = placesSvcRef.current;
      if (!map || !query) return resolve(false);

      const q = normalizeQuery(query);
      console.log('[goToQuery] 입력:', q);

      // 1) 좌표 문자열
      if (isCoordString(q)) {
        const m = q.match(/^\(?\s*([+-]?\d+(?:\.\d+)?)\s*[, ]\s*([+-]?\d+(?:\.\d+)?)\s*\)?$/);
        const lat = parseFloat(m[1]); const lng = parseFloat(m[2]);
        if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
          moveMapTo(new window.kakao.maps.LatLng(lat, lng), 3);
          return resolve(true);
        }
      }

      // 2) 주소 지오코딩
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
                moveMapTo(new window.kakao.maps.LatLng(parseFloat(y), parseFloat(x)), 3);
                ok(true);
              } else ok(false);
            },
            { analyze_type: type }
          );
        });
      };

      const run = async () => {
        let moved = false;

        if (await tryGeocode('EXACT')) moved = true;
        else if (await tryGeocode('SIMILAR')) moved = true;

        if (!moved) {
          // 느슨 폴백: 도로명만으로 재시도
          const { region, rest } = splitRegionAndRest(q);
          const roadOnly = extractRoad(rest || q);
          if (roadOnly) {
            const ANALYZE = window.kakao?.maps?.services?.AnalyzeType;
            const type = ANALYZE ? ANALYZE.SIMILAR : 'similar';

            // 지역 + 도로명
            moved = await new Promise((ok) => {
              geocoder.addressSearch(
                normalizeQuery([region, roadOnly].filter(Boolean).join(' ')),
                (r, st) => {
                  console.log('[goToQuery] loose road cand1 →', st, r?.[0]);
                  if (st === window.kakao.maps.services.Status.OK && r?.length) {
                    const { y, x } = r[0];
                    moveMapTo(new window.kakao.maps.LatLng(parseFloat(y), parseFloat(x)), 5);
                    ok(true);
                  } else ok(false);
                },
                { analyze_type: type }
              );
            });

            // 도로명 단독
            if (!moved) {
              moved = await new Promise((ok) => {
                geocoder.addressSearch(
                  roadOnly,
                  (r, st) => {
                    console.log('[goToQuery] loose road cand2 →', st, r?.[0]);
                    if (st === window.kakao.maps.services.Status.OK && r?.length) {
                      const { y, x } = r[0];
                      moveMapTo(new window.kakao.maps.LatLng(parseFloat(y), parseFloat(x)), 6);
                      ok(true);
                    } else ok(false);
                  },
                  { analyze_type: type }
                );
              });
            }
          }
        }

        // 3) 전국 보정은 "주소로 보일 때만"
        if (!moved && svc && isProbablyAddress(q)) {
          svc.keywordSearch(q, (data, st) => {
            console.log('[goToQuery] keywordSearch 보정 →', st, data?.[0]);
            if (st === window.kakao.maps.services.Status.OK && data?.length) {
              const first = data[0];
              moveMapTo(new window.kakao.maps.LatLng(parseFloat(first.y), parseFloat(first.x)), 3);
              return resolve(true);
            }
            resolve(false);
          }, { size: 5, page: 1 });
          return;
        }

        resolve(!!moved);
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
        const ok = await (isCoordString(address) || isProbablyAddress(address)
          ? goToQuery(address)
          : Promise.resolve(false));
        console.log('[init] address param 이동 결과:', ok);
        doSearch();
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
      const seq = ++searchSeqRef.current; // 최신 토큰
      svc.keywordSearch(
        v,
        (data, status) => {
          if (seq !== searchSeqRef.current) return; // 오래된 프리뷰 무시
          if (status !== window.kakao.maps.services.Status.OK) return;
          setPlaces(data);
        },
        { location: center, radius: 2000 }
      );
    }, 250);
  }, []);

  // 검색 버튼: 주소/좌표일 때만 지도 이동, 그 외는 현재 화면(bounds)만
  const onSearchClick = useCallback(async () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current); // 프리뷰 취소

    const kw = normalizeQuery(compositeKeyword ?? '');
    try { localStorage.setItem('map.keyword', kw || ''); } catch {}
    pushRecent(kw);

    if (isCoordString(kw) || isProbablyAddress(kw)) {
      const ok = await goToQuery(kw);
      console.log('[search] goToQuery 결과:', ok);
    }

    doSearch(); // 이동 여부와 관계없이 "현 지도 화면" 기준 검색
  }, [doSearch, pushRecent, compositeKeyword, goToQuery]);

  const onPlaceClick = useCallback((place) => {
    const coords = new window.kakao.maps.LatLng(parseFloat(place.y), parseFloat(place.x));
    moveMapTo(coords, 3);
    const marker = markersRef.current.find(m => m.__pid === place.id);
    if (marker) {
      marker.setZIndex(999);
      setTimeout(() => marker.setZIndex(undefined), 1200);
      showOverlay(place, marker.getPosition()); // ✅ 분산 마커 좌표로 오버레이
    } else {
      showOverlay(place);
    }
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
