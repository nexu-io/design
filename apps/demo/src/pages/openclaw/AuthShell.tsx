import { Button } from "@nexu-design/ui-web";
import { AnimatePresence, motion } from "framer-motion";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import LanguageSwitcher from "../../components/LanguageSwitcher";

export default function AuthShell() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="flex items-center justify-end px-6 py-5 sm:px-8">
        <LanguageSwitcher variant="dark" />
      </header>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="w-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="px-6 py-6 sm:px-8">
        <div className="mx-auto flex max-w-[520px] items-center justify-center gap-4 text-[12px] text-text-muted">
          <span>© {new Date().getFullYear()} nexu</span>
          <span className="text-border select-none">·</span>
          <Button
            type="button"
            variant="ghost"
            size="inline"
            onClick={() => navigate("/openclaw/terms")}
            className="h-auto p-0 text-[12px] text-text-muted transition-colors hover:bg-transparent hover:text-text-secondary"
          >
            Terms
          </Button>
          <span className="text-border select-none">·</span>
          <Button
            type="button"
            variant="ghost"
            size="inline"
            onClick={() => navigate("/openclaw/privacy")}
            className="h-auto p-0 text-[12px] text-text-muted transition-colors hover:bg-transparent hover:text-text-secondary"
          >
            Privacy
          </Button>
        </div>
      </footer>
    </div>
  );
}
