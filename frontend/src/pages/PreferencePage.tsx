import { motion, type Variants } from 'framer-motion';
import {
  Mountain,
  Building2,
  UtensilsCrossed,
  Sparkles,
  Zap,
  Loader2,
  ArrowRight,
  Check,
  Circle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TagCategorySection } from '@/components/preference/TagCategorySection';
import { usePreferenceStore } from '@/stores/preferenceStore';
import { useSubmitPreference } from '@/hooks/auth/usePreference';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TAG_CATEGORIES = [
  {
    category: '자연 & 아웃도어',
    icon: Mountain,
    tags: ['자연', '해변', '산', '트레킹', '캠핑'],
  },
  {
    category: '도시 & 문화',
    icon: Building2,
    tags: ['도시', '역사', '문화', '건축', '박물관'],
  },
  {
    category: '음식 & 쇼핑',
    icon: UtensilsCrossed,
    tags: ['음식', '쇼핑', '야시장', '카페', '길거리음식'],
  },
  {
    category: '여행 스타일',
    icon: Sparkles,
    tags: ['럭셔리', '배낭여행', '가족여행', '커플여행', '혼자여행'],
  },
  {
    category: '액티비티',
    icon: Zap,
    tags: ['액티비티', '다이빙', '서핑', '스키', '번지점프'],
  },
] as const;

const STEPS = [
  { label: '로그인 완료', status: 'completed' as const },
  { label: '취향 선택', status: 'active' as const },
  { label: '여행 시작', status: 'pending' as const },
] as const;

type StepStatus = 'completed' | 'active' | 'pending';

const POSITIVE_THRESHOLD = 5;

// ---------------------------------------------------------------------------
// Framer Motion variants
// ---------------------------------------------------------------------------

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
};

const sidebarVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: 'easeOut', delay: 0.1 },
  },
};

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut', delay: 0.15 },
  },
};

const categoriesVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.25 },
  },
};

const categoryItemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface StepIndicatorProps {
  label: string;
  status: StepStatus;
  isLast: boolean;
}

function StepIndicator({ label, status, isLast }: StepIndicatorProps) {
  return (
    <li className="flex flex-col items-start gap-0">
      <div className="flex items-center gap-3">
        {/* Icon */}
        <span
          className={cn(
            'flex items-center justify-center size-7 rounded-full border-2 shrink-0 transition-colors',
            status === 'completed' &&
              'bg-blue-600 border-blue-600 text-white',
            status === 'active' &&
              'bg-blue-600/20 border-blue-500 text-blue-400',
            status === 'pending' &&
              'bg-slate-800 border-slate-600 text-slate-500',
          )}
          aria-hidden="true"
        >
          {status === 'completed' ? (
            <Check className="size-3.5" />
          ) : status === 'active' ? (
            <span className="size-2 rounded-full bg-blue-400" />
          ) : (
            <Circle className="size-3 opacity-50" />
          )}
        </span>

        {/* Label */}
        <span
          className={cn(
            'text-sm font-medium',
            status === 'completed' && 'text-slate-400 line-through',
            status === 'active' && 'text-blue-300 font-semibold',
            status === 'pending' && 'text-slate-500',
          )}
        >
          {label}
        </span>
      </div>

      {/* Connector line */}
      {!isLast && (
        <div
          className={cn(
            'w-px h-6 ml-3.5 mt-0.5',
            status === 'completed' ? 'bg-blue-600/50' : 'bg-slate-700',
          )}
          aria-hidden="true"
        />
      )}
    </li>
  );
}

interface SelectionCounterProps {
  count: number;
}

