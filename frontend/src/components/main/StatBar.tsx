import { motion, type Variants } from 'framer-motion';
import { Users, Plane, Wallet, ShieldCheck, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatItem {
  icon: LucideIcon;
  label: string;
  value: string;
}

const STATS: StatItem[] = [
  { icon: Users, label: '탐험자', value: '1,247명' },
  { icon: Plane, label: '평균 항공비', value: '₩523,000' },
  { icon: Wallet, label: '평균 생활비', value: '₩1,200,000 / 월' },
  { icon: ShieldCheck, label: '안전 등급', value: 'A등급' },
];

const barVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut', delay: 0.3 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, delay: 0.4 + i * 0.05, ease: 'easeOut' },
  }),
};

export function StatBar() {
  return (
    <motion.div
      variants={barVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        'absolute bottom-4 left-1/2 -translate-x-1/2 z-10',
        'flex items-center gap-1 px-4 py-2.5 rounded-2xl',
        'bg-white/80 backdrop-blur-md shadow-lg border border-white/40',
        'pointer-events-none',
      )}
      aria-label="여행 통계 바"
    >
      {STATS.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            custom={index}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className={cn(
              'flex items-center gap-2.5 px-4',
              index < STATS.length - 1 && 'border-r border-slate-200/80',
            )}
          >
            <Icon className="size-4 text-blue-500 shrink-0" aria-hidden="true" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                {stat.label}
              </span>
              <span className="text-sm font-bold text-slate-700 leading-tight">
                {stat.value}
              </span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
