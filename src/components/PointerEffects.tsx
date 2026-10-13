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
    let lastX = -1;
    let lastY = -1;

    const locateCard = (target: Element | null, cx: number, cy: number) => {
      const hit = (target?.closest?.('.card') as HTMLElement | null) ?? null;
      card = hit;
      if (hit) {
        const r = hit.getBoundingClientRect();
        cardX = cx - r.left;
        cardY = cy - r.top;
      }
    };

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
      targetX = lastX = e.clientX;
      targetY = lastY = e.clientY;
      locateCard(e.target as Element | null, e.clientX, e.clientY);
      light.style.opacity = '1';
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onLeave = () => {
      light.style.opacity = '0';
    };
    const onScroll = () => {
      if (lastX < 0) return;
      locateCard(document.elementFromPoint(lastX, lastY), lastX, lastY);
      if (!raf) raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    root.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      root.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
      root.classList.remove('pointer-fx');
    };
  }, []);

  return <div ref={lightRef} className="cursor-light" aria-hidden="true" />;
}
