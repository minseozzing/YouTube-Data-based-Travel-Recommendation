# home/ vs MainPage + components 비교 분석

> 작성 기준: `src/pages/home/` (구버전) vs `src/pages/MainPage.tsx` + `src/components/main/` + `src/components/globe/` (신버전)

---

## 1. 파일 대응표

| 구버전 (`src/pages/home/`) | 신버전 (`src/pages/`, `src/components/`) | 관계 |
|---|---|---|
| `home/index.tsx` | `pages/MainPage.tsx` | 교체 |
| `home/components/NavBar.tsx` | `components/main/MainNavBar.tsx` | 교체 (기능 확장) |
| `home/components/LeftSidebar.tsx` | `components/main/LeftSidebar.tsx` + `TripSettingsPanel.tsx` + `TopMatchingList.tsx` + `TopMatchingCard.tsx` | 분리 확장 |
| `home/components/RightPanel.tsx` | `components/main/RightPanel.tsx` | 교체 (역할 축소 + 진입점 추가) |
| _(없음)_ | `components/globe/GlobeViewer.tsx` | 신규 추가 |
| _(없음)_ | `components/globe/GlobeContainer.tsx` | 신규 추가 |
| _(없음)_ | `components/city/CityDetailModal.tsx` | 신규 추가 |
| _(없음)_ | `components/main/HeroTextBlock.tsx` | 신규 추가 |
| _(없음)_ | `components/main/StatBar.tsx` | 신규 추가 |

---

## 2. 전체 구조 비교

### 구버전 컴포넌트 계층
```
HomePage
├── NavBar                      (정적 - 하드코딩)
├── LeftSidebar
│   ├── 여행 설정 (예산, 기간)   (로컬 useState)
│   └── 매칭 여행지 목록          (3개 하드코딩)
├── Globe (직접 사용)            (13개 마커 하드코딩)
├── RightPanel                  (하드코딩: "파리, 프랑스")
│   ├── 4개 탭 (정적 콘텐츠)
│   ├── 가격 정보
│   └── 상세보기 버튼            (동작 없음)
└── 패널 토글 버튼
```

### 신버전 컴포넌트 계층
```
MainPage
├── MainNavBar                  (동적 - authStore 연동)
├── LeftSidebar
│   ├── TripSettingsPanel       (예산/기간/위험도 + useRecommend API)
│   └── TopMatchingList         (TOP 5, useCityList API + 로딩/빈상태)
│       └── TopMatchingCard × 5
├── GlobeContainer (lazy)
│   └── GlobeViewer             (15개 마커, 필터링, 점수별 색상)
├── HeroTextBlock               (신규 - 오버레이 텍스트)
├── StatBar                     (신규 - 4개 통계)
├── RightPanel (슬라이드)        (도시 요약 + 상세보기 진입점)
└── CityDetailModal (전체화면)   (4탭 상세정보)
    ├── DestinationHeroCard
    ├── CityDetailTabNav
    └── RecommendTab / CostCompareTab / FlightTab / NewsTab
```

---

## 3. 항목별 상세 비교

### 3-1. 상태 관리

| 항목 | 구버전 | 신버전 |
|---|---|---|
| RightPanel 열고/닫기 | `isPanelOpen: useState` (HomePage 로컬) | `isRightPanelOpen` (Zustand uiStore) |
| 선택된 도시 | 없음 | `selectedCityId` (Zustand, RightPanel·Modal 공유) |
| 예산 입력값 | `budget: useState` (LeftSidebar 로컬) | `globeBudgetFilter` (Zustand) |
| 기간 입력값 | `duration: useState` (LeftSidebar 로컬) | TripSettingsPanel 로컬 (API 전송용) |
| 위험도 | 없음 | `globeRiskFilter: 1~5` (Zustand) |
| 탭 상태 | `activeTab: useState` (RightPanel 로컬) | `activeCityTab` (Zustand) |

**평가**: 신버전이 명확히 우수. 구버전은 컴포넌트 간 상태 공유가 불가능해 Globe 클릭 → RightPanel 연동이 구현되어 있지 않다.

---

### 3-2. NavBar 비교

| 항목 | 구버전 `NavBar.tsx` | 신버전 `MainNavBar.tsx` |
|---|---|---|
| 로고 | 텍스트 정적 | Link 라우터 연결 |
| 네비게이션 | 하드코딩 항목 | 북마크(/bookmarks), 물가(/cost) 라우터 Link |
| 사용자 영역 | "회원가입 · 로그인" 버튼 (동작 없음) | `useAuthStore` 연동, 프로필 이미지, 로그아웃 |
| 스타일 | `bg-white/85 backdrop-blur` | 동일 패턴 |

