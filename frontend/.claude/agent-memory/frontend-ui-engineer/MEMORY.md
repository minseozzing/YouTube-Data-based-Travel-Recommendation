# Frontend UI Engineer — Project Memory

## Project Stack
- React 19 + TypeScript (strict, verbatimModuleSyntax, noUnusedLocals/Params)
- Tailwind CSS v4 via `@tailwindcss/vite`
- shadcn/ui components manually written in `src/components/ui/`
- `radix-ui` v1.4.3 (monorepo package re-exporting all @radix-ui/* packages)
- framer-motion v12
- lucide-react v0.576
- recharts v3.7.0

## Key Paths
- Pages: `src/pages/*.tsx`
- UI primitives: `src/components/ui/` (button, card, separator, badge, select, skeleton, input, dialog created)
- Layout: `src/components/layout/TopNavBar.tsx`, `Footer.tsx`, `AuthenticatedLayout.tsx`
- Common: `src/components/common/LoadingSpinner.tsx`, `Pagination.tsx`, `QueryErrorFallback.tsx`
- Routes: `src/routes/` (TanStack Router file-based)
- Auth hooks: `src/hooks/auth/useGoogleLogin.ts`, `useLogout.ts`, `usePreference.ts`
- Zustand stores: `src/stores/authStore.ts`, `src/stores/preferenceStore.ts`, `src/stores/uiStore.ts`
- City components: `src/components/city/` (CityDetailModal, CityDetailTabNav, DestinationHeroCard, SaveButton, tabs/)

## Critical TypeScript Rules (verbatimModuleSyntax + strict)
- Use `import type { X }` for type-only imports
- Use `import { type X, Y }` to mix type and value imports in one line
- Use `import { motion, type Variants } from 'framer-motion'` — NOT two separate lines
- `import * as React from 'react'` — only needed if React namespace used as value
- Use `import type * as React from 'react'` for type-only React namespace usage
- Use `LucideIcon` from lucide-react for icon prop types: `import { type LucideIcon } from 'lucide-react'`
- NEVER use `React.ElementType` for lucide icon props — use `LucideIcon`
- Unused params: prefix with `_` (e.g. `_asChild`) to suppress noUnusedLocals
- NEVER use `React.KeyboardEvent` or `React.ReactNode` directly — import from 'react'
- Use `NonNullable<Type['field']>` to extract optional field types from schemas

## radix-ui Import Patterns
```ts
import { Slot } from 'radix-ui'; // Slot.Root is the actual component
import { Separator as SeparatorPrimitive } from 'radix-ui'; // SeparatorPrimitive.Root
import { Select as SelectPrimitive } from 'radix-ui';
import { Dialog as DialogPrimitive } from 'radix-ui';
// DialogPrimitive.Root, .Trigger, .Portal, .Overlay, .Content, .Title, .Description, .Close
```

## shadcn/ui Components Created
- `src/components/ui/button.tsx` — uses `Slot.Root` for `asChild`, splits into two `if` branches
- `src/components/ui/card.tsx` — Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter
- `src/components/ui/separator.tsx` — wraps SeparatorPrimitive.Root
- `src/components/ui/badge.tsx` — standalone span wrapper
- `src/components/ui/select.tsx` — full Select component using `radix-ui` Select namespace
- `src/components/ui/skeleton.tsx` — animate-pulse div wrapper
- `src/components/ui/input.tsx` — extends `ComponentProps<'input'>`, standard shadcn pattern
- `src/components/ui/dialog.tsx` — Dialog using `radix-ui` Dialog namespace, supports `showClose?: boolean` prop

## Pages Implemented
- `src/pages/IntroPage.tsx` — hero + feature cards + CTA banner
- `src/pages/LoginPage.tsx` — 2-col split (55/45), Google SVG icon inline
- `src/pages/AuthCallbackPage.tsx` — Loader2 spinner + error AlertCircle
- `src/pages/PreferencePage.tsx` — dark fullscreen 2-col, progress bar
- `src/pages/BookmarkListPage.tsx` — 4-col card grid, continent filter (local state), client-side pagination
- `src/pages/BookmarkDetailPage.tsx` — hero + 2-col dashboard (55/45)
- `src/pages/CostPage.tsx` — hero search + 3-col TOP cards + 4-col cheap/expensive + promo banner
- `src/pages/CountryCostDetailPage.tsx` — breadcrumb + hero + 2-col KPI + recharts line + city grid
- `src/pages/MainPage.tsx` — includes `<CityDetailModal />` at top level

## City Detail Modal Architecture
- `src/components/city/CityDetailModal.tsx` — Dialog wrapper (max-w-4xl h-[85vh], flex-row layout)
- Left (w-72 fixed): `DestinationHeroCard` — full height, img bg, gradient overlay, back button, SaveButton
- Right (flex-1): `CityDetailTabNav` + tab content area (overflow-y-auto)
- Tabs: recommend | cost | flight | news stored in `useUiStore.activeCityTab`
- Dialog accessibility: always add `<DialogTitle className="sr-only">` inside DialogContent
- `DestinationHeroCard` calls `closeCityModal` from uiStore (not prop drilling)

## City Feature Hooks
- `useCityDetail(cityId: number | null)` — returns `CityDetail`
- `useNews(countryId: number | null)` — returns `NewsItem[]`
- `useCountryCost(countryId: number | null)` — returns `CountryCost`
- `useMonthlyFlights(cityId, year, month)` — returns `MonthlyFlight` (summary only, no daily breakdown)
- `useCreateBookmark()` — `mutate: (body: CreateBookmarkRequest) => void`

## uiStore State (src/stores/uiStore.ts)
- `selectedCityId | isCityModalOpen | activeCityTab | globeBudgetFilter | globeRiskFilter`
- `openCityModal(cityId, tab?)`, `closeCityModal()`, `setActiveCityTab(tab)`

## recharts v3 Patterns
- Tooltip formatter type: use `(value) => ...` without explicit annotation to avoid type errors
  (actual type: `TValue | undefined` where `TValue = number | string | (number | string)[]`)
- tickFormatter: use `(v) => String(v).slice(...)` not `(v: string) => ...`
- Bar `radius` prop: `RectRadius = number | [number, number, number, number]`
- `ResponsiveContainer` with `width="100%"` and explicit `height={number}`
- `contentStyle={{ fontSize: 11, borderRadius: 8 }}` — number values OK

## Module-Level Constants for Stability
- When `useMemo(() => fn(), [])` captures stable external values (like `dayjs()`),
  move the computation to module-level to avoid stale closure lint warnings:
  ```ts
  function buildMonthTabs() { const now = dayjs(); return ...; }
  const MONTH_TABS = buildMonthTabs(); // computed once at module load
  ```

## Layout Components
- `AuthenticatedLayout` wraps `TopNavBar` + `<main>` + `Footer`
- `TopNavBar` — sticky top-0 z-50
- `Footer` — Privacy · Safety links, copyright 2026

## Bookmark Feature Architecture
- Schema: `src/schemas/bookmark.schema.ts` — `BookmarkListItem`, `BookmarkDetail`
- `useBookmarkList(keyword?)` — returns `BookmarkListItem[]`
- `useBookmarkDetail(bookmarkId)` — returns `BookmarkDetail`
- `useDeleteBookmark()` — `mutate(bookmarkId)`, auto-invalidates list cache
- `useCreateBookmark()` — `mutate({ country, city, json })`, auto-invalidates list cache

## Cost Feature Architecture
- Schema: `src/schemas/cost.schema.ts` — `CountryCost`, `OnePersonCost`, `FamilyOf4Cost`
- `useCountryCost(countryId: number | null)` — returns `CountryCost` data
- Route: `/_authenticated/cost/$countryId` — params parsed with `z.coerce.number()`

## Common Patterns
- Framer Motion tab/content transition: `opacity: 0, y: 8` → `opacity: 1, y: 0`, duration 0.25
- Image error fallback: `useState(false)` + `onError` + conditional Landmark icon + gray bg
- Accessible clickable divs: `role="button"` + `tabIndex={0}` + `onKeyDown` Enter/Space
- Dark page bg: `bg-[#0f172a]`; Authenticated bg: `min-h-screen bg-slate-50`
- Hero bg: `bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900`
