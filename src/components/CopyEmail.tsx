'use client';

import { useState } from 'react';
import { LuCopy, LuCheck } from 'react-icons/lu';

export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 px-4 font-mono text-xs text-muted transition-colors hover:border-white/35 hover:text-paper"
      aria-live="polite"
    >
      {copied ? <LuCheck className="text-jade" aria-hidden="true" /> : <LuCopy aria-hidden="true" />}
      {copied ? 'Copied' : 'Copy email'}
    </button>
  );
}
