import { createFileRoute } from '@tanstack/react-router';
import PreferencePage from '@/pages/PreferencePage';

export const Route = createFileRoute('/preference')({
  component: PreferencePage,
});
