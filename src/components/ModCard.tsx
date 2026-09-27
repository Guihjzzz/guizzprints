import { Download } from 'lucide-react';
import Link from 'next/link';
import { FavoriteButton } from '@/components/FavoriteButton';
import { OptimizedImage } from '@/components/OptimizedImage';

interface ModCardProps {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
}

export function ModCard({ id, title, category, imageUrl }: ModCardProps) {
  return (
    <div className="min-w-[280px] md:min-w-[320px] bg-[#18181b] rounded-xl overflow-hidden border border-zinc-800 group hover:border-zinc-700 transition-colors flex-shrink-0">
      <div className="relative h-[160px] w-full overflow-hidden">
        <OptimizedImage src={imageUrl} optimizeWidth={480} optimizeHeight={270} optimizeQuality={70} alt={title} fill loading="lazy" sizes="(max-width: 768px) 280px, 320px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
        <Link href={`/search?tag=${category.toLowerCase()}`} className="absolute top-2 left-2 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-2 py-1 rounded uppercase z-10 transition-colors">
          {category}
        </Link>
        <FavoriteButton modId={id} className="absolute top-2 right-2" />
      </div>
      <div className="p-4 flex justify-between items-center">
        <Link href={`/mod/${id}`} className="font-bold text-zinc-100 group-hover:text-red-500 transition-colors truncate pr-2 block flex-1">
          {title}
        </Link>
        <button className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors cursor-pointer">
          <Download size={16} />
        </button>
      </div>
    </div>
  );
}
