'use client';

import { useEffect, useRef, useState } from 'react';

// A small, scripted MiniGrid "DoorKey" episode: pick up the key, unlock the
// door, reach the goal. The only reward arrives at the very end, which is the
// sparse-reward problem the research is about. Purely illustrative (no
// learning happens here); the agent follows a shortest-path script.

type Pt = [number, number];
type Action = { kind: 'move'; to: Pt } | { kind: 'pickup' } | { kind: 'open' } | { kind: 'goal' };
type Layout = { wallX: number; doorY: number; key: Pt; start: Pt; goal: Pt };
type Chain = { key: boolean; door: boolean; goal: boolean };

const COLS = 9;
const ROWS = 7;
const NEIGHBOURS: Pt[] = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];
const DURATION = { move: 280, pickup: 600, open: 600, goal: 1900 } as const;
const FADE_MS = 380;

const COLOR = {
  floor: 'rgba(255,255,255,0.018)',
  line: 'rgba(255,255,255,0.06)',
  wall: '#1c212b',
  wallEdge: 'rgba(255,255,255,0.05)',
  agent: '#ff6a4d',
  gold: '#f2b84b',
  jade: '#5fbf8f',
  trail: 'rgba(255,106,77,',
};

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeLayout(rand: () => number): Layout {
  const wallX = 3 + Math.floor(rand() * 3); // 3..5
  const doorY = 1 + Math.floor(rand() * (ROWS - 2));
  const left: Pt[] = [];
  for (let x = 1; x < wallX; x++) for (let y = 1; y < ROWS - 1; y++) left.push([x, y]);
  const pick = () => left.splice(Math.floor(rand() * left.length), 1)[0];
  // Keep the key off the door's doorstep so it never blocks the only way through.
  const doorstep = (p: Pt) => p[0] === wallX - 1 && p[1] === doorY;
  let key = pick();
  while (doorstep(key)) key = pick();
  const start = pick();
  return { wallX, doorY, key, start, goal: [COLS - 2, ROWS - 2] };
}

function plan(l: Layout): Action[] {
  const blocked = (x: number, y: number, keyTaken: boolean, doorOpen: boolean) =>
    x <= 0 ||
    y <= 0 ||
    x >= COLS - 1 ||
    y >= ROWS - 1 ||
    (x === l.wallX && !(y === l.doorY && doorOpen)) ||
    (!keyTaken && x === l.key[0] && y === l.key[1]);

  const bfs = (from: Pt, isTarget: (p: Pt) => boolean, keyTaken: boolean, doorOpen: boolean): Pt[] => {
    const prev = new Map<string, string | null>([[from.join(), null]]);
    const queue: Pt[] = [from];
    while (queue.length) {
      const cur = queue.shift()!;
      if (isTarget(cur)) {
        const path: Pt[] = [];
        let k: string | null = cur.join();
        while (k && k !== from.join()) {
          path.unshift(k.split(',').map(Number) as Pt);
          k = prev.get(k) ?? null;
        }
        return path;
      }
      for (const [dx, dy] of NEIGHBOURS) {
        const nx = cur[0] + dx;
        const ny = cur[1] + dy;
        const id = `${nx},${ny}`;
        if (!prev.has(id) && !blocked(nx, ny, keyTaken, doorOpen)) {
          prev.set(id, cur.join());
          queue.push([nx, ny]);
        }
      }
    }
    return [];
  };

  const actions: Action[] = [];
  const nextToKey = (p: Pt) => Math.abs(p[0] - l.key[0]) + Math.abs(p[1] - l.key[1]) === 1;
  const toKey = bfs(l.start, nextToKey, false, false);
  toKey.forEach((to) => actions.push({ kind: 'move', to }));
  actions.push({ kind: 'pickup' });

  const afterKey = toKey.length ? toKey[toKey.length - 1] : l.start;
  const doorstep: Pt = [l.wallX - 1, l.doorY];
  const toDoor = bfs(afterKey, (p) => p[0] === doorstep[0] && p[1] === doorstep[1], true, false);
  toDoor.forEach((to) => actions.push({ kind: 'move', to }));
  actions.push({ kind: 'open' });

  const toGoal = bfs(doorstep, (p) => p[0] === l.goal[0] && p[1] === l.goal[1], true, true);
  toGoal.forEach((to) => actions.push({ kind: 'move', to }));
  actions.push({ kind: 'goal' });
  return actions;
}

type Sim = {
  layout: Layout;
  actions: Action[];
  index: number;
  elapsed: number; // ms into the current action
  pos: Pt;
  from: Pt;
  angle: number;
  fromAngle: number;
  carrying: boolean;
  doorOpen: boolean;
  trail: Pt[];
  steps: number;
  fade: number; // 0..1, used between episodes
};

