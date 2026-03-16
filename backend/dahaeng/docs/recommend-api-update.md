# Recommend API Update

## 개요

이 문서는 추천 API와 도시 상세 API를 어떻게 바꿨는지, 현재 응답이 어떤 구조인지, 프론트가 어떤 흐름으로 호출해야 하는지, 그리고 추가 확장 포인트가 무엇인지 정리한 문서다.

## 이번 작업에서 바뀐 핵심

- `POST /api/recommend`는 더 이상 뉴스, 추천 문구, 관광지 목록까지 한 번에 많이 내려주지 않는다.
- 대신 추천 상위 3개 도시의 요약 정보만 내려준다.
- 다만 추천 상세를 같은 기준으로 다시 계산할 수 있도록 `requestContext`를 함께 내려준다.
- `GET /api/city/{id}?recommend=true`는 추천 목록에서 사용한 조건을 다시 받아 상세 정보를 계산한다.
- 위험도(`danger`)는 기존 팀원이 만든 `DangerService`를 그대로 재사용한다.
- 추천 상세 응답에서는 News API, Google Places, OpenAI 결과를 사용하도록 연결했다.

## API 흐름

### 1. 추천 목록 요청

프론트가 먼저 아래 API를 호출한다.

```http
POST /api/recommend
Content-Type: application/json
```

요청 예시:

```json
{
  "selectedTags": ["food", "nature"],
  "userDailyBudget": 1000,
  "travelDays": 3,
  "month": 5
}
```

### 2. 추천 목록 응답

서버는 추천 계산에 사용한 값과 추천 도시 상위 3개를 함께 반환한다.

응답 예시:

```json
{
  "requestContext": {
    "selectedTags": ["food", "nature"],
    "userDailyBudget": 1000.0,
    "travelDays": 3,
    "month": 5
  },
  "recommendations": [
    {
      "id": 1,
      "name": "Chicago",
      "imgUrl": null,
      "expectedBudgetFor1day": 906.0,
      "danger": {
        "countryName": "United States",
        "items": [
          {
            "level": "여행유의(일부)",
            "description": "하와이 제외한 지역"
          }
        ]
      },
      "lat": 41.8781,
      "lon": -87.6298
    },
    {
      "id": 2,
      "name": "Guam",
      "imgUrl": null,
      "expectedBudgetFor1day": 819.9,
      "danger": {
        "countryName": "United States",
        "items": [
          {
            "level": "여행유의(일부)",
            "description": "하와이 제외한 지역"
          }
        ]
      },
      "lat": 13.4443,
      "lon": 144.7937
    }
  ]
}
```

### 3. 추천 도시 상세 요청

사용자가 추천 도시 하나를 클릭하면, 프론트는 추천 목록 응답에서 받은 `requestContext`를 그대로 상세 API에 다시 넘긴다.

```http
GET /api/city/1?recommend=true&userDailyBudget=1000&travelDays=3&month=5&selectedTags=food&selectedTags=nature
```

### 4. 추천 도시 상세 응답

서버는 같은 예산, 같은 태그, 같은 여행월 기준으로 상세 점수와 추천 사유를 다시 계산해서 내려준다.

응답 예시:

```json
{
  "name": "Chicago",
  "score": {
    "finalScore": 72.4,
    "budgetScore": 11.8,
    "safetyScore": 7.5,
    "tagMatchScore": 40.0,
    "newPenaltyScore": -2.0
  },
  "recommendationReason": "예산과 선호 태그에 잘 맞고 최근 뉴스 흐름도 비교적 안정적이어서 추천된 도시입니다.",
  "livingCostFor1Day": {
    "food": 120.0,
    "transportation": 35.0
  },
  "airTicketAndHotel": {
    "airTicket": 650.0,
    "hotel": 101.0
  },
  "news": {
    "summation": "최근 시카고 여행 관련 기사들을 보면 관광, 이벤트, 치안 이슈가 함께 언급되지만 전반적으로 여행 수요는 유지되고 있습니다.",
    "top3": [
      {
        "title": "Chicago tourism sees spring rebound",
        "url": "https://example.com/news1",
        "content": "Chicago tourism is seeing a rebound this spring...",
        "description": "Visitor demand is recovering ahead of the summer season.",
        "urlToImage": "https://example.com/image1.jpg",
        "publishedAt": "2026-03-12T08:30:00Z"
      }
    ]
  },
  "danger": {
    "countryName": "United States",
    "items": [
      {
        "level": "여행유의(일부)",
        "description": "하와이 제외한 지역"
      }
    ]
  },
  "tags": [
    {
      "name": "food",
      "tagScore": 0.91
    },
    {
      "name": "nature",
      "tagScore": 0.77
    }
  ],
  "touristSpot": [
    {
      "name": "Millennium Park",
      "description": "Google Places가 보강한 관광지 설명",
      "lat": 41.8826,
      "lon": -87.6226,
      "imageUrl": "https://example.com/place-image.jpg",
      "tags": ["nature"]
    }
  ]
}
```

