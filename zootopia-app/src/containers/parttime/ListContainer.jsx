// src/containers/parttime/ListContainer.jsx
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import List from '../../components/parttime/List.jsx'
import * as parttimeApi from '../../apis/parttime.js'
import * as commentApi from '../../apis/parttimeComment.js'
import { useLoginContext } from '../../context/LoginContextProvider.jsx'

const ListContainer = () => {
  const [jobs, setJobs] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [comments, setComments] = useState([])
  const [totalComments, setTotalComments] = useState(0)
  const [totalCommentPages, setTotalCommentPages] = useState(1)

  const { userInfo } = useLoginContext()

  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const commentPage = Number(searchParams.get('commentPage')) || 1
  const location = searchParams.get('location') || ''
  const animalType = searchParams.get('animalType') || ''
  const payRange = searchParams.get('payRange') || ''
  const startDate = searchParams.get('startDate') || ''
  const endDate = searchParams.get('endDate') || ''
  const keyword = searchParams.get('keyword') || ''

  useEffect(() => {
    fetchJobs()
  }, [page, location, animalType, payRange, startDate, endDate, keyword])

  useEffect(() => {
    fetchComments()
  }, [commentPage])

  const fetchJobs = async () => {
    const params = {
      page: page - 1,         // (현재 백엔드 로그 보니 0 → OFFSET 0 OK, 유지)
      location: location || undefined,
      animalType: animalType || undefined,
      payRange: payRange || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      keyword: keyword || undefined,
    }

    try {
      const res = await parttimeApi.getJobs(params)
      const data = res.data ?? res // (혹시 헬퍼로 data만 리턴한다면 대비)

      const list  = data?.jobs ?? []
      const pages = Number(data?.totalPages ?? 1)

      console.log('✅ jobs api data:', data)   // 디버깅용
      setJobs(list)
      setTotalPages(Math.max(1, pages))
    } catch (e) {
      console.error('알바 목록 불러오기 실패:', e)
      setJobs([])
      setTotalPages(1)
    }
  }

  const fetchComments = async () => {
    const response = await commentApi.getAllCommentsPaged(commentPage, 6)
    const { comments, totalPages, totalComments } = response.data
    setComments(comments)
    setTotalCommentPages(totalPages)
    setTotalComments(totalComments)
  }

  const handlePageChange = (nextPage) => {
  const next = Math.max(1, Number(nextPage))
  const qp = new URLSearchParams(searchParams)
    qp.set('page', String(next))
    setSearchParams(qp)  // 새 인스턴스로 갱신
  }

  const handleCommentPageChange = (newPage) => {
    const next = new URLSearchParams(searchParams)
    next.set('commentPage', newPage)
    setSearchParams(next)
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    const next = new URLSearchParams(searchParams) // 새 객체로 복사

    if (value) next.set(name, value)
    else next.delete(name)

    next.set('page', 1) // 필터 바뀌면 1페이지
    setSearchParams(next)
  }

  const handleCommentSubmit = async ({ writer, content }) => {
    try {
      await commentApi.createComment({
        writer,
        content,
        // 필요하면 특정 알바 댓글일 때만:
        // jobId: 현재 화면의 jobId 또는 null
      })
      await fetchComments()   // 저장 후 최신 목록 갱신
    } catch (e) {
      console.error('댓글 등록 실패:', e)
      alert('댓글 등록에 실패했습니다.')
    }
  }

  const handleCommentDelete = async (commentId) => {
   if (!window.confirm('댓글을 삭제하시겠습니까?')) return
   try {
     await commentApi.deleteComment(commentId)   // axios.delete('/parttime/comments/{id}')
     await fetchComments()                       // 목록 새로고침
   } catch (e) {
     console.error('댓글 삭제 실패:', e)
     alert(e?.response?.data?.message || '삭제에 실패했습니다.')
   }
  }

  return (
  <List
    jobs={jobs}
    totalPages={totalPages}
    currentPage={page}
    commentPage={commentPage}
    totalCommentPages={totalCommentPages}
    totalComments={totalComments}
    comments={comments}
    user={userInfo}
    location={location}
    animalType={animalType}
    payRange={payRange}
    startDate={startDate}
    endDate={endDate}
    keyword={keyword}
    searchParams={searchParams}
    onPageChange={handlePageChange}
    onCommentPageChange={handleCommentPageChange}  
    onFilterChange={handleFilterChange}
    onCommentSubmit={handleCommentSubmit}
    onCommentDelete={handleCommentDelete} 
  />
  )
}

export default ListContainer
