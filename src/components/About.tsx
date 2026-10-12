import Image from 'next/image';
import SectionHeading from '@/components/SectionHeading';
import { about, profile } from '@/data/site';

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <SectionHeading index="01" label="About" title={about.heading} />

        <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-14 lg:gap-20">
          <div className="reveal">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[18rem] overflow-hidden rounded-2xl border border-white/[0.08] sm:max-w-sm md:max-w-none">
              <Image
                src={profile.photo}
                alt={`Portrait of ${profile.name}`}
                fill
                sizes="(min-width: 768px) 40vw, 90vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 via-transparent to-transparent" />
            </div>
          </div>

          <div className="reveal">
            <div className="space-y-5 text-base leading-relaxed text-muted sm:text-[1.05rem]">
              {about.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>

            <dl className="mt-10 divide-y divide-white/[0.06] border-y border-white/[0.06]">
              {about.facts.map((f) => (
                <div key={f.label} className="grid grid-cols-[7.5rem_1fr] gap-4 py-3 sm:grid-cols-[9rem_1fr]">
                  <dt className="eyebrow pt-0.5">{f.label}</dt>
                  <dd className="text-sm text-paper sm:text-base">
                    {f.label === 'Lab' ? (
                      <a href={profile.lab.url} target="_blank" rel="noopener noreferrer" className="link-underline">
                        {f.value}
                      </a>
                    ) : (
                      f.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-8 border-l-2 border-accent/60 pl-4 text-sm leading-relaxed text-muted">
              {about.offTheClock}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
