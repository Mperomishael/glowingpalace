import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { GIVING } from "@/lib/site";

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

export function CopyableAccountNumber({
  className = "",
  numberClassName = "",
  hintClassName = "text-amber-300/90",
}: {
  className?: string;
  numberClassName?: string;
  hintClassName?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copyAccount = async () => {
    const ok = await copyText(GIVING.accountNumber);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <button
      type="button"
      onClick={copyAccount}
      className={`group text-center ${className}`}
      aria-label={`Copy account number ${GIVING.accountNumber}`}
      title="Tap to copy account number"
    >
      <div className={`font-mono font-bold tracking-wider group-active:scale-95 transition-transform break-all ${numberClassName}`}>
        {GIVING.accountNumber}
      </div>
      <div className={`mt-1.5 inline-flex items-center justify-center gap-1 text-[11px] sm:text-xs ${hintClassName}`}>
        {copied ? <Check size={12} /> : <Copy size={12} />}
        {copied ? "Copied" : "Tap to copy"}
      </div>
    </button>
  );
}

export function CopyAccountButton({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  const copyAccount = async () => {
    const ok = await copyText(GIVING.accountNumber);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <button
      type="button"
      onClick={copyAccount}
      className={className}
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
      {copied ? "Copied" : "Copy Account Number"}
    </button>
  );
}