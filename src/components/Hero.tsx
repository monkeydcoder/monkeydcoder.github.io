import { LuArrowRight, LuFileText, LuMail, LuMapPin } from 'react-icons/lu';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa6';
import GridWorld from '@/components/GridWorld';
import Rich from '@/components/Rich';
import { profile } from '@/data/site';

const socials = [
  { label: 'GitHub', href: profile.github, icon: FaGithub },
  { label: 'LinkedIn', href: profile.linkedin, icon: FaLinkedinIn },
  { label: 'Email', href: `mailto:${profile.email}`, icon: LuMail },
];

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex flex-col justify-center overflow-hidden pb-20 pt-28 sm:pb-28 sm:pt-36 lg:min-h-[100svh] lg:pb-24 lg:pt-28"
    >
      <div className="grid-lines pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
      <div className="container grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.12fr_0.88fr] lg:gap-16">
        <div>
          <p className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.03] px-3 py-1.5 font-mono text-[0.76rem] text-muted sm:rounded-full">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-jade opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-jade" />
            </span>
            {profile.status}
          </p>

          <h1 className="mt-6 font-serif text-[clamp(2.75rem,14vw,3.4rem)] leading-[0.95] tracking-tight text-paper sm:text-7xl lg:text-[6rem] xl:text-[7rem]">
            {profile.name}
          </h1>

          <p className="mt-6 max-w-xl text-balance text-[1.35rem] leading-snug text-paper sm:text-2xl xl:max-w-2xl xl:text-[1.9rem]">
            <Rich text={profile.tagline} />
          </p>

          <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-muted sm:text-lg xl:text-[1.2rem]">
            <Rich text={profile.intro} />
          </p>

          <dl className="mt-8 grid max-w-xl grid-cols-3 gap-4 border-t border-white/[0.08] pt-6">
            {profile.glance.map((g) => (
              <div key={g.label}>
                <dt className="sr-only">{g.label}</dt>
                <dd>
                  <span className="block font-serif text-[1.45rem] leading-none text-paper sm:text-3xl">{g.value}</span>
                  <span className="mt-2 block text-[0.8rem] leading-snug text-faint sm:text-[0.85rem]" aria-hidden="true">
                    {g.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#research" className="btn-primary group">
              See my research <LuArrowRight className="btn-arrow" aria-hidden="true" />
            </a>
            <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              <LuFileText aria-hidden="true" /> Résumé (PDF)
            </a>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
            <ul className="flex items-center gap-1">
              {socials.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    aria-label={label}
                    className="flex h-11 w-11 items-center justify-center rounded-full text-lg text-muted transition-colors hover:bg-white/[0.05] hover:text-paper"
                  >
                    <Icon aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
            <span className="flex items-center gap-1.5 font-mono text-[0.8rem] text-faint">
              <LuMapPin aria-hidden="true" /> {profile.location}
            </span>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[460px] lg:max-w-none">
          <GridWorld />
        </div>
      </div>
      <a
        href="#about"
        className="group absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-faint transition-colors hover:text-paper lg:flex"
        aria-label="Scroll to About"
      >
        scroll
        <span className="block h-8 w-px bg-gradient-to-b from-white/30 to-transparent transition-colors group-hover:from-accent" />
      </a>
    </section>
  );
}
