# 검색 바와 카테고리 컴포넌트

스크린샷과 유사한 검색 바와 카테고리 버튼 UI 컴포넌트입니다.

## 컴포넌트 구조

```
src/components/products/search/
├── SearchBar.jsx         # 검색 입력창
├── CategoryButtons.jsx   # 카테고리 버튼들
├── SearchSection.jsx     # 통합 검색 섹션
├── search.css           # 전용 스타일 파일
└── README.md            # 사용 가이드
```

## CSS 모듈 구조

모든 스타일은 `search.css` 파일에 분리되어 있으며, App.css와 독립적으로 관리됩니다.

### 주요 CSS 클래스

- `.search-container` - 전체 검색 섹션 컨테이너
- `.search-bar-wrapper` - 검색 바 래퍼
- `.search-input-container` - 검색 입력 컨테이너
- `.search-input` - 검색 입력 필드
- `.search-button` - 검색 버튼
- `.category-buttons-container` - 카테고리 버튼 컨테이너
- `.category-button` - 개별 카테고리 버튼
- `.category-button.active` - 활성화된 카테고리 버튼

## 사용 방법

### 1. 전체 검색 섹션 사용

```jsx
import SearchSection from '../components/products/search/SearchSection';

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
        isLoading={false}
      />
    </div>
  );
};
```

### 2. 개별 컴포넌트 사용

```jsx
import SearchBar from '../components/products/search/SearchBar';
import CategoryButtons from '../components/products/search/CategoryButtons';

const MyPage = () => {
  return (
    <div>
      <SearchBar 
        onSearch={(term) => console.log(term)}
        placeholder="검색하세요..."
        isLoading={false}
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
| isLoading | Boolean | false | 로딩 상태 |

### SearchBar

| Props | 타입 | 기본값 | 설명 |
|-------|------|-------|------|
| onSearch | Function | - | 검색 실행 시 호출되는 함수 |
| placeholder | String | "상품명을 검색하세요..." | 검색창 플레이스홀더 |
| isLoading | Boolean | false | 로딩 상태 |

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

## 스타일 커스터마이징

`search.css` 파일을 수정하여 스타일을 커스터마이징할 수 있습니다:

```css
/* 검색 버튼 색상 변경 */
.search-button {
  background: linear-gradient(135deg, #your-color, #your-color-dark);
}

/* 카테고리 버튼 활성 색상 변경 */
.category-button.active {
  background: linear-gradient(135deg, #your-color, #your-color-dark);
}

/* 컨테이너 배경 변경 */
.search-container {
  background: linear-gradient(135deg, #your-bg-color1, #your-bg-color2);
}
```

## 특징

- ✅ **독립적인 CSS 모듈**: App.css와 분리된 전용 스타일 파일
- ✅ **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원
- ✅ **애니메이션 효과**: 부드러운 호버, 클릭 애니메이션
- ✅ **로딩 상태 지원**: 검색 중 로딩 표시
- ✅ **접근성**: 키보드 네비게이션 및 포커스 관리
- ✅ **커스터마이징**: 쉬운 스타일 및 카테고리 변경

## 데모 페이지

`src/pages/SearchDemo.jsx` 파일에서 실제 사용 예시를 확인할 수 있습니다.
