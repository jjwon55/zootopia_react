import React from 'react'

export default function OutboundLink({
  href,
  productId,
  label = 'apply',    // 'apply' | 'homepage'
  sponsored = false,
  className = '',
  children,
}) {
  const handleClick = () => {
    try {
      const payload = { productId, label, href, ts: Date.now() }
      navigator.sendBeacon?.(
        '/track/outbound/insurance',
        new Blob([JSON.stringify(payload)], { type: 'application/json' })
      )
    } catch {}
  }

  return (
    <a
      href={href}
      target="_blank"
      rel={sponsored ? 'noopener noreferrer nofollow sponsored' : 'noopener noreferrer'}
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  )
}