import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

// 기본 alert
export const alert = (title, text, icon, callback) => {
  MySwal.fire({ title, text, icon }).then(callback)
}

// confirm
export const confirm = (title, text, icon, callback) => {
  MySwal.fire({
    title, text, icon,
    showCancelButton: true,
    cancelButtonColor: '#d33',
    cancelButtonText: '취소',
    confirmButtonColor: '#3085d6',
    confirmButtonText: '확인',
  }).then(callback)
}

/* =======================
   ✅ Toast helpers 추가
   ======================= */

// 기본 토스트 (옵션 커스터마이즈 가능)
export const toast = (title, icon = 'success', opts = {}) => {
  return MySwal.fire({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1400,
    timerProgressBar: true,
    didOpen: (t) => {
      // 마우스 올리면 일시정지
      t.onmouseenter = MySwal.stopTimer
      t.onmouseleave = MySwal.resumeTimer
    },
    title,
    icon,
    ...opts, // 필요 시 position/timer 등 재정의
  })
}

// 편의 함수들
export const toastSuccess = (title, opts) => toast(title, 'success', opts)
export const toastInfo    = (title, opts) => toast(title, 'info', opts)
export const toastWarn    = (title, opts) => toast(title, 'warning', opts)
export const toastError   = (title, opts) => toast(title, 'error', opts)


