// src/apis/products/notify.js
// 제품 영역 전용 알림/토스트 유틸. 공통 alert.js는 건드리지 않습니다.
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// 단일 toast: (title, text, icon) 또는 (title, opts) 둘 다 지원
export const toast = (title, p2, p3) => {
  const base = {
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (t) => {
      t.onmouseenter = MySwal.stopTimer;
      t.onmouseleave = MySwal.resumeTimer;
    },
  };

  let config = { ...base, title };

  if (typeof p2 === 'string') {
    // (title, text, icon)
    config = { ...config, text: p2 };
    if (p3) config.icon = p3;
    else config.icon = 'success';
  } else if (typeof p2 === 'object' && p2 !== null) {
    // (title, opts)
    config = { ...config, ...p2 };
  } else {
    config.icon = 'success';
  }

  return MySwal.fire(config);
};

export const toastSuccess = (title, opts) => toast(title, { icon: 'success', ...(opts || {}) });
export const toastInfo = (title, opts) => toast(title, { icon: 'info', ...(opts || {}) });
export const toastWarn = (title, opts) => toast(title, { icon: 'warning', ...(opts || {}) });
export const toastError = (title, opts) => toast(title, { icon: 'error', ...(opts || {}) });

// 간단한 모달 alert (선택적으로 사용)
export const modal = (title, text, icon = 'info') => MySwal.fire({ title, text, icon });
