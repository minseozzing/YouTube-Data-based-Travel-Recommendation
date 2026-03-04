import { createFileRoute } from '@tanstack/react-router';
import IntroPage from '@/pages/IntroPage';

export const Route = createFileRoute('/')({
  component: IntroPage,
});