**평가**: 신버전 우수. 실제 인증 연동 및 라우팅이 완성되어 있음.

---

### 3-3. LeftSidebar 비교

| 항목 | 구버전 `LeftSidebar.tsx` | 신버전 `TripSettingsPanel.tsx` + `TopMatchingList.tsx` |
|---|---|---|
| 예산 통화 | `$` (USD) | `₩` (KRW) |
| 위험도 필터 | 없음 | 슬라이더 (1~5단계) |
| 추천 업데이트 | 버튼 있으나 동작 없음 | `useRecommend` API 실제 호출 |
| 매칭 목록 | 3개 하드코딩 (시드니, 리스본, 발리) | `useCityList` API 기반 TOP 5 동적 정렬 |
| 매칭 카드 클릭 | 동작 없음 | `openRightPanel(cityId)` 연동 |
| 로딩 상태 | 없음 | Skeleton 컴포넌트 |
| 빈 상태 | 없음 | MapPin 아이콘 + 안내 메시지 |

**평가**: 신버전 대폭 개선. 특히 API 연동과 상태 연결이 핵심 차이.

---

### 3-4. Globe 비교

| 항목 | 구버전 `home/index.tsx` 내부 | 신버전 `GlobeViewer.tsx` + `GlobeContainer.tsx` |
|---|---|---|
| 분리 여부 | HomePage에 직접 인라인 | 별도 컴포넌트로 분리 |
| 지연 로딩 | 없음 (번들 통합) | `lazy()` + `Suspense` (코드 스플리팅) |
| 마커 수 | 13개 하드코딩 | 15개 (API + DUMMY_CITIES 폴백) |
| 마커 색상 | 노란색 고정 | 매칭 점수별 (≥80: 초록, ≥50: 파랑, <50: 주황) |
| 마커 크기 | `size` 필드 개별 설정 | 통일된 `pointRadius=0.5` |
| 필터링 | 없음 | 예산 범위 + 위험도 필터 (useMemo 최적화) |
| 클릭 이벤트 | 없음 | `openRightPanel(cityId)` |
| 크기 조정 | ResizeObserver (globeSize state) | ResizeObserver (GlobeContainer) |
| 초기 시점 | 한반도 중심 (35, 127) | 동일 (35, 127) |

**평가**: 신버전 우수. 코드 스플리팅으로 초기 로딩 성능 개선. 마커 클릭 → 상세정보 연동이 핵심.

---

### 3-5. RightPanel 비교

| 항목 | 구버전 `RightPanel.tsx` | 신버전 `RightPanel.tsx` |
|---|---|---|
| 역할 | 도시 상세 정보 전부 담당 | 요약 정보만 표시 (진입점 역할) |
| 도시 데이터 | 하드코딩 "파리, 프랑스" | `useCityDetail(selectedCityId)` API + 폴백 |
| 헤더 | 노란 원 + 텍스트 | 실제 도시 이미지 + 매칭% 배지 |
| 탭 내용 | 4개 탭 (정적 더미) | 없음 (탭은 CityDetailModal로 이동) |
| 비용 표시 | $1,800~$2,200 하드코딩 | 일 예산 ₩, 항공비 ₩ (API 기반) |
| 상세보기 버튼 | 동작 없음 | `openCityModal()` → 전체화면 모달 진입 |
| 애니메이션 | `AnimatePresence` 슬라이드 | 동일 (`AnimatePresence`) |
| 닫기 | X 버튼 (`isPanelOpen=false`) | X 버튼 (`closeRightPanel()`) |

**평가**: 신버전이 역할 분리 측면에서 우수. 구버전은 RightPanel 하나가 너무 많은 책임을 가짐.

---

### 3-6. 신버전에만 있는 컴포넌트

| 컴포넌트 | 역할 | 구버전 대응 |
|---|---|---|
| `CityDetailModal` | 전체화면 도시 상세 (4탭) | RightPanel의 탭 기능을 분리하여 확장 |
| `HeroTextBlock` | 메인 페이지 오버레이 텍스트 | 없음 |
| `StatBar` | 하단 4개 통계 (유저수, 항공비, 생활비, 안전) | 없음 |
| `DestinationHeroCard` | 모달 좌측 도시 이미지 카드 | 없음 |
| `CityDetailTabNav` | 모달 탭 네비게이션 | RightPanel 내부 탭 (기능 분리) |
| `RecommendTab` | 추천 이유 + 키워드 + 관련정보 | RightPanel "추천" 탭 (정적 더미) |
| `CostCompareTab` | 서울 대비 생활비 비교 차트 | RightPanel "물가" 탭 (정적 더미) |
| `FlightTab` | 월별 항공권 가격 추이 | RightPanel "항공권" 탭 (정적 더미) |
| `NewsTab` | 현지 뉴스 요약 + 기사 목록 | RightPanel "뉴스" 탭 (정적 더미) |

