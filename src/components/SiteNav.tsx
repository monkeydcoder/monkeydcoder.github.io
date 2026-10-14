'use client';

import { useEffect, useState } from 'react';
import { LuMenu, LuX, LuFileText } from 'react-icons/lu';
import { nav, profile } from '@/data/site';

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Highlight the section currently in the middle band of the viewport.
    const sections = nav
      .map((n) => document.querySelector<HTMLElement>(n.href))
      .filter((el): el is HTMLElement => Boolean(el));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => io.observe(s));
    return () => {
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? 'border-b border-white/[0.06] bg-ink-900/[0.95] backdrop-blur-md' : 'border-b border-transparent'
      }`}
    >
      <div className="scroll-progress" aria-hidden="true" />
      <nav className="container flex h-16 items-center justify-between" aria-label="Main">
        <a href="#top" className="group flex min-h-[44px] items-center gap-2 whitespace-nowrap" onClick={() => setOpen(false)}>
          <span className="font-serif text-xl text-paper">{profile.name}</span>
          <span className="hidden font-mono text-[0.72rem] text-faint transition-colors group-hover:text-accent sm:inline">
            RL · Tokyo
          </span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <li key={n.href}>
              <a
                href={n.href}
                aria-current={active === n.href ? 'true' : undefined}
                className={`relative rounded-full px-3 py-2 text-[0.95rem] transition-colors after:absolute after:inset-x-3 after:bottom-0.5 after:h-px after:origin-left after:bg-accent after:transition-transform after:duration-300 ${
                  active === n.href ? 'text-paper after:scale-x-100' : 'text-muted after:scale-x-0 hover:text-paper'
                }`}
              >
                {n.label}
              </a>
            </li>
          ))}
          <li className="ml-2">
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-white/15 px-3.5 text-[0.95rem] text-paper transition-colors hover:border-accent hover:text-accent"
            >
              <LuFileText aria-hidden="true" /> Résumé
            </a>
          </li>
        </ul>

        <button
          type="button"
          className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-2xl text-paper lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <LuX /> : <LuMenu />}
        </button>
      </nav>

      <div
        id="mobile-menu"
        hidden={!open}
        className="h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-white/[0.06] bg-ink-900/95 backdrop-blur-md lg:hidden"
      >
        <ul className="container flex flex-col py-6">
          {nav.map((n, i) => (
            <li key={n.href}>
              <a
                href={n.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-4 border-b border-white/[0.06] py-4 font-serif text-3xl text-paper"
              >
                <span className="font-mono text-xs text-faint">{String(i + 1).padStart(2, '0')}</span>
                {n.label}
              </a>
            </li>
          ))}
          <li className="pt-8">
            <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="btn-primary w-full">
              <LuFileText aria-hidden="true" /> Download résumé
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
