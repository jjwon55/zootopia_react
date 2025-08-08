import React, { useEffect, useState } from 'react'
import List from '../../components/posts/List'     
import * as postsApi from '../../apis/posts/posts'        
import { useLocation } from 'react-router-dom'

const ListContainer = () => {
  const [pagination, setPagination] = useState({})
  const [list, setList] = useState([])
  const [topList, setTopList] = useState([])
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState('');


  const location = useLocation()

  // 🔍 URL 쿼리에서 page, size, sort, type, keyword 추출
  const updatePageInfo = () => {
    const query = new URLSearchParams(location.search)
    const newPage = parseInt(query.get('page')) || 1
    const newSize = parseInt(query.get('size')) || 10
    setPage(newPage)
    setSize(newSize)
  }

  // 📦 게시글 불러오기
  const getList = async () => {
    try {
      const query = new URLSearchParams(location.search)
      const sort = query.get('sort') || 'latest'
      const type = query.get('type')
      const keyword = query.get('keyword')

      const response = await postsApi.list({
        page,
        size,
        sort,
        type,
        keyword,
      })

      const data = response.data
      setList(data.posts)
      setTopList(data.topPosts || [])
      setPagination(data.pagination)

    } catch (error) {
      console.error('❌ 게시글 목록 불러오기 실패:', error)
    }
  }

  useEffect(() => {
    updatePageInfo()
  }, [location.search])

  useEffect(() => {
    getList()
  }, [page, size, location.search])  

  useEffect(() => {
    const query = new URLSearchParams(location.search)
    setPage(parseInt(query.get('page')) || 1)
    setSize(parseInt(query.get('size')) || 10)
    setType(query.get('type') || '')
    setKeyword(query.get('keyword') || '')
  }, [location.search])

  return (
    <List posts={list} pagination={pagination} topList={topList} keyword={keyword} type={type} />
  )
}

export default ListContainer
