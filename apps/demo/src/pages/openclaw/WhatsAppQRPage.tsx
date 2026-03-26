import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { usePageTitle } from '../../hooks/usePageTitle';

const CAPABILITY_PILLS = [
  { emoji: '🚀', label: 'Deploy in 3 sentences' },
  { emoji: '💻', label: 'Computer + 1000+ tools' },
  { emoji: '👥', label: 'Understands your team' },
  { emoji: '⏰', label: 'Always-on 24/7' },
];

export default function WhatsAppQRPage() {
  usePageTitle('Connect WhatsApp');
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen">
      {/* Left panel — dark */}
      <div className="hidden lg:flex w-[400px] shrink-0 bg-[#111111] flex-col justify-between p-8 relative overflow-hidden">
        <div className="flex items-center gap-2.5">
          <div className="flex justify-center items-center w-7 h-7 rounded-lg bg-white/15">
            <span className="text-xs font-bold text-white">N</span>
          </div>
          <span className="text-[14px] font-semibold text-white/90">nexu</span>
        </div>

        <div>
          <h2 className="text-[32px] font-bold text-white leading-[1.15] mb-4">
            Your AI coworker
            <br />
            in IM,
            <br />
            24/7 next to you.
          </h2>
          <p className="text-[13px] text-white/45 leading-relaxed mb-6 max-w-[280px]">
            Your AI coworker lives in IM—24/7 next to you, with memory, a cloud computer & 1000+ tools. No replacement, just support.
          </p>

          <div className="flex flex-wrap gap-2">
            {CAPABILITY_PILLS.map((p) => (
              <span
                key={p.label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] leading-none font-medium bg-white/[0.07] text-white/60 border border-white/[0.06]"
              >
                <span className="text-[11px]">{p.emoji}</span>
                {p.label}
              </span>
            ))}
          </div>
        </div>

        <div className="text-[11px] text-white/20">© 2026 nexu by Refly</div>
      </div>

      {/* Right panel — QR code */}
      <div className="flex-1 flex flex-col bg-surface-0">
        {/* Top bar with back button */}
        <div className="flex items-center px-6 h-14 border-b border-border">
          <button
            onClick={() => navigate('/openclaw')}
            className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        {/* Centered QR content */}
        <div className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-[360px] text-center">
            {/* WhatsApp icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-lg bg-[#25D366]/10 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                </svg>
              </div>
            </div>

            <h1 className="text-[22px] font-bold text-text-primary mb-2">
              Join via WhatsApp
            </h1>
            <p className="text-[14px] text-text-muted mb-8">
              Scan the QR code below to join our WhatsApp group and try the
              OpenClaw bot instantly.
            </p>

            {/* QR code placeholder */}
            <div className="mx-auto w-[220px] h-[220px] rounded-lg border-2 border-dashed border-border bg-surface-1 flex items-center justify-center mb-6">
              <div className="text-center">
                <div className="text-4xl mb-2">📱</div>
                <span className="text-[12px] text-text-muted">
                  QR Code
                  <br />
                  Coming Soon
                </span>
              </div>
            </div>

            <p className="text-[12px] text-text-muted leading-relaxed">
              Open WhatsApp on your phone → Scan this code → Start chatting with
              🦞
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
