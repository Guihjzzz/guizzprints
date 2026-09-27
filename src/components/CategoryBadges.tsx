import { categoryLabel, normalizeCategory } from '@/lib/mod-categories';

export function CategoryBadges({ category, subcategory, primaryClassName = 'border-blue-500/30 bg-blue-600/20 text-blue-300' }: { category?: string | null; subcategory?: string | null; primaryClassName?: string }) {
  const secondary = subcategory?.trim();
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-1 text-[8px] font-bold uppercase tracking-wide md:text-[9px]">
      {category && <span className={`max-w-full break-words rounded border px-1.5 py-0.5 ${primaryClassName}`}>{categoryLabel(category)}</span>}
      {secondary && normalizeCategory(secondary) !== normalizeCategory(category) && (
        <span className="max-w-full break-words rounded border border-violet-500/30 bg-violet-600/20 px-1.5 py-0.5 text-violet-300">{categoryLabel(secondary)}</span>
      )}
    </div>
  );
}
