import React, { useEffect, useState, useContext } from 'react'
import { useSearchParams } from 'react-router-dom'
import List from '../../components/insurance/List'
import { LoginContext } from '../../context/LoginContextProvider'

// ── 공통 fetch 헬퍼 (SPA-CSRF: XSRF-TOKEN 쿠키 → X-XSRF-TOKEN 헤더)
const getCsrf = () =>
  decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || '')

async function req(url, { method = 'GET' } = {}) {
  const headers = {}
  const init = { method, credentials: 'include', headers }
  const token = getCsrf()
  if (token) headers['X-XSRF-TOKEN'] = token

  const res = await fetch('/api' + url, init)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status} ${text}`)
  }
  return res.headers.get('content-type')?.includes('application/json')
    ? res.json()
    : {}
}

export default function ListContainer() {
  const [items, setItems] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()

  const { roles } = useContext(LoginContext) || { roles: [] }
  const isAdmin = roles?.includes?.('ADMIN')

  const page    = Number(searchParams.get('page')) || 1
  const species = searchParams.get('species') || ''
  const company = searchParams.get('company') || ''

  // 목록 로드
  useEffect(() => {
    let ignore = false
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const q = new URLSearchParams()
        if (species) q.set('species', species)
        if (company) q.set('company', company)
        q.set('page', String(page))

        const data = await req(`/insurance/list?${q.toString()}`)
        if (ignore) return
        setItems(data?.products || [])
        setTotalPages(data?.totalPages || 1)
      } catch (e) {
        if (!ignore) setError(e.message || '목록 조회 실패')
      } finally {
        if (!ignore) setLoading(false)
      }
    })()
    return () => { ignore = true }
  }, [page, species, company])

  // 필터 변경 (species/company)
  const onFilterChange = (next = {}) => {
    const nextParams = new URLSearchParams(searchParams)
    Object.entries(next).forEach(([k, v]) => {
      if (v) nextParams.set(k, v)
      else nextParams.delete(k)
    })
    nextParams.set('page', '1') // 필터 변경 시 1페이지로
    setSearchParams(nextParams)
  }

  // 페이지 변경
  const onPageChange = (nextPage) => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('page', String(nextPage))
    setSearchParams(nextParams)
  }

  return (
    <List
      items={items}
      loading={loading}
      error={error}
      page={page}
      totalPages={totalPages}
      filters={{ species, company }}
      isAdmin={isAdmin}
      onFilterChange={onFilterChange}
      onPageChange={onPageChange}
    />
  )
}