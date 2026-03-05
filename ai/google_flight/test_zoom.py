import asyncio
from playwright.async_api import async_playwright

async def test_zooms():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()
        
        # Navigate to Asia
        print("Navigating to Asia...")
        await page.goto("https://www.google.com/travel/explore?q=Asia&hl=ko", wait_until="domcontentloaded", timeout=60000)
        await asyncio.sleep(5)
        
        map_selector = 'div[aria-label="지도"]'
        map_el = await page.query_selector(map_selector)
        
        async def zoom_map(amount):
            if map_el:
                box = await map_el.bounding_box()
                if box:
                    await page.mouse.move(box["x"] + box["width"]/2, box["y"] + box["height"]/2)
                    await page.mouse.wheel(delta_x=0, delta_y=amount)
                    await asyncio.sleep(2)

        # Baseline: 0
        print("Taking baseline screenshot...")
        await page.screenshot(path="zoom_0_default.png")
        
        # Zoom In -200
        print("Zooming in -200...")
        await zoom_map(-200)
        await page.screenshot(path="zoom_1_minus_200.png")
        
        # Zoom In another -200 (Total -400)
        print("Zooming in another -200...")
        await zoom_map(-200)
        await page.screenshot(path="zoom_2_minus_400.png")
        
        # Zoom In another -400 (Total -800)
        print("Zooming in another -400...")
        await zoom_map(-400)
        await page.screenshot(path="zoom_3_minus_800.png")

        # Zoom In another -400 (Total -1200)
        print("Zooming in another -400...")
        await zoom_map(-400)
        await page.screenshot(path="zoom_4_minus_1200.png")
        
        await browser.close()
        print("Done.")

if __name__ == "__main__":
    asyncio.run(test_zooms())
