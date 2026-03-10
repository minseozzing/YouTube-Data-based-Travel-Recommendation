# API 및 프론트엔드 데이터 연동 가이드

이 문서는 제공된 물가 관련 API 명세서가 프론트엔드의 각 페이지 및 컴포넌트와 어떻게 매핑되는지 설명합니다.

## 1. 글로벌 물가 탐색 페이지 (`CostPage.tsx`)

이 페이지는 전 세계 국가들의 물가 순위와 검색 기능을 제공하며, `/api/cost/cards` API와 밀접하게 연동됩니다.

### 연동 API: `GET /api/cost/cards`
- **모드별 매핑**:
  - `mode=top`: **"한국인이 자주 찾는 여행지 TOP"** 섹션에 데이터를 공급합니다.
  - `mode=change`: **"물가 변동이 큰 여행지"** (급상승/급하락) 섹션에 사용됩니다.
  - `mode=search`: 상단 검색바에서 국가/대륙 검색 시 결과를 필터링하여 리스트를 보여줄 때 사용됩니다.
- **데이터 필드 활용**:
  - `name`, `img_url`: `DestinationCard` 및 `SmallDestinationCard`의 제목과 배경 이미지.
  - `daily_budget`: 각 카드 하단의 "월/일 평균 예산" 표시.
  - `change_rate_percent`: 물가 변동률 아이콘(TrendingUp/Down)과 함께 표시.

---

## 2. 국가별 물가 상세 페이지 (`CountryCostDetailPage.tsx`)

특정 국가를 선택했을 때 진입하는 상세 페이지로, `/api/cost/detail` 및 환율 관련 API를 사용합니다.

### 연동 API: `GET /api/cost/detail`
- **`living_cost` 상세 필드 매핑**:
  - `daily_budget`, `without_rent`: 상단 KPI 카드(`PriceIndexCard`)에 표시되는 핵심 지표.
  - `monthly_salary_after_tax`, `population`: `PPPIndexCard`에서 구매력 지수 계산 및 정보성 데이터로 활용.
  - **카테고리별 물가 (`eating_out`, `transportation`, `groceries`, `other`)**: 페이지 중단의 `PriceItemTable` 컴포넌트에서 각 항목별(식비, 교통비, 생필품 등) 상세 가격 리스트를 구성합니다.

### 연동 API: `GET /api/exchange-rate` & `/history`
- `CountryHero` 및 각 가격 표시부에서 실시간 환율을 반영하여 KRW 환산 금액을 보여줄 때 사용됩니다.

---

## 3. 도시 상세 모달 - 물가 비교 탭 (`CostCompareTab.tsx`)

메인 페이지 지구본에서 도시를 클릭하여 여는 모달의 '물가' 탭입니다. `/api/cost/compare/{city_id}` API의 데이터를 직접적으로 시각화합니다.

### 연동 API: `GET /api/cost/compare/{city_id}`
- **`cost_vs_seoul` 매핑**:
  - `daily_budget_gap_percent`: 상단 좌측의 **"서울 대비 생활비"** 카드에 "약 X% 높을 수/낮을 수" 문구로 표시.
  - `summary`: 하단 요약 텍스트로 활용.
- **`expected_daily_budget` 매핑**:
  - `total`, `breakdown`: 사용자의 하루 예상 지출 비용 및 항목별 비중(숙박, 식비 등) 표시.
- **`item_comparison` 매핑**:
  - `items` 리스트: 하단의 **"주요 항목별 비교"** 테이블에서 점심 식사, 커피, 버스비 등 구체적인 품목별 서울 가격 vs 현지 가격 비교표를 구성합니다.

---

## 4. 공통 데이터 흐름 요약

| API 엔드포인트 | 주요 사용 페이지/컴포넌트 | 핵심 데이터 필드 |
| :--- | :--- | :--- |
| `/api/cost/cards` | `CostPage` | `rank`, `daily_budget`, `change_rate_percent` |
| `/api/cost/detail` | `CountryCostDetailPage` | `eating_out`, `groceries`, `monthly_salary` |
| `/api/cost/compare/{id}`| `CostCompareTab` (모달) | `daily_budget_gap_percent`, `item_comparison` |
| `/api/exchange-rate` | 모든 물가 관련 UI | `rate`, `target_currency` |
| `/api/exchange-rate/history`| `CostCompareTab` (차트) | `trend` (일별/주별/월별 환율 추이) |
