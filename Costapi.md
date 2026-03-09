물가 카드 리스트	GET	/api/cost/cards	query param 
 - mode : top, change, search
 - change 일때 
    - sort : desc, asc
 - search 일때
    - type : contient, country
    - keyword : 대륙명 or 나라
Ex)
mode=search&type=continent&continent=Asia	{
    "mode": "top5",
    “
    "cards": [
      {
        "rank": 1,
        "id": 1,
        "name": "Switzerland",
        "img_url": "https://example.com/switzerland.jpg",
        "daily_budget": 120.5,
        "currency": "CHF",
        "change_rate_percent": 3.2
      }
    ]
}
	국가 단위 평균 물가
물가 상세 조회	GET	/api/cost/detail	query params
 - target_type : country, city
 - target_id : country_id or city_id	{
    "target_type": "country",
    "target": {
      "id": 81,
      "name": "Japan",
      "continent": "Asia",
      "currency": "JPY",
      "img_url": "https://example.com/images/japan.jpg"
    },
    "living_cost": {
      "id": 15,
      "daily_budget": 73.4,
      "without_rent": 980.0,
      "food": 420.0,
      "transport": 130.0,
      "monthly_salary_after_tax": 2200.0,
      "population": 125000000.0,
      "eating_out": {
        "lunch_menu": 10.0,
        "dinner_in_a_resturant_for_2": 20.0,
        "fast_food_meal": 7.5,
        "beer_in_a_pub": 5.2,
        "cappuccino": 4.0,
        "coke_pepsi": 2.0
      },
      "transportation": {
        "local_transport_ticket": 3.0,
        "monthly_ticket_local_transport": 55.0,
        "taxi_ride": 12.0,
        "gas_pterol": 1.4
      },
      "groceries": {
        "milk": 1.3,
        "bread": 2.1,
        "rice": 3.8,
        "egg": 2.9,
        "chicken": 8.4,
        "steak": 14.2,
        "apple": 2.5,
        "banana": 1.9,
        "orange": 2.4,
        "tomato": 2.7,
        "potato": 1.8,
        "onion": 1.6,
        "water": 0.8,
        "coke": 1.9,
        "wine": 12.0,
        "beer": 2.6,
        "cigarette": 4.5,
        "cold_medicine": 6.0,
        "shampoo": 5.5,
        "toilet_paper": 3.2,
        "toothpaste": 2.7
      },
      "other": {
        "gym_month": 45.0,
        "cinema_ticket": 11.0,
        "haircut": 18.0,
        "brand_jeans": 72.0,
        "brand_sneakers": 95.0
      },
      "created_at": "2026-03-08T10:00:00",
      "updated_at": "2026-03-08T10:00:00"
    }
}
	도시 상세 페이지에 필요한 모든 물가 정보
