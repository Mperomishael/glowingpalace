import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Copy, Heart, Loader2 } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import WhatsAppFloat from '../../components/WhatsAppFloat';
import {
  GIVE_COUNTRIES,
  GIVE_INTL_OPTIONS,
  GIVE_FREQUENCIES,
  CRYPTO_WALLETS,
  type GiveCountry,
  type GiveFrequency,
} from '@/lib/give';
import { useFlutterwaveScript } from '../../hooks/useFlutterwaveScript';

const NOT_LISTED = 'NOT_LISTED';
const ALL_OPTIONS = [...GIVE_COUNTRIES, ...GIVE_INTL_OPTIONS];

function formatAmount(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = value;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    const ok = await copyText(value);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };
  return (
    <div className="bg-white/70 border border-[#D9C4AA] rounded-xl p-4 text-left min-w-0">
      <div className="text-[10px] uppercase tracking-wider text-[#321C04]/60 mb-1">{label}</div>
      <button type="button" onClick={onCopy} className="group w-full flex items-center justify-between gap-3 text-left min-w-0">
        <span className="font-mono text-sm sm:text-base text-[#321C04] break-all min-w-0">{value}</span>
        <span className="shrink-0 text-[#321C04]/60 group-active:scale-90 transition-transform">
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </span>
      </button>
    </div>
  );
}

