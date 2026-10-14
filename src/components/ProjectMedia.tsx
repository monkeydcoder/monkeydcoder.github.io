'use client';

import { useId, useRef, useState } from 'react';
import { LuPlay } from 'react-icons/lu';
import type { ProjectMedia as Media } from '@/data/site';

const FRAME = 'relative aspect-video w-full overflow-hidden bg-ink-950';

function PlayButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="group absolute inset-0 flex items-center justify-center bg-ink-950/30 transition-colors hover:bg-ink-950/10"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-xl text-ink-950 shadow-[0_0_40px_rgba(255,106,77,0.45)] transition-transform group-hover:scale-105">
        <LuPlay className="translate-x-[1px]" aria-hidden="true" />
      </span>
    </button>
  );
}

function Poster({ src, alt, dim = false }: { src: string; alt: string; dim?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover/card:scale-[1.03] ${dim ? 'brightness-[0.72]' : ''}`}
    />
  );
}

function Pattern({ variant, caption }: { variant: 'route' | 'pipeline'; caption: string }) {
  const uid = useId().replace(/:/g, '');
  if (variant === 'route') {
    const stops = [
      [40, 128], [72, 62], [106, 100], [140, 46], [152, 138], [190, 84], [228, 128], [250, 50], [286, 96],
    ];
    const others = [[62, 150], [120, 28], [206, 30], [270, 150], [28, 78], [300, 40], [176, 158]];
    return (
      <div className={`${FRAME} flex items-center justify-center`}>
        <svg viewBox="0 0 320 180" className="h-full w-full" aria-hidden="true">
          <defs>
            <pattern id={`dots-${uid}`} width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.06)" />
            </pattern>
          </defs>
          <rect width="320" height="180" fill={`url(#dots-${uid})`} />
          {others.map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="2.5" fill="rgba(255,255,255,0.16)" />
          ))}
          <polyline
            points={stops.slice(0, 5).map((p) => p.join(',')).join(' ')}
            fill="none"
            stroke="#ff6a4d"
            strokeWidth="1.6"
            strokeDasharray="4 4"
          />
          <polyline
            points={stops.slice(4).map((p) => p.join(',')).join(' ')}
            fill="none"
            stroke="#5fbf8f"
            strokeWidth="1.6"
            strokeDasharray="4 4"
          />
          {stops.map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="3.4" fill="#f2b84b" />
          ))}
          <line x1="14" y1="17" x2="24" y2="17" stroke="#ff6a4d" strokeWidth="1.6" />
          <text x="29" y="20" fill="#ff6a4d" fontFamily="monospace" fontSize="9">day 1</text>
          <line x1="14" y1="30" x2="24" y2="30" stroke="#5fbf8f" strokeWidth="1.6" />
          <text x="29" y="33" fill="#5fbf8f" fontFamily="monospace" fontSize="9">day 2</text>
        </svg>
        <span className="absolute bottom-3 left-4 font-mono text-[0.76rem] text-faint">{caption}</span>
      </div>
    );
  }

  const parts = caption.split('→').map((t) => t.trim());
  const boxW = Math.min(72, (296 - (parts.length - 1) * 22) / parts.length);
  const gap = (296 - parts.length * boxW) / Math.max(1, parts.length - 1);
  return (
    <div className={`${FRAME} flex items-center justify-center`}>
      <svg viewBox="0 0 320 180" className="h-full w-full" aria-hidden="true">
        <defs>
          <marker id={`arrow-${uid}`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0 0 L8 4 L0 8 z" fill="#ff6a4d" />
          </marker>
        </defs>
        {parts.map((label, i) => {
          const x = 12 + i * (boxW + gap);
          const last = i === parts.length - 1;
          return (
            <g key={label}>
              <rect
                x={x}
                y="72"
                width={boxW}
                height="36"
                rx="8"
                fill={last ? 'rgba(95,191,143,0.10)' : 'rgba(255,255,255,0.03)'}
                stroke={last ? 'rgba(95,191,143,0.7)' : 'rgba(255,255,255,0.18)'}
              />
              <text
                x={x + boxW / 2}
                y="94"
                textAnchor="middle"
                fill={last ? '#5fbf8f' : '#a4a7af'}
                fontFamily="monospace"
                fontSize="8.5"
              >
                {label}
              </text>
              {!last && (
                <line
                  x1={x + boxW + 4}
                  y1="90"
                  x2={x + boxW + gap - 6}
                  y2="90"
                  stroke="#ff6a4d"
                  strokeWidth="1.4"
                  markerEnd={`url(#arrow-${uid})`}
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function ProjectMedia({ media, title }: { media: Media; title: string }) {
  const [active, setActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (media.type === 'pattern') return <Pattern variant={media.variant} caption={media.caption} />;

  if (media.type === 'video') {
    return (
      <div className={FRAME}>
        <video
          ref={videoRef}
          src={media.src}
          poster={media.poster}
          preload="none"
          controls={active}
          muted
          playsInline
          className="h-full w-full object-contain"
        />
        {!active && (
          <div className="absolute inset-0">
            <Poster src={media.poster} alt={media.alt} dim />
            <PlayButton
              label={`Play ${title} video`}
              onClick={() => {
                // play() must run inside the tap for iOS Safari to allow it
                videoRef.current?.play().catch(() => undefined);
                setActive(true);
              }}
            />
          </div>
        )}
      </div>
    );
  }

  if (media.type === 'loom') {
    return (
      <div className={FRAME}>
        {active ? (
          <iframe
            src={media.embed}
            title={`${title} demo video`}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <>
            <Poster src={media.poster} alt={media.alt} />
            <PlayButton label={`Play ${title} demo video`} onClick={() => setActive(true)} />
          </>
        )}
      </div>
    );
  }

  // gif: show a still, animate on request (the 3D walkthrough is ~3.7 MB)
  return (
    <div className={FRAME}>
      {active ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={media.src} alt={media.alt} className="h-full w-full object-cover object-top" />
      ) : (
        <>
          <Poster src={media.poster} alt={media.alt} />
          <PlayButton label={`Play ${title} walkthrough`} onClick={() => setActive(true)} />
        </>
      )}
    </div>
  );
}
