'use client';

import { useEffect, useRef } from 'react';

// Subtle pointer-driven light, for mouse/trackpad users only.
// - A soft vermilion glow follows the cursor (moved with transform, so no repaints).
// - The hovered .card gets --mx/--my so CSS can light its border near the cursor.
// Disabled on touch screens and when the visitor prefers reduced motion.
export default function PointerEffects() {
  const lightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const light = lightRef.current;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!light || !finePointer.matches || reduced.matches) return;

    const root = document.documentElement;
    root.classList.add('pointer-fx');

    let targetX = window.innerWidth * 0.7;
    let targetY = window.innerHeight * 0.3;
    let x = targetX;
    let y = targetY;
    let raf = 0;
    let card: HTMLElement | null = null;
    let cardX = 0;
    let cardY = 0;

    const tick = () => {
      // ease toward the pointer so the light glides instead of snapping
      x += (targetX - x) * 0.16;
      y += (targetY - y) * 0.16;
      light.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      if (card) {
        card.style.setProperty('--mx', `${cardX.toFixed(0)}px`);
        card.style.setProperty('--my', `${cardY.toFixed(0)}px`);
      }
      raf = Math.abs(targetX - x) + Math.abs(targetY - y) > 0.4 ? requestAnimationFrame(tick) : 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      targetX = e.clientX;
      targetY = e.clientY;
      const hit = (e.target as Element | null)?.closest?.('.card') as HTMLElement | null;
      card = hit;
      if (hit) {
        const r = hit.getBoundingClientRect();
        cardX = e.clientX - r.left;
        cardY = e.clientY - r.top;
      }
      light.style.opacity = '1';
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onLeave = () => {
      light.style.opacity = '0';
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    root.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      root.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
      root.classList.remove('pointer-fx');
    };
  }, []);

  return <div ref={lightRef} className="cursor-light" aria-hidden="true" />;
}
