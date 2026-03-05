# 다행 — 프론트엔드

여행 도시 추천 및 물가·항공·뉴스 정보를 제공하는 웹 애플리케이션의 프론트엔드입니다.

## 기술 스택

| 분류 | 기술 |
|------|------|
| 빌드 | Vite 7 + React 19 + TypeScript 5 |
| 라우팅 | TanStack Router |
| 서버 상태 | TanStack Query |
| HTTP | Axios |
| 전역 상태 | Zustand |
| 폼 / 검증 | React Hook Form + Zod |
| UI | Tailwind CSS v4 + shadcn/ui + Lucide React |
| 애니메이션 | Framer Motion |
| 인증 | @react-oauth/google |
| 테이블 | TanStack Table |
| 3D 글로브 | react-globe.gl |
| 차트 | Recharts |
| 날짜 | dayjs |

## 시작하기

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build

# 빌드 결과 미리보기
pnpm preview

# 린트 검사
pnpm lint
```

> **패키지 매니저는 pnpm만 사용합니다.** npm / yarn 사용 금지.

## 폴더 구조

```
src/
├── api/              # Axios 인스턴스 및 TanStack Query 커스텀 훅
├── components/
│   ├── ui/           # shadcn/ui 등 공통 재사용 컴포넌트
│   └── layout/       # 헤더, 푸터, 네비게이션 등 레이아웃 컴포넌트
├── pages/            # 실제 화면 단위 컴포넌트 (PAGE-101, PAGE-201 ...)
├── routes/           # TanStack Router 라우트 설정 파일
├── store/            # Zustand 전역 상태 스토어
├── types/            # Zod 스키마 및 TypeScript 타입 정의
└── utils/            # dayjs 설정, 포맷터 등 유틸 함수
```

### 주요 규칙

- `api/` — 서버 통신 로직은 여기에만 작성. 컴포넌트에서 직접 axios 호출 금지.
- `pages/` — 라우트에 직접 연결되는 페이지 컴포넌트. 비즈니스 로직 최소화.
- `components/ui/` — 특정 도메인에 종속되지 않는 순수 UI 컴포넌트만.
- `store/` — 서버 상태는 TanStack Query, 클라이언트 전역 상태만 Zustand 사용.
