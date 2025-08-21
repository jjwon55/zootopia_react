export default function OutboundLink({
  href,
  productId,
  label = 'apply',
  sponsored = false,
  className = '',
  children,
}) {
  const sendTrack = () => {
    try {
      const body = JSON.stringify({ productId, label, href, ts: Date.now() })
      const url = '/api/track/outbound/insurance'
      if (navigator.sendBeacon) {
        navigator.sendBeacon(url, new Blob([body], { type: 'application/json' }))
      } else {
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          keepalive: true,
        }).catch(() => {})
      }
    } catch {}
  }

  if (!href) {
    return (
      <button className={`${className} tw:opacity-50`} disabled aria-disabled>
        이동 가능한 링크 없음
      </button>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel={sponsored ? 'noopener noreferrer nofollow sponsored' : 'noopener noreferrer'}
      onClick={sendTrack}
      onMouseDown={sendTrack}     // 새탭(마우스다운) 선반영
      onAuxClick={sendTrack}      // 가운데 클릭
      onKeyDown={(e) => e.key === 'Enter' && sendTrack()}
      className={className}
      aria-label="외부 사이트로 이동"
      referrerPolicy="strict-origin-when-cross-origin"
    >
      {children}
    </a>
  )
}