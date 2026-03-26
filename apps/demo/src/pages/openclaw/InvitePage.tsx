import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '../../hooks/usePageTitle';
import { AlertCircle, Check } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const VALID_CODES = ['NEXU2026', 'OPENCLAW', 'LOBSTER', 'EARLY-ACCESS'];

const TOKENS = {
  brand700: '#3db9ce',
  brand800: '#00a2c7',
  surface0: '#fafdfe',
  surface1: '#ffffff',
  textPrimary: '#1c1f23',
  textSecondary: '#545659',
  textPlaceholder: '#8f959e',
  borderInput: '#dee0e3',
  error: '#F8672F',
  success: '#346E58',
  darkBg: '#042028',
  font: 'var(--font-sans)',
  fontMono: 'var(--font-mono)',
  easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
};

export default function InvitePage() {
  usePageTitle('Invite Code');
  const navigate = useNavigate();
  const [fullCode, setFullCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData('text')
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9-]/g, '');
    setFullCode(pasted);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const codeValue = fullCode.trim().toUpperCase();
    if (!codeValue) {
      setError('Please enter an invite code');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      if (VALID_CODES.includes(codeValue)) {
        setSuccess(true);
        setTimeout(() => navigate('/openclaw/onboarding'), 1200);
      } else {
        setError('Invalid invite code. Please try again.');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div
      className="flex min-h-screen"
      style={{ fontFamily: TOKENS.font }}
    >
      {/* Left panel — brand dark */}
      <div
        className="hidden lg:flex w-[420px] shrink-0 flex-col justify-between p-10 relative overflow-hidden"
        style={{ background: TOKENS.darkBg }}
      >
        <img
          src="/brand/nexu logo-white1.svg"
          alt="nexu"
          className="h-7 w-auto object-contain"
        />

        <div className="flex-1 flex flex-col justify-center">
          <h2
            className="text-[28px] font-semibold leading-[1.2] mb-4"
            style={{ color: '#ffffff' }}
          >
            Your mind,
            <br />
            extended.
          </h2>
          <p
            className="text-[14px] leading-relaxed max-w-[280px]"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            AI coworkers that live in your IM — with memory, tools, and
            real understanding of your team.
          </p>
        </div>

        <div
          className="text-[11px]"
          style={{ color: 'rgba(255,255,255,0.2)' }}
        >
          © 2026 nexu by Refly
        </div>
      </div>

      {/* Right panel — form */}
      <div
        className="flex-1 flex flex-col"
        style={{ background: TOKENS.surface0 }}
      >
        {/* Mobile-only nav */}
        <nav
          className="lg:hidden flex items-center px-6 h-14"
          style={{ borderBottom: `1px solid ${TOKENS.borderInput}` }}
        >
          <button
            onClick={() => navigate('/openclaw')}
            className="flex items-center"
          >
            <img
              src="/brand/nexu logo-black1.svg"
              alt="nexu"
              className="h-6 w-auto object-contain"
            />
          </button>
        </nav>

        <div className="flex-1 flex items-center justify-center px-6 py-16">
          <div
            className="w-full max-w-[380px]"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(12px)',
              transition: `all 0.3s ${TOKENS.easeOut}`,
            }}
          >
            {success ? (
              <SuccessState />
            ) : (
              <FormState
                fullCode={fullCode}
                setFullCode={setFullCode}
                error={error}
                setError={setError}
                loading={loading}
                onSubmit={handleSubmit}
                onPaste={handlePaste}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SuccessState() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setShow(true));
  }, []);

  return (
    <div className="text-center">
      <div
        className="flex items-center justify-center mx-auto mb-6 w-16 h-16 rounded-lg"
        style={{
          background: `${TOKENS.success}14`,
          transform: show ? 'scale(1)' : 'scale(0.5)',
          opacity: show ? 1 : 0,
          transition: `all 0.4s ${TOKENS.easeOut}`,
        }}
      >
        <Check
          size={32}
          strokeWidth={2.5}
          style={{ color: TOKENS.success }}
        />
      </div>
      <h1
        className="text-[24px] font-semibold mb-2"
        style={{
          color: TOKENS.textPrimary,
          fontFamily: TOKENS.font,
          opacity: show ? 1 : 0,
          transform: show ? 'translateY(0)' : 'translateY(8px)',
          transition: `all 0.3s ${TOKENS.easeOut} 0.1s`,
        }}
      >
        You're in!
      </h1>
      <p
        className="text-[14px] mb-6"
        style={{
          color: TOKENS.textSecondary,
          fontFamily: TOKENS.font,
          opacity: show ? 1 : 0,
          transition: `opacity 0.3s ease 0.2s`,
        }}
      >
        Invite code verified. Setting things up...
      </p>
      <div
        className="mx-auto w-5 h-5 rounded-full border-2 animate-spin"
        style={{
          borderColor: `${TOKENS.brand700}30`,
          borderTopColor: TOKENS.brand700,
        }}
      />
    </div>
  );
}

