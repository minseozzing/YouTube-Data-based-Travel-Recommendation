import { Globe2, Search, UserCircle } from "lucide-react";

const NAV_LINKS = ["여행지", "내 여행", "가이드"] as const;

export function NavBar() {
  return (
    <header
      className="absolute top-3 left-3 right-3 z-30 flex items-center h-12 px-5 gap-4
                 rounded-2xl bg-white/85 backdrop-blur-md shadow-lg"
      role="banner"
    >
      {/* 로고 */}
      <div className="flex items-center gap-2 shrink-0">
        <Globe2 className="w-6 h-6 text-blue-600" aria-hidden="true" />
        <span className="font-bold text-gray-900 text-lg tracking-tight">
          GlobeTrekker
        </span>
      </div>

      {/* 검색바 */}
      <div className="flex-1 flex items-center bg-gray-100 rounded-xl px-3 py-2 gap-2 max-w-sm mx-auto">
        <Search className="w-4 h-4 text-gray-400 shrink-0" aria-hidden="true" />
        <input
          type="text"
          placeholder="목적지 검색..."
          aria-label="목적지 검색"
          className="bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400 w-full"
        />
      </div>

      {/* 네비 링크 */}
      <nav aria-label="주 메뉴" className="flex items-center gap-5">
        {NAV_LINKS.map((link) => (
          <button
            key={link}
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors bg-transparent border-none p-0 cursor-pointer"
            aria-label={link}
          >
            {link}
          </button>
        ))}
      </nav>

      {/* 우측 액션 */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          className="text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white
                     px-4 py-2 rounded-xl transition-colors border-none cursor-pointer"
          aria-label="회원가입"
        >
          회원가입
        </button>
        <UserCircle
          className="w-8 h-8 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
          aria-label="내 계정"
        />
      </div>
    </header>
  );
}
