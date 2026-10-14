import { LuArrowUpRight, LuLock, LuPlay, LuFileText } from 'react-icons/lu';
import { FaGithub } from 'react-icons/fa6';
import SectionHeading from '@/components/SectionHeading';
import ProjectMedia from '@/components/ProjectMedia';
import Rich from '@/components/Rich';
import { projects, profile, type ProjectLink } from '@/data/site';

const LINK_ICON: Record<ProjectLink['kind'], React.ComponentType<{ 'aria-hidden'?: boolean }>> = {
  code: FaGithub,
  video: LuPlay,
  demo: LuArrowUpRight,
  doc: LuFileText,
};

export default function Projects() {
  return (
    <section id="projects" className="section">
      <div className="container">
        <SectionHeading index="03" label="Projects" title="Selected projects">
          <p>
            Course projects, LLM apps and tools I built for myself. Code and demo videos are linked wherever they&apos;re
            public, and there&apos;s more on{' '}
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="link-underline text-paper">
              GitHub
            </a>
            .
          </p>
        </SectionHeading>

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((p) => (
            <li key={p.title} className="reveal">
              <article className="card group/card flex h-full flex-col overflow-hidden transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-1 hover:border-white/[0.12] hover:shadow-[0_30px_60px_-35px_rgba(0,0,0,0.9)]">
                <ProjectMedia media={p.media} title={p.title} />
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <p className="font-mono text-[0.76rem] uppercase tracking-[0.14em] text-faint">{p.kind}</p>
                  <h3 className="mt-2 font-serif text-[1.75rem] leading-tight text-paper">{p.title}</h3>
                  <p className="mt-3 text-[1.0625rem] leading-relaxed text-paper/90">
                    <Rich text={p.summary} />
                  </p>
                  <ul className="mt-4 space-y-2">
                    {p.points.map((pt) => (
                      <li key={pt.slice(0, 24)} className="flex gap-3 text-[0.98rem] leading-relaxed text-muted">
                        <span className="mt-[0.6rem] h-1 w-1 shrink-0 rounded-full bg-accent/70" aria-hidden="true" />
                        <span>
                          <Rich text={pt} />
                        </span>
                      </li>
                    ))}
                  </ul>
                  <ul className="mt-5 flex flex-wrap gap-1.5" aria-label={`${p.title} technologies`}>
                    {p.tech.map((t) => (
                      <li key={t} className="chip">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-6">
                    {p.links.map((l) => {
                      const Icon = LINK_ICON[l.kind];
                      return (
                        <a
                          key={l.href}
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex min-h-[40px] items-center gap-2 text-[0.95rem] text-paper transition-colors hover:text-accent"
                        >
                          <Icon aria-hidden={true} />
                          {l.label}
                          <LuArrowUpRight className="link-arrow text-faint group-hover:text-accent" aria-hidden="true" />
                        </a>
                      );
                    })}
                    {p.note && (
                      <span className="inline-flex min-h-[40px] items-center gap-2 font-mono text-[0.8rem] text-faint">
                        <LuLock aria-hidden="true" /> {p.note}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