function angleTo(dx: number, dy: number) {
  return Math.atan2(dy, dx);
}

function newSim(rand: () => number): Sim {
  const layout = makeLayout(rand);
  const first = plan(layout);
  return {
    layout,
    actions: first,
    index: 0,
    elapsed: 0,
    pos: layout.start,
    from: layout.start,
    angle: 0,
    fromAngle: 0,
    carrying: false,
    doorOpen: false,
    trail: [layout.start],
    steps: 0,
    fade: 1,
  };
}

function lerpAngle(a: number, b: number, t: number) {
  let d = b - a;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return a + d * t;
}

function ease(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function draw(ctx: CanvasRenderingContext2D, s: Sim, cell: number, reduced: boolean, hover: Pt | null = null) {
  const { layout } = s;
  const W = COLS * cell;
  const H = ROWS * cell;
  ctx.clearRect(0, 0, W, H);
  ctx.globalAlpha = s.fade;

  // floor + walls
  for (let x = 0; x < COLS; x++) {
    for (let y = 0; y < ROWS; y++) {
      const isWall =
        x === 0 || y === 0 || x === COLS - 1 || y === ROWS - 1 || (x === layout.wallX && y !== layout.doorY);
      if (isWall) {
        ctx.fillStyle = COLOR.wall;
        ctx.fillRect(x * cell, y * cell, cell, cell);
        ctx.strokeStyle = COLOR.wallEdge;
        ctx.lineWidth = 1;
        ctx.strokeRect(x * cell + 0.5, y * cell + 0.5, cell - 1, cell - 1);
      } else {
        ctx.fillStyle = COLOR.floor;
        ctx.fillRect(x * cell, y * cell, cell, cell);
      }
    }
  }
  ctx.strokeStyle = COLOR.line;
  ctx.lineWidth = 1;
  for (let x = 1; x < COLS; x++) {
    ctx.beginPath();
    ctx.moveTo(x * cell + 0.5, cell);
    ctx.lineTo(x * cell + 0.5, H - cell);
    ctx.stroke();
  }
  for (let y = 1; y < ROWS; y++) {
    ctx.beginPath();
    ctx.moveTo(cell, y * cell + 0.5);
    ctx.lineTo(W - cell, y * cell + 0.5);
    ctx.stroke();
  }

  // cell under the visitor's mouse
  if (hover) {
    const [hx, hy] = hover;
    const isWall = hx <= 0 || hy <= 0 || hx >= COLS - 1 || hy >= ROWS - 1 || (hx === layout.wallX && hy !== layout.doorY);
    if (!isWall) {
      ctx.fillStyle = 'rgba(255,106,77,0.08)';
      ctx.fillRect(hx * cell + 1, hy * cell + 1, cell - 2, cell - 2);
      ctx.strokeStyle = 'rgba(255,106,77,0.45)';
      ctx.lineWidth = 1;
      ctx.strokeRect(hx * cell + 1.5, hy * cell + 1.5, cell - 3, cell - 3);
    }
  }

  // planned route (reduced motion only) or the agent's recent trail
  if (reduced) {
    ctx.fillStyle = 'rgba(255,106,77,0.55)';
    let p = layout.start;
    for (const a of s.actions) {
      if (a.kind !== 'move') continue;
      p = a.to;
      ctx.beginPath();
      ctx.arc((p[0] + 0.5) * cell, (p[1] + 0.5) * cell, Math.max(1.5, cell * 0.06), 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    s.trail.forEach((p, i) => {
      const alpha = ((i + 1) / s.trail.length) * 0.28;
      ctx.fillStyle = `${COLOR.trail}${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc((p[0] + 0.5) * cell, (p[1] + 0.5) * cell, cell * 0.08, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // goal
  const goalAction = s.actions[s.index];
  const reached = goalAction?.kind === 'goal' && s.elapsed > 0;
  const gx = layout.goal[0] * cell;
  const gy = layout.goal[1] * cell;
  const inset = cell * 0.12;
  if (reached) {
    const pulse = 0.5 + 0.5 * Math.sin((s.elapsed / 260) * Math.PI);
    ctx.shadowColor = COLOR.jade;
    ctx.shadowBlur = cell * (0.4 + pulse * 0.6);
  }
  ctx.fillStyle = reached ? 'rgba(95,191,143,0.45)' : 'rgba(95,191,143,0.16)';
  ctx.fillRect(gx + inset, gy + inset, cell - inset * 2, cell - inset * 2);
  ctx.shadowBlur = 0;
  ctx.strokeStyle = COLOR.jade;
  ctx.lineWidth = Math.max(1, cell * 0.04);
  ctx.strokeRect(gx + inset, gy + inset, cell - inset * 2, cell - inset * 2);

  // door
  const dx = layout.wallX * cell;
  const dy = layout.doorY * cell;
  ctx.lineWidth = Math.max(1.2, cell * 0.05);
  ctx.strokeStyle = COLOR.gold;
  if (s.doorOpen) {
    ctx.globalAlpha = s.fade * 0.6;
    ctx.beginPath();
    ctx.moveTo(dx + cell * 0.12, dy + cell * 0.12);
    ctx.lineTo(dx + cell * 0.12, dy + cell * 0.88);
    ctx.moveTo(dx + cell * 0.88, dy + cell * 0.12);
    ctx.lineTo(dx + cell * 0.88, dy + cell * 0.88);
    ctx.stroke();
    ctx.globalAlpha = s.fade;
  } else {
    ctx.fillStyle = 'rgba(242,184,75,0.16)';
    ctx.fillRect(dx + cell * 0.1, dy + cell * 0.1, cell * 0.8, cell * 0.8);
    ctx.strokeRect(dx + cell * 0.1, dy + cell * 0.1, cell * 0.8, cell * 0.8);
    ctx.beginPath();
    ctx.arc(dx + cell * 0.5, dy + cell * 0.44, cell * 0.07, 0, Math.PI * 2);
    ctx.moveTo(dx + cell * 0.5, dy + cell * 0.5);
    ctx.lineTo(dx + cell * 0.5, dy + cell * 0.64);
    ctx.stroke();
  }

  // key (on the floor until picked up)
  const drawKey = (cx: number, cy: number, size: number) => {
    ctx.strokeStyle = COLOR.gold;
    ctx.fillStyle = COLOR.gold;
    ctx.lineWidth = Math.max(1.2, size * 0.09);
    ctx.beginPath();
    ctx.arc(cx - size * 0.18, cy, size * 0.16, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - size * 0.02, cy);
    ctx.lineTo(cx + size * 0.32, cy);
    ctx.moveTo(cx + size * 0.2, cy);
    ctx.lineTo(cx + size * 0.2, cy + size * 0.14);
    ctx.moveTo(cx + size * 0.3, cy);
    ctx.lineTo(cx + size * 0.3, cy + size * 0.12);
    ctx.stroke();
  };
  if (!s.carrying) drawKey((layout.key[0] + 0.5) * cell, (layout.key[1] + 0.5) * cell, cell);

  // agent: a triangle pointing where it faces, as in MiniGrid
  const action = s.actions[s.index];
  let px = s.pos[0];
  let py = s.pos[1];
  let ang = s.angle;
  if (action && !reduced) {
    if (action.kind === 'move') {
      const t = ease(Math.min(1, s.elapsed / DURATION.move));
      px = s.from[0] + (action.to[0] - s.from[0]) * t;
      py = s.from[1] + (action.to[1] - s.from[1]) * t;
    }
    ang = lerpAngle(s.fromAngle, s.angle, ease(Math.min(1, s.elapsed / 160)));
  }
  const cx = (px + 0.5) * cell;
  const cy = (py + 0.5) * cell;
  const r = cell * 0.34;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(ang);
  ctx.shadowColor = COLOR.agent;
  ctx.shadowBlur = cell * 0.35;
  ctx.fillStyle = COLOR.agent;
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(-r * 0.75, r * 0.78);
  ctx.lineTo(-r * 0.75, -r * 0.78);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  if (s.carrying) drawKey(cx + cell * 0.02, cy - cell * 0.42, cell * 0.55);

  ctx.globalAlpha = 1;
}

export default function GridWorld() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoverRef = useRef<Pt | null>(null);
  const cellRef = useRef(32);
  const [chain, setChain] = useState<Chain>({ key: false, door: false, goal: false });
  const [steps, setSteps] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rand = mulberry32(20261012);
    let sim = newSim(rand);
    let cell = 32;
    let raf = 0;
    let last = 0;
    let visible = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cell = Math.floor(wrap.clientWidth / COLS);
      cellRef.current = cell;
      canvas.style.width = `${cell * COLS}px`;
      canvas.style.height = `${cell * ROWS}px`;
      canvas.width = cell * COLS * dpr;
      canvas.height = cell * ROWS * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(ctx, sim, cell, reduced);
    };

    const applyAction = (a: Action) => {
      if (a.kind === 'move') {
        sim.pos = a.to;
        sim.trail = [...sim.trail.slice(-14), a.to];
        sim.steps += 1;
        setSteps(sim.steps);
      } else if (a.kind === 'pickup') {
        sim.carrying = true;
        sim.steps += 1;
        setSteps(sim.steps);
        setChain((c) => ({ ...c, key: true }));
      } else if (a.kind === 'open') {
        sim.doorOpen = true;
        sim.steps += 1;
        setSteps(sim.steps);
        setChain((c) => ({ ...c, door: true }));
      }
    };

    const beginAction = () => {
      const a = sim.actions[sim.index];
      if (!a) return;
      sim.from = sim.pos;
      sim.fromAngle = sim.angle;
      if (a.kind === 'move') {
        sim.angle = angleTo(a.to[0] - sim.pos[0], a.to[1] - sim.pos[1]);
      } else if (a.kind === 'pickup') {
        sim.angle = angleTo(sim.layout.key[0] - sim.pos[0], sim.layout.key[1] - sim.pos[1]);
      } else if (a.kind === 'open') {
        sim.angle = 0;
      } else if (a.kind === 'goal') {
        setChain({ key: true, door: true, goal: true });
      }
    };

    const tick = (now: number) => {
      const dt = last ? Math.min(now - last, 50) : 16;
      last = now;
      const a = sim.actions[sim.index];
      if (a) {
        sim.elapsed += dt;
        const dur = DURATION[a.kind];
        if (a.kind === 'goal' && sim.elapsed > dur - FADE_MS) {
          sim.fade = Math.max(0, (dur - sim.elapsed) / FADE_MS);
        }
        if (sim.elapsed >= dur) {
          applyAction(a);
          sim.index += 1;
          sim.elapsed = 0;
          if (sim.index >= sim.actions.length) {
            sim = newSim(rand);
            sim.fade = 0;
            setChain({ key: false, door: false, goal: false });
            setSteps(0);
          }
          beginAction();
        }
      }
      if (sim.fade < 1 && sim.actions[sim.index]?.kind !== 'goal') sim.fade = Math.min(1, sim.fade + dt / FADE_MS);
      draw(ctx, sim, cell, false, hoverRef.current);
      if (visible) raf = requestAnimationFrame(tick);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    if (reduced) {
      setChain({ key: true, door: true, goal: true });
      return () => ro.disconnect();
    }

    beginAction();
    const io = new IntersectionObserver(
      ([entry]) => {
        const nowVisible = entry.isIntersecting;
        if (nowVisible && !visible) {
          visible = true;
          last = 0;
          raf = requestAnimationFrame(tick);
        } else if (!nowVisible) {
          visible = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0.05 },
    );
    io.observe(wrap);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  const items: { id: keyof Chain; label: string; color: string }[] = [
    { id: 'key', label: 'pick up key', color: 'bg-gold' },
    { id: 'door', label: 'unlock door', color: 'bg-gold' },
    { id: 'goal', label: 'reach goal', color: 'bg-jade' },
  ];

  return (
    <figure className="card overflow-hidden p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <span className="eyebrow">MiniGrid · DoorKey</span>
        <span className="flex items-center gap-3 font-mono text-[0.7rem] text-faint" aria-hidden="true">
          <span>step {String(steps).padStart(2, '0')}</span>
          <span>
            reward{' '}
            <span className={`tabular-nums ${chain.goal ? 'text-jade' : 'text-muted'}`}>{chain.goal ? '1.0' : '0.0'}</span>
          </span>
        </span>
      </div>
      <div ref={wrapRef} className="flex justify-center">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Animated grid world: an agent picks up a key, unlocks a door and reaches a green goal square. The reward is given only at the goal."
          className="block"
          onPointerMove={(e) => {
            if (e.pointerType === 'touch') return;
            const r = e.currentTarget.getBoundingClientRect();
            const c = cellRef.current;
            hoverRef.current = [Math.floor((e.clientX - r.left) / c), Math.floor((e.clientY - r.top) / c)];
          }}
          onPointerLeave={() => {
            hoverRef.current = null;
          }}
        />
      </div>
      <ol className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2 font-mono text-[0.7rem]">
        {items.map((it, i) => (
          <li key={it.id} className="flex items-center gap-2">
            <span
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 transition-colors duration-300 ${
                chain[it.id] ? 'border-white/20 text-paper' : 'border-white/[0.07] text-faint'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${chain[it.id] ? it.color : 'bg-white/15'}`}
              />
              {it.label}
            </span>
            {i < items.length - 1 && <span className="text-faint">→</span>}
          </li>
        ))}
      </ol>
      <figcaption className="mt-3 text-xs leading-relaxed text-faint">
        The reward only arrives after the whole chain. Scripted illustration of the sparse-reward problem my research
        studies.
      </figcaption>
    </figure>
  );
}
