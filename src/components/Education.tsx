import { LuArrowUpRight, LuAward, LuGraduationCap } from 'react-icons/lu';
import SectionHeading from '@/components/SectionHeading';
import { education, awards, certifications, profile } from '@/data/site';

export default function Education() {
  return (
    <section id="education" className="section">
      <div className="container">
        <SectionHeading index="04" label="Education" title="Tokyo now, Punjab before." />

        <ol className="space-y-6">
          {education.map((e) => (
            <li key={`${e.school}-${e.period}`} className="reveal card p-6 sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
                <div className="flex gap-4">
                  <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-muted">
                    <LuGraduationCap aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-lg font-medium leading-snug text-paper sm:text-xl">{e.degree}</h3>
                    <p className="mt-1 text-muted">
                      {e.school}
                      {e.note && <span className="text-faint"> · {e.note}</span>}
                    </p>
                    {e.focus && <p className="mt-1 text-sm text-faint">Focus: {e.focus}</p>}
                  </div>
                </div>
                <div className="pl-[3.25rem] font-mono text-xs leading-relaxed text-faint sm:pl-0 sm:text-right">
                  <p className="text-paper/80">{e.period}</p>
                  <p>{e.place}</p>
                </div>
              </div>

              {e.highlights.length > 0 && (
                <ul className="mt-5 space-y-1.5 pl-[3.25rem]">
                  {e.highlights.map((h) => (
                    <li key={h} className="text-sm leading-relaxed text-paper/85 sm:text-[0.95rem]">
                      {h.includes('Prof. Ryutaro Ichise') ? (
                        <>
                          <a href={profile.lab.url} target="_blank" rel="noopener noreferrer" className="link-underline">
                            {profile.lab.name}
                          </a>
                          {h.replace(profile.lab.name, '')}
                        </>
                      ) : (
                        h
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {e.courses.length > 0 && (
                <div className="mt-6 grid grid-cols-1 gap-5 border-t border-white/[0.06] pt-6 sm:grid-cols-2 sm:pl-[3.25rem]">
                  {e.courses.map((c) => (
                    <div key={c.group}>
                      <p className="eyebrow">{c.group}</p>
                      <ul className="mt-2.5 flex flex-wrap gap-1.5">
                        {c.items.map((it) => (
                          <li key={it} className="chip text-[0.72rem]">
                            {it}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ol>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {awards.map((a) => (
            <article key={a.title} className="reveal card relative overflow-hidden p-6 sm:p-8">
              <div
                className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 bg-[radial-gradient(closest-side,rgba(255,106,77,0.13),transparent)]"
                aria-hidden="true"
              />
              <p className="eyebrow flex items-center gap-2">
                <LuAward className="text-accent" aria-hidden="true" /> Scholarship · {a.year}
              </p>
              <h3 className="mt-4 font-serif text-2xl leading-tight text-paper sm:text-3xl">{a.title}</h3>
              <p className="mt-1 text-sm text-faint">{a.org}</p>
              <p className="mt-4 leading-relaxed text-muted">{a.body}</p>
            </article>
          ))}

          <article className="reveal card p-6 sm:p-8">
            <p className="eyebrow">Certifications</p>
            <ul className="mt-4 divide-y divide-white/[0.06]">
              {certifications.map((c) => (
                <li key={c.title}>
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start justify-between gap-4 py-4"
                  >
                    <span>
                      <span className="block text-paper transition-colors group-hover:text-accent">{c.title}</span>
                      <span className="mt-0.5 block text-sm text-faint">{c.org}</span>
                    </span>
                    <LuArrowUpRight className="mt-1 shrink-0 text-faint group-hover:text-accent" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
