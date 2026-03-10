import { motion, type Variants } from 'framer-motion';

const heroVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const subVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.15, ease: 'easeOut' },
  },
};

export function HeroTextBlock() {
  return (
    <div
      className="absolute top-20 right-12 z-10 pointer-events-none text-right"
      aria-label="히어로 텍스트"
    >
      <motion.h1
        variants={heroVariants}
        initial="hidden"
        animate="visible"
        className="text-4xl font-extrabold text-white leading-tight drop-shadow-lg"
      >
        Explore your next{' '}
        <span className="text-cyan-400 italic">escape.</span>
      </motion.h1>
      <motion.p
        variants={subVariants}
        initial="hidden"
        animate="visible"
        className="mt-2 text-base text-white/75 font-medium drop-shadow-md max-w-xs ml-auto"
      >
        AI가 추천하는 맞춤 여행지를
        <br />
        탐색하세요
      </motion.p>
    </div>
  );
}
