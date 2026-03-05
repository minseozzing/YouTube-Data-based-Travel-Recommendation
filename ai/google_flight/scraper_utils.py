from playwright.async_api import async_playwright
# import playwright_stealth

async def get_stealth_context(playwright, user_agent=None):
    """
    stealth 설정을 적용한 브라우저 컨텍스트를 반환합니다.
    """
    browser = await playwright.chromium.launch(headless=True)
    
    # 기본 User-Agent 설정 (필요시)
    if not user_agent:
        user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
    
    context = await browser.new_context(
        user_agent=user_agent,
        viewport={'width': 1280, 'height': 800}
    )
    
    # stealth 적용 (임시 주석 처리)
    page = await context.new_page()
    # await playwright_stealth.stealth(page)
    
    return browser, context, page

def format_currency(price_str):
    """
    가격 문자열에서 숫자만 추출하여 정수로 변환합니다.
    """
    if not price_str:
        return 0
    # 숫자와 쉼표 등을 제외한 문자 제거 시도
    clean_price = ''.join(filter(str.isdigit, price_str))
    return int(clean_price) if clean_price else 0
