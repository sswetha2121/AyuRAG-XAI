import React from 'react';
import './Pagination.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * AyuRAG-XAI Reusable Pagination Component
 */
export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems,
  itemsPerPage,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className={`ayur-pagination ${className}`.trim()}>
      {totalItems !== undefined && (
        <span className="ayur-pagination__info">
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}–
          {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
        </span>
      )}

      <div className="ayur-pagination__controls">
        <button
          type="button"
          className="ayur-pagination__btn"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((p) => (
          <button
            key={p}
            type="button"
            className={`ayur-pagination__page-btn ${p === currentPage ? 'ayur-pagination__page-btn--active' : ''}`}
            onClick={() => onPageChange(p)}
            aria-current={p === currentPage ? 'page' : undefined}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          className="ayur-pagination__btn"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