export default function GivePage() {
  const flwReady = useFlutterwaveScript();

  const [selectedCode, setSelectedCode] = useState<string>(GIVE_COUNTRIES[0].code);
  const selected: GiveCountry | null =
    selectedCode === NOT_LISTED ? null : ALL_OPTIONS.find((c) => c.code === selectedCode) || null;

  const [frequency, setFrequency] = useState<GiveFrequency>('one_time');
  const [amount, setAmount] = useState<number | ''>(selected?.quickAmounts[1] ?? '');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ amount: number; currency: string } | null>(null);

  const frequencyIndex = GIVE_FREQUENCIES.findIndex((f) => f.value === frequency);

  const pickCountry = (code: string) => {
    setSelectedCode(code);
    setError(null);
    setSuccess(null);
    if (code !== NOT_LISTED) {
      const c = ALL_OPTIONS.find((o) => o.code === code);
      if (c) setAmount(c.quickAmounts[1]);
    }
  };

  const canSubmit =
    flwReady && !submitting && !!selected && typeof amount === 'number' && amount > 0 && name.trim() && email.trim();

  const handleGive = async () => {
    if (!selected || typeof amount !== 'number' || amount <= 0) return;
    setSubmitting(true);
    setError(null);

    try {
      let planId: string | undefined;
      if (frequency !== 'one_time') {
        const planRes = await fetch('/api/give', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount, currency: selected.currency, interval: frequency }),
        });
        const planData = await planRes.json();
        if (!planRes.ok) throw new Error(planData?.error || 'Could not set up recurring giving');
        planId = planData.planId;
      }

      const txRef = `gpcm-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      window.FlutterwaveCheckout?.({
        public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
        tx_ref: txRef,
        amount,
        currency: selected.currency,
        ...(planId ? { payment_plan: planId } : {}),
        customer: { email, name, phone_number: phone || undefined },
        customizations: {
          title: "GPCM INT'L Giving",
          description: `${frequency === 'one_time' ? 'One-time' : frequency} giving — ${selected.name}`,
          logo: `${window.location.origin}/logo.webp`,
        },
        callback: async (response: { transaction_id?: number | string; tx_ref?: string; status?: string }) => {
          try {
            const ref = response.transaction_id || response.tx_ref || txRef;
            const param = response.transaction_id ? 'transaction_id' : 'tx_ref';
            const verifyRes = await fetch(`/api/give?${param}=${encodeURIComponent(String(ref))}`);
            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.status === 'successful') {
              setSuccess({ amount: verifyData.amount ?? amount, currency: verifyData.currency ?? selected.currency });
            } else {
              setError("We couldn't confirm that payment yet. If you were charged, please contact us via WhatsApp.");
            }
          } catch {
            setError("We couldn't confirm that payment yet. If you were charged, please contact us via WhatsApp.");
          } finally {
            setSubmitting(false);
          }
        },
        onclose: () => setSubmitting(false),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setSubmitting(false);
    }
  };

  const flagWatermark = useMemo(() => {
    if (selectedCode === NOT_LISTED) return '🌐';
    return selected?.flag || '🙏';
  }, [selectedCode, selected]);

  return (
    <div className="tail-container bg-zinc-50 text-zinc-900 min-h-screen relative overflow-x-clip">
      <Navbar onOpenLiveModal={() => (window.location.href = '/live')} />
      <main className="pt-20">
        <section className="relative py-10 sm:py-14 md:py-16 bg-[#F6E4CF] overflow-hidden">
          {/* Live animated background — soft drifting glow orbs */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-16 -left-16 w-72 h-72 rounded-full bg-violet-300/25 blur-3xl animate-float-slow"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 -right-10 w-80 h-80 rounded-full bg-amber-200/30 blur-3xl animate-float-slower"
          />
          <div
            key={flagWatermark}
            aria-hidden
            className="pointer-events-none select-none absolute -top-10 -right-10 text-[220px] sm:text-[320px] opacity-[0.08] leading-none transition-opacity duration-500 animate-float-slower"
          >
            {flagWatermark}
          </div>

          <div className="relative max-w-3xl mx-auto px-4 sm:px-5">
            <div className="text-center mb-8 sm:mb-10">
              <div className="inline-flex items-center gap-1.5 bg-violet-100 text-violet-700 px-3 sm:px-4 py-1 rounded-full text-[11px] sm:text-xs font-medium mb-3">
                <Heart size={12} className="animate-pulse" />
                GIVE
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#321C04]">
                Partner With Us
              </h1>
              <p className="mt-3 text-sm sm:text-base text-[#321C04]/80">
                Give from wherever you are — your partnership advances the Gospel.
              </p>
            </div>

            {success ? (
              <div className="bg-[#FFF9F2] border border-[#D9C4AA] rounded-2xl p-8 text-center shadow-sm animate-pop-in">
                <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4 animate-pop-in">
                  <Check size={28} />
                </div>
                <h2 className="font-serif text-2xl font-semibold text-[#321C04] mb-2">Thank You!</h2>
                <p className="text-[#321C04]/80 text-sm sm:text-base break-words">
                  We received your gift of {formatAmount(success.amount, success.currency)}. May God bless you richly.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="https://wa.me/2348069390490"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full text-sm font-semibold transition-all shadow-sm"
                  >
                    Send a message for prayer
                  </a>
                  <Link
                    to="/"
                    className="inline-flex items-center justify-center gap-2 bg-white border border-[#D9C4AA] text-[#321C04] px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#FFF9F2] transition-all"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-[#FFF9F2]/90 backdrop-blur-sm border border-[#D9C4AA] rounded-2xl p-5 sm:p-8 shadow-sm">
                {/* Country / currency picker — horizontal scroll strip with scroll hint */}
                <div className="mb-6 relative">
                  <div className="text-xs uppercase tracking-wider text-[#321C04]/60 mb-2.5">
                    Where are you giving from?
                  </div>
                  <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory scroll-smooth">
                    {ALL_OPTIONS.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => pickCountry(c.code)}
                        className={`snap-start shrink-0 flex flex-col items-center gap-1 px-3.5 py-2.5 rounded-xl border transition-all duration-200 ${
                          selectedCode === c.code
                            ? 'border-violet-500 bg-violet-50 shadow-md shadow-violet-200 scale-105'
                            : 'border-[#D9C4AA] bg-white/70 hover:bg-white hover:scale-[1.02]'
                        }`}
                      >
                        <span className="text-2xl leading-none">{c.flag}</span>
                        <span className="text-[10px] font-medium text-[#321C04] whitespace-nowrap">{c.name}</span>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => pickCountry(NOT_LISTED)}
                      className={`snap-start shrink-0 flex flex-col items-center gap-1 px-3.5 py-2.5 rounded-xl border transition-all duration-200 ${
                        selectedCode === NOT_LISTED
                          ? 'border-violet-500 bg-violet-50 shadow-md shadow-violet-200 scale-105'
                          : 'border-[#D9C4AA] bg-white/70 hover:bg-white hover:scale-[1.02]'
                      }`}
                    >
                      <span className="text-2xl leading-none">🌐</span>
                      <span className="text-[10px] font-medium text-[#321C04] whitespace-nowrap">Not listed</span>
                    </button>
                  </div>
                  {/* fade hint so it reads as scrollable on small screens */}
                  <div className="pointer-events-none absolute top-6 right-0 bottom-2 w-8 bg-gradient-to-l from-[#FFF9F2] to-transparent" />
                </div>

                {selectedCode === NOT_LISTED ? (
                  <div className="space-y-3">
                    <p className="text-sm text-[#321C04]/80 mb-1">
                      Give with crypto — tap an address below to copy it.
                    </p>
                    <CopyField label={CRYPTO_WALLETS.usdt.label} value={CRYPTO_WALLETS.usdt.address} />
                    <CopyField label={CRYPTO_WALLETS.btc.label} value={CRYPTO_WALLETS.btc.address} />
                    <p className="text-xs text-[#321C04]/60 pt-1">
                      After sending, please share your confirmation via WhatsApp so we can acknowledge your gift in prayer.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Frequency toggle — animated sliding pill */}
                    <div className="mb-6">
                      <div className="text-xs uppercase tracking-wider text-[#321C04]/60 mb-2.5">How often?</div>
                      <div className="relative grid grid-cols-3 bg-white/70 border border-[#D9C4AA] rounded-full p-1">
                        <div
                          className="absolute inset-y-1 w-1/3 bg-violet-600 rounded-full shadow-md shadow-violet-300 transition-transform duration-300 ease-out"
                          style={{ transform: `translateX(${frequencyIndex * 100}%)` }}
                        />
                        {GIVE_FREQUENCIES.map((f) => (
                          <button
                            key={f.value}
                            type="button"
                            onClick={() => setFrequency(f.value)}
                            className={`relative z-10 py-2 text-xs sm:text-sm font-semibold rounded-full transition-colors ${
                              frequency === f.value ? 'text-white' : 'text-[#321C04]/70'
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Amount — sized to content, never overflows its box */}
                    <div className="mb-6">
                      <div className="text-xs uppercase tracking-wider text-[#321C04]/60 mb-2.5">Amount</div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                        {selected?.quickAmounts.map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => setAmount(q)}
                            className={`flex flex-col items-center justify-center gap-0.5 py-2.5 px-1.5 rounded-xl border transition-all min-w-0 ${
                              amount === q
                                ? 'border-violet-500 bg-violet-50 text-violet-700 shadow-sm'
                                : 'border-[#D9C4AA] bg-white/70 text-[#321C04] hover:bg-white'
                            }`}
                          >
                            <span className="text-[9px] uppercase tracking-wide opacity-60 leading-none">
                              {selected.currency}
                            </span>
                            <span className="text-sm sm:text-base font-bold leading-tight tabular-nums truncate max-w-full">
                              {q.toLocaleString()}
                            </span>
                          </button>
                        ))}
                      </div>
                      <div className="flex items-stretch bg-white/70 border border-[#D9C4AA] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-violet-400">
                        <span className="shrink-0 flex items-center px-3 text-xs font-semibold text-[#321C04]/60 border-r border-[#D9C4AA] whitespace-nowrap">
                          {selected?.currency}
                        </span>
                        <input
                          type="number"
                          min={1}
                          inputMode="decimal"
                          placeholder="Custom amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
                          className="w-full min-w-0 px-3 py-3 text-sm outline-none bg-transparent"
                        />
                      </div>
                    </div>

                    {/* Donor info */}
                    <div className="space-y-3 mb-6">
                      <input
                        type="text"
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white/70 border border-[#D9C4AA] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-400"
                      />
                      <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/70 border border-[#D9C4AA] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-400"
                      />
                      <input
                        type="tel"
                        placeholder="Phone number (optional)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white/70 border border-[#D9C4AA] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-400"
                      />
                    </div>

                    {error && <p className="text-xs text-red-600 mb-3 text-center break-words">{error}</p>}

                    <button
                      type="button"
                      disabled={!canSubmit}
                      onClick={handleGive}
                      className="w-full py-3.5 px-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full font-semibold text-xs sm:text-sm inline-flex flex-wrap items-center justify-center gap-1.5 text-center transition-all"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin shrink-0" /> Processing…
                        </>
                      ) : (
                        <>
                          <Heart size={16} className="shrink-0" />
                          <span className="break-words">
                            Give {typeof amount === 'number' && amount > 0 ? formatAmount(amount, selected?.currency || 'USD') : ''}
                            {frequency !== 'one_time' ? ` / ${frequency === 'weekly' ? 'week' : 'month'}` : ''}
                          </span>
                        </>
                      )}
                    </button>

                    {/* Local alternative — data-driven per country. Nigeria has one today;
                        any other country shows "coming soon" until its details are filled in
                        in src/lib/give.ts, at which point this automatically renders it. */}
                    <details className="mt-6 text-center">
                      <summary className="text-xs text-[#321C04]/60 cursor-pointer select-none">
                        {selected?.localAlternative
                          ? `Prefer ${selected.localAlternative.label.toLowerCase()} instead?`
                          : `Other ways to give from ${selected?.name}`}
                      </summary>
                      <div className="mt-4">
                        {selected?.localAlternative ? (
                          <div className="bg-white/70 border border-[#D9C4AA] rounded-xl p-4 text-left">
                            <div className="text-[10px] uppercase tracking-wider text-[#321C04]/60 mb-2">
                              {selected.localAlternative.label} · {selected.localAlternative.bank}
                            </div>
                            <CopyField label="Account Number" value={selected.localAlternative.accountNumber} />
                            <div className="mt-2 text-sm text-[#321C04]/80">
                              {selected.localAlternative.accountName}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-white/50 border border-dashed border-[#D9C4AA] rounded-xl p-4 text-xs sm:text-sm text-[#321C04]/60">
                            More local payment options for {selected?.name} are coming soon.
                          </div>
                        )}
                      </div>
                    </details>
                  </>
                )}
              </div>
            )}

            <p className="mt-8 text-center text-xs text-[#321C04]/60 italic">
              &quot;God loves a cheerful giver.&quot; — 2 Corinthians 9:7
            </p>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
