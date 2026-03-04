import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { type LucideIcon, Globe, TrendingDown, Plane, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import TopNavBar from '@/components/layout/TopNavBar';
import Footer from '@/components/layout/Footer';

// ─── 애니메이션 variants ───────────────────────────────────────────
const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

// ─── Feature 카드 데이터 ──────────────────────────────────────────
const FEATURES = [
  {
    icon: Globe,
    title: 'AI 여행 추천',
    description:
      '취향과 예산에 맞는 여행지를 AI가 분석해 3D 글로브로 시각화합니다.',
    accent: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
  },
  {
    icon: TrendingDown,
    title: '실시간 물가 비교',
    description:
      '세계 주요 도시의 생활 물가를 실시간으로 비교해 여행 예산을 정확히 수립하세요.',
    accent: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
  },
  {
    icon: Plane,
    title: '항공권 최저가',
    description:
      '출발일과 목적지를 선택하면 최저가 항공권을 즉시 비교해 드립니다.',
    accent: 'text-violet-500',
    bg: 'bg-violet-50 dark:bg-violet-950/30',
  },
] as const;

// ─── FeatureCard 컴포넌트 ─────────────────────────────────────────
interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string;
  bg: string;
}

const FeatureCard = ({ icon: Icon, title, description, accent, bg }: FeatureCardProps) => (
  <motion.div variants={fadeInUp}>
    <Card className="h-full border-border/50 hover:shadow-md transition-shadow duration-300">
      <CardContent className="pt-6 flex flex-col gap-3">
        <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}>
          <Icon className={`size-5 ${accent}`} aria-hidden="true" />
        </div>
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

// ─── IntroPage ────────────────────────────────────────────────────
const IntroPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-background">
      <TopNavBar />

      <main className="flex-1">
        {/* ── Hero 섹션 ── */}
        <section
          className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900"
          aria-labelledby="hero-headline"
        >
          {/* 배경 장식 */}
          <div
            className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.4),transparent)]"
            aria-hidden="true"
          />
          <div
            className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:py-40">
            <motion.div
              className="flex flex-col items-center text-center gap-6"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {/* 배지 */}
              <motion.div variants={fadeInUp}>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
                  <Sparkles className="size-3" aria-hidden="true" />
                  AI 기반 맞춤 여행 플래너
                </span>
              </motion.div>

              {/* 헤드라인 */}
              <motion.h1
                id="hero-headline"
                variants={fadeInUp}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight"
              >
                다음 여행을{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  행복하게
                </span>
              </motion.h1>

              {/* 서브 카피 */}
              <motion.p
                variants={fadeInUp}
                className="max-w-xl text-base sm:text-lg text-slate-300 leading-relaxed"
              >
                AI가 추천하는 맞춤 여행지를 3D 글로브로 탐색하세요.
                <br className="hidden sm:block" />
                실시간 물가 비교와 항공권 최저가로 완벽한 여행을 설계합니다.
              </motion.p>

              {/* CTA 버튼 */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row items-center gap-3 pt-2"
              >
                <Button asChild size="lg" className="bg-blue-500 hover:bg-blue-600 text-white min-w-40">
                  <Link to="/login" className="no-underline flex items-center gap-2">
                    지금 시작하기
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-slate-600 bg-transparent text-slate-200 hover:bg-slate-800 hover:text-white min-w-40"
                >
                  <a href="#features" className="no-underline">
                    서비스 소개 보기
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── Feature 섹션 ── */}
        <section
          id="features"
          className="mx-auto max-w-7xl px-6 py-20 sm:py-28"
          aria-labelledby="features-headline"
        >
          <motion.div
            className="flex flex-col items-center gap-12"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {/* 섹션 헤더 */}
            <motion.div variants={fadeInUp} className="text-center flex flex-col gap-3">
              <h2
                id="features-headline"
                className="text-2xl sm:text-3xl font-bold text-foreground"
              >
                왜 다행인가요?
              </h2>
              <p className="text-muted-foreground max-w-md">
                여행 계획의 처음부터 끝까지, 다행이 함께합니다.
              </p>
            </motion.div>

            {/* 카드 그리드 */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
              variants={staggerContainer}
            >
              {FEATURES.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ── CTA 배너 ── */}
        <section className="bg-blue-600 dark:bg-blue-700">
          <motion.div
            className="mx-auto max-w-7xl px-6 py-16 sm:py-20 flex flex-col sm:flex-row items-center justify-between gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                지금 바로 여행을 시작해 보세요
              </h2>
              <p className="mt-1 text-blue-100 text-sm sm:text-base">
                무료로 가입하고 AI 맞춤 추천을 경험하세요.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold shrink-0"
            >
              <Link to="/login" className="no-underline">
                무료로 시작하기
              </Link>
            </Button>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default IntroPage;
