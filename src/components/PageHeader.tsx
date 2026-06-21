type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export default function PageHeader({ eyebrow = "熵减", title, description }: PageHeaderProps) {
  return (
    <header className="mb-5 pt-2">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--sage-dark)]">{eyebrow}</p>
      <h1 className="mt-2 text-3xl font-black leading-tight text-[var(--ink)]">{title}</h1>
      {description ? <p className="mt-2 text-sm leading-6 muted">{description}</p> : null}
    </header>
  );
}
