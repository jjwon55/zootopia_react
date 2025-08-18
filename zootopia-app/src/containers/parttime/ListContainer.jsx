import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import List from '../../components/parttime/List.jsx'
import * as parttimeApi from '../../apis/parttime/parttime.js'
import * as commentApi from '../../apis/parttime/parttimeComment.js'
import { useLoginContext } from '../../context/LoginContextProvider.jsx'

// 시/도 → 시/군/구
const REGION_TO_CITIES = {
  서울: ['강남구','강서구','관악구','광진구','구로구','노원구','도봉구','동대문구','동작구','마포구','서대문구','서초구','성동구','성북구','송파구','양천구','영등포구','용산구','은평구','종로구','중구','중랑구'],
  경기: ['수원','용인','성남','고양','부천','안양','안산','남양주','화성','평택','의정부','파주','김포','광명','군포','하남','구리','시흥','오산','이천','여주','동두천','양주','포천','가평','연천'],
  인천: ['미추홀구','연수구','남동구','부평구','계양구','서구','중구','동구'],
  부산: ['해운대구','수영구','남구','연제구','부산진구','동래구','사하구','사상구','강서구','북구','영도구','동구','서구','중구','금정구'],
  대구: ['수성구','달서구','동구','서구','남구','북구','중구','달성군'],
  광주: ['광산구','서구','남구','동구','북구'],
  대전: ['유성구','서구','대덕구','중구','동구'],
  울산: ['남구','중구','동구','북구','울주군'],
  세종: ['세종시'],
  강원: ['춘천','원주','강릉','동해','속초','삼척','홍천','횡성','영월','평창','정선','철원','화천','양구','인제','고성','양양'],
  충북: ['청주','충주','제천','보은','옥천','영동','증평','진천','괴산','음성','단양'],
  충남: ['천안','아산','서산','당진','공주','보령','논산','계룡','금산','부여','서천','청양','홍성','예산','태안'],
  전북: ['전주','군산','익산','정읍','남원','김제','완주','진안','무주','장수','임실','순창','고창','부안'],
  전남: ['목포','여수','순천','나주','광양','담양','곡성','구례','고흥','보성','화순','장흥','강진','해남','영암','무안','함평','영광','장성','완도','진도','신안'],
  경북: ['포항','경주','김천','안동','구미','영주','영천','상주','문경','경산','군위','의성','청송','영양','영덕','청도','고령','성주','칠곡','예천','봉화','울진','울릉'],
  경남: ['창원','진주','통영','사천','김해','밀양','거제','양산','의령','함안','창녕','고성','남해','하동','산청','함양','거창','합천'],
  제주: ['제주시','서귀포시'],
}

