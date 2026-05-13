import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

interface SearchCategoryProps<T> {
  title: string;
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  onSeeAll?: () => void;
}

export default function SearchCategory<T>({ title, items, renderItem, onSeeAll }: SearchCategoryProps<T>) {
  if (!items || items.length === 0) {
    return null;
  }

  const displayItems = items.slice(0, 3);
  const hasMore = items.length > 3;

  return (
    <div className="mb-8 last:mb-0">
      <h2 className="text-2xl font-bold text-slate-800 mb-4 px-2">{title}</h2>
      
      <div className="flex flex-col space-y-3">
        {displayItems.map((item, index) => renderItem(item, index))}
      </div>

      {hasMore && (
        <button
          onClick={onSeeAll}
          className="mt-4 flex items-center justify-center w-full py-3 rounded-xl bg-slate-100 hover:bg-accent/10 text-accent font-semibold transition-all border border-transparent hover:border-accent/30 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 group"
        >
          Показать все
          <ChevronRight className="ml-1 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  );
}
