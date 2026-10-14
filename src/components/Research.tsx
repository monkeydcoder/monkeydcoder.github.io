import { LuLock, LuArrowUpRight, LuCircleCheck } from 'react-icons/lu';
import SectionHeading from '@/components/SectionHeading';
import Rich from '@/components/Rich';
import { research, profile } from '@/data/site';

export default function Research() {
  return (
    <section id="research" className="section">
      <div className="container">
        <SectionHeading index="02" label="Research" title={research.title}>
          {research.intro.map((p) => (
            <p key={p.slice(0, 24)}>
              <Rich text={p} />
            </p>
          ))}
        </SectionHeading>

        {/* status */}
        <div className="reveal card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex gap-4">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
              <LuLock aria-hidden="true" />
            </span>
            <p className="text-[0.95rem] leading-relaxed text-muted sm:text-base">{research.status}</p>
          </div>
          <a
            href={profile.lab.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex shrink-0 items-center gap-1.5 self-start font-mono text-[0.8rem] text-paper transition-colors hover:text-accent sm:self-center"
          >
            {profile.lab.name} <LuArrowUpRight className="link-arrow" aria-hidden="true" />
          </a>
        </div>

        {/* numbers */}
        <dl className="reveal mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] lg:grid-cols-4">
          {research.stats.map((s) => (
            <div key={s.label} className="bg-ink-900 p-5 sm:p-6">
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="block font-serif text-4xl text-paper sm:text-5xl">{s.value}</span>
                <span className="mt-2 block text-[0.85rem] leading-snug text-faint sm:text-[0.95rem]" aria-hidden="true">
                  {s.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>

        {/* stages */}
        <ol className="mt-16 space-y-6 sm:mt-20">
          {research.stages.map((st) => (
            <li
              key={st.step}
              className="reveal grid grid-cols-1 gap-4 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-10"
            >
              <div className="flex items-baseline gap-3 md:flex-col md:gap-1 md:pt-6">
                <span className="font-mono text-sm text-accent">{st.step}</span>
                <span className="font-mono text-[0.78rem] uppercase tracking-[0.14em] text-faint">{st.period}</span>
              </div>
              <article
                className={`card p-6 sm:p-8 ${st.current ? 'border-accent/30 bg-gradient-to-br from-accent/[0.07] to-transparent' : ''}`}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-serif text-2xl leading-tight text-paper sm:text-[1.9rem]">{st.title}</h3>
                  {st.current && (
                    <span className="chip border-accent/30 text-accent">
                      <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-accent motion-reduce:animate-none" />
                      in progress
                    </span>
                  )}
                </div>
                <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted">
                  <Rich text={st.body} />
                </p>
                {st.findings.length > 0 && (
                  <ul className="mt-5 space-y-2.5 border-t border-white/[0.06] pt-5">
                    {st.findings.map((f) => (
                      <li key={f.slice(0, 24)} className="flex gap-3 text-[0.98rem] leading-relaxed text-paper/90 sm:text-[1.02rem]">
                        <LuCircleCheck className="mt-[3px] shrink-0 text-jade" aria-hidden="true" />
                        <span>
                          <Rich text={f} />
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </li>
          ))}
        </ol>

        {/* practice */}
        <div className="mt-20 sm:mt-24">
          <h3 className="reveal eyebrow">How I work</h3>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {research.practice.map((p, i) => (
              <article key={p.title} className="reveal card p-6">
                <p className="font-mono text-[0.78rem] text-faint">{String(i + 1).padStart(2, '0')}</p>
                <h4 className="mt-3 text-lg font-medium text-paper">{p.title}</h4>
                <p className="mt-2 text-[0.98rem] leading-relaxed text-muted sm:text-[1.02rem]">
                  <Rich text={p.body} />
                </p>
              </article>
            ))}
          </div>
        </div>

        {/* tools */}
        <div className="reveal mt-12 flex flex-col gap-4 border-t border-white/[0.06] pt-8 lg:flex-row lg:items-start lg:justify-between">
          <ul className="flex flex-wrap gap-2" aria-label="Research tools">
            {research.tools.map((t) => (
              <li key={t} className="chip">
                {t}
              </li>
            ))}
          </ul>
          <p className="max-w-sm text-[0.95rem] leading-relaxed text-faint lg:text-right">{research.seminar}</p>
        </div>
      </div>
    </section>
  );
}
