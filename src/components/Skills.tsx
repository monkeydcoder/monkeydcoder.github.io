import { LuArrowUpRight } from 'react-icons/lu';
import SectionHeading from '@/components/SectionHeading';
import { skills, leadership } from '@/data/site';

export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container">
        <SectionHeading index="05" label="Skills" title="Skills and leadership" />

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((s) => (
            <div key={s.group} className="reveal bg-ink-900 p-6">
              <h3 className="eyebrow text-muted">{s.group}</h3>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {s.items.map((it) => (
                  <li key={it} className="chip text-paper/90">
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <h3 className="reveal eyebrow">Leadership & activities</h3>
          <ul className="mt-6 divide-y divide-white/[0.06] border-y border-white/[0.06]">
            {leadership.map((l) => (
              <li key={l.role + l.org} className="reveal grid grid-cols-1 gap-2 py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-10">
                <div>
                  <p className="text-paper">
                    {l.href ? (
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className="group inline-flex min-h-[40px] items-center gap-1.5 hover:text-accent">
                        {l.role} <LuArrowUpRight className="link-arrow text-faint group-hover:text-accent" aria-hidden="true" />
                      </a>
                    ) : (
                      l.role
                    )}
                  </p>
                  <p className="mt-1 text-[0.9rem] text-faint">
                    {l.org}
                    {l.period && <span className="font-mono text-[0.8rem]"> · {l.period}</span>}
                  </p>
                </div>
                <p className="text-[0.98rem] leading-relaxed text-muted sm:text-[1.02rem]">{l.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
