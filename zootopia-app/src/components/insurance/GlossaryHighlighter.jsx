import React, { useState } from 'react'

export default function GlossaryHighlighter({ text, glossary }) {
  if (!text) return null
  const keys = Object.keys(glossary || {})
  if (keys.length === 0) return <>{text}</>

  const pattern = new RegExp(
    `(${keys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
    'g'
  )
  const parts = String(text).split(pattern)

  return (
    <>
      {parts.map((part, i) => {
        const exp = glossary[part]
        if (!exp) return <React.Fragment key={i}>{part}</React.Fragment>
        return <Tooltip key={i} term={part} desc={exp} />
      })}
    </>
  )
}

function Tooltip({ term, desc }) {
  const [open, setOpen] = useState(false)

  return (
    <span
      className="tw:relative tw:inline-block tw:align-baseline tw:cursor-help tw:text-[#F27A7A] tw:font-medium"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      tabIndex={0}
    >
      {term}
      {open && (
        <span
          role="tooltip"
          className="
            tw:absolute tw:z-50
            tw:left-1/2 tw:top-full -tw:translate-x-1/2 tw:mt-2
            tw:inline-block tw:w-auto tw:max-w-none tw:whitespace-nowrap
            tw:bg-black tw:text-white tw:text-xs
            tw:rounded-lg tw:px-3 tw:py-1.5 tw:shadow-lg
          "
        >
          {desc}
        </span>
      )}
    </span>
  )
}