import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocale } from "../../hooks/useLocale";
import { usePageTitle } from "../../hooks/usePageTitle";

const IM_CHANNELS = ["WeChat", "Feishu", "Telegram", "Discord", "Slack"];

function RotatingChannel() {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setAnimating(true);
      window.setTimeout(() => {
        setIndex((prev) => (prev + 1) % IM_CHANNELS.length);
        setAnimating(false);
      }, 350);
    }, 2200);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <span
      className="relative inline-flex overflow-hidden align-bottom"
      style={{ height: "1.15em" }}
    >
      <span
        className="transition-all duration-300 ease-in-out"
        style={{
          transform: animating ? "translateY(-110%)" : "translateY(0)",
          opacity: animating ? 0 : 1,
        }}
      >
        {IM_CHANNELS[index]}
      </span>
    </span>
  );
}

export default function ClientWelcomePage() {
  const { t } = useLocale();
  usePageTitle(t("welcome.pageTitle"));
  const navigate = useNavigate();

  return (
    <div className="flex max-w-[420px] flex-col items-start">
      <img src="/brand/nexu-welcome-logo.svg" alt="nexu" className="mb-10 h-32 w-32" />

      <h1 className="text-[32px] font-bold leading-[1.25] tracking-tight text-neutral-900">
        {t("welcome.landing.title")
          .split("\n")
          .map((line, index, all) => (
            <span key={line}>
              {line}
              {index < all.length - 1 && <br />}
            </span>
          ))}
        <span className="whitespace-nowrap">
          {" "}
          <RotatingChannel />
        </span>
      </h1>

      <div className="mt-5 flex flex-col text-[14px] leading-[1.7] text-neutral-500">
        {t("welcome.landing.subtitle")
          .split("\n")
          .map((line) => (
            <span key={line} className="whitespace-nowrap">
              {line}
            </span>
          ))}
      </div>

      <div className="mt-10 w-full space-y-3">
        <button
          type="button"
          onClick={() => navigate("/openclaw/auth")}
          className="flex h-[50px] w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-neutral-900 text-[14px] font-medium text-white transition-all hover:bg-neutral-800 active:scale-[0.98]"
        >
          <svg
            aria-hidden="true"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
          {t("welcome.hero.cta")}
        </button>

        <button
          type="button"
          onClick={() =>
            navigate("/openclaw/workspace?view=settings&tab=providers&provider=anthropic")
          }
          className="block w-full cursor-pointer text-center text-[13px] text-neutral-400 transition-colors hover:text-neutral-600"
        >
          {t("welcome.hero.byok")}
        </button>
      </div>
    </div>
  );
}
