import React from 'react';
import { paginate } from '../utils.js';

export function DataTable({ rows, page, pageSize, onPage, headers, sort, onSort }) {
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pageRows = paginate(rows, page, pageSize);

  const getSortIcon = (column) => {
    if (sort.key !== column) return '↕️';
    return sort.dir === 'asc' ? '↑' : '↓';
  };

  const handlePageSizeChange = (newPageSize) => {
    // When page size changes, reset to page 1
    onPage(1);
    // Note: In a real app, you'd want to pass pageSize changes back to parent
    // For now, we'll just reset to page 1
  };

  return (
    <div className="card data-table-card">
      <div className="table-header">
        <div className="table-title-section">
          <h2>📋 Transaction Details</h2>
          <div className="table-stats">
            <span className="stat-badge">{rows.length} transactions</span>
            <span className="stat-badge">Page {page} of {totalPages}</span>
          </div>
        </div>
        <div className="table-controls">
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
            className="page-size-select"
          >
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
            <option value="100">100 per page</option>
          </select>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {headers.map((h) => (
                <th
                  key={h}
                  onClick={() => onSort(h)}
                  className="sortable-header"
                >
                  <div className="header-content">
                    <span className="header-text">{h}</span>
                    <span className="sort-icon">{getSortIcon(h)}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="empty-state">
                  <div className="empty-state-content">
                    <span className="empty-icon">📊</span>
                    <p>No transactions match your current filters</p>
                    <small>Try adjusting your filter criteria</small>
                  </div>
                </td>
              </tr>
            ) : (
              pageRows.map((row, idx) => (
                <tr key={idx} className="data-row">
                  {headers.map((h) => (
                    <td key={h} className={`data-cell ${getCellClass(row, h)}`}>
                      {formatCell(row, h)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {rows.length > pageSize && (
        <div className="pagination-controls">
          <button
            className="pagination-btn"
            onClick={() => onPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            ← Previous
          </button>

          <div className="page-indicators">
            <span className="page-info">
              Page {page} of {totalPages}
            </span>
            <div className="page-numbers">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                if (pageNum > totalPages) return null;
                return (
                  <button
                    key={pageNum}
                    className={`page-number ${pageNum === page ? 'active' : ''}`}
                    onClick={() => onPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            className="pagination-btn"
            onClick={() => onPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

function formatCell(row, key) {
  const value = row[key];
  if (value === undefined || value === null) return <span className="empty-value">-</span>;

  if (typeof value === 'number') {
    if (key.toLowerCase().includes('tax') || key.toLowerCase().includes('price') || key.toLowerCase().includes('value')) {
      return <span className="currency-value">€{value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>;
    }
    return <span className="number-value">{value.toLocaleString('de-DE')}</span>;
  }

  if (key.toLowerCase().includes('date')) {
    return <span className="date-value">{new Date(value).toLocaleDateString('de-DE')}</span>;
  }

  return <span className="text-value">{String(value)}</span>;
}

function getCellClass(row, key) {
  const value = row[key];

  if (typeof value === 'number') {
    if (key.toLowerCase().includes('tax') && value > 0) return 'tax-positive';
    if (key.toLowerCase().includes('tax') && value < 0) return 'tax-negative';
    if (key.toLowerCase().includes('gain') && value > 0) return 'gain-positive';
    if (key.toLowerCase().includes('gain') && value < 0) return 'gain-negative';
  }

  return '';
}