---

## 4. UX 흐름 비교

### 구버전 흐름
```
진입 → 페이지 표시
  → Globe 클릭 → 아무 반응 없음
  → 매칭 카드 클릭 → 아무 반응 없음
  → RightPanel: 항상 "파리, 프랑스" 고정 표시
  → 상세보기 버튼 → 아무 반응 없음
```

### 신버전 흐름
```
진입 → 인증 확인 → 페이지 표시
  → Globe 마커 클릭 (또는 TopMatchingCard 클릭)
      → RightPanel 슬라이드 인
          → 선택된 도시 요약 (이미지, 키워드, 예산, 추천이유 미리보기)
          → "상세 보기" 클릭
              → CityDetailModal 전체화면
                  → 추천이유 탭 (AI 분석 + 키워드)
                  → 생활물가 탭 (서울 비교 차트)
                  → 항공권 탭 (월별 가격 추이)
                  → 뉴스 탭 (현지 뉴스 요약)
                  → X 버튼으로 닫기
```

---

## 5. 성능 비교

| 항목 | 구버전 | 신버전 |
|---|---|---|
| Globe 번들 분리 | ❌ 메인 번들에 포함 | ✅ `lazy()` + `Suspense` |
| 리스트 정렬 최적화 | ❌ | ✅ `useMemo` |
| 글로브 필터 최적화 | ❌ | ✅ `useMemo` |
| 이벤트 핸들러 최적화 | ❌ | ✅ `useCallback` |
| 로딩 상태 | ❌ 없음 | ✅ Skeleton |
| API 캐싱 | ❌ | ✅ TanStack Query (staleTime) |

---

## 6. 누락 / 미구현 항목 (구버전에 있으나 신버전에 미반영)

| 항목 | 구버전 | 신버전 상태 | 권장 조치 |
|---|---|---|---|
| 이미지 카드 갤러리 | RightPanel 하단 가로 스크롤 카드 | ❌ 미구현 | CityDetailModal RecommendTab에 추가 검토 |
| 총 여행 비용 범위 표시 | "$1,800 - $2,200" | ❌ 미구현 | RightPanel 또는 CostCompareTab에 추가 검토 |
| 패널 닫혔을 때 재열기 버튼 | 우측 "상세 보기" 토글 버튼 | ❌ 제거됨 | 현재 Globe 재클릭으로 대체 가능 |

---

## 7. 종합 추천

### 신버전 유지 권장 ✅

| 이유 | 설명 |
|---|---|
| **상태 관리 완성도** | Zustand 전역 상태로 컴포넌트 간 연동이 실제 동작함 |
| **API 연동 준비** | 모든 훅이 구현되어 있고 더미 폴백도 완비 |
| **UX 흐름** | 마커 클릭 → 요약 → 상세 전체화면 흐름이 직관적 |
| **확장성** | 컴포넌트 분리가 잘 되어 있어 기능 추가 용이 |
| **코드 품질** | TypeScript 타입, 에러 처리, 로딩 상태 모두 구현됨 |
| **성능** | lazy loading, useMemo, useCallback 적용 |

### 구버전에서 참고할 것 ⚠️

| 항목 | 구버전의 장점 | 반영 방법 |
|---|---|---|
| **이미지 갤러리** | 도시 이미지 가로 스크롤 카드가 시각적으로 풍부함 | RecommendTab 하단에 이미지 카드 섹션 추가 |
| **총 예산 범위** | `$1,800 - $2,200` 형식의 요약 비용 표시가 직관적 | RightPanel 상단에 총 예산 범위 추가 |
| **단순함** | 컴포넌트 구조가 단순해 파악이 빠름 | 참고용으로만 유지 |

### home/ 디렉토리 처리 권장

`src/pages/home/` 디렉토리는 현재 어떤 라우트에도 연결되어 있지 않아 실제 빌드에 포함되지 않는다.
신버전이 완전히 대체했으므로 **추후 정리 시 삭제해도 무방**하다.
단, 머지 이력 보존이나 참고 목적으로 잠시 유지할 수 있다.

---

## 8. 빠른 참조 요약

```
구버전 → 신버전 핵심 변화 5가지

1. 하드코딩 → API 연동 (더미 폴백 포함)
2. 로컬 상태 → Zustand 전역 상태
3. RightPanel 단독 → RightPanel(요약) + CityDetailModal(전체화면) 분리
4. Globe 인터랙션 없음 → 클릭 → 패널 → 모달 연동 완성
5. 인증 없음 → authStore + TanStack Router 인증 가드 연동
```
