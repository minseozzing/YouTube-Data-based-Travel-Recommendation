# Frontend UI Engineer - Project Memory

## Project Stack
- Tailwind CSS v4 (no shadcn/ui - pure Tailwind only)
- Lucide React icons
- Framer Motion (framer-motion ^12)
- react-globe.gl for 3D globe
- TanStack Router (file-based routing via src/routes/)
- No shadcn/ui installed - build all UI from scratch with Tailwind

## Key File Locations
- Entry: `src/main.tsx`, `src/App.tsx`, `src/index.css`
- Routes: `src/routes/__root.tsx`, `src/routes/index.tsx`
- Home page: `src/pages/home/index.tsx`
- Home components: `src/pages/home/components/`
  - NavBar.tsx, LeftSidebar.tsx, GlobeInfoBar.tsx, RightPanel.tsx
- Assets: `src/assets/Maldive_beach_1.jpg`

## CSS Notes
- `src/index.css` uses `@import "tailwindcss"` (Tailwind v4 syntax)
- body had `display: flex; place-items: center` which breaks full-screen layouts - removed
- Default color-scheme is dark - override text/bg colors explicitly on page components

## Floating Panel Layout Pattern
Panels float over background with absolute positioning + gap from edges:
- NavBar: `absolute top-3 left-3 right-3 z-30 h-16 rounded-2xl`
- Left sidebar: `absolute left-3 top-20 bottom-3 z-20 w-[270px] rounded-2xl`
- Right panel: `absolute right-3 top-20 bottom-3 z-20 w-[350px] rounded-2xl`
- Frosted glass: `bg-white/85 backdrop-blur-md shadow-lg`

## Framer Motion Slide-in Pattern (Right Panel)
```tsx
initial={{ x: 380, opacity: 0 }}
animate={{ x: 0, opacity: 1 }}
exit={{ x: 380, opacity: 0 }}
transition={{ duration: 0.35, ease: "easeInOut" }}
```
Wrap with `<AnimatePresence>` for exit animations to work.

## Button Reset Pattern (no shadcn/ui)
Always add `border-none bg-transparent cursor-pointer` to reset browser button defaults.

## Globe Component Pattern
```tsx
const wrapRef = useRef<HTMLDivElement | null>(null);
const [size, setSize] = useState({ w: 500, h: 500 });
useLayoutEffect(() => {
  const ro = new ResizeObserver(() => {
    const rect = el.getBoundingClientRect();
    setSize({ w: Math.round(rect.width), h: Math.round(rect.height) });
  });
  ro.observe(el);
  return () => ro.disconnect();
}, []);
// Container: aspect-square rounded-full overflow-hidden
// Globe: backgroundColor="rgba(0,0,0,0)" for transparent bg
```
