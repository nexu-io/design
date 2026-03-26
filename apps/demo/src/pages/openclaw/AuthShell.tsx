import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import OpenClawBrandRail from '../../components/openclaw/OpenClawBrandRail';

export default function AuthShell() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-[var(--color-dark-bg)]">
      <OpenClawBrandRail
        onLogoClick={() => navigate('/openclaw')}
        topRight={<LanguageSwitcher variant="light" />}
      />

      <div className="flex-1 flex flex-col bg-surface-0 relative overflow-hidden rounded-l-[12px]">
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Mobile nav removed — nexu is a desktop client, BrandRail always visible */}

        <div className="relative z-10 flex-1 flex items-center justify-center px-5 py-8">
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
        </div>
      </div>
    </div>
  );
}
