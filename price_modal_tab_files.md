# 물가 모달 탭 관련 프론트엔드 파일 구조

물가 모달 탭(City Detail Modal - Cost Tab)의 기능 및 UI와 관련된 주요 파일 목록입니다.

## 1. Pages & Main Layout (페이지 및 메인 레이아웃)
- `frontend/src/pages/MainPage.tsx`: 메인 페이지 컴포넌트로, 도시 상세 모달(`CityDetailModal`)이 배치되는 최상위 지점입니다.
- `frontend/src/components/main/RightPanel.tsx`: 메인 페이지 우측 패널로, '상세 보기' 버튼을 통해 물가 정보가 포함된 모달을 엽니다.

## 2. Components (UI 컴포넌트)
- `frontend/src/components/city/CityDetailModal.tsx`: 도시 상세 정보 모달의 메인 컨테이너로, 물가 탭을 포함한 전체 탭 시스템을 관리합니다.
- `frontend/src/components/city/CityDetailTabNav.tsx`: 모달 내에서 '추천', '물가', '항공', '뉴스' 탭 간의 전환을 담당하는 네비게이션바입니다.
- `frontend/src/components/city/tabs/CostCompareTab.tsx`: '물가' 탭의 실제 콘텐츠 영역으로, 서울 대비 생활비 비교 및 각종 물가 차트를 표시합니다.
- `frontend/src/components/city/DestinationHeroCard.tsx`: 모달 좌측 섹션에서 도시의 이미지와 기본 정보를 시각적으로 보여주는 컴포넌트입니다.

## 3. Hooks (데이터 페칭 및 로직)
- `frontend/src/hooks/cost/useCountryCost.ts`: 특정 국가/도시의 물가 데이터를 서버 또는 더미 데이터로부터 가져오는 커스텀 훅입니다.
- `frontend/src/hooks/city/useCityDetail.ts`: 선택된 도시의 상세 프로필 정보를 조회하는 커스텀 훅입니다.
- `frontend/src/hooks/cost/useExchangeRate.ts`: 실시간 환율 정보 및 과거 환율 추이 데이터를 가져오는 커스텀 훅입니다.

## 4. API & Data (네트워크 및 정적 데이터)
- `frontend/src/api/cost.api.ts`: 물가 리스트, 상세 정보, 도시 간 물가 비교 API 호출을 위한 Axios 함수들이 정의되어 있습니다.
- `frontend/src/api/city.api.ts`: 도시 기본 정보 및 상세 데이터를 가져오기 위한 API 통신 함수들을 포함합니다.
- `frontend/src/data/dummyCityData.ts`: 백엔드 API 미완성 시 사용되는 도시 및 물가 관련 테스트용 더미 데이터가 정의된 파일입니다.

## 5. Schemas & Types (데이터 정의)
- `frontend/src/schemas/cost.schema.ts`: 물가 데이터의 구조(Zod 스키마)와 TypeScript 타입을 정의하여 데이터 안정성을 보장합니다.
- `frontend/src/schemas/city.schema.ts`: 도시 정보 및 모달 탭 관련 상태를 위한 타입 정의가 포함되어 있습니다.

## 6. State Management (전역 상태)
- `frontend/src/stores/uiStore.ts`: 모달의 노출 여부, 선택된 도시 ID, 현재 활성 탭 상태를 관리하는 Zustand 스토어입니다.