function SelectionCounter({ count }: SelectionCounterProps) {
  const isPositive = count >= POSITIVE_THRESHOLD;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-400">선택된 취향</span>
      <span
        className={cn(
          'text-sm font-bold tabular-nums transition-colors',
          count === 0 && 'text-slate-500',
          count > 0 && !isPositive && 'text-blue-300',
          isPositive && 'text-emerald-400',
        )}
      >
        {count}개
      </span>
      {isPositive && (
        <motion.span
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xs text-emerald-400 font-medium"
        >
          잘 선택하셨어요!
        </motion.span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

const PreferencePage = () => {
  const { selectedTags, toggleTag } = usePreferenceStore();
  const { mutate: submit, isPending } = useSubmitPreference();

  const handleSubmit = () => {
    submit(selectedTags);
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-[#0f172a] text-white"
    >
      <div className="flex min-h-screen">
        {/* ---------------------------------------------------------------- */}
        {/* Left Sidebar                                                      */}
        {/* ---------------------------------------------------------------- */}
        <motion.aside
          variants={sidebarVariants}
          initial="hidden"
          animate="visible"
          className={cn(
            'w-64 shrink-0 flex flex-col justify-between',
            'px-6 py-8',
            'border-r border-slate-700/60',
            'bg-slate-900/60 backdrop-blur-sm',
          )}
          aria-label="단계 안내 사이드바"
        >
          <div className="flex flex-col gap-10">
            {/* Logo */}
            <div>
              <span
                className="text-2xl font-bold tracking-tight text-white"
                aria-label="다행 앱 로고"
              >
                다행
              </span>
              <p className="mt-1 text-xs text-slate-500">나에게 맞는 여행</p>
            </div>

            {/* Step Indicator */}
            <nav aria-label="설정 단계">
              <ul className="flex flex-col" role="list">
                {STEPS.map((step, idx) => (
                  <StepIndicator
                    key={step.label}
                    label={step.label}
                    status={step.status}
                    isLast={idx === STEPS.length - 1}
                  />
                ))}
              </ul>
            </nav>
          </div>

          {/* Bottom description */}
          <p className="text-xs leading-relaxed text-slate-500">
            당신의 취향을 알려주세요.
            <br />더 정확한 여행지를 추천해 드립니다.
          </p>
        </motion.aside>

        {/* ---------------------------------------------------------------- */}
        {/* Right Content                                                     */}
        {/* ---------------------------------------------------------------- */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col flex-1 px-8 py-10 max-w-3xl w-full mx-auto"
          >
            {/* Header */}
            <header className="mb-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white leading-snug">
                    어떤 여행을 좋아하시나요?
                  </h1>
                  <p className="mt-2 text-sm text-slate-400">
                    관심 있는 여행 스타일을 모두 선택해 주세요{' '}
                    <span className="text-slate-500">(최소 1개)</span>
                  </p>
                </div>

                {/* Selection counter — top right */}
                <div className="mt-1">
                  <SelectionCounter count={selectedTags.length} />
                </div>
              </div>

              {/* Progress bar */}
              <div
                className="mt-5 h-1 w-full rounded-full bg-slate-800 overflow-hidden"
                role="progressbar"
                aria-valuenow={selectedTags.length}
                aria-valuemin={0}
                aria-valuemax={25}
                aria-label="태그 선택 진행도"
              >
                <motion.div
                  className="h-full rounded-full bg-blue-600"
                  animate={{
                    width: `${Math.min((selectedTags.length / 25) * 100, 100)}%`,
                  }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </div>
            </header>

            {/* Tag Category Sections */}
            <motion.div
              variants={categoriesVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-7 flex-1"
            >
              {TAG_CATEGORIES.map((cat) => (
                <motion.div key={cat.category} variants={categoryItemVariants}>
                  <TagCategorySection
                    category={cat.category}
                    icon={cat.icon}
                    tags={[...cat.tags]}
                    selectedTags={selectedTags}
                    onToggle={toggleTag}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Footer */}
            <footer className="mt-10 pt-6 border-t border-slate-700/60">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Inline reminder if nothing selected */}
                {selectedTags.length === 0 ? (
                  <p className="text-sm text-slate-500 order-2 sm:order-1">
                    최소 1개 이상의 태그를 선택해 주세요.
                  </p>
                ) : (
                  <p className="text-sm text-slate-400 order-2 sm:order-1">
                    <span className="text-blue-300 font-semibold">
                      {selectedTags.length}개
                    </span>
                    의 취향이 선택되었습니다.
                  </p>
                )}

                <Button
                  onClick={handleSubmit}
                  disabled={isPending || selectedTags.length === 0}
                  size="lg"
                  className={cn(
                    'order-1 sm:order-2 min-w-[160px]',
                    'bg-blue-600 hover:bg-blue-500 text-white',
                    'disabled:opacity-40 disabled:cursor-not-allowed',
                    'transition-all duration-200',
                    selectedTags.length > 0 &&
                      'shadow-lg shadow-blue-900/50',
                  )}
                  aria-label={
                    isPending
                      ? '선호도 저장 중'
                      : '선택 완료 후 여행 시작'
                  }
                >
                  {isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                      저장 중...
                    </>
                  ) : (
                    <>
                      선택 완료
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </>
                  )}
                </Button>
              </div>
            </footer>
          </motion.div>
        </main>
      </div>
    </motion.div>
  );
};

export default PreferencePage;
