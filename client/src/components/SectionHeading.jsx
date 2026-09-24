export default function SectionHeading({ eyebrow, title, text, action, center = false, dark = false }) {
  return (
    <div className={`mb-12 flex flex-col gap-5 ${center ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'}`}>
      <div className="max-w-2xl">
        {eyebrow && (
          <span className={dark ? 'eyebrow bg-white/10 text-brand-200' : 'eyebrow'}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" /> {eyebrow}
          </span>
        )}
        <h2 className={`mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-[42px] ${dark ? 'text-white' : ''}`}>{title}</h2>
        {text && <p className={`mt-4 text-[17px] leading-relaxed ${dark ? 'text-white/60' : 'text-muted'}`}>{text}</p>}
      </div>
      {action && <div className="shrink-0 self-start md:self-auto">{action}</div>}
    </div>
  );
}
