import type { ReactNode } from 'react';
import TopNavBar from './TopNavBar';
import Footer from './Footer';

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopNavBar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
};

export default AuthenticatedLayout;
