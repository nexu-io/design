import { AuthShell as DesktopAuthShell } from "@nexu-design/ui-web";
import { AnimatePresence, motion } from "framer-motion";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import OpenClawBrandRail from "../../components/openclaw/OpenClawBrandRail";

export default function AuthShell() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <DesktopAuthShell
      rail={
        <OpenClawBrandRail
          onLogoClick={() => navigate("/openclaw")}
          topRight={<LanguageSwitcher variant="light" />}
        />
      }
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="w-full"
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </DesktopAuthShell>
  );
}