function FormState({
  fullCode,
  setFullCode,
  error,
  setError,
  loading,
  onSubmit,
  onPaste,
}: {
  fullCode: string;
  setFullCode: (v: string) => void;
  error: string;
  setError: (v: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onPaste: (e: React.ClipboardEvent) => void;
}) {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? TOKENS.error
    : focused
      ? TOKENS.brand700
      : TOKENS.borderInput;

  const shadowStyle = error
    ? `0 0 0 2px ${TOKENS.error}25`
    : focused
      ? 'var(--shadow-focus)'
      : 'none';

  return (
    <>
      <div className="mb-8">
        <h1
          className="text-[24px] font-semibold mb-2"
          style={{
            color: TOKENS.textPrimary,
            fontFamily: TOKENS.font,
          }}
        >
          Enter your invite code
        </h1>
        <p
          className="text-[14px]"
          style={{
            color: TOKENS.textSecondary,
            fontFamily: TOKENS.font,
          }}
        >
          Got an invite code? Enter it below to get started.
        </p>
      </div>

      <form onSubmit={onSubmit}>
        <div className="mb-5">
          <Label
            className="text-[13px] font-semibold mb-2"
            style={{
              color: TOKENS.textSecondary,
              fontFamily: TOKENS.font,
            }}
          >
            Invite code
          </Label>
          <input
            type="text"
            value={fullCode}
            onChange={(e) => {
              setFullCode(e.target.value.toUpperCase());
              setError('');
            }}
            onPaste={onPaste}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="e.g. NEXU2026"
            className="w-full text-center font-mono tracking-[0.15em] text-[18px] outline-none"
            style={{
              fontFamily: 'var(--font-mono)',
              background: TOKENS.surface1,
              color: TOKENS.textPrimary,
              border: `0.5px solid ${borderColor}`,
              borderRadius: '16px',
              padding: '14px 16px',
              boxShadow: shadowStyle,
              transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            }}
          />
          <div
            style={{
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              marginTop: '8px',
            }}
          >
            {error && (
              <div
                className="flex items-center gap-1.5 text-[13px]"
                style={{ color: TOKENS.error }}
              >
                <AlertCircle size={14} />
                {error}
              </div>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded-full h-9 text-[14px] font-semibold"
          style={{
            background: '#1c1f23',
            color: '#ffffff',
            fontFamily: TOKENS.font,
          }}
        >
          {loading ? (
            <div
              className="w-4 h-4 rounded-full border-2 animate-spin"
              style={{
                borderColor: 'rgba(255,255,255,0.3)',
                borderTopColor: '#ffffff',
              }}
            />
          ) : (
            'Continue'
          )}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <span
          className="text-[13px]"
          style={{ color: TOKENS.textPlaceholder, fontFamily: TOKENS.font }}
        >
          Don't have a code?{' '}
          <a
            href="#"
            className="font-semibold hover:underline underline-offset-2"
            style={{ color: TOKENS.brand700 }}
          >
            Join waitlist
          </a>
        </span>
      </div>
    </>
  );
}
