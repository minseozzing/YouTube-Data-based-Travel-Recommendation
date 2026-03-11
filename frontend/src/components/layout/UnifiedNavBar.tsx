import { motion } from "framer-motion";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Globe2,
  Bookmark,
  TrendingUp,
  Search,
  User,
  MapPin,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useState, useRef, useEffect, useMemo } from "react";
import { useCityList } from "@/hooks/city/useCityList";
import { useUiStore } from "@/stores/uiStore";
import { DUMMY_CITY_DETAILS } from "@/data/dummyCityData";
import { cn } from "@/lib/utils";

export function UnifiedNavBar() {
  const pathname = useLocation({ select: (l) => l.pathname });
  const isMain = pathname === "/main";
  const isFloating =
    isMain ||
    pathname.startsWith("/bookmarks") ||
    pathname.startsWith("/cost") ||
    pathname.startsWith("/mypage");

  const { user } = useAuthStore();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { openRightPanel, isCityModalOpen } = useUiStore();
  const { data: cities } = useCityList();

  const fallbackCities = useMemo(() => Object.values(DUMMY_CITY_DETAILS), []);
  const citySource = cities ?? fallbackCities;

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    return citySource
      .filter(
        (c) => c.cityName.includes(query) || c.countryName.includes(query),
      )
      .slice(0, 8);
  }, [query, citySource]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <motion.nav
      initial={{
        borderRadius: 0,
        top: 0,
        left: 0,
        right: 0,
        height: 64,
        backgroundColor: "rgba(10,17,40,0.55)",
      }}
      animate={{
        borderRadius: isFloating ? 16 : 0,
        top: isFloating ? 12 : 0,
        left: isFloating ? 12 : 0,
        right: isFloating ? 12 : 0,
        height: isFloating ? 48 : 64,
        backgroundColor: isFloating
          ? "rgba(255,255,255,0.85)"
          : "rgba(10,17,40,0.55)",
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 28,
      }}
      style={{
        position: "fixed",
        zIndex: isCityModalOpen ? -1 : 50,
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        boxShadow: isFloating ? "0 4px 20px rgba(0,0,0,0.08)" : "none",
        borderBottom: isFloating ? "none" : "1px solid rgba(255,255,255,0.1)",
      }}
      className="flex items-center px-5"
      aria-label="네비게이션"
    >
      <div className="flex items-center justify-between w-full h-full">
        {/* 로고 */}
        <Link
          to="/main"
          search={{ tab: "recommend" }}
          className={cn(
            "flex items-center gap-2 no-underline font-bold text-lg tracking-tight transition-colors duration-300",
            isFloating
              ? "text-slate-800 hover:text-blue-600"
              : "text-white hover:text-white/80",
          )}
          aria-label="다행 메인으로 이동"
        >
          <Globe2
            className={cn(
              "size-5 transition-colors duration-300",
              isFloating ? "text-blue-500" : "text-white",
            )}
          />
          <span>다행</span>
        </Link>

        {/* 검색바 — 메인에서만 표시 */}
        {isMain && (
          <div
            ref={wrapperRef}
            className="hidden md:flex flex-col flex-1 mx-6 relative overflow-visible"
            style={{ maxWidth: "320px" }}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                placeholder="도시 또는 국가를 검색하세요..."
                className="w-full pl-9 pr-4 py-1.5 text-sm rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
              />
            </div>
            {searchOpen && suggestions.length > 0 && (
              <ul className="absolute top-full mt-1 w-full bg-white rounded-xl shadow-lg border border-slate-100 z-50 overflow-hidden">
                {suggestions.map((city) => (
                  <li
                    key={city.cityId}
                    onMouseDown={() => {
                      openRightPanel(city.cityId, city.imgUrl, {
                        lat: city.latitude,
                        lng: city.longitude,
                      });
                      setQuery(city.cityName);
                      setSearchOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 cursor-pointer text-sm"
                  >
                    <MapPin className="size-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-800">
                      {city.cityName}
                    </span>
                    <span className="text-slate-400 text-xs ml-auto">
                      {city.countryName}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* 우측 링크 + 사용자 */}
        <div className="flex items-center gap-2">
          <Link
            to="/bookmarks"
            className={cn(
              "flex items-center gap-1.5 text-sm font-medium no-underline px-2.5 py-1.5 rounded-lg transition-all duration-300",
              isFloating
                ? "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                : "text-white hover:text-white/80 hover:bg-white/10",
            )}
          >
            <Bookmark className="size-4" />
            <span className="hidden sm:inline">북마크</span>
          </Link>

          <Link
            to="/cost"
            className={cn(
              "flex items-center gap-1.5 text-sm font-medium no-underline px-2.5 py-1.5 rounded-lg transition-all duration-300",
              isFloating
                ? "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                : "text-white hover:text-white/80 hover:bg-white/10",
            )}
          >
            <TrendingUp className="size-4" />
            <span className="hidden sm:inline">물가</span>
          </Link>

          <Link
            to="/mypage"
            className={cn(
              "flex items-center justify-center size-8 rounded-full overflow-hidden border-2 transition-colors duration-300 no-underline",
              isFloating
                ? "border-slate-200 hover:border-blue-400"
                : "border-white/30 hover:border-white/60",
            )}
            aria-label="마이페이지로 이동"
          >
            {user?.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt={user.nickname ?? "사용자"}
                className="size-full object-cover"
              />
            ) : (
              <User
                className={cn(
                  "size-4 transition-colors duration-300",
                  isFloating ? "text-slate-500" : "text-white",
                )}
              />
            )}
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
