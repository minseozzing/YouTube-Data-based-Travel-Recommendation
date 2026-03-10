const Footer = () => {
  return (
    <footer className="w-full border-t border-border/60 bg-background py-6">
      <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          &copy; 2026 다행. All rights reserved.
        </p>
        <nav
          className="flex items-center gap-4"
          aria-label="푸터 네비게이션"
        >
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            aria-label="개인정보처리방침"
          >
            Privacy
          </a>
          <span className="text-border" aria-hidden="true">·</span>
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            aria-label="안전 정책"
          >
            Safety
          </a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
