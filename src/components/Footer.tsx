import { LuArrowUp } from 'react-icons/lu';
import { profile } from '@/data/site';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="container flex flex-col gap-4 py-8 text-sm text-faint sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {profile.name} · {profile.location}
        </p>
        <div className="flex items-center gap-5">
          <a
            href="https://github.com/monkeydcoder/monkeydcoder.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-paper"
          >
            Source on GitHub
          </a>
          <a href="#top" className="inline-flex items-center gap-1.5 transition-colors hover:text-paper">
            Back to top <LuArrowUp aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
