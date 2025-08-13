import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

/* ========== 기본 alert ========== */
export const alert = (title, text, icon, callback) => {
  return MySwal.fire({ title, text, icon })
    .then((result) => {
      if (typeof callback === 'function') callback(result)
      return result
    })
}

/* ========== confirm ========== */
export const confirm = (title, text, icon, callback) => {
  return MySwal.fire({
    title, text, icon,
    showCancelButton: true,
    cancelButtonColor: '#d33',
    cancelButtonText: '취소',
    confirmButtonColor: '#3085d6',
    confirmButtonText: '확인',
  }).then((result) => {
    if (typeof callback === 'function') callback(result)
    return result
  })
}

/* =======================
   ✅ Toast helpers
   - opts 또는 callback 둘 다 지원
   - 사용 예:
     toastSuccess('완료')                           // 기본
     toastError('실패', { timer: 2000 })           // 옵션만
     toastInfo('알림', (r)=>console.log(r))        // 콜백만
     toastWarn('주의', { position:'bottom' }, cb)  // 옵션+콜백
   ======================= */
export const toast = (title, icon = 'success', optsOrCb = {}, cb) => {
  // 오버로드 처리: 2번째 인자를 콜백으로 쓴 경우 허용
  let opts = optsOrCb
  let callback = cb
  if (typeof optsOrCb === 'function') {
    callback = optsOrCb
    opts = {}
  }

  return MySwal.fire({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1400,
    timerProgressBar: true,
    didOpen: (t) => {
      t.onmouseenter = MySwal.stopTimer
      t.onmouseleave = MySwal.resumeTimer
    },
    title,
    icon,
    ...opts, // 사용자가 지정한 옵션으로 덮어쓰기
  }).then((result) => {
    if (typeof callback === 'function') callback(result)
    return result
  })
}

/* 편의 함수들 */
export const toastSuccess = (title, optsOrCb, cb) => toast(title, 'success', optsOrCb, cb)
export const toastInfo    = (title, optsOrCb, cb) => toast(title, 'info', optsOrCb, cb)
export const toastWarn    = (title, optsOrCb, cb) => toast(title, 'warning', optsOrCb, cb)
export const toastError   = (title, optsOrCb, cb) => toast(title, 'error', optsOrCb, cb)
