# append_missing_airports.py 실행 시 추출 정보 요약

이 스크립트는 Google Flights의 Explore 페이지를 크롤링하여 인천 출발로 특정 목적지 공항(39개)으로의 여행 정보를 추출합니다. 월별(3월~8월)로 데이터를 수집하며, 기존 CSV 파일에 누락된 데이터를 추가합니다.

## 주요 추출 정보
- **월 (Month)**: 검색한 월 (예: 3월)
- **목적지 (Destination)**: 공항 코드 (예: ALA, ARN 등)
- **검색된 이름 (Searched As)**: 실제 검색에 사용된 텍스트
- **여행 날짜 (Dates)**: 추천 여행 기간
- **호텔 가격 (Hotel Price / Night)**: 숙박 1박당 가격 (₩ 단위)
- **항공권 가격 범위 (Flight Price Range/Low/High)**: 항공권 가격 범위 및 최저/최고가
- **성수기/비성수기 월 (Peak/Off Season Months)**: 성수기 및 비성수기 월 목록 (원본 텍스트 및 파싱된 목록)
- **항공편 상세 (Flight 1~3)**: 최대 3개의 항공편 정보
  - 항공사 (Airline)
  - 가격 (Price)
  - 경유 (Stops, Return Stops)
  - 소요시간 (Duration)
  - 출발/도착 공항 (Departure/Arrival Airport)
  - 대체 공항 여부 (Is Alternate Airport)
  - 대체 정보 (Alternate Info)
- **타임스탬프 (Timestamp)**: 데이터 수집 시간

## 출력
- 기존 CSV 파일(`explore_prices_live_20260306_132558.csv`)에 데이터를 추가하여 저장.
- 각 행은 월_목적지 조합으로 고유하게 식별됨.

## CSV 출력 데이터 형식
스크립트 실행 후 생성되는 CSV 파일의 컬럼은 "행 수준(레코드) 필드"와 "항공편 반복 필드(Flight N)"로 나뉩니다. 각 행은 하나의 월-목적지 조합을 나타내며, Flight 1~3까지 최대 3개의 항공편 정보를 포함합니다.

**핵심 필드 (Row-level)**

| 컬럼명 | 설명 | 데이터 형식 | 예시 |
|--------|------:|:------------:|------|
| Month | 검색한 월 | 문자열 | 3월 |
| Destination | 목적지 공항 코드 | 문자열 | ALA |
| Searched As | 실제 검색에 사용된 텍스트 | 문자열 | 알마티 |
| Dates | 추천 여행 기간 | 문자열 | 3월 15일~3월 22일 |
| Hotel Price / Night | 숙박 1박당 가격 (표시 형식) | 문자열 | ₩ 150,000 |
| Flight Price Range | 항공권 가격 범위 (표시형) | 문자열 | ₩ 500,000~₩ 700,000 |
| Flight Price Low | 최저 항공권 가격 | 문자열 | ₩ 500,000 |
| Flight Price High | 최고 항공권 가격 | 문자열 | ₩ 700,000 |
| Peak Season Months (Raw) | 성수기 월 원본 텍스트 | 문자열 | 8월~10월 및 12월 |
| Peak Season Months (List) | 파싱된 성수기 월 목록 (콤마 구분) | 문자열 | 8,9,10,12 |
| Off Season Months (Raw) | 비성수기 월 원본 텍스트 | 문자열 | 1월~3월 |
| Off Season Months (List) | 파싱된 비성수기 월 목록 (콤마 구분) | 문자열 | 1,2,3 |
| Timestamp | 데이터 수집 시간 (저장 시각) | 문자열 (YYYY-MM-DD HH:MM:SS) | 2026-03-06 14:25:30 |

**항공편 관련 필드 (Flight N — 반복, N=1..3)**

각 항공편 블록(Flight 1, Flight 2, Flight 3)은 아래 필드를 포함합니다. CSV에는 `Flight 1 Airline`, `Flight 1 Stops`, ... 처럼 접두사로 N이 붙은 컬럼이 생성됩니다.

| 필드 | 설명 | 데이터 형식 | 예시 |
|------|------:|:--------:|------|
| Airline | 항공사 이름 | 문자열 | 대한항공 |
| Stops | 경유 정보(편도) | 문자열 | 직항 / 1회 경유 |
| Return Stops | 왕복(돌아오는 편) 경유 정보 | 문자열 | 직항 |
| Duration | 소요 시간 | 문자열 | 10시간 30분 |
| Departure Airport | 출발 공항 표시(문자열) | 문자열 | ICN |
| Arrival Airport | 도착 공항 표시(문자열) | 문자열 | ALA |
| Price | 항공편 가격(표시형) | 문자열 | ₩ 550,000 |
| Is Alternate Airport | 대체 공항 여부 (데이터 소스에서 감지) | 문자열 (Yes/No/N/A) | No |
| Alternate Info | 대체 공항 관련 추가 텍스트 | 문자열 | "공항 대체: XYZ" |

Notes:
- Flight N 필드는 동일한 구조로 최대 3개(Flight 1~3)까지 생성됩니다.
- 값이 없을 경우 `N/A`로 채워집니다.
- 파일은 기존 CSV와 병합하여 덮어쓰기 방식으로 저장되며, 각 행의 고유키는 `Month_Destination` 입니다.
<parameter name="filePath">c:\Users\SSAFY\workspace\D206v1\S14P21D206\ai\google_flight\append_missing_airports_summary.md