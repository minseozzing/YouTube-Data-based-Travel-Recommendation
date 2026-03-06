import asyncio
from playwright.async_api import async_playwright
import traceback
import os
import json
import pandas as pd
from datetime import datetime

async def scrape_google_explore():
    all_results = {}
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    incremental_filename = f"explore_prices_live_{timestamp}.csv"

    async with async_playwright() as p:
        # headless=False로 설정하여 지도가 움직이는 것을 직접 볼 수 있게 함
        # slow_mo를 추가하여 움직임을 눈으로 쫓기 편하게 함
        browser = await p.chromium.launch(headless=False, slow_mo=50) 
        context = await browser.new_context(viewport={'width': 1920, 'height': 1080})
        page = await context.new_page()

        async def extract_current_view(current_month):
            # 추출 전 데이터 로딩 대기 시간 증가
            await asyncio.sleep(3.5) 
            sidebar_selector = "ol.SD4Ugf"
            try:
                await page.wait_for_selector(sidebar_selector, timeout=8000)
                await page.mouse.move(300, 500) 
                # 스크롤 횟수와 간격을 조정하여 더 꼼꼼하게 로드
                for _ in range(10):
                    await page.mouse.wheel(0, 2500) 
                    await asyncio.sleep(0.4)
                await page.mouse.wheel(0, -25000)
                await asyncio.sleep(0.8)
            except: pass

            items = await page.query_selector_all("li.lPyEac")
            new_count = 0
            for item in items:
                try:
                    # 1. 도시 이름 추출
                    name_el = await item.query_selector("h3")
                    if not name_el: continue
                    name = (await name_el.inner_text()).strip()
                    
                    # 2. 날짜 범위 추출
                    date = ""
                    divs = await item.query_selector_all("div")
                    for d in divs:
                        t = await d.inner_text()
                        if "~" in t and ("월" in t or "일" in t):
                            date = t.strip()
                            break

                    # 3. 이미지 URL 추출
                    image_url = ""
                    img_div = await item.query_selector("div[style*='background-image']")
                    if img_div:
                        style = await img_div.get_attribute("style")
                        import re
                        match = re.search(r'url\("?(.+?)"?\)', style)
                        if match:
                            image_url = match.group(1).split(',')[0].replace("'", "").replace('"', "")

                    # 4. 가격 및 정보 분류 로직 (고급화)
                    flight_price = "Price Not Found"
                    hotel_price = "Price Not Found"
                    stops = ""
                    duration = ""
                    ground_transport = ""

                    # 모든 데이터 컨테이너를 돌며 아이콘과 텍스트 분석
                    data_rows = await item.query_selector_all("div.Q70fcd > div, div.tsAU4e > div")
                    for row in data_rows:
                        row_html = await row.inner_html()
                        row_text = (await row.inner_text()).strip()
                        
                        # 아이콘 경로로 유형 파악 (M3.29=비행기, M7 14=침대, M18.92=자동차)
                        is_flight = "M3.29" in row_html or "path d=\"M21" in row_html
                        is_hotel = "M7 14" in row_html or "path d=\"M19 7" in row_html
                        is_car = "M18.92" in row_html or "path d=\"M18.92" in row_html

                        # 가격 추출 (aria-label에 '원'이 있는 경우)
                        price_el = await row.query_selector("[aria-label*='원']")
                        if price_el:
                            p_val = (await price_el.get_attribute("aria-label")).strip()
                            if is_flight: flight_price = p_val
                            elif is_hotel: hotel_price = p_val
                            elif flight_price == "Price Not Found": flight_price = p_val # 기본값

                        # 경유 및 시간 정보 추출
                        if "직항" in row_text or "경유" in row_text:
                            stops_match = re.search(r"(직항|경유\s*\d+회)", row_text)
                            if stops_match: stops = stops_match.group(0)
                        
                        # 시간 패턴 추출 (XX시간 XX분)
                        time_matches = re.findall(r"(\d+시간\s*(?:\d+분)?)", row_text)
                        for tm in time_matches:
                            if is_car:
                                ground_transport = tm
                            elif not duration:
                                duration = tm
                            else:
                                # 이미 duration이 있고 자동차 아이콘이 없더라도 추가 시간으로 간주
                                ground_transport = tm

                    # 5. 결과 저장 (중복 키는 도시_월)
                    res_key = f"{name}_{current_month}"
                    if res_key not in all_results or (all_results[res_key]["Price"] == "Price Not Found" and "₩" in flight_price):
                        all_results[res_key] = {
                            "Destination": name,
                            "Month": current_month,
                            "Date": date,
                            "Stops": stops,
                            "Flight Duration": duration,
                            "Ground/Extra Time": ground_transport,
                            "Flight Price": flight_price,
                            "Hotel Price": hotel_price,
                            "Image URL": image_url,
                            "Timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                        }
                        new_count += 1
                except Exception as e:
                    continue
            print(f"[Extract] {current_month} - New: {new_count}, Total Unique: {len(all_results)}", flush=True)

        async def drag_map(px, py):
            map_selector = 'div[aria-label="지도"]'
            try:
                map_el = await page.wait_for_selector(map_selector, timeout=10000)
                box = await map_el.bounding_box()
                cx = box["x"] + box["width"] * 0.7
                cy = box["y"] + box["height"] * 0.5
                await page.mouse.move(cx, cy)
                await page.mouse.down()
                await page.mouse.move(cx - px, cy - py, steps=50)
                await page.mouse.up()
                await asyncio.sleep(2.5) 
            except: pass

        print("\n[Explore] >>> Starting Visual World Scan")
        # URL에 인천 출발을 명시하지만, UI에서 한 번 더 확실히 설정합니다.
        url = "https://www.google.com/travel/explore?q=인천 출발 전세계&hl=ko"
        try:
            await page.goto(url, wait_until="networkidle", timeout=60000)
            await asyncio.sleep(5)

            # 출발지 명시적으로 설정 (사용자 요청: 인천)
            print("[Explore] Setting origin to Incheon...")
            try:
                selector = 'input[aria-label="출발지가 어디인가요?"]'
                # 요소가 나타날 때까지 충분히 대기
                input_el = await page.wait_for_selector(selector, timeout=10000)
                
                # 1. 실제 마우스로 중앙 클릭 (방해 요소 회피)
                box = await input_el.bounding_box()
                if box:
                    await page.mouse.click(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
                else:
                    await page.click(selector, force=True)
                
                await asyncio.sleep(1)
                
                # 2. 기존 내용 전체 선택 및 지우기
                await page.keyboard.press("Control+A")
                await page.keyboard.press("Backspace")
                await asyncio.sleep(1)
                
                # 3. 한 글자씩 키보드 입력 시뮬레이션
                print("[Explore] Typing '인천'...")
                for char in "인천":
                    await page.keyboard.type(char, delay=200)
                    await asyncio.sleep(0.1)
                
                await asyncio.sleep(1.5)
                
                # 4. 엔터 입력 (추천 목록 반영을 위해 2번 입력)
                await page.keyboard.press("Enter")
                await asyncio.sleep(1.5)
                await page.keyboard.press("Enter")
                
                print(f"[Explore] Origin set to Incheon via Keyboard simulation.")
                await asyncio.sleep(5)
            except Exception as e:
                print(f"[Warning] Could not set origin via keyboard: {e}")

            # 사용자 요청: 가로 11, 세로 8 지그재그 탐색
            step_x, step_y = 700, 500
            grid_x, grid_y = 11, 8
            months = ["2월", "3월", "4월", "5월", "6월", "7월"]
            zoom_done = False

            for month_name in months:
                print(f"\n[Month Loop] >>> Starting Scan for {month_name}")
                
                # 1. 날짜 선택창 열기 및 월 선택
                try:
                    date_button_selector = 'div[jsname="S55YWb"]'
                    await page.wait_for_selector(date_button_selector, timeout=10000)
                    await page.click(date_button_selector)
                    await asyncio.sleep(2)
                    
                    # '유연한 일정' 탭 선택 확인
                    flexible_tab = page.get_by_role("tab", name="유연한 일정")
                    if await flexible_tab.count() > 0:
                        await flexible_tab.click()
                        await asyncio.sleep(1)

                    # 해당 월 클릭
                    print(f"[Explore] Selecting month: {month_name}")
                    month_button_selector = f'button:has-text("{month_name}")'
                    await page.wait_for_selector(month_button_selector, timeout=5000)
                    await page.click(month_button_selector)
                    await asyncio.sleep(1)
                    
                    # '확인' 버튼 클릭 (jsname="McfNlf" 및 다양한 방식 시도)
                    print("[Explore] Clicking 'Confirm' (확인) button...")
                    confirm_selector = 'button[jsname="McfNlf"]'
                    try:
                        # 요소가 클릭 가능한 상태가 될 때까지 대기 후 강제 클릭
                        await page.wait_for_selector(confirm_selector, timeout=5000)
                        await page.click(confirm_selector, force=True)
                        print("[Explore] Clicked confirm via jsname selector.")
                    except:
                        # 텍스트 기반 클릭 시도
                        try:
                            await page.locator('button:has-text("확인")').click(force=True)
                            print("[Explore] Clicked confirm via text selector.")
                        except:
                            # 좌표 클릭 시도 (버튼이 보통 있는 위치)
                            await page.mouse.click(1100, 850)
                            print("[Explore] Clicked confirm via coordinates.")
                    
                    await asyncio.sleep(4) # 반영 대기
                except Exception as e:
                    print(f"[Warning] Error selecting month {month_name}: {e}")

                # 2. 줌인 (처음 한 번만 또는 요청 시)
                if not zoom_done:
                    print("[Explore] Adjusting zoom to 1400...")
                    await page.mouse.move(1200, 500)
                    await page.mouse.wheel(0, -1400) 
                    await asyncio.sleep(4)
                    zoom_done = True

                # 3. 시작 위치로 이동 (위로 3번)
                print(f"[Explore] Moving to start position for {month_name} (Up 3)...")
                for _ in range(3): await drag_map(0, -step_y)
                
                # 4. 11x8 지그재그 탐색
                for y in range(grid_y):
                    direction = 1 if y % 2 == 0 else -1
                    dir_text = "Right" if direction > 0 else "Left"
                    
                    print(f"[World Scan] {month_name} - Row {y+1}/{grid_y}")
                    for x in range(grid_x):
                        await extract_current_view(month_name)
                        if x < grid_x - 1:
                            await drag_map(step_x * direction, 0)
                    
                    # 매 Row 끝날 때마다 CSV 중간 저장
                    if all_results:
                        df_live = pd.DataFrame(list(all_results.values()))
                        df_live.to_csv(incremental_filename, index=False, encoding='utf-8-sig')

                    if y < grid_y - 1:
                        await drag_map(0, step_y)
                        await asyncio.sleep(1.5)

                # 5. 원점 복귀 (위로 4번 이동하여 인천 중심으로)
                print(f"[Explore] Returning to origin from {month_name} scan...")
                for _ in range(4):
                    await drag_map(0, -step_y)
                
                print(f"[Explore] Back at origin. Ready for next month.")
                await asyncio.sleep(2)

                    
        except Exception as e:
            print(f"[Error] World scan failed: {e}")
            traceback.print_exc()

        print("\n[Done] Scan finished. Keeping browser open for 10 seconds...")
        await asyncio.sleep(10)
        await browser.close()
        return list(all_results.values())

if __name__ == "__main__":
    asyncio.run(scrape_google_explore())
