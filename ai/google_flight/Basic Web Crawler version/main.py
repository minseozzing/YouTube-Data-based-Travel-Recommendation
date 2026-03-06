import asyncio
import pandas as pd
from datetime import datetime
from google_explore import scrape_google_explore

async def crawl_all_destinations():
    print("=== Starting Google Explore Optimization Mode ===")
    
    # 익스플로어를 통해 한 번에 수집
    all_data = await scrape_google_explore()
    
    if not all_data:
        print("[Error] No data collected from Google Explore.")
        return

    # 1. 전체 데이터 CSV 저장 (필터링 및 가공 없음)
    df_all = pd.DataFrame(all_data)
    filename = f"explore_prices_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    df_all.to_csv(filename, index=False, encoding='utf-8-sig')
    print(f"\n[Success] ALL {len(all_data)} destinations saved to {filename}")
    print("[Summary] Scanning complete. CSV file is ready.")

if __name__ == "__main__":
    asyncio.run(crawl_all_destinations())
