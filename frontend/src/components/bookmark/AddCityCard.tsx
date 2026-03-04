import { useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export function AddCityCard() {
  const navigate = useNavigate();

  return (
    <motion.button
      className="flex h-full min-h-[17rem] w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-500"
      onClick={() => void navigate({ to: '/main' })}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      aria-label="새로운 도시 추가하기"
    >
      <div className="flex size-12 items-center justify-center rounded-full border-2 border-dashed border-current">
        <Plus className="size-6" aria-hidden="true" />
      </div>
      <span className="text-sm font-medium">도시 추가하기</span>
    </motion.button>
  );
}
