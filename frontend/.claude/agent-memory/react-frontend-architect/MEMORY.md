# 다행 프로젝트 — React Frontend Architect Memory

## 프로젝트 기본 정보
- 위치: `C:/Users/SSAFY/workspace/D206v1/S14P21D206/frontend`
- 빌드 명령: `pnpm build` (tsc -b && vite build)
- 타입 체크: `pnpm exec tsc --noEmit`

## 스캐폴딩 완료 상태 (2026-03-04)
- 전체 src/ 구조 생성 완료, `pnpm build` 통과 확인

## 핵심 패턴

### verbatimModuleSyntax (중요)
tsconfig.app.json에 `"verbatimModuleSyntax": true` 설정됨.
타입만 쓰는 import는 반드시 `import type` 또는 `import { type X }` 사용.
```typescript
// WRONG
import { ReactNode, ErrorInfo } from 'react';
import { InternalAxiosRequestConfig } from 'axios';
// CORRECT
import type { ReactNode } from 'react';
import { type InternalAxiosRequestConfig } from 'axios';
```

### TanStack Router 경로 규칙
- routeTree.gen.ts의 `to` 타입: fullPath 기준 (e.g., `/main`, `/cost`, `/bookmarks`, `/mypage`)
- `/_authenticated/...` 경로는 ID이고, `to`는 `/main` 처럼 실제 URL path 사용
- `useNavigate({ from: '...' })` — `from` 없이 사용하면 더 유연함

### TanStack Router 파일명 규칙
- `src/routes/router.ts` — 라우트로 인식되어 경고 발생
- 라우트로 처리하지 않으려면 `-`로 시작: `src/routes/-router.ts`

### @tanstack/react-query-devtools
- 이 프로젝트에 설치되어 있지 않음
- main.tsx에서 import 금지

### 설치된 @tanstack 패키지
- @tanstack/react-query, @tanstack/react-router, @tanstack/react-table, @tanstack/router-plugin

## 라우트 fullPath 매핑
| 파일 ID | fullPath (to에 사용) |
|---|---|
| /_authenticated/main | /main |
| /_authenticated/cost | /cost |
| /_authenticated/cost/$countryId | /cost/$countryId |
| /_authenticated/bookmarks | /bookmarks |
| /_authenticated/bookmarks/$id | /bookmarks/$id |
| /_authenticated/mypage | /mypage |

## 인증 흐름
1. LoginPage → useGoogleLogin → GET /api/auth/google/login-url → window.location.href
2. /auth/callback?code=... → AuthCallbackPage → POST /api/auth/google/callback → authStore
3. hasCompletedPreference: false → /preference / true → /main

## staleTime 정책
- 도시 목록/상세: 5분
- 물가 데이터: 60분
- 환율: 30분
- 뉴스: 10분
- 북마크: 0 (즉시 갱신)

## 상세 문서 참조
- `architecture.md` — 전체 설계
- `notion-api.md` — API 명세