// 동물 대분류 → 세부 종
const ANIMAL_GROUP_TO_SPECIES = {
  포유류: ['개','고양이','토끼','햄스터','기니피그','고슴도치','페렛'],
  파충류: ['거북이','도마뱀','이구아나','카멜레온','뱀'],
  절지류: ['타란툴라','전갈','곤충'],
  어류:   ['금붕어','구피','베타','시클리드','코이'],
  양서류: ['개구리','도롱뇽','살라맨더','뉴트'],
  조류:   ['앵무새','잉꼬','카나리아','왕관앵무','문조'],
}

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

  // 지역
  const region = searchParams.get('region') || ''
  const location = searchParams.get('location') || ''

  // 동물
  const animalGroup = searchParams.get('animalGroup') || ''
  const animalType = searchParams.get('animalType') || ''

  const payRange = searchParams.get('payRange') || ''
  const startDate = searchParams.get('startDate') || ''
  const endDate = searchParams.get('endDate') || ''
  const keyword = searchParams.get('keyword') || ''

  // 검색 입력은 로컬에만, 버튼 눌러야 반영
  const [keywordDraft, setKeywordDraft] = useState(keyword)
  useEffect(() => { setKeywordDraft(keyword) }, [keyword])

  const cityOptions = REGION_TO_CITIES[region] || []
  const speciesOptions = ANIMAL_GROUP_TO_SPECIES[animalGroup] || []

  useEffect(() => { fetchJobs() }, [page, region, location, animalGroup, animalType, payRange, startDate, endDate, keyword])
  useEffect(() => { fetchComments() }, [commentPage])

  const fetchJobs = async () => {
    const params = {
      // 서버가 1-base(page) 사용 → 그대로 전달
      page,
      location: location || undefined,
      animalType: animalType || undefined,
      animalGroup: (!animalType && animalGroup) ? animalGroup : undefined,
      payRange: payRange || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      keyword: keyword || undefined,
    }
    try {
      const res = await parttimeApi.getJobs(params)
      const data = res.data ?? res
      setJobs(data?.jobs ?? [])
      setTotalPages(Math.max(1, Number(data?.totalPages ?? 1)))
    } catch (e) {
      console.error('알바 목록 불러오기 실패:', e)
      setJobs([]); setTotalPages(1)
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
    const qp = new URLSearchParams(searchParams)
    qp.set('page', String(Math.max(1, Number(nextPage))))
    setSearchParams(qp)
  }

  const handleCommentPageChange = (newPage) => {
    const next = new URLSearchParams(searchParams)
    next.set('commentPage', String(newPage))
    setSearchParams(next)
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    const next = new URLSearchParams(searchParams)

    // 키워드는 로컬만 갱신 (검색 버튼 눌러야 반영)
    if (name === 'keyword') {
      setKeywordDraft(value)
      return
    }

    // 시/도 변경 시: 시/군/구 초기화
    if (name === 'region') {
      value ? next.set('region', value) : next.delete('region')
      next.delete('location')
      next.set('page', '1')
      setSearchParams(next)
      return
    }

    // 동물 대분류 변경 시: 종 초기화
    if (name === 'animalGroup') {
      value ? next.set('animalGroup', value) : next.delete('animalGroup')
      next.delete('animalType')
      next.set('page','1')
      setSearchParams(next)
      return
    }

    if (value) next.set(name, value)
    else next.delete(name)
    next.set('page', '1')
    setSearchParams(next)
  }

  const handleSearch = () => {
    const next = new URLSearchParams(searchParams)
    const v = (keywordDraft || '').trim()
    v ? next.set('keyword', v) : next.delete('keyword')
    next.set('page', '1')
    setSearchParams(next)
  }

  const handleResetFilters = () => {
    setKeywordDraft('')
    const next = new URLSearchParams()
    next.set('page', '1')
    setSearchParams(next)
  }

  const handleCommentSubmit = async ({ writer, content }) => {
    try {
      await commentApi.createComment({ writer, content })
      await fetchComments()
    } catch (e) {
      console.error('댓글 등록 실패:', e)
      alert('댓글 등록에 실패했습니다.')
    }
  }

  const handleCommentDelete = async (commentId) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return
    try {
      await commentApi.deleteComment(commentId)
      await fetchComments()
    } catch (e) {
      console.error('댓글 삭제 실패:', e)
      alert(e?.response?.data?.message || '삭제에 실패했습니다.')
    }
  }

  return (
    <List
      // 데이터
      jobs={jobs}
      totalPages={totalPages}
      currentPage={page}
      region={region}
      location={location}
      cityOptions={cityOptions}
      animalGroup={animalGroup}
      animalType={animalType}
      speciesOptions={speciesOptions}
      payRange={payRange}
      startDate={startDate}
      endDate={endDate}
      keyword={keyword}
      keywordDraft={keywordDraft}
      comments={comments}
      totalComments={totalComments}
      commentPage={commentPage}
      totalCommentPages={totalCommentPages}
      user={userInfo}

      // 이벤트
      onFilterChange={handleFilterChange}
      onSearch={handleSearch}
      onReset={handleResetFilters}
      onKeywordChange={(e)=>setKeywordDraft(e.target.value)}
      onPageChange={handlePageChange}
      onCommentPageChange={handleCommentPageChange}
      onCommentSubmit={handleCommentSubmit}
      onCommentDelete={handleCommentDelete}
    />
  )
}

export default ListContainer