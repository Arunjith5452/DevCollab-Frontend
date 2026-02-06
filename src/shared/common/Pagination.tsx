import { ChevronLeft, ChevronRight } from "lucide-react";


interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 10
}: PaginationProps) {
  // Calculate range
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems || (currentPage * itemsPerPage));
  const showInfo = totalItems !== undefined;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4">
      {/* Info Text */}
      <div className="text-sm text-gray-500 font-medium">
        {showInfo ? (
          <>Showing <span className="text-gray-900">{startItem}</span> to <span className="text-gray-900">{endItem}</span> of <span className="text-gray-900">{totalItems}</span> results</>
        ) : (
          <>Page <span className="text-gray-900">{currentPage}</span> of <span className="text-gray-900">{totalPages}</span></>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 text-gray-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center">
          {[...Array(totalPages || 0)].map((_, index) => {
            const page = index + 1;
            if (totalPages > 7 && (page !== 1 && page !== totalPages && Math.abs(currentPage - page) > 1)) {
              if (page === 2 || page === totalPages - 1) return <span key={page} className="px-1 text-gray-400">...</span>;
              return null;
            }

            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all mx-0.5 ${currentPage === page
                    ? 'bg-teal-600 text-white shadow-sm ring-2 ring-teal-100'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 text-gray-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed"
          aria-label="Next Page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}