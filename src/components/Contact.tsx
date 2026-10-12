import { LuArrowUpRight, LuFileText, LuMail, LuMapPin } from 'react-icons/lu';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa6';
import CopyEmail from '@/components/CopyEmail';
import { profile } from '@/data/site';

const channels = [
  { label: 'LinkedIn', value: 'Satyam Sharma', href: profile.linkedin, icon: FaLinkedinIn },
  { label: 'GitHub', value: '@monkeydcoder', href: profile.github, icon: FaGithub },
  { label: 'Résumé', value: 'PDF, includes phone', href: profile.resume, icon: LuFileText },
];

export default function Contact() {
  return (
    <section id="contact" className="section pb-24 sm:pb-32">
      <div className="container">
        <div className="reveal card relative overflow-hidden px-6 py-12 sm:px-12 sm:py-16">
          <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden="true" />
          <div
            className="pointer-events-none absolute -bottom-40 -right-40 h-[28rem] w-[28rem] bg-[radial-gradient(closest-side,rgba(255,106,77,0.16),transparent)]"
            aria-hidden="true"
          />
          <div className="relative">
            <p className="eyebrow">
              <span className="text-accent">06</span>
              <span className="mx-2 text-white/20">/</span>
              Contact
            </p>
            <h2 className="mt-4 font-serif text-5xl leading-[1.02] text-paper sm:text-7xl">Let&apos;s talk.</h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              I&apos;m open to conversations about machine-learning and reinforcement-learning internships, roles and
              research collaborations. Email is the quickest way to reach me.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={`mailto:${profile.email}`}
                className="group inline-flex min-h-[44px] items-center gap-3 font-serif text-[1.3rem] text-paper transition-colors [overflow-wrap:anywhere] hover:text-accent sm:text-3xl"
              >
                <LuMail className="shrink-0 text-xl text-accent" aria-hidden="true" />
                {profile.email}
              </a>
              <CopyEmail email={profile.email} />
            </div>

            <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {channels.map(({ label, value, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-ink-950/40 px-4 py-3.5 transition-colors hover:border-white/25"
                  >
                    <span className="flex items-center gap-3">
                      <Icon aria-hidden="true" />
                      <span>
                        <span className="block text-sm text-paper">{label}</span>
                        <span className="block font-mono text-[0.68rem] text-faint">{value}</span>
                      </span>
                    </span>
                    <LuArrowUpRight className="text-faint transition-colors group-hover:text-accent" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>

            <p className="mt-8 flex items-center gap-2 font-mono text-xs text-faint">
              <LuMapPin aria-hidden="true" /> {profile.location} · JST (UTC+9)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
