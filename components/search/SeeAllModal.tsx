import { useEffect, ReactNode } from "react";
import { X, Loader2 } from "lucide-react";
import { createPortal } from "react-dom";

interface SeeAllModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export default function SeeAllModal<T>({
  isOpen,
  onClose,
  title,
  items,
  renderItem,
  isLoadingMore = false,
  hasMore = false,
  onLoadMore,
}: SeeAllModalProps<T>) {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
        onClick={onClose} 
        aria-hidden="true" 
      />
      
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white/90 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200/60 bg-white/50">
          <h2 id="modal-title" className="text-2xl font-bold text-slate-800">
            All {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {items.map((item, index) => renderItem(item, index))}
          
          {isLoadingMore && (
            <div className="flex justify-center py-6">
              <Loader2 className="h-8 w-8 text-accent animate-spin" />
            </div>
          )}
          
          {!isLoadingMore && hasMore && (
            <button
              onClick={onLoadMore}
              className="w-full py-4 mt-4 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-accent hover:text-accent hover:bg-accent/5 font-medium transition-all"
            >
              Load More
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Use portal if running in browser to render at document root
  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  // Fallback for SSR/tests that don't support portal correctly
  return modalContent;
}
