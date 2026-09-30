import { categoryLabel } from '@/lib/mod-categories';

type CategoryBadgesProps = {
  category?: string | null;
  /** Kept for older callers. File formats are intentionally not card labels. */
  subcategory?: string | null;
  contentCategories?: readonly string[] | null;
  contentThemes?: readonly string[] | null;
  primaryClassName?: string;
};

/**
 * A construction card identifies the Minecraft edition and the choices made
 * by the publisher. Download formats remain in the download selector, where
 * they are useful, instead of looking like a category on every card.
 */
export function CategoryBadges({
  category,
  contentCategories,
  contentThemes,
  primaryClassName = 'border-blue-500/30 bg-blue-600/20 text-blue-300',
}: CategoryBadgesProps) {
  const selectedCategory = contentCategories?.find((value) => value.trim());
  const selectedTheme = contentThemes?.find((value) => value.trim());
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-1 text-[8px] font-bold uppercase tracking-wide md:text-[9px]">
      {category && <span className={`max-w-full break-words rounded border px-1.5 py-0.5 ${primaryClassName}`}>{categoryLabel(category)}</span>}
      {selectedCategory && <span className="max-w-[10rem] truncate rounded border border-violet-500/30 bg-violet-600/20 px-1.5 py-0.5 text-violet-200">{selectedCategory}</span>}
      {selectedTheme && <span className="max-w-[8rem] truncate rounded border border-sky-400/25 bg-sky-500/10 px-1.5 py-0.5 text-sky-200">{selectedTheme}</span>}
    </div>
  );
}
