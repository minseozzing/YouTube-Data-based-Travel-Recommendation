# API 연동 현황 및 UI 데이터 매핑 리포트

현재 프로젝트의 물가 관련 API 연동 상태와 각 데이터가 UI에서 어떻게 표현되고 있는지에 대한 상세 분석 결과입니다.

---

## 1. 글로벌 물가 탐색 페이지 (`CostPage.tsx`)

| 항목 | 상태 | 상세 내용 |
| :--- | :--- | :--- |
| **연동 API** | **미연동 (Dummy)** | 현재 `TOP_DESTINATIONS`, `CHEAP_DESTINATIONS` 등의 상수를 직접 사용 중입니다. |
| **미흡 사항** | API 호출 부재 | `/api/cost/cards` API를 호출하는 `useCountryCostCards` 훅이 구현되지 않았습니다. |
| **UI 표현** | 카드 리스트 | 국가 이미지, 이름, 평균 물가(텍스트)가 `DestinationCard`로 표현됩니다. |

---

## 2. 국가별 물가 상세 페이지 (`CountryCostDetailPage.tsx`)

| 항목 | 상태 | 상세 내용 |
| :--- | :--- | :--- |
| **연동 API** | **연동 완료 (Partial)** | `useCountryCost` 훅을 통해 `/api/cost/countries/{id}` API를 호출합니다. |
| **데이터 흐름** | API -> UI | `data.onePerson`, `data.familyOf4` 등의 실제 API 데이터를 수신합니다. |
| **UI 표현** | 지표 및 테이블 | `PriceIndexCard`에서 1인 생활비를, `PriceItemTable`에서 항목별 상세 가격을 보여줍니다. |
| **미흡 사항** | 비교 데이터 | `CountrySelectorList`를 통한 국가 간 비교 기능은 현재 UI상에만 존재하며 실제 비교 API 연동은 확인이 필요합니다. |

---

## 3. 도시 상세 모달 - 물가 탭 (`CostCompareTab.tsx`)

| 항목 | 상태 | 상세 내용 |
| :--- | :--- | :--- |
| **연동 API** | **연동 중 (Fallback)** | `useCountryCost`를 사용하지만, 상세 비교 데이터는 `DUMMY_COST`로 대체 중입니다. |
| **UI 표현** | 차트 및 비교표 | `recharts`를 이용해 PPP 지수와 환율 추이를 막대 그래프로 시각화합니다. |
| **데이터 매핑** | 서울 대비 비율 | `SEOUL_COSTS` 상수와 현지 데이터를 비교하여 "약 X% 높음/낮음"을 계산하여 표시합니다. |
| **미흡 사항** | 비교 API 부재 | `/api/cost/compare/{city_id}` 전용 API를 호출하는 로직이 아직 적용되지 않았습니다. |

---

## 4. API별 데이터-UI 매핑 상세

### ① 국가 물가 상세 (`/api/cost/detail`)
- **`living_cost.eating_out`**: `PriceItemTable`의 "식비" 섹션에서 점심, 저녁, 외식 비용으로 렌더링.
- **`living_cost.transportation`**: `PriceItemTable`의 "교통" 섹션에서 대중교통 및 택시비로 렌더링.
- **`living_cost.monthly_salary_after_tax`**: `PPPIndexCard`에서 해당 국가의 경제 수준 지표로 활용.

### ② 물가 비교 (`/api/cost/compare/{city_id}`)
- **`daily_budget_gap_percent`**: 모달 상단 배지와 함께 "서울 대비 생활비" 수치로 직관적 표현.
- **`item_comparison`**: "주요 항목별 비교" 테이블에서 각 아이템(빅맥, 커피 등)의 가격 차이를 KRW로 환산하여 출력.

### ③ 환율 (`/api/exchange-rate/history`)
- **`trend` 리스트**: `CostCompareTab` 내의 "환율 추이" 막대 그래프의 X축(날짜)과 Y축(환율 값) 데이터로 사용.

---

## 5. 최종 요약 및 향후 과제

1.  **연동 성공**: `CountryCostDetailPage`는 실제 API 구조를 따라 데이터를 잘 받아오고 있습니다.
2.  **연동 필요**: `CostPage` 전체와 `CostCompareTab`의 상세 비교 로직은 현재 더미 데이터에 의존하고 있어, 명세서에 정의된 `/api/cost/cards` 및 `/api/cost/compare` API로의 교체가 시급합니다.
3.  **데이터 일관성**: 현재 UI에서 사용하는 데이터 구조(`OnePersonCost`)와 API 명세서의 구조(`living_cost`) 간의 필드명 매핑 작업을 통해 데이터 누락을 방지해야 합니다.
