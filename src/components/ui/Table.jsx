import React from 'react';
import './Table.css';
import { Skeleton } from './Skeleton';
import { Inbox } from 'lucide-react';

/**
 * AyuRAG-XAI Standardized Accessible Data Table
 */
export const Table = ({
  columns = [],
  data = [],
  isLoading = false,
  emptyMessage = 'No records found.',
  onRowClick,
  className = '',
  keyExtractor = (item, idx) => item.id || idx,
}) => {
  return (
    <div className={`ayur-table-container ${className}`.trim()}>
      <table className="ayur-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key || col.label}
                style={{ width: col.width, textAlign: col.align || 'left' }}
                className="ayur-th"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, rIdx) => (
              <tr key={rIdx} className="ayur-tr">
                {columns.map((col, cIdx) => (
                  <td key={cIdx} className="ayur-td">
                    <Skeleton height="18px" width={cIdx === 0 ? '70%' : '50%'} />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="ayur-table-empty">
                <div className="flex flex-col items-center justify-center py-xl text-center">
                  <Inbox size={32} className="text-muted mb-xs" />
                  <p className="text-sm text-muted">{emptyMessage}</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((item, idx) => (
              <tr
                key={keyExtractor(item, idx)}
                className={`ayur-tr ${onRowClick ? 'ayur-tr--clickable' : ''}`}
                onClick={onRowClick ? () => onRowClick(item) : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={
                  onRowClick
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onRowClick(item);
                        }
                      }
                    : undefined
                }
              >
                {columns.map((col) => (
                  <td
                    key={col.key || col.label}
                    style={{ textAlign: col.align || 'left' }}
                    className="ayur-td"
                  >
                    {col.render ? col.render(item, idx) : item[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
