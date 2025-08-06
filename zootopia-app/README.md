# 리액트 + 테일윈드 + 데이지UI
✅ 1단계: Tailwind CSS 설치
터미널에서 프로젝트 루트 디렉토리로 이동 후, 다음 명령어 실행:

npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

결과:
tailwind.config.js 생성됨

postcss.config.js 생성됨

✅ 2단계: Tailwind 설정
tailwind.config.js 수정:

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // React 컴포넌트 경로 포함
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}


✅ 3단계: Tailwind CSS 임포트
src/index.css 또는 src/main.css에 아래 3줄 추가:

@tailwind base;
@tailwind components;
@tailwind utilities;
보통 Vite 기본 템플릿에서는 src/index.css가 이미 연결되어 있어요. 아니면 main.jsx에서 수동으로 import 해주세요:

import './index.css'

✅ 4단계: DaisyUI 설치 및 설정

npm install daisyui
tailwind.config.js에 DaisyUI 플러그인 등록:

import daisyui from 'daisyui'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
}


✅ 5단계: 사용 확인 (예제 컴포넌트)
App.jsx 또는 아무 컴포넌트에서 아래처럼 사용해보세요:

function App() {
  return (
    <div className="p-4">
      <button className="btn btn-primary">Primary 버튼</button>
      <button className="btn btn-secondary ml-2">Secondary 버튼</button>
    </div>
  );
}

export default App;


실행:

npm run dev