### 5. 일반 도시 상세 요청

추천 맥락 없이 일반 상세만 볼 경우에는 아래처럼 호출한다.

```http
GET /api/city/1?recommend=false
```

응답 예시:

```json
{
  "id": 1,
  "name": "Chicago",
  "livingCostFor1Day": {
    "food": 120.0,
    "transportation": 35.0
  },
  "airTicketAndHotel": {
    "airTicket": 650.0,
    "hotel": 101.0
  },
  "danger": {
    "countryName": "United States",
    "items": [
      {
        "level": "여행유의(일부)",
        "description": "하와이 제외한 지역"
      }
    ]
  },
  "tags": [
    {
      "name": "food",
      "tagScore": 0.91
    }
  ]
}
```

## 현재 추천 상세에서 실제로 채워지는 외부 API 데이터

### News API

추천 상세 응답의 `news.top3`에는 아래 필드가 들어간다.

- `title`
- `url`
- `description`
- `content`
- `urlToImage`
- `publishedAt`

즉, 이전처럼 `content`, `description`, `publishedAt`이 비어 있지 않고 News API 원본 응답을 그대로 매핑한다.

### Google Places

추천 상세 응답의 `touristSpot`은 Google Places enrichment 결과를 우선 사용한다.

- `description`
- `imageUrl`
- `lat`
- `lon`

API 키가 있으면 Google Places 보강 결과가 우선 반영되고, 실패하면 DB 기본값을 사용한다.
실패 원인은 서버 로그에 warning 레벨로 남기도록 수정했다.

### OpenAI

추천 상세 응답의 `recommendationReason`은 OpenAI narration service 결과를 사용한다.

만약 OpenAI 호출이 실패하면 fallback 문구를 사용한다.

## 외부 API 실패 로그

외부 API가 실패해도 사용자 응답은 fallback으로 내려가지만, 이제 서버 로그에는 원인이 남는다.

### News API

다음 상황에서 warning 로그가 남는다.

- News API 호출 실패
- 뉴스 요약용 OpenAI 호출 실패

예시:

```text
News API request failed for city=Tokyo, country=Japan: 401 Unauthorized
News summary generation failed for city=Tokyo, country=Japan: ...
```

### Google Places

다음 상황에서 warning 로그가 남는다.

- Google Places 검색 실패
- 사진 media 조회 실패
- Places API 권한, 과금, 키 문제

예시:

```text
Google Places enrichment failed for spot=Shibuya Crossing: 403 Forbidden
```

## 점수 계산 방식

### 추천 목록 도시 점수

추천 목록에서 도시 점수는 다음 요소를 조합한다.

- `budgetScore`
- `safetyScore`
- `tagScore`
- `newsPenaltyScore`

최종적으로 `totalScore`를 계산하고 상위 3개를 반환한다.

### 추천 상세 도시 점수

추천 상세도 같은 조건을 다시 받아 아래 값을 계산한다.

- `budgetScore`
- `safetyScore`
- `tagMatchScore`
- `newPenaltyScore`
- `finalScore`

상세 API가 `requestContext`를 다시 받기 때문에 추천 목록과 같은 기준으로 계산할 수 있다.

## 각 관광지에도 점수를 줄 수 있는가

가능하다.

현재 내부적으로는 관광지별 태그 점수 맵을 이미 만들고 있다. 추천 서비스 내부의 `RecommendedPlace`에는 아래 값이 이미 존재한다.

- `categoryTags`
- `tagScores`

즉, 내부 데이터 기준으로는 각 관광지별 매칭 점수를 계산할 준비가 되어 있다.

### 현재 상태

