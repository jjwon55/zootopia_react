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
    fetchComments()
  }, [searchParams])

  const fetchJobs = async () => {
    const res = await parttimeApi.getJobs({
      page,
      location,
      animalType,
      payRange,
      startDate,
      endDate,
      keyword
    })
    setJobs(res.jobs)
    setTotalPages(res.totalPages)
  }

  const fetchComments = async () => {
    const response = await commentApi.getAllCommentsPaged(commentPage, 6)
    const { comments, totalPages, totalCount } = response.data
    setComments(comments)
    setTotalCommentPages(totalPages)
    setTotalComments(totalCount)
  }

  const handlePageChange = (newPage) => {
    searchParams.set('page', newPage)
    setSearchParams(searchParams)
  }

  const handleCommentPageChange = (newPage) => {
    searchParams.set('commentPage', newPage)
    setSearchParams(searchParams)
  }

  const handleFilterChange = (key, value) => {
    if (value) {
      searchParams.set(key, value)
    } else {
      searchParams.delete(key)
    }
    searchParams.set('page', 1) // 필터 바뀌면 1페이지로
    setSearchParams(searchParams)
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
    onCommentSubmit={fetchComments}
  />
  )
}

export default ListContainer
