import type { ReactNode } from "react";
import { useLocation } from "@tanstack/react-router";
import { UnifiedNavBar } from "./UnifiedNavBar";
import Footer from "./Footer";

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  const pathname = useLocation({ select: (l) => l.pathname });
  const isMain = pathname === "/main";

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <UnifiedNavBar />
      <main style={{ flex: 1 }}>{children}</main>
      {!isMain && <Footer />}
    </div>
  );
};

export default AuthenticatedLayout;