- 추천 상세 응답의 `touristSpot`에는 이제 `tags`가 포함된다.
- `tags`는 내부 `tagScores` 중 0보다 큰 태그만 추려서 내려준다.
- `spotScore`는 아직 노출하지 않는다.

현재 실제 `touristSpot` 응답 형태:

```json
{
  "name": "Millennium Park",
  "description": "Google Places가 보강한 관광지 설명",
  "lat": 41.8826,
  "lon": -87.6226,
  "imageUrl": "https://example.com/place-image.jpg",
  "tags": ["nature"]
}
```

### 바로 확장 가능한 방식

`touristSpot` 응답에 예를 들어 아래 필드를 추가하면 된다.

```json
{
  "name": "Millennium Park",
  "description": "Google Places가 보강한 관광지 설명",
  "lat": 41.8826,
  "lon": -87.6226,
  "imageUrl": "https://example.com/place-image.jpg",
  "spotScore": 8.7,
  "tagScores": {
    "food": 0.2,
    "nature": 0.9
  }
}
```

### 관광지 점수 계산 예시

아래 방식으로 계산할 수 있다.

- 선택 태그 점수 평균
- 선택 태그 점수 합계
- 상위 태그 가중합
- Google Places 보강 성공 여부 가산점

가장 단순한 버전은:

- `spotScore = selectedTags에 대한 tagScores 합계`

가장 실용적인 버전은:

- `spotScore = 태그 매칭 점수 + 이미지 보유 가산점 + 설명 보강 가산점`

즉, 지금 구조에서는 관광지별 점수 추가가 어렵지 않고, 응답 DTO만 확장하면 바로 붙일 수 있다.

## 현재 기준 최종 정리

### 이미 반영된 것

- `POST /api/recommend`는 `requestContext + recommendations` 구조로 응답
- 추천 상위 3개 도시만 요약형으로 반환
- `GET /api/city/{id}?recommend=true`는 예산, 태그, 여행월을 다시 받아 같은 기준으로 상세 계산
- 추천 상세에서 `budgetScore`, `finalScore`, `recommendationReason` 재계산
- 추천 상세에서 News API 기사 상세 필드 사용
- 추천 상세에서 Google Places 관광지 보강 사용
- 추천 상세에서 OpenAI 추천 문구 사용
- `danger`는 기존 `DangerService` 재사용

### 아직 응답에 없는 것

- `touristSpot.spotScore`
- `touristSpot.tagScores`

즉, 관광지별 태그는 현재 API 응답에 포함되지만, 관광지별 점수는 아직 포함되지 않는다.

### 다음에 바로 확장 가능한 것

아래 형태로 확장 가능하다.

```json
{
  "touristSpot": [
    {
      "name": "Millennium Park",
      "description": "Google Places가 보강한 관광지 설명",
      "lat": 41.8826,
      "lon": -87.6226,
      "imageUrl": "https://example.com/place-image.jpg",
      "spotScore": 8.7,
      "tagScores": {
        "food": 0.2,
        "nature": 0.9
      }
    }
  ]
}
```

## 구현 메모

- `POST /api/recommend`는 요약형 응답으로 유지
- 추천 조건은 `requestContext`로 함께 반환
- `GET /api/city/{id}?recommend=true`는 그 조건을 query parameter로 다시 받음
- `danger`는 기존 `DangerService.dangers(countryId)` 재사용
- 추천 상세는 News API, Google Places, OpenAI를 사용
- News API 기사 상세 필드도 현재는 응답에 포함

## 더미 데이터 시딩

모든 기능을 바로 테스트할 수 있도록 서버 시작 시 추천용 더미 데이터를 자동으로 넣는 시더를 추가했다.

시더 파일:

- `src/main/java/com/example/dahaeng/global/init/DemoDataSeeder.java`

설정:

- `src/main/resources/application.yml`
  - `app.demo-data.enabled: true`
- `src/main/resources/application-example.yml`
  - `app.demo-data.enabled: ${DEMO_DATA_ENABLED:false}`

### 시딩 방식

- 서버 실행 시 `DemoDataSeeder`가 동작한다.
- 같은 이름의 국가, 도시, 태그, 관광지, 월별 항공 데이터가 있으면 update
- 없으면 insert
- 즉, 로컬에서 여러 번 실행해도 같은 테스트용 데이터를 유지하도록 idempotent 방식으로 구성했다.

### 자동으로 들어가는 더미 데이터