현재 환율	GET	/api/exchange-rate	query param 
 - currency : "USD", "VND", "JPY", "CNY", "HKD", "MOP", "THB", "PHP", "EUR", "RUB",    "AUD", "TWD", "GBP", "SGD", "IDR", "MYR", "CAD", "KHR", "MNT", "NZD",    "INR", "BRL", "CHF", "MXN", "HUF", "TRY", "ZAR", "LAK", "CZK", "AED",    "MVR", "QAR", "PLN", "SEK", "NOK", "PEN", "EGP", "MUR", "ISK", "DKK",    "BOB", "ARS", "CLP", "NPR", "KZT", "MAD", "CUP", "KES"	{
"base": "KRW",
"target": "USD",
"rate": 0.00075,
"asOf": "2026-03-02",
"meta": {
"lastUpdatedAt": "2026-03-02T01:00:00Z",
"source": "fx_provider_v1"
}
}	
환율 추이(일별/주별/월별 각각 7개)	GET	/api/exchange-rate/history	query param 
 - target_currency : "USD", "VND", "JPY", "CNY", "HKD", "MOP", "THB", "PHP", "EUR", "RUB",    "AUD", "TWD", "GBP", "SGD", "IDR", "MYR", "CAD", "KHR", "MNT", "NZD",    "INR", "BRL", "CHF", "MXN", "HUF", "TRY", "ZAR", "LAK", "CZK", "AED",    "MVR", "QAR", "PLN", "SEK", "NOK", "PEN", "EGP", "MUR", "ISK", "DKK",    "BOB", "ARS", "CLP", "NPR", "KZT", "MAD", "CUP", "KES"
 - type : “d”, “w” , “m”	{
    "base_currency": "KRW",
    "target_currency": "JPY",
    "type": "d",
    "latest": {
      "event_date": "2026-03-08",
      "rate_1krw_to_target": 0.11,
      "krw_per_1target": 9.09,
      "display_unit": 100,
      "display_symbol": "JPY(100)",
      "krw_per_display_unit": 909.0
    },
    "trend": [
      {
        "date": "2026-03-02",
        "rate_1krw_to_target": 0.108,
        "krw_per_1target": 9.26
      },
      {
        "date": "2026-03-03",
        "rate_1krw_to_target": 0.109,
        "krw_per_1target": 9.17
      },
      {
        "date": "2026-03-04",
        "rate_1krw_to_target": 0.109,
        "krw_per_1target": 9.17
      },
      {
        "date": "2026-03-05",
        "rate_1krw_to_target": 0.108,
        "krw_per_1target": 9.26
      },
      {
        "date": "2026-03-06",
        "rate_1krw_to_target": 0.11,
        "krw_per_1target": 9.09
      },
      {
        "date": "2026-03-07",
        "rate_1krw_to_target": 0.111,
        "krw_per_1target": 9.01
      },
      {
        "date": "2026-03-08",
        "rate_1krw_to_target": 0.11,
        "krw_per_1target": 9.09
      }
    ]
}	
물가 차이	GET	/api/cost/compare/{city_id}	query params 
 - target_city : city_id	{
  "base_city": {
    "id": 1,
    "name": "Seoul",
    "country": "South Korea",
    "currency": "KRW"
  },
  "target_city": {
     "id": 120,
     "name": "Tokyo",
     "country": "Japan",
     "currency": "JPY"
  },
  "cost_vs_seoul": {
     "currency": "KRW",
     "seoul_daily_budget": 150000,
     "target_daily_budget": 180000,
     "daily_budget_gap_krw": 30000,
     "daily_budget_gap_percent": 20.0,
     "summary": "Tokyo is more expensive than Seoul based on expected daily budget."
  },
  "expected_daily_budget": {
     "currency": "KRW",
     "total": 180000,
     "breakdown": {
          "food": 50000,
          "transport": 15000,
          "accommodation": 115000
  },
  "calculation_notes": [
     "food = estimated breakfast + lunch + dinner",
     "transport = average daily local transport usage",
     "accommodation = average 1 night stay cost"
  ]
  },
  "item_comparison": {
     "currency": "KRW",
     "base_city": "Seoul",
     "target_city": "Tokyo",
     "items": [
          {
               "item_key": "lunch_menu",
               "item_name": "점심 식사",
               "seoul_price": 12000,
               "target_price": 15000,
               "difference_krw": 3000,
               "difference_percent": 25.0
          },
          {
               "item_key": "dinner_for_2",
               "item_name": "저녁비 (2인)",
               "seoul_price": 70000,
               "target_price": 82000,
               "difference_krw": 12000,
               "difference_percent": 17.1
          },
          {
               "item_key": "big_mac",
               "item_name": "빅맥지수",
               "seoul_price": 5500,
               "target_price": 6200,
               "difference_krw": 700,
               "difference_percent": 12.7
          },
          {
               "item_key": "cappuccino",
               "item_name": "카푸치노",
               "seoul_price": 4800,
               "target_price": 5600,
               "difference_krw": 800,
               "difference_percent": 16.7
          },
          {
               "item_key": "coke",
               "item_name": "콜라",
               "seoul_price": 2200,
               "target_price": 2500,
               "difference_krw": 300,
               "difference_percent": 13.6
          },
          {
               "item_key": "bus_ticket",
               "item_name": "버스비",
               "seoul_price": 1500,
               "target_price": 2100,
               "difference_krw": 600,
               "difference_percent": 40.0
          },
          {
               "item_key": "taxi_8km",
               "item_name": "택시비 (8km)",
               "seoul_price": 12000,
               "target_price": 18500,
               "difference_krw": 6500,
               "difference_percent": 54.2
          },
          {
               "item_key": "brand_jeans",
               "item_name": "brand jeans",
               "seoul_price": 89000,
               "target_price": 97000,
               "difference_krw": 8000,
               "difference_percent": 9.0
          },
          {
               "item_key": "brand_sneakers",
               "item_name": "brand sneakers",
               "seoul_price": 110000,
               "target_price": 128000,
               "difference_krw": 18000,
               "difference_percent": 16.4
          }
     ]
  }
}
	