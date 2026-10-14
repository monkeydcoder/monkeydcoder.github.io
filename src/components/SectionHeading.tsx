type Props = {
  index: string;
  label: string;
  title: React.ReactNode;
  children?: React.ReactNode;
};

export default function SectionHeading({ index, label, title, children }: Props) {
  return (
    <header className="reveal mb-12 max-w-3xl sm:mb-16">
      <p className="eyebrow">
        <span className="text-accent">{index}</span>
        <span className="mx-2 text-white/20">/</span>
        {label}
      </p>
      <h2 className="section-title mt-4 text-balance">{title}</h2>
      {children && <div className="mt-6 space-y-4 text-[1.0625rem] leading-relaxed text-muted sm:text-lg lg:text-[1.2rem]">{children}</div>}
    </header>
  );
}
