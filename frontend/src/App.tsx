import { RouterProvider } from '@tanstack/react-router';
import { router } from '@/lib/router';
import { queryClient } from '@/lib/queryClient';

export default function App() {
  return <RouterProvider router={router} context={{ queryClient }} />;
}
