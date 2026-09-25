export default function Avatar({ name = '', className = 'h-10 w-10 text-sm' }) {
  return (
    <span className={`grid shrink-0 place-items-center rounded-full bg-brand-gradient font-bold text-white ${className}`}>
      {name.trim()[0]?.toUpperCase() || '?'}
    </span>
  );
}
