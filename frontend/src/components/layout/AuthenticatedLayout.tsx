import type { ReactNode } from 'react';
import { useLocation } from '@tanstack/react-router';
import TopNavBar from './TopNavBar';
import Footer from './Footer';

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

// Routes that manage their own full-screen layout (no standard chrome)
const CHROMELESS_ROUTES = new Set(['/main']);

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  const pathname = useLocation({ select: (l) => l.pathname });
  const isChromeless = CHROMELESS_ROUTES.has(pathname);

  if (isChromeless) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopNavBar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
};

export default AuthenticatedLayout;
