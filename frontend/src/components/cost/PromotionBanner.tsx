import { useNavigate } from '@tanstack/react-router';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PromotionBanner() {
  const navigate = useNavigate();

  return (
    <section
      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-16 px-6"
      aria-label="AI 추천 여행지 프로모션"
    >
      <div className="mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-white/20 shrink-0">
            <Sparkles className="size-6 text-white" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-white text-2xl font-bold leading-snug">
              AI가 추천하는 맞춤 여행지를 찾아보세요
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              취향과 예산에 맞는 최적의 여행지를 AI가 분석해 드립니다
            </p>
          </div>
        </div>
        <Button
          size="lg"
          className="bg-white text-blue-700 hover:bg-blue-50 hover:text-blue-800 font-semibold shrink-0 gap-2"
          onClick={() => void navigate({ to: '/login' })}
          aria-label="AI 맞춤 여행지 추천 시작하기"
        >
          지금 시작하기
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </section>
  );
}
