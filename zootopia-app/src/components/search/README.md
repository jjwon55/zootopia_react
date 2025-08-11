# 검색 바와 카테고리 컴포넌트

스크린샷과 유사한 검색 바와 카테고리 버튼 UI 컴포넌트입니다.

## 컴포넌트 구조

```
src/components/search/
├── SearchBar.jsx       # 검색 입력창
├── CategoryButtons.jsx # 카테고리 버튼들
└── SearchSection.jsx   # 통합 검색 섹션
```

## 사용 방법

### 1. 전체 검색 섹션 사용

```jsx
import SearchSection from '../components/search/SearchSection';

const MyPage = () => {
  const handleSearch = (searchTerm) => {
    console.log('검색어:', searchTerm);
    // 검색 로직 구현
  };

  const handleCategorySelect = (category) => {
    console.log('선택된 카테고리:', category);
    // 카테고리 필터링 로직 구현
  };

  return (
    <div>
      <SearchSection
        onSearch={handleSearch}
        onCategorySelect={handleCategorySelect}
        searchPlaceholder="상품명을 검색하세요..."
      />
    </div>
  );
};
```

### 2. 개별 컴포넌트 사용

```jsx
import SearchBar from '../components/search/SearchBar';
import CategoryButtons from '../components/search/CategoryButtons';

const MyPage = () => {
  return (
    <div>
      <SearchBar 
        onSearch={(term) => console.log(term)}
        placeholder="검색하세요..."
      />
      
      <CategoryButtons 
        onCategorySelect={(category) => console.log(category)}
        activeCategory="전체"
      />
    </div>
  );
};
```

## Props

### SearchSection

| Props | 타입 | 기본값 | 설명 |
|-------|------|-------|------|
| onSearch | Function | - | 검색 실행 시 호출되는 함수 |
| onCategorySelect | Function | - | 카테고리 선택 시 호출되는 함수 |
| categories | Array | 기본 카테고리 | 카테고리 목록 |
| activeCategory | String | '전체' | 현재 활성화된 카테고리 |
| searchPlaceholder | String | "상품명을 검색하세요..." | 검색창 플레이스홀더 |

### SearchBar

| Props | 타입 | 기본값 | 설명 |
|-------|------|-------|------|
| onSearch | Function | - | 검색 실행 시 호출되는 함수 |
| placeholder | String | "상품명을 검색하세요..." | 검색창 플레이스홀더 |

### CategoryButtons

| Props | 타입 | 기본값 | 설명 |
|-------|------|-------|------|
| categories | Array | 기본 카테고리 | 카테고리 목록 |
| onCategorySelect | Function | - | 카테고리 선택 시 호출되는 함수 |
| activeCategory | String | '전체' | 현재 활성화된 카테고리 |

## 기본 카테고리

- 📋 전체
- 🍽️ 사료  
- 🛍️ 용품
- 🏀 장난감
- 🚶‍♂️ 산책

## 커스텀 카테고리

```jsx
const customCategories = [
  { name: '의류', icon: '👕' },
  { name: '액세서리', icon: '🎀' },
  { name: '건강식품', icon: '💊' }
];

<SearchSection categories={customCategories} />
```

## 스타일링

- Tailwind CSS 기반
- 반응형 디자인 지원
- 호버 효과 및 애니메이션 포함
- 핑크 테마 색상 사용

## 데모 페이지

`src/pages/SearchDemo.jsx` 파일에서 실제 사용 예시를 확인할 수 있습니다.
