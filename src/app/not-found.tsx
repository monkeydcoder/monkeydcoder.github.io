import Link from 'next/link';
import { LuArrowLeft } from 'react-icons/lu';

export default function NotFound() {
  return (
    <main className="container flex min-h-[100dvh] flex-col items-start justify-center py-24">
      <p className="eyebrow">
        <span className="text-accent">404</span>
        <span className="mx-2 text-white/20">/</span>
        reward 0.0
      </p>
      <h1 className="mt-4 max-w-2xl font-serif text-5xl leading-[1.05] text-paper sm:text-7xl">
        This episode ended without finding the goal.
      </h1>
      <p className="mt-6 max-w-lg text-muted">The page you were looking for doesn&apos;t exist, or it has moved.</p>
      <Link href="/" className="btn-primary mt-10">
        <LuArrowLeft aria-hidden="true" /> Back to the start
      </Link>
    </main>
  );
}