#### 카테고리

- `travel`

#### 태그

- `food`
- `nature`
- `city`
- `art`
- `beach`
- `healing`

#### 국가

- `United States`
- `Japan`
- `Vietnam`

#### 위험도

- 미국: `여행유의(일부)` / `하와이 제외한 지역`
- 일본: `철수권고(일부)` / `후쿠시마 원전 반경 30km 이내 및 일본 정부 지정 피난지시구역`
- 베트남: `여행유의` / `전 지역`

#### 도시

- `Chicago`
- `Guam`
- `Tokyo`
- `Da Nang`

#### 도시 태그

- Chicago: `food`, `city`, `art`
- Guam: `beach`, `healing`, `nature`
- Tokyo: `city`, `food`, `art`
- Da Nang: `beach`, `food`, `healing`

#### 생활비

각 도시에 대해 다음 데이터가 자동 생성된다.

- `daily_budget`
- `food`
- `transport`
- 점심, 저녁, 커피, 교통권, 택시 등 기본 생활비 컬럼

#### 항공/호텔 요약

각 도시에 대해 현재 연도의 `1월~12월` 전부 `flight_summary`가 생성된다.

예시:

- Chicago: `ORD`, 항공 `650`, 호텔 `101`
- Guam: `GUM`, 항공 `540`, 호텔 `85`
- Tokyo: `NRT`, 항공 `330`, 호텔 `110`
- Da Nang: `DAD`, 항공 `280`, 호텔 `60`

즉, 사용자가 어느 여행월을 넣어도 추천 API가 동작하도록 월별 데이터를 모두 넣는다.

#### 관광지

- Chicago
  - `Millennium Park`
  - `Art Institute of Chicago`
- Guam
  - `Tumon Beach`
  - `Two Lovers Point`
- Tokyo
  - `Shibuya Crossing`
  - `Senso-ji`
- Da Nang
  - `My Khe Beach`
  - `Dragon Bridge`

#### 관광지 태그

각 관광지에는 `spot_tags`가 연결된다.

예시:

- Millennium Park: `city`, `art`
- Tumon Beach: `beach`, `healing`
- Shibuya Crossing: `city`, `food`
- My Khe Beach: `beach`, `healing`

### 더미 데이터로 바로 테스트 가능한 기능

- 추천 상위 3개 도시 조회
- 추천 상세 조회
- 예산/태그/여행월 기준 점수 계산
- 위험도 응답
- 관광지 목록 조회
- 관광지 태그 조회
- Google Places 기반 관광지 보강
- OpenAI 추천 문구 생성
- News API 기반 뉴스 요약 및 기사 3개 조회

### 실행 후 확인 포인트

서버를 띄운 뒤 아래 흐름으로 바로 확인할 수 있다.

1. `POST /api/recommend`
2. 응답에서 `requestContext`와 추천 도시 `id` 확인
3. `GET /api/city/{id}?recommend=true...` 호출
4. `touristSpot.tags`, `news.top3`, `recommendationReason`, `danger` 확인

## 수정 파일

- `src/main/java/com/example/dahaeng/domain/recommend/controller/RecommendController.java`
- `src/main/java/com/example/dahaeng/domain/recommend/Service/RecommendFacade.java`
- `src/main/java/com/example/dahaeng/domain/recommend/Service/CityRankResult.java`
- `src/main/java/com/example/dahaeng/domain/recommend/repository/RecommendQueryRepository.java`
- `src/main/java/com/example/dahaeng/domain/recommend/repository/CityCandidateProjection.java`
- `src/main/java/com/example/dahaeng/domain/recommend/dto/response/RecommendCitySummaryResponse.java`
- `src/main/java/com/example/dahaeng/domain/recommend/dto/response/RecommendCitiesResponse.java`
- `src/main/java/com/example/dahaeng/domain/recommend/Service/NewsApiSearchService.java`
- `src/main/java/com/example/dahaeng/domain/recommend/Service/DummyNewsSerachService.java`
- `src/main/java/com/example/dahaeng/domain/city/controller/CityController.java`
- `src/main/java/com/example/dahaeng/domain/city/service/CityService.java`
- `docs/recommend-api-update.md`

## 검증

아래 명령으로 컴파일 검증을 진행했다.

```bash
./gradlew compileJava --project-cache-dir .gradle-home/project-cache
```

결과:

- 컴파일 성공
