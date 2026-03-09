# 하둡 layer 구성

| Layer | 저장 포맷 | 이유 |
| --- | --- | --- |
| **Bronze** | JSONL | 원본 보존, 스키마 변경 대응 |
| **Silver** | **Parquet** | 정제 데이터, 분석/조인 |
| **Gold** | **Parquet** | 서비스/집계 데이터 |

---

# 1️⃣ 왜 Silver를 Parquet로 저장하냐

Silver는 **정제 + 정규화된 데이터**라서 분석이 많이 일어나.

Parquet 장점

1️⃣ **컬럼 기반 저장**

예:

```
country | date | rate
```

Spark가 `rate`만 필요하면 **rate 컬럼만 읽음**

→ I/O 감소

→ 속도 증가

---

2️⃣ **압축 효율이 좋음**

예

```
CSV   10GB
JSON  15GB
Parquet 2~3GB
```

특히 같은 값이 반복되는 컬럼 (country, currency 등)에 강함.

---

3️⃣ **Predicate Pushdown**

예

```sql
WHERE date = '2026-03-04'
```

Parquet은 **파일 metadata로 해당 row group을 건너뜀**

→ Spark 속도 크게 개선

---

# 2️⃣ Gold도 Parquet 쓰는 이유

Gold는 보통

- 집계
- 추천 결과
- 서비스 조회

같은 **조회 중심 데이터**라서 Parquet이 좋음.

예

```
city_travel_stats.parquet

city
country
avg_flight_price
risk_score
cost_index
```

서비스에서 Spark / Trino / Presto로 바로 조회 가능.

---

# 3️⃣ 실제 데이터 레이크 구조 예

너희 프로젝트 기준

```
HDFS
 ├─ bronze
 │   ├─ news/
 │   │   └─ dt=2026-03-04/*.jsonl
 │   ├─ fx/
 │   └─ flights/
 │
 ├─ silver
 │   ├─ news_clean/
 │   │   └─ dt=2026-03-04/*.parquet
 │   ├─ fx_rates/
 │   └─ flights_clean/
 │
 └─ gold
     ├─ city_travel_stats/
     ├─ city_risk_scores/
     └─ travel_recommendations/
```

---

# 4️⃣ 예외 상황

가끔 Gold는 이런 것도 씀

| 포맷 | 이유 |
| --- | --- |
| **Parquet** | 일반적인 분석 |
| **Delta / Iceberg / Hudi** | 업데이트/ACID 필요 |
| **Redis / MongoDB** | 서비스 API |

하지만 **Spark 기반 프로젝트라면 대부분 Gold도 Parquet**이야.

---

# ⭐ 너희 프로젝트에서 추천 구조

뉴스 + 항공권 + 환율

```
Bronze
 → JSONL

Silver
 → Parquet (정규화 데이터)

Gold
 → Parquet (도시별 여행 지표 / 위험도 / 가격)
```

---

💡 하나만 더 중요한 팁을 말하면

**Parquet에서는 “파일 크기”가 굉장히 중요해.**

Spark에서 가장 좋은 크기

```
128MB ~ 512MB
```

이걸 맞추면 **쿼리 속도가 몇 배 차이** 나.

---